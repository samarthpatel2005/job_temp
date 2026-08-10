import { motion } from 'framer-motion';
import { BarChart2, Briefcase, Edit, Eye, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useApplications } from '../contexts/applicationContext';
import { useAuth } from '../contexts/authContext';
import { useJobs } from '../contexts/jobContext';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const { fetchMyJobs, deleteJob } = useJobs();
  const { fetchJobApplicants } = useApplications();
  const navigate = useNavigate();

  const [myJobs, setMyJobs] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const jobsResult = await fetchMyJobs();
    if (jobsResult.success) {
      setMyJobs(jobsResult.jobs);
      let applicantsData = [];
      for (const job of jobsResult.jobs) {
        const applicantsResult = await fetchJobApplicants(job._id);
        if (applicantsResult.success) {
            const applicantsWithJobTitle = applicantsResult.applicants.map(app => ({...app, jobTitle: job.title}));
            applicantsData = [...applicantsData, ...applicantsWithJobTitle];
        }
      }
      setAllApplicants(applicantsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      const result = await deleteJob(id);
      if (result.success) {
        fetchData();
      }
    }
  };

  const totalApplications = allApplicants.length;
  const recentApplicants = allApplicants.slice(0, 5);
  
  const applicationByJobData = myJobs.map(job => ({
      name: job.title,
      value: allApplicants.filter(app => app.jobID === job._id).length
  })).filter(item => item.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="surface-strong p-6 sm:p-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
            <span className="hero-badge mb-4"><Sparkles className="h-4 w-4" /> Employer dashboard</span>
            <h1 className="text-4xl font-black tracking-tight text-white">Hello, {user?.name} 👋</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Here’s an overview of your hiring activities, application flow, and active job posts.</p>
        </div>
        <Link to="/post-job" className="primary-button gap-2 self-start">
            <Plus /> Post a New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-soft p-6 flex items-center space-x-4">
          <Briefcase className="w-12 h-12 text-cyan-300" />
          <div>
            <p className="text-slate-300">Total Jobs Posted</p>
            <p className="text-3xl font-bold text-white">{myJobs.length}</p>
          </div>
        </div>
        <div className="surface-soft p-6 flex items-center space-x-4">
          <Users className="w-12 h-12 text-emerald-300" />
          <div>
            <p className="text-slate-300">Total Applications</p>
            <p className="text-3xl font-bold text-white">{totalApplications}</p>
          </div>
        </div>
        <div className="surface-soft p-6 flex items-center space-x-4">
            <BarChart2 className="w-12 h-12 text-indigo-300" />
            <div>
                <p className="text-slate-300">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">{myJobs.length > 0 ? `${((totalApplications / myJobs.length) * 10).toFixed(1)}%` : 'N/A'}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 surface-soft p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Active Job Posts</h2>
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {myJobs.map(job => (
              <div key={job._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:bg-white/8">
                <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <p className="text-sm text-slate-400">Posted on: {new Date(job.jobPostedOn).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/job/applicants/${job._id}`)} className="rounded-full p-2 text-cyan-300 transition hover:bg-white/10"><Eye /></button>
                    <button onClick={() => navigate(`/post-job/${job._id}`)} className="rounded-full p-2 text-emerald-300 transition hover:bg-white/10"><Edit /></button>
                    <button onClick={() => handleDelete(job._id)} className="rounded-full p-2 text-rose-300 transition hover:bg-white/10"><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 surface-soft p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Recent Applications</h2>
          <div className="space-y-3">
            {recentApplicants.map(app => (
              <div key={app._id} className="flex items-center justify-between rounded-2xl bg-slate-950/40 p-3">
                <div>
                  <p className="font-semibold text-white">{app.name}</p>
                  <p className="text-sm text-slate-400">Applied for: {app.jobTitle}</p>
                </div>
                <Link to={`/job/applicants/${app.jobID}`} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="surface-soft p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Applications by Job</h2>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={applicationByJobData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {applicationByJobData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
      </div>

    </motion.div>
  );
};

export default EmployerDashboard; 