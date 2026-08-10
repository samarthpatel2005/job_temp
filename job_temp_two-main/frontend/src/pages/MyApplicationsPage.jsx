import { motion } from 'framer-motion';
import { BadgeCheck, Briefcase, Building, FileText, MapPin, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplications } from '../contexts/applicationContext';
import { useAuth } from '../contexts/authContext';

const MyApplicationsPage = () => {
  const { myApplications, deleteApplication, fetchMyApplications } = useApplications();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'Job Seeker') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      const result = await deleteApplication(id);
      if (result.success) {
        fetchMyApplications();
      }
    }
  };

  const summary = useMemo(() => ({
    total: myApplications.length,
    shortlisted: myApplications.filter((application) => application.status === 'Shortlisted').length,
    pending: myApplications.filter((application) => !['Shortlisted', 'Rejected'].includes(application.status)).length,
  }), [myApplications]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200';
      case 'Rejected':
        return 'border-rose-400/20 bg-rose-400/10 text-rose-200';
      default:
        return 'border-amber-400/20 bg-amber-400/10 text-amber-200';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 },
    }),
  };

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="surface-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_26%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="hero-badge"><Sparkles className="h-4 w-4" /> Application tracker</span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Your applications in one high-clarity view.</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Track every submission, open the matching job, jump into chat, or withdraw an application from a cleaner dark dashboard.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
            {[
              { label: 'Total', value: summary.total },
              { label: 'Pending', value: summary.pending },
              { label: 'Shortlisted', value: summary.shortlisted },
            ].map((item) => (
              <div key={item.label} className="surface-soft px-4 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {myApplications.length > 0 ? (
        <div className="space-y-5">
          {myApplications.map((app, i) => {
            const job = app.jobID;

            if (!job) {
              return (
                <motion.div key={app._id} variants={cardVariants} initial="hidden" animate="visible" custom={i} className="surface-soft flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Archived application</p>
                    <h2 className="mt-2 text-xl font-bold text-white">This job is no longer available.</h2>
                  </div>
                  <button onClick={() => handleDelete(app._id)} className="secondary-button gap-2 self-start text-sm text-rose-200 hover:border-rose-300/30 hover:bg-rose-400/10"><Trash2 className="h-4 w-4" /> Withdraw</button>
                </motion.div>
              );
            }

            return (
              <motion.div key={app._id} variants={cardVariants} initial="hidden" animate="visible" custom={i} className="surface-soft p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                      <Briefcase className="h-7 w-7" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Application status</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                          <span className={`chip border ${getStatusClasses(app.status)}`}>{app.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-2"><Building className="h-4 w-4 text-cyan-200" /> {job.companyName}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-200" /> {job.city}, {job.country}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(app._id)} className="secondary-button gap-2 self-start text-sm text-rose-200 hover:border-rose-300/30 hover:bg-rose-400/10"><Trash2 className="h-4 w-4" /> Withdraw</button>
                </div>

                <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-indigo-200 ring-1 ring-white/10"><BadgeCheck className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm text-slate-400">ATS Score</p>
                      <p className="text-2xl font-black text-white">{app.atsScore}%</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/job/${job._id}`} className="secondary-button gap-2 text-sm"><FileText className="h-4 w-4" /> Details</Link>
                    <Link to={`/chat/${app._id}`} className="primary-button gap-2 text-sm"><MessageSquare className="h-4 w-4" /> Chat</Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="surface-soft flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-200 ring-1 ring-white/10">
            <FileText className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-bold text-white">No applications yet</h3>
          <p className="mt-3 max-w-xl text-slate-300">Once you apply for jobs, every submission will appear here with its ATS score and status.</p>
          <Link to="/jobs" className="primary-button mt-8">Find jobs</Link>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;