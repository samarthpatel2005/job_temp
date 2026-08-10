import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../contexts/jobContext';

const JobsPage = () => {
  // Destructuring jobs and loading state from the job context
  const { jobs, loading } = useJobs();

  // State to hold jobs after filtering
  const [filteredJobs, setFilteredJobs] = useState([]);

  // State to manage the filter input values
  const [filters, setFilters] = useState({
    title: '',
    country: '',
    city: '',
    jobType: 'All',
  });

  // useEffect hook to apply filters whenever 'jobs' data or 'filters' change
  useEffect(() => {
    let result = jobs; // Start with all jobs

    // Apply title filter if 'title' input is not empty
    if (filters.title) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    // Apply country filter if 'country' input is not empty
    if (filters.country) {
      result = result.filter(job =>
        job.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    // Apply city filter if 'city' input is not empty
    if (filters.city) {
      result = result.filter(job =>
        job.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.jobType && filters.jobType !== 'All') {
      result = result.filter(job => job.jobType === filters.jobType);
    }
    setFilteredJobs(result); // Update the filtered jobs state
  }, [jobs, filters]); // Dependencies: re-run when 'jobs' or 'filters' change

  // Handler for changes in filter input fields
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Display a loading message while job data is being fetched
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="surface-soft px-8 py-6 text-center text-slate-200">Loading job listings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="surface-strong relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.15),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.12),_transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="hero-badge"><Sparkles className="h-4 w-4" /> Search the marketplace</span>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">Discover your next opportunity.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">Search by role, location, and work style with a focused view of every opening.</p>
          </div>
          <div className="surface-soft flex items-center gap-3 px-4 py-3 text-slate-200">
            <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
            <span className="text-sm font-medium">Refined filter experience</span>
          </div>
        </div>
      </motion.section>

      <section className="surface-soft p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="title"
              placeholder="Search by title..."
              value={filters.title}
              onChange={handleFilterChange}
              className="field pl-11"
              aria-label="Search by job title"
            />
          </div>
          <input
            type="text"
            name="country"
            placeholder="Filter by country..."
            value={filters.country}
            onChange={handleFilterChange}
            className="field"
            aria-label="Filter by country"
          />
          <input
            type="text"
            name="city"
            placeholder="Filter by city..."
            value={filters.city}
            onChange={handleFilterChange}
            className="field"
            aria-label="Filter by city"
          />
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            className="field md:col-span-2"
            aria-label="Filter by job type"
          >
            <option value="All">All Types</option>
            <option value="Full Time">Full-time</option>
            <option value="Part Time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredJobs && filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <motion.div key={job._id} whileHover={{ y: -6 }} className="surface-soft flex h-full flex-col p-6 transition hover:border-cyan-300/20 hover:bg-white/8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-white">{job.title}</h2>
                    <span className="chip shrink-0">{job.jobType}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{job.companyName}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin className="h-4 w-4" /> {job.city}, {job.country}</p>
                </div>
              </div>
              <p className="mt-5 line-clamp-3 flex-1 leading-7 text-slate-300">{job.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-lg font-bold text-white">
                  {job.fixedSalary ? `$${Number(job.fixedSalary).toLocaleString()}` : `$${Number(job.salaryFrom).toLocaleString()} - $${Number(job.salaryTo).toLocaleString()}`}
                </span>
                <Link to={`/job/${job._id}`} className="secondary-button gap-2 px-4 py-2 text-sm">
                  View details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="surface-soft col-span-full px-6 py-14 text-center text-slate-300">No jobs match your criteria. Please adjust your filters.</p>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
