import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  Sparkles,
  MessageSquare,
  Folder,
  ShieldCheck,
  Users,
  CreditCard,
  FileText,
  Activity,
  HelpCircle,
  Code,
  Play,
  CheckCircle2,
  Briefcase,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp,
  ArrowLeft,
  Mail,
  Shield
} from 'lucide-react';

const infoData = {
  'overview': {
    title: 'Platform Overview',
    subtitle: 'Learn how PulseHR organizes and simplifies workforce management.',
    icon: Building,
    content: 'PulseHR is a unified HR management system designed to streamline all administrative and operational activities for modern enterprises. It integrates employee records, shifts tracking, leaves processing, and AI candidate matching in a single dashboard. By centralizing operations, PulseHR eliminates structural silos and helps your teams work closer together.'
  },
  'features': {
    title: 'Core Features',
    subtitle: 'Discover the advanced tools built into PulseHR.',
    icon: Sparkles,
    content: 'Our feature set includes real-time attendance consoles with geochecks, multi-level leave approvals, and fully configurable shift patterns. Additionally, the integrated tasks manager allows managers to delegate, monitor, and grade employee deliverables seamlessly. The dashboard offers visual metrics tracking to keep operations managers informed of organizational health at a glance.'
  },
  'messaging': {
    title: 'Internal Messaging',
    subtitle: 'Communicate securely across departments and hierarchies.',
    icon: MessageSquare,
    content: 'PulseHR features an integrated, real-time messaging pipeline built for corporate teams. Share direct messages with coworkers, start group chats inside departments, or send announcements to entire branches. All communications are fully encrypted to guarantee data security and compliance with enterprise audit trails.'
  },
  'file-sharing': {
    title: 'File Sharing & Storage',
    subtitle: 'Secure repository for all administrative assets.',
    icon: Folder,
    content: 'Upload, organize, and retrieve files within a centralized repository. Employees can submit leave support documents, and recruitment specialists can manage candidate resumes. All files are isolated per tenant company, ensuring that your corporate intellectual assets and candidate records remain securely stored and partitioned.'
  },
  'security': {
    title: 'Enterprise-Grade Security',
    subtitle: 'Learn about our data isolation and protection models.',
    icon: ShieldCheck,
    content: 'Security is at the foundation of PulseHR. We implement JWT-based session validation, Bcrypt password hashing, and role-based access control (RBAC). Data nodes are partitioned using strict tenant isolation filters (company checks). This ensures that admins, managers, and standard employees only interact with records matching their verified clearance.'
  },
  'hr-operations': {
    title: 'HR Operations',
    subtitle: 'Manage roles, positions, and employee registries.',
    icon: Users,
    content: 'Simplify administrative tasks with our interactive employee registry. HR personnel can add, view, update, and terminate employee records. The system dynamically groups staff profiles by department, coordinates supervisor designations, and tracks history logs, bringing maximum clarity to company structural hierarchies.'
  },
  'payroll': {
    title: 'Payroll Compliance',
    subtitle: 'Bridge attendance records with payroll processing.',
    icon: CreditCard,
    content: 'Ensure accuracy in timesheet auditing. PulseHR monitors check-in and check-out timestamps to determine present days, late flags, and active hours. HR admins can export detailed attendance reports for any custom monthly billing cycle, facilitating effortless import into standard enterprise payroll tools.'
  },
  'screening': {
    title: 'AI Candidate Screening',
    subtitle: 'Automate resume screening with advanced processing.',
    icon: FileText,
    content: 'Accelerate your hiring pipeline with AI. Our system parses uploaded candidate resumes, extracting skills, positions, and qualification parameters automatically. Recruiter dashboards match candidates to target job descriptions, providing key match scores and summaries to screen hundreds of candidates in minutes.'
  },
  'performance': {
    title: 'Performance Evaluation',
    subtitle: 'Establish performance milestones and log reviews.',
    icon: Activity,
    content: 'Foster professional growth through structured evaluation cycles. PulseHR supports manager check-ins, custom review logs, and milestone objectives tracking. Review records are securely integrated into individual employee profiles, helping operations leaders track historic growth and plan promotions.'
  },
  'help-center': {
    title: 'Help Center',
    subtitle: 'Guides and reference materials to get you started.',
    icon: HelpCircle,
    content: 'Explore step-by-step setup checklists, product manuals, and video documentation. Learn how to seed initial department nodes, configure check-in margins, request emergency leaves, or parse custom candidate formats. Find quick solutions to common login and permission queries.'
  },
  'api': {
    title: 'Developer API',
    subtitle: 'Integrate external services directly with PulseHR.',
    icon: Code,
    content: 'Integrate custom tooling with our standard RESTful APIs. Pull attendance statistics, trigger new candidate screen pipelines from external jobs boards, or synchronize department registries. Our endpoints are gated behind JWT tokens, guaranteeing audit logs for every external payload query.'
  },
  'tutorials': {
    title: 'Product Tutorials',
    subtitle: 'Accelerate system onboarding with curated guides.',
    icon: Play,
    content: 'Browse our library of tutorials and walk-throughs designed for new users. View interactive steps for employees setting up their profiles, guidelines for managers reviewing department tasks, and security overviews for administrative configuration of company parameters.'
  },
  'status': {
    title: 'System Uptime Status',
    subtitle: 'Monitor system components and service logs.',
    icon: CheckCircle2,
    content: 'We maintain a transparent status tracker for all API gateway routes and database clusters. Current status: All servers fully operational. API routes register 99.98% historic uptime, database clusters operate within normal latency margins, and candidate AI screening queues remain clear.'
  },
  'about': {
    title: 'About PulseHR Platforms',
    subtitle: 'Our mission and operational footprint.',
    icon: Building,
    content: 'We design SaaS tools to help organizations structure their operations with greater agility and insight. PulseHR was built to bridge the gap between attendance logging, candidate acquisition, and employee performance monitoring. Today, we empower companies around the globe to run secure, transparent workspaces.'
  },
  'careers': {
    title: 'Join Our Team',
    subtitle: 'Help shape the future of intelligent enterprise tools.',
    icon: Briefcase,
    content: 'We are looking for creative thinkers, frontend developers, and data engineers who are passionate about scaling operations tools. At PulseHR, you will work on clean codebases, optimize performance filters, and design features that simplify day-to-day work lives for thousands of businesses.'
  },
  'partner': {
    title: 'Partner Program',
    subtitle: 'Expand your offering by integrating with PulseHR.',
    icon: ShieldCheck,
    content: 'Partner with us to offer advanced workforce tools to your existing client base. Our reseller licenses, referral incentives, and white-label integration programs are built to help payroll systems, accounting firms, and consulting services deliver comprehensive HR platforms to their users.'
  },
  'privacy': {
    title: 'Privacy Policy',
    subtitle: 'Understand how we protect your corporate records.',
    icon: Shield,
    content: 'PulseHR respects your company privacy regulations. User profile credentials, timesheet details, performance notes, and candidate resume attachments are stored securely with tenant check validation controls. We never distribute, sell, or analyze your company datasets for third-party operations.'
  },
  'terms': {
    title: 'Terms of Service',
    subtitle: 'Standard license rules and service parameters.',
    icon: FileText,
    content: 'These terms outline the licensing parameters for using PulseHR. Service access is provided on a subscription model based on the chosen pricing tiers. Customers are responsible for configuring authorized roles, managing payroll imports safely, and complying with regional timesheet policies.'
  }
};

const InfoPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const data = infoData[slug] || {
    title: 'Resource Not Found',
    subtitle: 'The requested information page could not be located.',
    icon: HelpCircle,
    content: 'Please verify the address or return to the main homepage to continue exploring the PulseHR platform.'
  };

  const Icon = data.icon;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-primary-500 selection:text-white flex flex-col justify-between scroll-smooth">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Floating Header */}
      <header className="fixed top-0 inset-x-0 h-20 glass border-b border-slate-800/60 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-transform duration-200">
              <Building size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">PulseHR</h1>
              <span className="text-[10px] text-primary-400 font-semibold tracking-widest uppercase">Operations Control</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <Link to="/#hero" className="hover:text-white transition">Home</Link>
            <Link to="/#features" className="hover:text-white transition">Features</Link>
            <Link to="/#pricing" className="hover:text-white transition">Pricing</Link>
            <Link to="/#faq" className="hover:text-white transition">FAQ</Link>
            <Link to="/#contact" className="hover:text-white transition">Contact</Link>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/10 transition flex items-center gap-1.5"
              >
                Dashboard <ArrowLeft size={14} className="rotate-180" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold text-slate-300 hover:text-white transition">
                  Book Demo
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/10 transition"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-36 pb-20 px-6 max-w-4xl mx-auto w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Home
        </Link>

        {/* Info Card */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-slate-800/60 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-800/40">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{data.title}</h2>
              <p className="text-sm text-slate-450 mt-1 font-medium">{data.subtitle}</p>
            </div>
          </div>

          <p className="text-slate-350 text-base leading-relaxed font-normal">
            {data.content}
          </p>

          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white">Need more assistance?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you have any questions or require custom setup modules for your organization, please connect with our tech operations desk via the form on the landing page or drop us an email.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/#contact" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-primary-600/10">
                Contact Operations
              </Link>
              <a href="mailto:info@pulsehr.com" className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/80 px-6 py-16 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                <Building size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">PulseHR</h3>
                <span className="text-[10px] text-primary-400 font-semibold tracking-widest uppercase">Operations Control</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Bring your team's departments, attendance, and tasks into one central hub. Work together, stay aligned, and scale faster.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/info/overview" className="hover:text-white transition-colors duration-150">Overview</Link></li>
              <li><Link to="/info/features" className="hover:text-white transition-colors duration-150">Features</Link></li>
              <li><Link to="/info/messaging" className="hover:text-white transition-colors duration-150">Messaging</Link></li>
              <li><Link to="/info/file-sharing" className="hover:text-white transition-colors duration-150">File Sharing</Link></li>
              <li><Link to="/info/security" className="hover:text-white transition-colors duration-150">Security</Link></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/info/hr-operations" className="hover:text-white transition-colors duration-150">HR Operations</Link></li>
              <li><Link to="/info/payroll" className="hover:text-white transition-colors duration-150">Payroll Management</Link></li>
              <li><Link to="/info/screening" className="hover:text-white transition-colors duration-150">Candidate Screening</Link></li>
              <li><Link to="/info/performance" className="hover:text-white transition-colors duration-150">Performance Tracking</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/info/help-center" className="hover:text-white transition-colors duration-150">Help Center</Link></li>
              <li><Link to="/info/api" className="hover:text-white transition-colors duration-150">API Reference</Link></li>
              <li><Link to="/info/tutorials" className="hover:text-white transition-colors duration-150">Tutorials</Link></li>
              <li><Link to="/info/status" className="hover:text-white transition-colors duration-150">System Status</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/info/about" className="hover:text-white transition-colors duration-150">About Us</Link></li>
              <li><Link to="/info/careers" className="hover:text-white transition-colors duration-150">Careers</Link></li>
              <li><Link to="/info/partner" className="hover:text-white transition-colors duration-150">Partner Program</Link></li>
              <li><Link to="/info/privacy" className="hover:text-white transition-colors duration-150">Privacy Policy</Link></li>
              <li><Link to="/info/terms" className="hover:text-white transition-colors duration-150">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Separator & Bottom Row */}
        <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} PulseHR. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800 rounded-lg transition duration-150 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800 rounded-lg transition duration-150 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800 rounded-lg transition duration-150 flex items-center justify-center"
                aria-label="GitHub"
              >
                <Instagram size={14} />
              </a>
            </div>
            {/* Scroll to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800 rounded-lg transition duration-150 flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoPage;
