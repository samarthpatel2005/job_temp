import { motion } from 'framer-motion';
import { ArrowRight, Building, ChartNoAxesCombined, FilePlus, MapPin, Search, ShieldCheck, Sparkles, UserCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useJobs } from '../contexts/jobContext';
import EmployerDashboard from './EmployerDashboard';
import JobSeekerDashboard from './JobSeekerDashboard';

const PublicHomePage = () => {
  const { jobs, loading } = useJobs();
  const featuredJobs = jobs.slice(0, 6);

  return (
    <div className="space-y-16">
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-glow surface-strong relative overflow-hidden px-6 py-16 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_28%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="hero-badge"><Sparkles className="h-4 w-4" /> AI-powered hiring</span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">Build a hiring flow that feels fast, modern, and human.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">JobConnect brings together job discovery, ATS scoring, shortlisting, and chat in one polished workspace for seekers and employers.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/jobs" className="primary-button gap-2"><Search size={18} /> Explore jobs</Link>
              <Link to="/register" className="secondary-button gap-2">Start hiring <ArrowRight size={18} /></Link>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                { label: 'Smart matching', value: 'ATS + AI' },
                { label: 'Live chat', value: 'In-app' },
                { label: 'Fast setup', value: 'One minute' },
              ].map((item) => (
                <div key={item.label} className="surface-soft p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-soft p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Create profile', text: 'Build a profile with skills, resume, and role.' },
                { title: 'Match instantly', text: 'Find jobs or candidates based on skill overlap.' },
                { title: 'Score resumes', text: 'Use ATS scoring before sending an application.' },
                { title: 'Keep chatting', text: 'Move from shortlist to conversation in-app.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <span className="hero-badge mx-auto"><ChartNoAxesCombined className="h-4 w-4" /> Modern workflow</span>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle mx-auto max-w-2xl">A single journey for candidates and employers, with less friction at every step.</p>
        </div>
        <div className="panel-grid md:grid-cols-3">
          {[
            { icon: UserCheck, title: 'Create an account', text: 'Set up your role, profile, and preferences in a few clicks.' },
            { icon: FilePlus, title: 'Find or post roles', text: 'Browse refined openings or publish hiring needs with rich details.' },
            { icon: Zap, title: 'Apply and connect', text: 'Check ATS fit, apply instantly, and chat with the right people.' },
          ].map((item) => (
            <div key={item.title} className="surface-soft p-7 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <span className="hero-badge mx-auto"><Building className="h-4 w-4" /> Featured openings</span>
          <h2 className="section-title">Latest job openings</h2>
          <p className="section-subtitle mx-auto max-w-2xl">Fresh listings rendered as polished cards with enough detail to scan quickly.</p>
        </div>
        {loading ? (
          <div className="surface-soft p-10 text-center text-slate-300">Loading jobs...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredJobs.map(job => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.45 }} className="surface-soft flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      <span className="chip shrink-0">{job.jobType}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{job.companyName}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400"><MapPin size={14}/> {job.city}, {job.country}</div>
                  </div>
                </div>
                <p className="mt-5 line-clamp-3 flex-1 leading-7 text-slate-300">{job.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-cyan-200">{job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom} - $${job.salaryTo}`}</span>
                  <Link to={`/job/${job._id}`} className="secondary-button px-4 py-2 text-sm">View details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center">
          <Link to="/jobs" className="primary-button">View all jobs</Link>
        </div>
      </section>
    </div>
  );
};

const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="surface-soft mx-auto max-w-md px-6 py-10 text-center text-slate-200">Loading...</div>;
  }

  if (user && user.role === 'Job Seeker') {
    return <JobSeekerDashboard />;
  }

  if (user && user.role === 'Employer') {
    return <EmployerDashboard />;
  }

  return <PublicHomePage />;
};

export default HomePage;
