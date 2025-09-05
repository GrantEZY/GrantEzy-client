"use client";

import { 
  FaRupeeSign, 
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

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-gray-50)] via-[var(--color-white)] to-[var(--color-blue-50)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-100)] text-[var(--color-blue-700)] rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-[var(--color-blue-600)] rounded-full mr-2 animate-pulse"></span>
            Innovation & Entrepreneurship Hub
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-gray-900)] leading-tight">
            Empowering
            <span className="block bg-gradient-to-r from-[var(--color-blue-600)] to-[var(--color-blue-700)] bg-clip-text text-transparent">
              Tomorrow&apos;s
            </span>
            <span className="block">Innovators</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[var(--color-gray-600)] max-w-4xl mx-auto leading-relaxed">
            Transforming groundbreaking ideas into impactful ventures through comprehensive support, 
            mentorship, and funding opportunities at IIIT Sri City.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button className="group bg-[var(--color-blue-600)] text-[var(--color-white)] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-blue-700)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center">
                Explore Open Calls
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button className="group border-2 border-[var(--color-blue-600)] text-[var(--color-blue-600)] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-blue-600)] hover:text-[var(--color-white)] transition-all duration-300">
              Learn Our Story
            </button>
          </div>
          
          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-[var(--color-gray-200)] mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-gray-900)]">₹2.5Cr+</div>
              <div className="text-[var(--color-gray-600)] text-sm">Funding Disbursed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-gray-900)]">89+</div>
              <div className="text-[var(--color-gray-600)] text-sm">Projects Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-gray-900)]">24</div>
              <div className="text-[var(--color-gray-600)] text-sm">Active Startups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-gray-900)]">100%</div>
              <div className="text-[var(--color-gray-600)] text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { 
      label: 'Total Funding Disbursed', 
      value: '₹2.5 Crores', 
      icon: <FaRupeeSign className="text-3xl" />, 
      color: 'green',
      description: 'Invested in innovation'
    },
    { 
      label: 'Active Projects', 
      value: '24', 
      icon: <FaRocket className="text-3xl" />, 
      color: 'orange',
      description: 'Currently in development'
    },
    { 
      label: 'Completed Projects', 
      value: '47', 
      icon: <FaCheckCircle className="text-3xl" />, 
      color: 'blue',
      description: 'Successfully launched'
    },
    { 
      label: 'Ongoing Projects', 
      value: '18', 
      icon: <FaBolt className="text-3xl" />, 
      color: 'purple',
      description: 'In progress'
    },
  ];

  const getStatColors = (color: string) => {
    switch (color) {
      case 'green':
        return { 
          bg: 'bg-green-50', 
          text: 'text-green-800', 
          icon: 'text-green-600', 
          border: 'border-green-200', 
          value: 'text-green-800',
          accent: 'bg-green-500'
        };
      case 'orange':
        return { 
          bg: 'bg-orange-50', 
          text: 'text-orange-800', 
          icon: 'text-orange-600', 
          border: 'border-orange-200', 
          value: 'text-orange-800',
          accent: 'bg-orange-500'
        };
      case 'blue':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-800', 
          icon: 'text-blue-600', 
          border: 'border-blue-200', 
          value: 'text-blue-800',
          accent: 'bg-blue-500'
        };
      case 'purple':
        return { 
          bg: 'bg-purple-50', 
          text: 'text-purple-800', 
          icon: 'text-purple-600', 
          border: 'border-purple-200', 
          value: 'text-purple-800',
          accent: 'bg-purple-500'
        };
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          icon: 'text-gray-600', 
          border: 'border-gray-200', 
          value: 'text-gray-800',
          accent: 'bg-gray-500'
        };
    }
  };

  return (
    <section className="py-24 bg-[var(--color-white)] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-[var(--color-gray-600)] max-w-2xl mx-auto">
            Driving innovation and entrepreneurship through measurable outcomes and sustainable growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const colors = getStatColors(stat.color);
            return (
              <div 
                key={index} 
                className={`group relative overflow-hidden rounded-2xl p-8 ${colors.bg} border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent}`}></div>
                
                <div className={`${colors.icon} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                <div className={`text-4xl font-bold ${colors.value} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                
                <div className={`text-lg font-semibold ${colors.text} mb-2`}>
                  {stat.label}
                </div>
                
                <div className="text-[var(--color-gray-600)] text-sm">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
            Our Purpose & Vision
          </h2>
          <p className="text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto">
            Guided by a clear mission and ambitious vision, we are shaping the future of innovation and entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-[var(--color-white)] p-10 rounded-2xl shadow-lg border border-[var(--color-gray-200)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <FaBullseye className="text-[var(--color-white)] text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--color-gray-900)]">Our Mission</h3>
              </div>
              <div className="flex-grow">
                <p className="text-[var(--color-gray-700)] leading-relaxed text-lg mb-8">
                  To create a thriving ecosystem that nurtures innovative ideas, provides comprehensive support 
                  to aspiring entrepreneurs, and bridges the gap between academic research and real-world 
                  applications through strategic partnerships and funding opportunities.
                </p>
                
                {/* Mission Points */}
                <div className="space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Foster innovation culture</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Bridge academia & industry</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Enable sustainable growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-[var(--color-white)] p-10 rounded-2xl shadow-lg border border-[var(--color-gray-200)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <FaEye className="text-[var(--color-white)] text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--color-gray-900)]">Our Vision</h3>
              </div>
              <div className="flex-grow">
                <p className="text-[var(--color-gray-700)] leading-relaxed text-lg mb-8">
                  To be recognized as a leading innovation hub in India, producing world-class entrepreneurs 
                  and startups that create significant societal impact while contributing to the nation&apos;s 
                  economic growth and technological advancement.
                </p>
                
                {/* Vision Points */}
                <div className="space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>Leading innovation hub</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>World-class entrepreneurs</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>Societal impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsSection() {
  const projects = [
    {
      title: 'EduTech Platform',
      description: 'AI-powered personalized learning platform that revolutionizes rural education through adaptive learning algorithms and personalized curriculum delivery.',
      status: 'Completed',
      funding: '₹25 Lakhs',
      link: 'https://example.com/edutech',
      tags: ['Education', 'AI', 'Rural Development'],
      icon: <FaGraduationCap className="text-2xl" />,
      color: 'blue',
      impact: '10,000+ Students Reached',
      timeline: '18 months'
    },
    {
      title: 'AgriBot Solutions',
      description: 'IoT-based automated farming solutions that help small-scale farmers optimize crop yields through smart monitoring and precision agriculture.',
      status: 'Ongoing',
      funding: '₹35 Lakhs',
      link: 'https://example.com/agribot',
      tags: ['Agriculture', 'IoT', 'Automation'],
      icon: <FaSeedling className="text-2xl" />,
      color: 'green',
      impact: '500+ Farmers Benefited',
      timeline: '24 months'
    },
    {
      title: 'HealthCare Connect',
      description: 'Comprehensive telemedicine platform connecting rural patients with specialist doctors, enabling remote consultations and health monitoring.',
      status: 'Completed',
      funding: '₹40 Lakhs',
      link: 'https://example.com/healthcare',
      tags: ['Healthcare', 'Telemedicine', 'Rural'],
      icon: <FaHeartbeat className="text-2xl" />,
      color: 'red',
      impact: '5,000+ Consultations',
      timeline: '15 months'
    }
  ];

  const getProjectColors = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-blue-50 to-blue-100',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          accent: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'from-green-50 to-green-100',
          border: 'border-green-200',
          icon: 'text-green-600',
          accent: 'bg-green-500'
        };
      case 'red':
        return {
          bg: 'from-red-50 to-red-100',
          border: 'border-red-200',
          icon: 'text-red-600',
          accent: 'bg-red-500'
        };
      default:
        return {
          bg: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          accent: 'bg-gray-500'
        };
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-gray-50)] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
            Featured Success Stories
          </h2>
          <p className="text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto">
            Discover how our innovative projects are creating real-world impact and transforming communities across India.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const colors = getProjectColors(project.color);
            return (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                
                {/* Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent}`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                      {project.icon}
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : project.status === 'Ongoing'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-[var(--color-gray-900)] mb-4 group-hover:text-[var(--color-blue-700)] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-gray-600)] leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  {/* Impact Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-gray-900)]">{project.funding}</div>
                      <div className="text-xs text-[var(--color-gray-600)]">Funding</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <div className="text-lg font-bold text-[var(--color-gray-900)]">{project.timeline}</div>
                      <div className="text-xs text-[var(--color-gray-600)]">Duration</div>
                    </div>
                  </div>
                  
                  {/* Impact Badge */}
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-2 bg-[var(--color-blue-50)] border border-[var(--color-blue-200)] rounded-full">
                      <div className="w-2 h-2 bg-[var(--color-blue-500)] rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-[var(--color-blue-700)]">{project.impact}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-3 py-1 bg-white/70 text-[var(--color-gray-700)] text-xs font-medium rounded-full border border-[var(--color-gray-200)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--color-gray-900)] text-[var(--color-white)] rounded-xl font-semibold hover:bg-[var(--color-blue-600)] transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Explore Project</span>
                    <FaExternalLinkAlt className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const leadership = [
    {
      name: 'Dr. Rajesh Kumar',
      position: 'Director, Innovation & Entrepreneurship',
      image: '/assets/placeholder-avatar.png',
      bio: 'Leading innovation initiatives with 15+ years of experience in technology entrepreneurship and academic research.',
      expertise: ['Strategic Planning', 'Technology Transfer', 'Entrepreneurship'],
      linkedin: '#',
      email: 'rajesh.kumar@iiits.in'
    },
    {
      name: 'Prof. Anita Sharma',
      position: 'Associate Director, Incubation',
      image: '/assets/placeholder-avatar.png',
      bio: 'Expert in startup incubation and technology transfer with extensive industry connections and mentorship experience.',
      expertise: ['Startup Incubation', 'Industry Relations', 'Mentorship'],
      linkedin: '#',
      email: 'anita.sharma@iiits.in'
    }
  ];

  const team = [
    { name: 'Dr. Suresh Reddy', position: 'Program Manager', department: 'Operations' },
    { name: 'Ms. Priya Patel', position: 'Startup Coordinator', department: 'Incubation' },
    { name: 'Mr. Vikram Singh', position: 'Industry Liaison', department: 'Partnerships' },
    { name: 'Dr. Meera Gupta', position: 'Research Coordinator', department: 'Research' },
    { name: 'Ms. Kavya Nair', position: 'Program Officer', department: 'Programs' },
    { name: 'Mr. Arjun Mehta', position: 'Technical Lead', department: 'Technology' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[var(--color-white)] via-[var(--color-gray-50)] to-[var(--color-blue-50)] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto">
            A dedicated team of visionaries, researchers, and industry experts committed to fostering innovation and entrepreneurship.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-[var(--color-gray-800)] mb-12">Leadership</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {leadership.map((leader, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col"
              >
                {/* Header with Gradient */}
                <div className="h-32 bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-600)] relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  {/* Avatar */}
                  <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] rounded-full flex items-center justify-center text-[var(--color-blue-600)] text-2xl font-bold">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-8 flex-grow flex flex-col">
                  <h4 className="text-2xl font-bold text-[var(--color-gray-900)] mb-2">{leader.name}</h4>
                  <p className="text-[var(--color-blue-600)] font-semibold mb-4">{leader.position}</p>
                  <p className="text-[var(--color-gray-600)] leading-relaxed mb-6 flex-grow">{leader.bio}</p>
                  
                  {/* Expertise Tags */}
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-[var(--color-gray-700)] mb-3">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex} 
                          className="px-3 py-1 bg-[var(--color-blue-50)] text-[var(--color-blue-700)] text-xs font-medium rounded-full border border-[var(--color-blue-200)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Links - Always at bottom */}
                  <div className="flex gap-4 pt-4 border-t border-[var(--color-gray-200)] mt-auto">
                    <a 
                      href={`mailto:${leader.email}`}
                      className="flex items-center text-[var(--color-gray-600)] hover:text-[var(--color-blue-600)] transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      <span className="text-sm">Email</span>
                    </a>
                    <a 
                      href={leader.linkedin}
                      className="flex items-center text-[var(--color-gray-600)] hover:text-[var(--color-blue-600)] transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Grid */}
        <div>
          <h3 className="text-3xl font-bold text-center text-[var(--color-gray-800)] mb-12">Core Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center transform hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] rounded-full mx-auto flex items-center justify-center text-[var(--color-blue-600)] text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-[var(--color-blue-500)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <h4 className="text-lg font-bold text-[var(--color-gray-900)] mb-2">{member.name}</h4>
                <p className="text-[var(--color-blue-600)] font-semibold mb-3">{member.position}</p>
                
                {/* Department Badge */}
                <div className="inline-flex items-center px-3 py-1 bg-[var(--color-gray-100)] text-[var(--color-gray-600)] text-sm rounded-full">
                  <div className="w-2 h-2 bg-[var(--color-blue-500)] rounded-full mr-2"></div>
                  {member.department}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OpenCallsSection() {
  const openCalls = [
    {
      title: 'Startup Incubation Program 2025',
      deadline: 'March 15, 2025',
      funding: 'Up to ₹50 Lakhs',
      description: 'Comprehensive 12-month incubation program for early-stage startups with mentorship, funding, and market access.',
      status: 'Open',
      category: 'Incubation',
      eligibility: 'Early-stage startups',
      duration: '12 months',
      applications: '250+',
      icon: <FaRocket className="text-2xl" />
    },
    {
      title: 'Research Innovation Grant',
      deadline: 'April 30, 2025',
      funding: 'Up to ₹25 Lakhs',
      description: 'Funding for innovative research projects with commercial potential and societal impact.',
      status: 'Open',
      category: 'Research',
      eligibility: 'Faculty & Students',
      duration: '18 months',
      applications: '150+',
      icon: <FaBolt className="text-2xl" />
    },
    {
      title: 'Social Impact Challenge',
      deadline: 'May 20, 2025',
      funding: 'Up to ₹30 Lakhs',
      description: 'Supporting startups focused on solving social and environmental challenges with sustainable solutions.',
      status: 'Coming Soon',
      category: 'Social Impact',
      eligibility: 'Social entrepreneurs',
      duration: '15 months',
      applications: 'Opening Soon',
      icon: <FaHeartbeat className="text-2xl" />
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-gray-900)] mb-6">
            Open Opportunities
          </h2>
          <p className="text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto">
            Discover funding opportunities and programs designed to accelerate your innovation journey and transform ideas into impact.
          </p>
        </div>

        {/* Calls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {openCalls.map((call, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-full flex flex-col"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  call.status === 'Open' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  <div className={`w-2 h-2 ${call.status === 'Open' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full mr-2 animate-pulse`}></div>
                  {call.status}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-8 h-full flex flex-col">
                {/* Icon & Category */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-blue-500)] to-[var(--color-blue-600)] rounded-xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                    {call.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-blue-600)] uppercase tracking-wide">{call.category}</div>
                    <div className="text-2xl font-bold text-[var(--color-gray-900)] group-hover:text-[var(--color-blue-700)] transition-colors duration-300">
                      {call.funding}
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-[var(--color-gray-900)] mb-4 leading-tight">
                    {call.title}
                  </h3>
                  <p className="text-[var(--color-gray-600)] leading-relaxed mb-6">
                    {call.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-[var(--color-gray-50)] rounded-lg">
                      <div className="text-sm font-semibold text-[var(--color-gray-900)]">{call.duration}</div>
                      <div className="text-xs text-[var(--color-gray-600)]">Duration</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--color-gray-50)] rounded-lg">
                      <div className="text-sm font-semibold text-[var(--color-gray-900)]">{call.applications}</div>
                      <div className="text-xs text-[var(--color-gray-600)]">Applications</div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-[var(--color-gray-700)] mb-2">Eligibility</div>
                    <div className="inline-flex items-center px-3 py-1 bg-[var(--color-blue-50)] text-[var(--color-blue-700)] text-sm rounded-full border border-[var(--color-blue-200)]">
                      {call.eligibility}
                    </div>
                  </div>
                </div>

                {/* Bottom section - Deadline and Button */}
                <div className="mt-auto">
                  {/* Deadline */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-[var(--color-blue-50)] to-[var(--color-blue-100)] rounded-lg border border-[var(--color-blue-200)]">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-[var(--color-blue-600)] mr-3" />
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-gray-700)]">Application Deadline</div>
                        <div className="text-lg font-bold text-[var(--color-blue-700)]">{call.deadline}</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      call.status === 'Open'
                        ? 'bg-[var(--color-blue-600)] text-white hover:bg-[var(--color-blue-700)] shadow-lg hover:shadow-xl'
                        : 'bg-[var(--color-gray-200)] text-[var(--color-gray-600)] cursor-not-allowed'
                    }`}
                    disabled={call.status !== 'Open'}
                  >
                    {call.status === 'Open' ? 'Apply Now' : 'Opening Soon'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center px-8 py-4 bg-white rounded-xl shadow-lg border border-[var(--color-gray-200)]">
            <div className="text-[var(--color-gray-700)] mr-4">
              <strong>Have questions?</strong> Our team is here to help guide you through the application process.
            </div>
            <button className="px-6 py-2 bg-[var(--color-blue-600)] text-white rounded-lg font-semibold hover:bg-[var(--color-blue-700)] transition-colors duration-200">
              Contact Us
            </button>
          </div>
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
