import { Briefcase, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Job Seeker');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password, role);
    if (result.success) {
      toast.success(result.message);
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_35%)]" />
          <div className="relative h-full">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              <Sparkles className="h-4 w-4" /> Welcome back
            </div>
            <div className="mt-10 space-y-6">
              <h1 className="max-w-md text-5xl font-black tracking-tight">Access the hiring workspace in a few seconds.</h1>
              <p className="max-w-md text-lg leading-8 text-cyan-50/90">Your dashboard, ATS score, shortlist, and chat all live in one clean interface.</p>
            </div>
            <div className="mt-12 space-y-4">
              {[
                'Polished candidate dashboards',
                'ATS scoring during application',
                'Real-time messaging and shortlisting',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-8 left-10 flex items-center gap-3 text-sm text-cyan-50/80">
              <Briefcase className="h-5 w-5" /> JobConnect
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <span className="hero-badge mx-auto mb-4"><Briefcase className="h-4 w-4" /> Secure login</span>
              <h2 className="text-3xl font-bold text-white">Sign in to your workspace</h2>
              <p className="mt-3 text-slate-300">Continue to your dashboard, applications, and chat history.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="field">
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>
              </div>
              <button type="submit" className="primary-button w-full">Login</button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-300">
              Don't have an account? <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
