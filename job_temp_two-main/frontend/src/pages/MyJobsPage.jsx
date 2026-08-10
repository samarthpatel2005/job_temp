import { motion } from 'framer-motion';
import { Briefcase, Calendar, Eye, MapPin, Plus, Sparkles, Trash2, Users, WandSparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useApplications } from '../contexts/applicationContext';
import { useAuth } from '../contexts/authContext';
import { useJobs } from '../contexts/jobContext';

const MyJobsPage = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchMyJobs, deleteJob } = useJobs();
  const { fetchJobApplicants } = useApplications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadMyJobs = async () => {
    setLoading(true);
    const result = await fetchMyJobs();
    if (result.success) {
      const jobsWithCounts = await Promise.all(
        result.jobs.map(async (job) => {
          const applicantsResult = await fetchJobApplicants(job._id);
          return {
            ...job,
            applicantCount: applicantsResult.success ? applicantsResult.applicants.length : 0,
          };
        })
      );
      setMyJobs(jobsWithCounts);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role !== 'Employer') {
      navigate('/');
    } else {
      loadMyJobs();
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const result = await deleteJob(id);
      if (result.success) {
        toast.success(result.message);
        loadMyJobs();
      } else {
        toast.error(result.message);
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  if (loading) {
    return <div className="surface-soft mx-auto max-w-md px-6 py-10 text-center text-slate-200">Loading your jobs...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="surface-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="hero-badge"><Sparkles className="h-4 w-4" /> Employer dashboard</span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Your jobs at a glance.</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Browse active openings, track applicants, edit postings, and manage deletions from a cleaner premium dashboard.</p>
          </div>
          <Link to="/post-job" className="primary-button gap-2 self-start"><Plus size={18} /> Post job</Link>
        </div>
      </motion.section>

      {myJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {myJobs.map((job, i) => (
            <motion.div
              key={job._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className="surface-soft flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className={`chip ${job.expired ? 'border-rose-400/20 bg-rose-400/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>
                  {job.expired ? 'Expired' : 'Active'}
                </span>
              </div>

              <div className="mt-5 space-y-3 flex-1">
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-cyan-200" /> {job.city}, {job.country}</p>
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-cyan-200" /> Posted {new Date(job.jobPostedOn).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><Users size={14} className="text-cyan-200" /> {job.applicantCount} applicants</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                <button onClick={() => navigate(`/job/applicants/${job._id}`)} className="secondary-button flex items-center justify-center gap-2 px-3 py-3 text-sm" title="View Applicants">
                  <Eye size={18} />
                </button>
                <button onClick={() => navigate(`/post-job/${job._id}`)} className="secondary-button flex items-center justify-center gap-2 px-3 py-3 text-sm" title="Edit Job">
                  <WandSparkles size={18} />
                </button>
                <button onClick={() => handleDelete(job._id)} className="secondary-button flex items-center justify-center gap-2 px-3 py-3 text-sm text-rose-200 hover:border-rose-300/30 hover:bg-rose-400/10" title="Delete Job">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="surface-soft flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-200 ring-1 ring-white/10">
            <Briefcase className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-bold text-white">No jobs posted yet</h3>
          <p className="mt-3 max-w-xl text-slate-300">Post your first job to start collecting applicants and managing your hiring pipeline.</p>
          <Link to="/post-job" className="primary-button mt-8">Post a job</Link>
        </div>
      )}
    </div>
  );
};

export default MyJobsPage; 