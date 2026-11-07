'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  UploadCloud,
  Check,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ProfileDrawer: React.FC = () => {
  const { isProfileDrawerOpen, setIsProfileDrawerOpen, currentUser, updateProfile } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState(6);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  // Sync state when open
  useEffect(() => {
    if (currentUser && isProfileDrawerOpen) {
      const timer = setTimeout(() => {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
        setTitle(currentUser.title || '');
        setLocation(currentUser.location || '');
        setBio(currentUser.bio || '');
        setYearsExperience(currentUser.yearsExperience || 5);
        setSkills(currentUser.skills || []);
        setPortfolioUrl(currentUser.portfolioUrl || '');
        setGithubUrl(currentUser.githubUrl || '');
        setResumeFileName(currentUser.resumeFileName || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isProfileDrawerOpen]);

  if (!isProfileDrawerOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimulateResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      title,
      location,
      bio,
      yearsExperience: Number(yearsExperience) || 1,
      skills,
      portfolioUrl,
      githubUrl,
      resumeFileName: resumeFileName || 'Alex_Mercer_Resume_2026.pdf',
    });
    setIsProfileDrawerOpen(false);
  };

  return (
    <div
      onClick={() => setIsProfileDrawerOpen(false)}
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-[#0a66c2]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Professional Profile</h2>
              <p className="text-xs text-slate-500">
                Update your credentials, resume, and skills for recruiter visibility
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Quick Avatar & Status */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#0a66c2]"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900">{name || 'Your Profile'}</span>
              <p className="text-xs text-slate-500">{title || 'Specialist'}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Profile Strength: {currentUser?.profileCompleteness || 85}%</span>
              </div>
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Professional Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Next.js & Full-Stack Engineer"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Years of Total Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Summary / About Me
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Verified Technical Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. GraphQL, Next.js 16)"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0a66c2] border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio / Personal Website URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub / LinkedIn URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Resume Upload Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default Resume / CV Document
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleSimulateResume}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-7 h-7 text-[#0a66c2] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {resumeFileName ? resumeFileName : 'Upload your updated resume PDF'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, DOCX up to 10MB • Auto-attaches to 1-Click Easy Apply
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#084e96] rounded-lg shadow-2xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
