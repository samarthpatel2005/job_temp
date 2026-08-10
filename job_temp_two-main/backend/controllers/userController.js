import fs from "fs";
import path from "path";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full registration form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  const subject = `Welcome to Job Portal, ${user.name}!`;
  let message;
  if (user.role === "Job Seeker") {
    message = `
      <h1>Hi ${user.name},</h1>
      <p>Welcome to Job Portal! We're excited to have you as a Job Seeker.</p>
      <p>Start exploring thousands of job opportunities tailored for you.</p>
      <p>Best of luck with your job search!</p>
      <p>Regards,</p>
      <p>Job Portal Team</p>
    `;
  } else if (user.role === "Employer") {
    message = `
      <h1>Hi ${user.name},</h1>
      <p>Welcome to Job Portal! We're thrilled to have you as an Employer.</p>
      <p>Post job openings and find the best talent for your organization.</p>
      <p>We look forward to helping you build a great team!</p>
      <p>Regards,</p>
      <p>Job Portal Team</p>
    `;
  }

  try {
    await sendEmail({
      email: user.email,
      subject,
      message,
    });
  } catch (error) {
    console.error("Error sending registration email:", error);
    // Optional: You might want to add more robust error handling/logging here
  }

  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and role not found!`, 404)
    );
  }
  sendToken(user, 200, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const { _id } = req.user;
    
    // Add debugging
    console.log("Profile update request received:");
    console.log("User ID:", _id);
    console.log("Request body:", req.body);
    
    // Remove fields that should not be updatable this way
    const { role, password, ...updateData } = req.body;
    
    // Ensure arrays are properly handled
    if (updateData.skills && typeof updateData.skills === 'string') {
        updateData.skills = updateData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    if (updateData.education && typeof updateData.education === 'string') {
        updateData.education = updateData.education.split(',').map(edu => edu.trim()).filter(edu => edu);
    }
    if (updateData.languages && typeof updateData.languages === 'string') {
        updateData.languages = updateData.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
    }
    
    console.log("Update data after processing:", updateData);

    const user = await User.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    
    console.log("Updated user skills:", user.skills);
    console.log("Updated user education:", user.education);
    console.log("Updated user languages:", user.languages);

    res.status(200).json({
        success: true,
        message: "Profile Updated!",
        user,
    });
});

export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler("Profile picture file required!", 400));
    }
    const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const uploadsDir = path.join(process.cwd(), "uploads", "profiles");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = path.extname(req.file.originalname) || ".png";
  const newFileName = `${user._id}_${Date.now()}${extension}`;
  const filePath = path.join(uploadsDir, newFileName);

  if (user.profilePicture?.fileName) {
    const previousFileName = user.profilePicture.fileName.replace(/\\/g, "/");
    if (previousFileName.startsWith("uploads/")) {
      const previousFilePath = path.join(process.cwd(), previousFileName);
      if (fs.existsSync(previousFilePath)) {
        fs.unlinkSync(previousFilePath);
      }
    }
  }

  fs.writeFileSync(filePath, req.file.buffer);

  const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${newFileName}`;

    user.profilePicture = {
        url: profilePictureUrl,
    fileName: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Picture Updated!",
        user,
    });
});

export const removeProfilePicture = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  if (user.profilePicture && user.profilePicture.fileName) {
    const previousFileName = user.profilePicture.fileName.replace(/\\/g, "/");
    if (previousFileName.startsWith("uploads/")) {
      const previousFilePath = path.join(process.cwd(), previousFileName);
      if (fs.existsSync(previousFilePath)) {
        fs.unlinkSync(previousFilePath);
      }
    }
    }

    // Reset to default
    user.profilePicture = {
        url: "https://t3.ftcdn.net/jpg/05/17/79/88/360_F_517798849_WuXhHTpg2djTbfNf0FQAjzFEoluHpnct.jpg",
        fileName: "",
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Picture Removed!",
        user,
    });
}); 