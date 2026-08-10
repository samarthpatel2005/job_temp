import { motion } from 'framer-motion';
import { ArrowRight, Award, Briefcase, CheckCircle, MessageSquare, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApplications } from '../contexts/applicationContext';
import { useAuth } from '../contexts/authContext';
import { useJobs } from '../contexts/jobContext';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const { myApplications } = useApplications();
  const { jobs } = useJobs();

  const [highestAts, setHighestAts] = useState({ score: 0, jobTitle: '' });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profileStatus, setProfileStatus] = useState(0);

  useEffect(() => {
    if (myApplications.length > 0) {
      const highest = myApplications.reduce((prev, current) => (prev.atsScore > current.atsScore) ? prev : current);
      setHighestAts({ score: highest.atsScore, jobTitle: highest.jobID.title });
    }

    if (user && jobs.length > 0) {
      const userSkills = user.skills.map(skill => skill.toLowerCase());
      const recJobs = jobs.filter(job =>
        job.skills.some(skill => userSkills.includes(skill.toLowerCase()))
      ).slice(0, 5);
      setRecommendedJobs(recJobs);
    }
    
    if (user) {
      let completed = 0;
      if (user.name) completed++;
      if (user.email) completed++;
      if (user.phone) completed++;
      if (user.skills && user.skills.length > 0) completed++;
      if (user.resume && user.resume.url) completed++;
      setProfileStatus((completed / 5) * 100);
    }

  }, [myApplications, user, jobs]);

  const profileData = [
    { name: 'Profile', completed: profileStatus, remaining: 100 - profileStatus }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="surface-strong p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="hero-badge mb-4"><Sparkles className="h-4 w-4" /> Candidate dashboard</span>
            <h1 className="text-4xl font-black tracking-tight text-white">Welcome back, {user?.name}!</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Here’s your job search at a glance, with ATS, recommendations, and profile health in one place.</p>
          </div>
          <a href="/jobs" className="secondary-button gap-2 self-start"><ArrowRight className="h-4 w-4" /> Browse jobs</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="surface-soft flex items-center space-x-4 p-6">
          <Briefcase className="w-12 h-12 text-cyan-300" />
          <div>
            <p className="text-slate-300">Total Applications</p>
            <p className="text-3xl font-bold text-white">{myApplications.length}</p>
          </div>
        </div>

        <div className="surface-soft flex items-center space-x-4 p-6">
            <Award className="w-12 h-12 text-emerald-300" />
            <div>
                <p className="text-slate-300">Highest ATS Score</p>
                <p className="text-3xl font-bold text-white">{highestAts.score}%</p>
                <p className="text-sm text-slate-400 truncate">for {highestAts.jobTitle}</p>
            </div>
        </div>

        <div className="surface-soft flex items-center space-x-4 p-6">
            <MessageSquare className="w-12 h-12 text-indigo-300" />
            <div>
                <p className="text-slate-300">Messages</p>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">No new messages</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-soft p-6">
          <h2 className="mb-4 flex items-center text-xl font-bold text-white"><Briefcase className="mr-2"/> Recommended Jobs</h2>
          <div className="space-y-4">
            {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
              <div key={job._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:bg-white/8">
                <h3 className="font-bold text-white">{job.title}</h3>
                <p className="text-sm text-slate-400">{job.companyName}</p>
              </div>
            )) : <p className="text-slate-300">No recommendations for now. Update your skills for better matches.</p>}
          </div>
        </div>

        <div className="space-y-6">
            <div className="surface-soft p-6">
              <h2 className="mb-4 flex items-center text-xl font-bold text-white"><User className="mr-2"/> Profile Status</h2>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={profileData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#22d3ee" name="Completed" />
                  <Bar dataKey="remaining" stackId="a" fill="rgba(255,255,255,0.12)" name="Remaining" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center font-bold text-white">{Math.round(profileStatus)}% Complete</p>
            </div>

            <div className="surface-soft p-6">
                <h2 className="mb-4 flex items-center text-xl font-bold text-white"><CheckCircle className="mr-2"/> Your Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {user?.skills.map((skill, index) => (
                        <span key={index} className="chip">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

    </motion.div>
  );
};

export default JobSeekerDashboard; 