import type { Metadata } from 'next';
import './globals.css';
import { ClientLayoutWrapper } from '@/components/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'BusyBoxes | Professional Job Portal & Freelance Services',
  description:
    'Search thousands of verified jobs and freelance projects from leading companies. Professional career portal for tech, design, marketing, and operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body className="min-h-full flex flex-col bg-[#f4f6f8] text-slate-800 antialiased font-sans">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
