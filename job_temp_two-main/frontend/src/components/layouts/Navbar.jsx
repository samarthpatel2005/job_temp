import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building, FileText, Home, LogIn, LogOut, Menu, PlusSquare, User, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileOpen(!profileOpen);

  const baseLinkClasses = 'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200';
  const activeLinkClasses = 'bg-white/10 text-white ring-1 ring-white/15';
  const inactiveLinkClasses = 'text-slate-300 hover:bg-white/8 hover:text-white';

  const mobileLinkClasses = 'flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium transition-all duration-200';
  const activeMobileLinkClasses = 'bg-white/10 text-white ring-1 ring-white/15';
  const inactiveMobileLinkClasses = 'text-slate-300 hover:bg-white/8 hover:text-white';

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  const commonLinks = (mobile = false) => (
    <NavLink to="/jobs" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
      <Briefcase className="h-5 w-5" /> Find Jobs
    </NavLink>
  );

  const jobSeekerLinks = (mobile = false) => (
    <>
      <NavLink to="/" end className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <Home className="h-5 w-5" /> Dashboard
      </NavLink>
      <NavLink to="/my-applications" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <FileText className="h-5 w-5" /> My Applications
      </NavLink>
    </>
  );
  
  const employerLinks = (mobile = false) => (
    <>
      <NavLink to="/" end className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <Home className="h-5 w-5" /> Dashboard
      </NavLink>
      <NavLink to="/post-job" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <PlusSquare className="h-5 w-5" /> Post Job
      </NavLink>
      <NavLink to="/my-jobs" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <Building className="h-5 w-5" /> My Jobs
      </NavLink>
    </>
  );

  const guestLinks = (mobile = false) => (
    <>
      <NavLink to="/login" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <LogIn className="h-5 w-5" /> Login
      </NavLink>
      <NavLink to="/register" className={({ isActive }) => `${mobile ? mobileLinkClasses : baseLinkClasses} ${isActive ? (mobile ? activeMobileLinkClasses : activeLinkClasses) : (mobile ? inactiveMobileLinkClasses : inactiveLinkClasses)}`}>
        <UserPlus className="h-5 w-5" /> Register
      </NavLink>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="page-width px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                <Briefcase className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight">JobConnect</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">AI hiring suite</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-8 flex items-center gap-2">
                {loading ? null : (isAuthenticated && user) ? (user.role === 'Job Seeker' ? jobSeekerLinks() : employerLinks()) : null}
                {commonLinks()}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {(isAuthenticated && user) ? (
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative ml-3">
                  <button onClick={toggleProfileMenu} className="flex max-w-xs items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-sm text-white shadow-lg shadow-slate-950/20 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/30">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10" src={user?.profilePicture?.url || 'https://via.placeholder.com/40'} alt="profile" />
                    <span className="hidden text-left lg:block">
                      <span className="block text-sm font-semibold text-white">{user.name}</span>
                      <span className="block text-xs text-slate-400">{user.role}</span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/50 backdrop-blur-xl"
                      >
                        <NavLink to="/profile" className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
                          <User className="h-4 w-4" /> Your Profile
                        </NavLink>
                        <button onClick={() => { logout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">{loading ? null : guestLinks()}</div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/30">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl md:hidden"
          >
            <div className="page-width px-4 pb-5 pt-4 sm:px-6">
              {loading ? null : (isAuthenticated && user) ? (user.role === 'Job Seeker' ? jobSeekerLinks(true) : employerLinks(true)) : guestLinks(true)}
              {(isAuthenticated && user) && (
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center px-1">
                    <div className="flex-shrink-0">
                      <img className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10" src={user?.profilePicture?.url || 'https://via.placeholder.com/40'} alt="profile" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-semibold leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <NavLink to="/profile" className={mobileLinkClasses + ' ' + inactiveMobileLinkClasses}>
                      <User className="h-5 w-5" /> Your Profile
                    </NavLink>
                    <button onClick={() => { logout(); setIsOpen(false); }} className={`${mobileLinkClasses} ${inactiveMobileLinkClasses} w-full text-left`}>
                      <LogOut className="h-5 w-5" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;