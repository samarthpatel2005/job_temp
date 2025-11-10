import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { getAtsScore } from "../utils/aiHelper.js";
import { sendEmail } from "../utils/sendEmail.js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }
  if (!req.file) {
    return next(new ErrorHandler("Resume file required!", 400));
  }

  // Validate file type
  if (req.file.mimetype !== 'application/pdf') {
    return next(new ErrorHandler("Only PDF files are allowed!", 400));
  }
  
  // Validate file size (5MB limit)
  if (req.file.size > 5 * 1024 * 1024) {
    return next(new ErrorHandler("File size should be less than 5MB!", 400));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const applicantID = { user: req.user._id, role: "Job Seeker" };

  const alreadyApplied = await Application.findOne({
    "applicantID.user": applicantID.user,
    jobID: jobId,
  });

  if (alreadyApplied) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }
  
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  
  const employerID = { user: jobDetails.postedBy, role: "Employer" };

  // Upload to Supabase with local fallback
  const resumeFileName = `${req.user.name.split(' ').join('_')}_${Date.now()}.pdf`;
  const resumePath = `resume1/${resumeFileName}`;
  let resumeUrl = "";
  
  // Try Supabase upload first, then fallback to local storage
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resume')
      .upload(resumePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      
    if (uploadError) {
      throw new Error("Supabase upload failed");
    }
    
    const { data: urlData } = supabase.storage.from('resume').getPublicUrl(resumePath);
    resumeUrl = urlData.publicUrl;
    console.log("Successfully uploaded to Supabase:", resumeUrl);
  } catch (supabaseError) {
    console.error("Supabase error:", supabaseError);
    console.log("Falling back to local file storage...");
    
    // Fallback: store file locally
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
      const localFilePath = path.join(uploadsDir, resumeFileName);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Save file locally
      fs.writeFileSync(localFilePath, req.file.buffer);
      
      // Create local URL
      resumeUrl = `http://localhost:${process.env.PORT || 4000}/uploads/resumes/${resumeFileName}`;
      console.log("Successfully saved locally:", resumeUrl);
    } catch (localError) {
      console.error("Local storage error:", localError);
      resumeUrl = `local://resumes/${resumeFileName}`;
    }
  }

  // Parse resume and get ATS score with proper error handling
  let resumeText = "";
  let atsScore = 0;
  
  try {
    // Validate PDF structure before parsing
    if (!req.file.buffer || req.file.buffer.length === 0) {
      throw new Error("Invalid or empty PDF file");
    }
    
    // Check if file starts with PDF header
    const pdfHeader = req.file.buffer.slice(0, 4).toString();
    if (pdfHeader !== '%PDF') {
      throw new Error("Invalid PDF file format");
    }
    
    const pdfData = await pdf(req.file.buffer);
    resumeText = pdfData.text;
    
    // Check if PDF contains readable text
    if (!resumeText || resumeText.trim().length === 0) {
      console.warn("PDF contains no readable text, setting default ATS score");
      resumeText = "No readable text found in PDF";
      atsScore = 1;
    } else {
      atsScore = await getAtsScore(resumeText, jobDetails.skills);
    }
  } catch (pdfError) {
    console.error("PDF parsing error:", pdfError);
    resumeText = "PDF parsing failed";
    atsScore = 1;
  }

  // Create application in database
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    jobID: jobId,
    resume: {
        url: resumeUrl,
        fileName: resumePath,
    },
    atsScore,
  });

  // Send confirmation email
  const emailMessage = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background-color: #28a745; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #aaa; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Application Received!</h1></div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We've successfully received your application for the <strong>${jobDetails.title}</strong> position at <strong>${jobDetails.companyName}</strong>.</p>
            <p>Your profile is now under review. We appreciate your interest and will get back to you soon if your qualifications match our needs.</p>
            <p>You can track the status of all your applications on your dashboard.</p>
            <a href="http://localhost:5173/my-applications" class="button">View My Applications</a>
          </div>
          <div class="footer"><p>&copy; ${new Date().getFullYear()} JobConnect. All rights reserved.</p></div>
        </div>
      </body>
    </html>
  `;

  try {
    await sendEmail({
        email: email,
        subject: `Confirmation of Your Application for ${jobDetails.title}`,
        message: emailMessage,
    });
  } catch(emailError){
      console.error("Email sending error:", emailError);
      // Don't fail the application submission due to email error
  }

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const getMyApplications = catchAsyncErrors(async (req, res, next) => {
  const { role, _id } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employers cannot view applications this way.", 400));
  }
  const applications = await Application.find({ "applicantID.user": _id }).populate('jobID');
  res.status(200).json({
    success: true,
    applications,
  });
});

export const getJobApplications = catchAsyncErrors(async (req, res, next) => {
  const { role, _id } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seekers cannot access this resource.", 400));
  }
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if(!job){
      return next(new ErrorHandler("Job not found!", 404));
  }
  if(job.postedBy.toString() !== _id.toString()){
    return next(new ErrorHandler("You are not authorized to view applications for this job.", 403));
  }

  const applications = await Application.find({ jobID: jobId });
  res.status(200).json({
    success: true,
    applications,
  });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { role, _id } = req.user;
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }

  if(role === 'Job Seeker' && application.applicantID.user.toString() !== _id.toString()){
      return next(new ErrorHandler("You are not authorized to delete this application.", 403));
  }

  if(role === 'Employer' && application.employerID.user.toString() !== _id.toString()){
    return next(new ErrorHandler("You are not authorized to delete this application.", 403));
  }
  
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted Successfully!",
  });
});

export const getSingleApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const application = await Application.findById(id).populate('applicantID.user').populate('employerID.user');
    if(!application){
        return next(new ErrorHandler("Application not found!", 404));
    }
    // Add authorization check later
    res.status(200).json({
        success: true,
        application,
    });
});

export const checkAts = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
    }
    if (!req.file) {
        return next(new ErrorHandler("Resume file required!", 400));
    }
    
    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
        return next(new ErrorHandler("Only PDF files are allowed!", 400));
    }
    
    // Validate file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
        return next(new ErrorHandler("File size should be less than 5MB!", 400));
    }
    
    const { jobId } = req.body;
    if (!jobId) {
        return next(new ErrorHandler("Job ID is required.", 400));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    try {
        // Validate PDF structure before parsing
        if (!req.file.buffer || req.file.buffer.length === 0) {
            return next(new ErrorHandler("Invalid or empty PDF file!", 400));
        }
        
        // Check if file starts with PDF header
        const pdfHeader = req.file.buffer.slice(0, 4).toString();
        if (pdfHeader !== '%PDF') {
            return next(new ErrorHandler("Invalid PDF file format!", 400));
        }
        
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;
        
        // Check if PDF contains readable text
        if (!resumeText || resumeText.trim().length === 0) {
            return next(new ErrorHandler("PDF file appears to be empty or contains no readable text!", 400));
        }
        
        const atsScore = await getAtsScore(resumeText, jobDetails.skills);

        res.status(200).json({
            success: true,
            message: "ATS Score Calculated Successfully!",
            atsScore,
        });
    } catch (error) {
        console.error("PDF parsing error:", error);
        if (error.message.includes('Invalid PDF structure') || 
            error.message.includes('PDF parsing') ||
            error.message.includes('Invalid PDF')) {
            return next(new ErrorHandler("Invalid PDF file. Please ensure the file is a valid PDF document.", 400));
        }
        return next(new ErrorHandler("Error processing PDF file. Please try again with a different file.", 500));
    }
}); 