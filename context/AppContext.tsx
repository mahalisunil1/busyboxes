'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Gig,
  Job,
  JobApplication,
  GigOrder,
  NotificationItem,
  ChatMessage,
  JobAlert,
  UserProfile,
  DemoPersona,
} from '@/types';
import {
  INITIAL_GIGS,
  INITIAL_JOBS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_APPLICATIONS,
  DEMO_PERSONAS,
} from '@/data/mockData';

interface ToastInfo {
  message: string;
  type: 'success' | 'info' | 'error';
}

const DEFAULT_USER: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@dev.io',
  phone: '+1 (555) 234-8901',
  title: 'Senior Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  location: 'San Francisco, CA (Remote)',
  bio: 'Full-stack software engineer with 6+ years specializing in Next.js 16, TypeScript, React, and scalable cloud systems architecture.',
  yearsExperience: 6,
  skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'GraphQL', 'AWS'],
  portfolioUrl: 'https://alexmercer.dev',
  githubUrl: 'https://github.com/alexmercer',
  resumeFileName: 'Alex_Mercer_Senior_FullStack_Resume.pdf',
  resumeFileSize: '2.4 MB',
  profileCompleteness: 85,
};

const INITIAL_ALERTS: JobAlert[] = [
  {
    id: 'alert-1',
    keyword: 'Senior Full-Stack Engineer',
    location: 'Remote',
    experienceLevel: 'Senior',
    frequency: 'Daily',
    createdAt: 'Oct 24, 2026',
    active: true,
  },
  {
    id: 'alert-2',
    keyword: 'Next.js & React Developer',
    location: 'Anywhere',
    experienceLevel: 'Mid-Level',
    frequency: 'Weekly',
    createdAt: 'Oct 20, 2026',
    active: true,
  },
];

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  updateProfile: (data: Partial<UserProfile>) => void;
  login: (email: string, name?: string, role?: Role) => void;
  logout: () => void;

  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;

  gigs: Gig[];
  jobs: Job[];
  addGig: (gig: Omit<Gig, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'rating' | 'reviewsCount' | 'reviews'>) => void;
  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'applicantsCount'>) => void;

  savedGigIds: string[];
  savedJobIds: string[];
  toggleSaveGig: (gigId: string) => void;
  toggleSaveJob: (jobId: string) => void;
  isGigSaved: (gigId: string) => boolean;
  isJobSaved: (jobId: string) => boolean;

  applications: JobApplication[];
  submitApplication: (application: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => void;

  orders: GigOrder[];
  placeOrder: (gig: Gig, packageTier: 'starter' | 'standard' | 'premium', notes: string) => void;
  updateOrderStatus: (id: string, status: GigOrder['status']) => void;

  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  openChatWith: (name: string, avatar: string) => void;

  // Job Alerts
  jobAlerts: JobAlert[];
  addJobAlert: (alert: Omit<JobAlert, 'id' | 'createdAt' | 'active'>) => void;
  toggleJobAlert: (id: string) => void;
  deleteJobAlert: (id: string) => void;

  // Demo Accounts & Personas
  demoPersonas: DemoPersona[];
  activePersonaId: string;
  loginAsPersona: (personaId: string) => void;
  isPersonaModalOpen: boolean;
  setIsPersonaModalOpen: (open: boolean) => void;

  // Recruiter Tools
  exportCandidatesCSV: () => void;

  // Modals & Drawers state
  selectedGig: Gig | null;
  setSelectedGig: (gig: Gig | null) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;

  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  postModalInitialType: 'job' | 'gig';
  setPostModalInitialType: (type: 'job' | 'gig') => void;
  openPostModal: (type?: 'job' | 'gig') => void;

  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  applyingJob: Job | null;
  openApplyModal: (job: Job) => void;

  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  orderingGig: Gig | null;
  selectedTier: 'starter' | 'standard' | 'premium';
  openOrderModal: (gig: Gig, tier?: 'starter' | 'standard' | 'premium') => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  isJobAlertModalOpen: boolean;
  setIsJobAlertModalOpen: (open: boolean) => void;

  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;

  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;

  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activePersonaId, setActivePersonaId] = useState<string>('alex');
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>(INITIAL_ALERTS);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isJobAlertModalOpen, setIsJobAlertModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [role, setRole] = useState<Role>('freelancer');
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  const [savedGigIds, setSavedGigIds] = useState<string[]>(['gig-1']);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1']);

  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);

  const [orders, setOrders] = useState<GigOrder[]>([
    {
      id: 'ord-101',
      gigId: 'gig-1',
      gigTitle: 'I will build an enterprise Next.js 16 & AI SaaS web app with Supabase',
      sellerName: 'Elena Rostova',
      packageTier: 'standard',
      price: 850,
      orderedDate: '2 days ago',
      dueDate: 'In 5 days',
      status: 'In Progress',
      progressPercentage: 65,
      requirementsNotes: 'Need Supabase auth + Stripe webhook setup for tiered billing.',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Modals
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalInitialType, setPostModalInitialType] = useState<'job' | 'gig'>('job');

  const openPostModal = (type: 'job' | 'gig' = 'job') => {
    setPostModalInitialType(type);
    setIsPostModalOpen(true);
  };

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderingGig, setOrderingGig] = useState<Gig | null>(null);
  const [selectedTier, setSelectedTier] = useState<'starter' | 'standard' | 'premium'>('starter');

  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Sync from localStorage once on client
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      try {
        const storedRole = localStorage.getItem('busyboxes_role');
        if (storedRole === 'freelancer' || storedRole === 'employer') {
          setRole(storedRole);
        }
        const storedPersona = localStorage.getItem('busyboxes_persona');
        if (storedPersona) {
          const match = DEMO_PERSONAS.find((p) => p.id === storedPersona);
          if (match) {
            setActivePersonaId(match.id);
            setCurrentUser({
              name: match.name,
              email: match.email,
              phone: match.id === 'alex' ? '+1 (555) 234-8901' : '+1 (555) 880-9921',
              title: match.title,
              avatar: match.avatar,
              location: match.location,
              bio: match.bio,
              yearsExperience: match.yearsExperience,
              skills: match.skills,
              portfolioUrl: `https://${match.name.toLowerCase().replace(/\s+/g, '')}.dev`,
              githubUrl: `https://github.com/${match.name.toLowerCase().replace(/\s+/g, '')}`,
              resumeFileName: `${match.name.replace(/\s+/g, '_')}_Resume.pdf`,
              resumeFileSize: '2.4 MB',
              profileCompleteness: 95,
            });
          }
        }
        const storedSavedGigs = localStorage.getItem('busyboxes_saved_gigs');
        if (storedSavedGigs) setSavedGigIds(JSON.parse(storedSavedGigs));

        const storedSavedJobs = localStorage.getItem('busyboxes_saved_jobs');
        if (storedSavedJobs) setSavedJobIds(JSON.parse(storedSavedJobs));

        const storedOrders = localStorage.getItem('busyboxes_orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedApps = localStorage.getItem('busyboxes_apps');
        if (storedApps) setApplications(JSON.parse(storedApps));
      } catch {
        // localStorage may fail in restricted environments
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('busyboxes_role', role);
      localStorage.setItem('busyboxes_persona', activePersonaId);
      localStorage.setItem('busyboxes_saved_gigs', JSON.stringify(savedGigIds));
      localStorage.setItem('busyboxes_saved_jobs', JSON.stringify(savedJobIds));
      localStorage.setItem('busyboxes_orders', JSON.stringify(orders));
      localStorage.setItem('busyboxes_apps', JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [role, activePersonaId, savedGigIds, savedJobIds, orders, applications, isMounted]);

  const loginAsPersona = (personaId: string) => {
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
    setIsAuthenticated(true);
    setActivePersonaId(persona.id);
    setRole(persona.role);
    setCurrentUser({
      name: persona.name,
      email: persona.email,
      phone: persona.id === 'alex' ? '+1 (555) 234-8901' : '+1 (555) 880-9921',
      title: persona.title,
      avatar: persona.avatar,
      location: persona.location,
      bio: persona.bio,
      yearsExperience: persona.yearsExperience,
      skills: persona.skills,
      portfolioUrl: `https://${persona.name.toLowerCase().replace(/\s+/g, '')}.dev`,
      githubUrl: `https://github.com/${persona.name.toLowerCase().replace(/\s+/g, '')}`,
      resumeFileName: `${persona.name.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: '2.4 MB',
      profileCompleteness: 95,
    });
    showToast(`Active session switched to ${persona.name} (${persona.personaType})`, 'success');
  };

  const login = (email: string, name?: string, newRole?: Role) => {
    setIsAuthenticated(true);
    const resolvedName = name || (email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'User');
    setCurrentUser({
      ...DEFAULT_USER,
      name: resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1),
      email,
      title: newRole === 'employer' ? 'Recruitment Lead' : 'Senior Specialist',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    });
    if (newRole) setRole(newRole);
    showToast(`Signed in successfully as ${resolvedName}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Signed out of BusyBoxes.', 'info');
  };

  const toggleRole = () => {
    const nextRole = role === 'freelancer' ? 'employer' : 'freelancer';
    setRole(nextRole);
    showToast(`Switched view to ${nextRole === 'freelancer' ? 'Job Seeker' : 'Recruiter / Employer'} Mode`, 'info');
  };

  const toggleSaveGig = (gigId: string) => {
    setSavedGigIds((prev) => {
      const exists = prev.includes(gigId);
      const next = exists ? prev.filter((id) => id !== gigId) : [...prev, gigId];
      showToast(exists ? 'Gig removed from saved bookmarks' : 'Gig saved to bookmarks!', 'info');
      return next;
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      showToast(exists ? 'Job removed from saved bookmarks' : 'Job saved to bookmarks!', 'info');
      return next;
    });
  };

  const isGigSaved = (gigId: string) => savedGigIds.includes(gigId);
  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const addGig = (gigData: Omit<Gig, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'rating' | 'reviewsCount' | 'reviews'>) => {
    const sellerDisplayName = currentUser ? currentUser.name : 'Verified Specialist';
    const newGig: Gig = {
      ...gigData,
      id: `gig-custom-${Date.now()}`,
      sellerId: 'current-user',
      sellerName: `${sellerDisplayName} (You)`,
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      sellerTitle: currentUser?.title || 'Verified Specialist',
      sellerTier: 'Top Rated',
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          author: 'BusyBoxes Verified',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          country: 'United States',
          rating: 5.0,
          date: 'Just now',
          comment: 'New verified gig listing on BusyBoxes with milestone escrow protection.',
        },
      ],
    };
    setGigs((prev) => [newGig, ...prev]);
    showToast(`Your new Gig "${newGig.title}" is now published and live!`, 'success');
  };

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate' | 'applicantsCount'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-custom-${Date.now()}`,
      postedDate: 'Just now',
      applicantsCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('Your new Job posting is now live and accepting applications!', 'success');
  };

  const submitApplication = (appData: Omit<JobApplication, 'id' | 'appliedDate' | 'status'>) => {
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedDate: 'Just now',
      status: 'Under Review',
    };
    setApplications((prev) => [newApp, ...prev]);
    // increment applicant count on job
    setJobs((prev) =>
      prev.map((j) => (j.id === appData.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );
    showToast(`Application submitted for ${appData.jobTitle}!`, 'success');
  };

  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    showToast(`Application status updated to "${status}"`, 'info');
  };

  const placeOrder = (gig: Gig, packageTier: 'starter' | 'standard' | 'premium', notes: string) => {
    const pkg = gig.packages[packageTier];
    const newOrder: GigOrder = {
      id: `ord-${Date.now().toString().slice(-5)}`,
      gigId: gig.id,
      gigTitle: gig.title,
      sellerName: gig.sellerName,
      packageTier,
      price: pkg.price,
      orderedDate: 'Just now',
      dueDate: `In ${pkg.deliveryDays} days`,
      status: 'In Progress',
      progressPercentage: 10,
      requirementsNotes: notes,
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order placed for ${pkg.name}! Check your dashboard.`, 'success');
  };

  const updateOrderStatus = (id: string, status: GigOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord))
    );
    showToast(`Order updated to "${status}"`, 'info');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const sendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Just now',
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply after 1.5 seconds
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: 'user-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Thanks for the message! I am reviewing the specifications right now and will update your dashboard milestone.',
        timestamp: 'Just now',
        isMe: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const openChatWith = (name: string, _avatar: string) => {
    setIsChatOpen(true);
    showToast(`Chat conversation opened with ${name}`, 'info');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated: UserProfile = { ...prev, ...data };
      // Recalculate completeness
      let score = 50;
      if (updated.name) score += 10;
      if (updated.title) score += 10;
      if (updated.bio) score += 10;
      if (updated.skills && updated.skills.length >= 3) score += 10;
      if (updated.resumeFileName) score += 10;
      updated.profileCompleteness = Math.min(score, 100);
      return updated;
    });
    showToast('Profile updated successfully!', 'success');
  };

  const addJobAlert = (alertData: Omit<JobAlert, 'id' | 'createdAt' | 'active'>) => {
    const newAlert: JobAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: 'Today',
      active: true,
    };
    setJobAlerts((prev) => [newAlert, ...prev]);
    showToast(`Job alert created for "${alertData.keyword}"!`, 'success');
    // Also push a notification
    const alertNotif: NotificationItem = {
      id: `notif-alert-${Date.now()}`,
      title: 'Job Alert Active',
      message: `You will receive ${alertData.frequency.toLowerCase()} matches for "${alertData.keyword}".`,
      time: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications((prev) => [alertNotif, ...prev]);
  };

  const toggleJobAlert = (id: string) => {
    setJobAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    showToast('Job alert status updated', 'info');
  };

  const deleteJobAlert = (id: string) => {
    setJobAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Job alert deleted', 'info');
  };

  const exportCandidatesCSV = () => {
    if (applications.length === 0) {
      showToast('No candidates available to export', 'info');
      return;
    }
    const headers = [
      'Applicant Name',
      'Email',
      'Phone',
      'Applied Role',
      'Company',
      'Experience (Yrs)',
      'Resume File',
      'Status',
      'Applied Date',
    ];
    const rows = applications.map((app) => [
      `"${app.applicantName.replace(/"/g, '""')}"`,
      `"${app.applicantEmail.replace(/"/g, '""')}"`,
      `"${app.applicantPhone.replace(/"/g, '""')}"`,
      `"${app.jobTitle.replace(/"/g, '""')}"`,
      `"${app.company.replace(/"/g, '""')}"`,
      `"${app.yearsExperience}"`,
      `"${app.resumeFileName.replace(/"/g, '""')}"`,
      `"${app.status.replace(/"/g, '""')}"`,
      `"${app.appliedDate.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `busyboxes_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Candidates report downloaded as CSV!', 'success');
  };

  const openApplyModal = (job: Job) => {
    setApplyingJob(job);
    setIsApplyModalOpen(true);
  };

  const openOrderModal = (gig: Gig, tier: 'starter' | 'standard' | 'premium' = 'starter') => {
    setOrderingGig(gig);
    setSelectedTier(tier);
    setIsOrderModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        updateProfile,
        login,
        logout,
        role,
        setRole,
        toggleRole,
        gigs,
        jobs,
        addGig,
        addJob,
        savedGigIds,
        savedJobIds,
        toggleSaveGig,
        toggleSaveJob,
        isGigSaved,
        isJobSaved,
        applications,
        submitApplication,
        updateApplicationStatus,
        orders,
        placeOrder,
        updateOrderStatus,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        messages,
        sendMessage,
        isChatOpen,
        setIsChatOpen,
        openChatWith,
        jobAlerts,
        addJobAlert,
        toggleJobAlert,
        deleteJobAlert,
        demoPersonas: DEMO_PERSONAS,
        activePersonaId,
        loginAsPersona,
        isPersonaModalOpen,
        setIsPersonaModalOpen,
        exportCandidatesCSV,
        selectedGig,
        setSelectedGig,
        selectedJob,
        setSelectedJob,
        isPostModalOpen,
        setIsPostModalOpen,
        postModalInitialType,
        setPostModalInitialType,
        openPostModal,
        isApplyModalOpen,
        setIsApplyModalOpen,
        applyingJob,
        openApplyModal,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderingGig,
        selectedTier,
        openOrderModal,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isJobAlertModalOpen,
        setIsJobAlertModalOpen,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
