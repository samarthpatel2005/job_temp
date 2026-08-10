import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="surface-strong max-w-xl px-8 py-14">
        <p className="hero-badge mx-auto">404</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="primary-button mt-8 gap-2">
          <ArrowLeft className="h-4 w-4" /> Go home
      </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 