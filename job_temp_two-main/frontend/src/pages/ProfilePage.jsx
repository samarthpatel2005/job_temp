import { AnimatePresence, motion } from 'framer-motion';
import { Building, Camera, Code, Globe, GraduationCap, Mail, Plus, Sparkles, Trash2, User, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/authContext';

const ArrayInputManager = ({ label, items, onAdd, onRemove, placeholder, icon }) => {
    const [inputValue, setInputValue] = useState('');
    const Icon = icon;

    const handleAdd = () => {
        if (inputValue.trim() === '') {
            return;
        }

        onAdd(inputValue.trim());
        setInputValue('');
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</label>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <motion.div
                        key={`${item}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="chip gap-2 border border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
                    >
                        {item}
                        <button type="button" onClick={() => onRemove(index)} className="rounded-full p-1 text-cyan-100/70 transition hover:bg-white/10 hover:text-white">
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className="field pl-11 pr-12"
                    placeholder={placeholder}
                />
                <button type="button" onClick={handleAdd} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 transition hover:brightness-110">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

const JobSeekerProfile = ({ user, formData, setFormData, handleAddItem, handleRemoveItem }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const tabs = ['personal', 'skills', 'education'];

    return (
        <div className="space-y-8">
            <div className="surface-soft p-2">
                <div className="grid grid-cols-3 gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                    {activeTab === 'personal' && (
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="field" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="field" />
                            </div>
                        </div>
                    )}
                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            <ArrayInputManager label="Skills" items={formData.skills} onAdd={(item) => handleAddItem('skills', item)} onRemove={(index) => handleRemoveItem('skills', index)} placeholder="Add a new skill..." icon={Code} />
                            <ArrayInputManager label="Languages" items={formData.languages} onAdd={(item) => handleAddItem('languages', item)} onRemove={(index) => handleRemoveItem('languages', index)} placeholder="Add a new language..." icon={Globe} />
                        </div>
                    )}
                    {activeTab === 'education' && (
                        <ArrayInputManager label="Education" items={formData.education} onAdd={(item) => handleAddItem('education', item)} onRemove={(index) => handleRemoveItem('education', index)} placeholder="Add education credential..." icon={GraduationCap} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const EmployerProfile = ({ user, formData, setFormData }) => (
    <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Name</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="field" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="field" />
            </div>
        </div>
        <div className="surface-soft space-y-6 p-5">
            <div className="flex items-center gap-3 text-white">
                <Building className="h-5 w-5 text-cyan-200" />
                <h3 className="text-lg font-bold">Company details</h3>
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Company name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="field" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Company description</label>
                <textarea name="companyDescription" value={formData.companyDescription} onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })} rows="4" className="field min-h-36 resize-y" />
            </div>
        </div>
    </div>
);

const ProfilePage = () => {
  const { user, updateProfile, updateProfilePicture, removeProfilePicture } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', companyName: '', companyDescription: '',
    education: [], skills: [], languages: [],
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
        if (user && !isInitialized) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        education: user.education || [],
        skills: user.skills || [],
        languages: user.languages || [],
      });
      setProfilePicPreview(user.profilePicture?.url || '');
      setIsInitialized(true);
    }
  }, [user, isInitialized]);
  
  const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

  const handlePicUpdate = async () => {
        if (!profilePicFile) return toast.error('Please select an image first.');
        const formData = new FormData();
        formData.append('profilePicture', profilePicFile);
        const result = await updateProfilePicture(formData);
        if (result.success) {
            setProfilePicFile(null);
        }
    };

  const handlePicRemove = async () => {
        if (window.confirm('Are you sure you want to remove your profile picture?')) {
            await removeProfilePicture();
    }
    };

  const handleAddItem = useCallback((field, item) => {
        setFormData((prev) => {
      const newData = { ...prev, [field]: [...prev[field], item] };
      return newData;
    });
  }, []);
  
  const handleRemoveItem = useCallback((field, index) => {
        setFormData((prev) => {
      const newData = { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
      return newData;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

    if (!user) return <div className="surface-soft mx-auto max-w-md px-6 py-10 text-center text-slate-200">Loading profile...</div>;

  const ProfileIcon = user.role === 'Employer' ? Building : User;

  return (
        <div className="space-y-8">
            <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="surface-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_26%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl space-y-4">
                        <span className="hero-badge"><Sparkles className="h-4 w-4" /> Profile studio</span>
                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Shape your profile with a cleaner, more premium editor.</h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Update personal details, build your skill stack, and manage your company or candidate profile in one focused workspace.</p>
                    </div>
                    <div className="surface-soft flex items-center gap-4 px-5 py-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200 ring-1 ring-white/10">
                            <ProfileIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Signed in as</p>
                            <p className="text-lg font-bold text-white">{formData.name || 'Your profile'}</p>
                            <p className="text-sm text-slate-300">{formData.email}</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
                <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="surface-soft p-6 text-center lg:sticky lg:top-28 lg:self-start">
                    <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                        <img src={profilePicPreview || 'https://via.placeholder.com/300'} alt="Profile" className="h-full w-full object-cover" />
                        <label htmlFor="profilePicInput" className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-950/40 opacity-0 transition hover:opacity-100">
                            <Camera className="h-12 w-12 text-white" />
                        </label>
                        <input type="file" id="profilePicInput" onChange={handlePicChange} className="hidden" accept="image/*" />
                    </div>
                    <div className="mt-6 space-y-3">
                        {profilePicFile && <button onClick={handlePicUpdate} className="primary-button w-full">Save picture</button>}
                        {user.profilePicture?.fileName && <button onClick={handlePicRemove} className="secondary-button flex w-full items-center justify-center gap-2 text-rose-200 hover:border-rose-300/30 hover:bg-rose-400/10"><Trash2 size={16} /> Remove picture</button>}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="surface-soft p-6 sm:p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 text-cyan-200 ring-1 ring-white/10">
                                <ProfileIcon className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{formData.name || 'Profile details'}</h2>
                                <p className="mt-1 flex items-center gap-2 text-slate-300"><Mail size={14} /> {formData.email}</p>
                            </div>
                        </div>

                        {user.role === 'Job Seeker' ? (
                            <JobSeekerProfile user={user} formData={formData} setFormData={setFormData} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} />
                        ) : (
                            <EmployerProfile user={user} formData={formData} setFormData={setFormData} />
                        )}

                        <div className="border-t border-white/10 pt-6">
                            <button type="submit" className="primary-button w-full py-4 text-lg">Update profile</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
  );
};

export default ProfilePage; 