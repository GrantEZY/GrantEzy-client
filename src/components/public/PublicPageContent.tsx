"use client";

import { 
  FaRupeeSign, 
  FaProjectDiagram,
  FaClock,
  FaCheckCircle, 
  FaBolt,
  FaBullseye,
  FaEye,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaSeedling,
  FaHeartbeat,
  FaCalendarAlt,
  FaRocket
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';

// Hero Section Component
function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-[var(--color-gray-50)] via-[var(--color-white)] to-[var(--color-blue-50)] py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
          Innovation & Entrepreneurship
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-gray-700)] mb-8 max-w-3xl mx-auto">
          Empowering the next generation of entrepreneurs through comprehensive support, 
          mentorship, and funding opportunities at IIIT Sri City.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[var(--color-gray-900)] text-[var(--color-white)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--color-gray-800)] transition-colors duration-200 shadow-lg">
            View Open Calls
          </button>
          <button className="border-2 border-[var(--color-gray-900)] text-[var(--color-gray-900)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--color-gray-900)] hover:text-[var(--color-white)] transition-colors duration-200">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

// Stats Section Component
function StatsSection() {
  const stats = [
    { label: 'Total Funding Disbursed', value: '₹2.5 Crores', icon: <FaRupeeSign className="text-2xl" />, color: 'green' },
    { label: 'Active Projects', value: '24', icon: <FaRocket className="text-2xl" />, color: 'orange' },
    { label: 'Completed Projects', value: '47', icon: <FaCheckCircle className="text-2xl" />, color: 'blue' },
    { label: 'Ongoing Projects', value: '18', icon: <FaBolt className="text-2xl" />, color: 'purple' },
  ];

  const getStatColors = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600', border: 'border-green-200', value: 'text-green-800' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-800', icon: 'text-orange-600', border: 'border-orange-200', value: 'text-orange-800' };
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600', border: 'border-blue-200', value: 'text-blue-800' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-600', border: 'border-purple-200', value: 'text-purple-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600', border: 'border-gray-200', value: 'text-gray-800' };
    }
  };

    const getProjectColors = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          status: 'text-blue-600 bg-blue-100',
          link: 'text-blue-600 hover:text-blue-800'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          title: 'text-green-800',
          status: 'text-green-600 bg-green-100',
          link: 'text-green-600 hover:text-green-800'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          title: 'text-red-800',
          status: 'text-red-600 bg-red-100',
          link: 'text-red-600 hover:text-red-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          status: 'text-gray-600 bg-gray-100',
          link: 'text-gray-600 hover:text-gray-800'
        };
    }
  };

  return (
    <section className="py-16 bg-[var(--color-white)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[var(--color-gray-900)] mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const colors = getStatColors(stat.color);
            return (
              <div key={index} className={`text-center p-6 rounded-lg bg-gradient-to-br ${colors.bg} border ${colors.border} hover:shadow-lg transition-all duration-200`}>
                <div className={`${colors.icon} mb-4 flex justify-center`}>{stat.icon}</div>
                <div className={`text-3xl font-bold ${colors.value} mb-2`}>{stat.value}</div>
                <div className="text-[var(--color-gray-700)] font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Mission & Vision Section
function MissionVisionSection() {
  return (
    <section className="py-16 bg-[var(--color-gray-50)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-[var(--color-white)] p-8 rounded-xl border border-[var(--color-gray-200)] hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <FaBullseye className="text-[var(--color-white)] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-gray-900)]">Our Mission</h3>
            </div>
            <p className="text-[var(--color-gray-700)] leading-relaxed">
              To create a thriving ecosystem that nurtures innovative ideas, provides comprehensive support 
              to aspiring entrepreneurs, and bridges the gap between academic research and real-world 
              applications through strategic partnerships and funding opportunities.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[var(--color-white)] p-8 rounded-xl border border-[var(--color-gray-200)] hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                <FaEye className="text-[var(--color-white)] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-gray-900)]">Our Vision</h3>
            </div>
            <p className="text-[var(--color-gray-700)] leading-relaxed">
              To be recognized as a leading innovation hub in India, producing world-class entrepreneurs 
              and startups that create significant societal impact while contributing to the nation's 
              economic growth and technological advancement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Projects Section
function FeaturedProjectsSection() {
  const projects = [
    {
      title: 'EduTech Platform',
      description: 'AI-powered personalized learning platform for rural education',
      status: 'Completed',
      funding: '₹25 Lakhs',
      link: 'https://example.com/edutech',
      tags: ['Education', 'AI', 'Rural Development'],
      icon: <FaGraduationCap className="text-xl" />,
      color: 'blue'
    },
    {
      title: 'AgriBot Solutions',
      description: 'IoT-based automated farming solutions for small-scale farmers',
      status: 'Ongoing',
      funding: '₹35 Lakhs',
      link: 'https://example.com/agribot',
      tags: ['Agriculture', 'IoT', 'Automation'],
      icon: <FaSeedling className="text-xl" />,
      color: 'green'
    },
    {
      title: 'HealthCare Connect',
      description: 'Telemedicine platform connecting rural patients with specialists',
      status: 'Completed',
      funding: '₹40 Lakhs',
      link: 'https://example.com/healthcare',
      tags: ['Healthcare', 'Telemedicine', 'Rural'],
      icon: <FaHeartbeat className="text-xl" />,
      color: 'red'
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-white)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[var(--color-gray-900)] mb-12">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-[var(--color-white)] border border-[var(--color-gray-200)] rounded-xl p-6 hover:shadow-lg hover:border-[var(--color-blue-300)] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {project.status}
                </span>
                <span className="text-[var(--color-blue-600)] font-semibold">{project.funding}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="text-[var(--color-blue-600)] mr-3">{project.icon}</div>
                <h3 className="text-xl font-bold text-[var(--color-gray-900)]">{project.title}</h3>
              </div>
              <p className="text-[var(--color-gray-700)] mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 py-1 bg-[var(--color-blue-50)] text-[var(--color-blue-700)] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-[var(--color-blue-600)] hover:text-[var(--color-blue-700)] font-medium"
              >
                View Project 
                <FaExternalLinkAlt className="w-3 h-3 ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Team Section
function TeamSection() {
  const directors = [
    {
      name: 'Dr. Rajesh Kumar',
      position: 'Director, Innovation & Entrepreneurship',
      image: '/assets/placeholder-avatar.png',
      bio: 'Leading innovation initiatives with 15+ years of experience in technology entrepreneurship.'
    },
    {
      name: 'Prof. Anita Sharma',
      position: 'Associate Director, Incubation',
      image: '/assets/placeholder-avatar.png',
      bio: 'Expert in startup incubation and technology transfer with extensive industry connections.'
    }
  ];

  const members = [
    { name: 'Dr. Suresh Reddy', position: 'Program Manager' },
    { name: 'Ms. Priya Patel', position: 'Startup Coordinator' },
    { name: 'Mr. Vikram Singh', position: 'Industry Liaison' },
    { name: 'Dr. Meera Gupta', position: 'Research Coordinator' }
  ];

  return (
    <section className="py-16 bg-[var(--color-gray-50)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[var(--color-gray-900)] mb-12">
          Our Team
        </h2>
        
        {/* Directors */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[var(--color-gray-800)] mb-8 text-center">Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {directors.map((director, index) => (
              <div key={index} className="bg-[var(--color-white)] p-6 rounded-xl border border-[var(--color-blue-200)] hover:shadow-lg transition-shadow duration-200 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] rounded-full mx-auto mb-4"></div>
                <h4 className="text-xl font-bold text-[var(--color-gray-900)] mb-1">{director.name}</h4>
                <p className="text-[var(--color-blue-600)] font-medium mb-3">{director.position}</p>
                <p className="text-[var(--color-gray-700)] text-sm">{director.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-2xl font-semibold text-[var(--color-gray-800)] mb-8 text-center">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <div key={index} className="bg-[var(--color-white)] p-4 rounded-lg border border-[var(--color-gray-200)] hover:border-[var(--color-blue-300)] transition-colors duration-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-[var(--color-gray-900)] mb-1">{member.name}</h4>
                <p className="text-[var(--color-blue-600)] text-sm">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Open Calls Section
function OpenCallsSection() {
  const openCalls = [
    {
      title: 'Startup Incubation Program 2025',
      deadline: 'March 15, 2025',
      funding: 'Up to ₹50 Lakhs',
      description: 'Comprehensive 12-month incubation program for early-stage startups',
      status: 'Open'
    },
    {
      title: 'Research Innovation Grant',
      deadline: 'April 30, 2025',
      funding: 'Up to ₹25 Lakhs',
      description: 'Funding for innovative research projects with commercial potential',
      status: 'Open'
    },
    {
      title: 'Social Impact Challenge',
      deadline: 'May 20, 2025',
      funding: 'Up to ₹30 Lakhs',
      description: 'Supporting startups focused on solving social and environmental challenges',
      status: 'Coming Soon'
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-white)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[var(--color-gray-900)] mb-12">
          Current Open Calls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {openCalls.map((call, index) => (
            <div key={index} className="bg-[var(--color-white)] border border-[var(--color-gray-200)] rounded-xl p-6 hover:shadow-lg hover:border-[var(--color-blue-300)] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  call.status === 'Open' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {call.status}
                </span>
                <span className="text-[var(--color-blue-600)] font-semibold">{call.funding}</span>
              </div>
              
              <h3 className="text-xl font-bold text-[var(--color-gray-900)] mb-3">{call.title}</h3>
              <p className="text-[var(--color-gray-700)] mb-4">{call.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-[var(--color-gray-600)]">
                  <FaCalendarAlt className="mr-2 text-[var(--color-blue-500)]" />
                  {call.deadline}
                </div>
                <button className="bg-[var(--color-blue-600)] text-[var(--color-white)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-blue-700)] transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PublicPageContent() {
  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <MissionVisionSection />
      <FeaturedProjectsSection />
      <TeamSection />
      <OpenCallsSection />
    </div>
  );
}
