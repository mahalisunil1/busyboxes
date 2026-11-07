export type Role = 'freelancer' | 'employer';

export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Freelance' | 'Internship';
export type WorkLocation = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';

export interface PackageTier {
  name: string;
  price: number;
  deliveryDays: number;
  revisions: string;
  description: string;
  features: string[];
}

export interface GigReview {
  id: string;
  author: string;
  avatar: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Gig {
  id: string;
  title: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerTitle: string;
  sellerTier: 'Top Rated Plus' | 'Top Rated' | 'Level 2' | 'Rising Star';
  rating: number;
  reviewsCount: number;
  category: string;
  subcategory?: string;
  thumbnail: string;
  bannerGradient: string;
  startingPrice: number;
  deliveryDays: number;
  tags: string[];
  description: string;
  packages: {
    starter: PackageTier;
    standard: PackageTier;
    premium: PackageTier;
  };
  faqs: { question: string; answer: string }[];
  reviews: GigReview[];
  featured?: boolean;
  ordersInQueue?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companySize?: string;
  category: string;
  type: JobType;
  location: string;
  workLocation: WorkLocation;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  experienceLevel: ExperienceLevel;
  postedDate: string;
  deadline?: string;
  applicantsCount: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  featured?: boolean;
  tags: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeFileName: string;
  portfolioUrl?: string;
  coverLetter: string;
  yearsExperience: number;
  appliedDate: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended' | 'Declined';
}

export interface GigOrder {
  id: string;
  gigId: string;
  gigTitle: string;
  sellerName: string;
  packageTier: 'starter' | 'standard' | 'premium';
  price: number;
  orderedDate: string;
  dueDate: string;
  status: 'In Progress' | 'Reviewing Delivery' | 'Completed' | 'Revision Requested';
  progressPercentage: number;
  requirementsNotes: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'application' | 'order' | 'message' | 'system';
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
  gigsCount: number;
  jobsCount: number;
  color: string;
}

export interface JobAlert {
  id: string;
  keyword: string;
  location: string;
  experienceLevel: string;
  frequency: 'Daily' | 'Weekly' | 'Instant';
  createdAt: string;
  active: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
  avatar: string;
  location: string;
  bio: string;
  yearsExperience: number;
  skills: string[];
  portfolioUrl: string;
  githubUrl: string;
  resumeFileName: string;
  resumeFileSize: string;
  profileCompleteness: number;
}

export interface DemoPersona {
  id: string;
  name: string;
  email: string;
  role: Role;
  personaType: 'Job Seeker' | 'Top Rated Seller' | 'Tech Recruiter' | 'Client / Founder';
  badgeColor: string;
  title: string;
  company: string;
  avatar: string;
  location: string;
  bio: string;
  yearsExperience: number;
  skills: string[];
  balance: number;
  statsBadge: string;
  demoHighlights: string[];
  defaultPath: string;
}
