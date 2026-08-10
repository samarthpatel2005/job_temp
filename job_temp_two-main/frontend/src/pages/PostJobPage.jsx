import { motion } from 'framer-motion';
import { Briefcase, Building2, Globe2, Hash, LayoutGrid, MapPin, Megaphone, PencilLine, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useJobs } from '../contexts/jobContext';

const PostJobPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    category: '',
    country: '',
    city: '',
    location: '',
    skills: '',
    jobType: 'Full Time',
    salaryType: 'range',
    fixedSalary: '',
    salaryFrom: '',
    salaryTo: '',
  });
  const { postJob, getSingleJob, updateJob } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchJobData = async () => {
        const result = await getSingleJob(id);
        if (result.success) {
          const { job } = result;
          setFormData({
            ...job,
            skills: job.skills.join(', '),
            salaryType: job.fixedSalary ? 'fixed' : 'range',
          });
        }
      };
      fetchJobData();
    }
  }, [id, getSingleJob]);

  useEffect(() => {
    if (user && user.role !== 'Employer') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map(skill => skill.trim());
    const jobData = { ...formData, skills: skillsArray };
    
    let result;
    if(id){
        result = await updateJob(id, jobData);
    } else {
        result = await postJob(jobData);
    }

    if (result.success) {
      toast.success(result.message);
      navigate('/my-jobs');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="surface-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="hero-badge"><Sparkles className="h-4 w-4" /> Employer studio</span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{id ? 'Edit your job post' : 'Post a new opportunity'}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Publish a sharper job card with a cleaner layout, better hierarchy, and a more premium feel for hiring teams.</p>
          </div>
          <div className="surface-soft grid grid-cols-2 gap-3 px-5 py-4 sm:min-w-[320px]">
            {[
              { label: 'Title', value: formData.title || 'Role' },
              { label: 'Type', value: formData.jobType || 'Full Time' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} onSubmit={handleSubmit} className="surface-soft space-y-8 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Briefcase className="h-4 w-4 text-cyan-200" /> Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Building2 className="h-4 w-4 text-cyan-200" /> Company name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="field" required />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Megaphone className="h-4 w-4 text-cyan-200" /> Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="field min-h-44 resize-y" required />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Hash className="h-4 w-4 text-cyan-200" /> Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Globe2 className="h-4 w-4 text-cyan-200" /> Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="field" required />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><MapPin className="h-4 w-4 text-cyan-200" /> City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="field" required />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><LayoutGrid className="h-4 w-4 text-cyan-200" /> Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="field" required />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><PencilLine className="h-4 w-4 text-cyan-200" /> Skills, comma separated</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="field" required />
        </div>

        <div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Job type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} className="field">
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400"><Wallet className="h-4 w-4 text-cyan-200" /> Salary type</label>
            <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="field">
              <option value="range">Range</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>

        {formData.salaryType === 'fixed' ? (
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Fixed salary</label>
            <input type="number" name="fixedSalary" value={formData.fixedSalary} onChange={handleChange} className="field" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Salary from</label>
              <input type="number" name="salaryFrom" value={formData.salaryFrom} onChange={handleChange} className="field" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Salary to</label>
              <input type="number" name="salaryTo" value={formData.salaryTo} onChange={handleChange} className="field" />
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <button type="submit" className="primary-button w-full py-4 text-lg">{id ? 'Update job' : 'Post job'}</button>
        </div>
      </motion.form>
    </div>
  );
};

export default PostJobPage; 