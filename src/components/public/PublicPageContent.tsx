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
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { successStories, openCalls, leadership, team } from "@/constants";

// Icon mapping function
const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactElement } = {
    FaRocket: <FaRocket className="text-2xl" />,
    FaBolt: <FaBolt className="text-2xl" />,
    FaHeartbeat: <FaHeartbeat className="text-2xl" />
  };
  return icons[iconName] || <FaRocket className="text-2xl" />;
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-gray-50)] via-[var(--color-white)] to-[var(--color-blue-50)] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-[var(--color-blue-100)] text-[var(--color-blue-700)] rounded-full text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 bg-[var(--color-blue-600)] rounded-full mr-2 animate-pulse"></span>
            Innovation & Entrepreneurship Hub
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-gray-900)] leading-tight">
            Empowering
            <span className="block bg-gradient-to-r from-[var(--color-blue-600)] to-[var(--color-blue-700)] bg-clip-text text-transparent">
              Tomorrow&apos;s
            </span>
            <span className="block">Innovators</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--color-gray-600)] max-w-4xl mx-auto leading-relaxed px-4">
            Transforming groundbreaking ideas into impactful ventures through comprehensive support, 
            mentorship, and funding opportunities at IIIT Sri City.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8">
            <button className="group bg-[var(--color-blue-600)] text-[var(--color-white)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[var(--color-blue-700)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center">
                Explore Open Calls
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button className="group border-2 border-[var(--color-blue-600)] text-[var(--color-blue-600)] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[var(--color-blue-600)] hover:text-[var(--color-white)] transition-all duration-300">
              Learn Our Story
            </button>
          </div>
          
          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-12 sm:pt-16 border-t border-[var(--color-gray-200)] mt-12 sm:mt-16">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">₹2.5Cr+</div>
              <div className="text-[var(--color-gray-600)] text-xs sm:text-sm">Funding Disbursed</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">89+</div>
              <div className="text-[var(--color-gray-600)] text-xs sm:text-sm">Projects Funded</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">24</div>
              <div className="text-[var(--color-gray-600)] text-xs sm:text-sm">Active Startups</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">100%</div>
              <div className="text-[var(--color-gray-600)] text-xs sm:text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-gray-900)] mb-4 sm:mb-6">
            Our Purpose & Vision
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto px-4">
            Guided by a clear mission and ambitious vision, we are shaping the future of innovation and entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Mission */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-[var(--color-white)] p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-[var(--color-gray-200)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform duration-300">
                  <FaBullseye className="text-[var(--color-white)] text-xl sm:text-2xl" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-gray-900)]">Our Mission</h3>
              </div>
              <div className="flex-grow">
                <p className="text-[var(--color-gray-700)] leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">
                  To create a thriving ecosystem that nurtures innovative ideas, provides comprehensive support 
                  to aspiring entrepreneurs, and bridges the gap between academic research and real-world 
                  applications through strategic partnerships and funding opportunities.
                </p>
                
                {/* Mission Points */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Foster innovation culture</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Bridge academia & industry</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Enable sustainable growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-[var(--color-white)] p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-[var(--color-gray-200)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform duration-300">
                  <FaEye className="text-[var(--color-white)] text-xl sm:text-2xl" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-gray-900)]">Our Vision</h3>
              </div>
              <div className="flex-grow">
                <p className="text-[var(--color-gray-700)] leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">
                  To be recognized as a leading innovation hub in India, producing world-class entrepreneurs 
                  and startups that create significant societal impact while contributing to the nation&apos;s 
                  economic growth and technological advancement.
                </p>
                
                {/* Vision Points */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Leading innovation hub</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">World-class entrepreneurs</span>
                  </div>
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Societal impact</span>
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
  const firstRow = successStories.slice(0, successStories.length / 2);
  const secondRow = successStories.slice(successStories.length / 2);

  const ReviewCard = ({
    img,
    name,
    username,
    body,
    project,
    impact,
  }: {
    img: string;
    name: string;
    username: string;
    body: string;
    project: string;
    impact: string;
  }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl p-6",
          // light styles
          "border-[var(--color-gray-200)] bg-[var(--color-white)] hover:bg-[var(--color-gray-50)]",
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <img className="rounded-full" width="40" height="40" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-base font-bold text-[var(--color-black)]">
              {name}
            </figcaption>
            <p className="text-sm font-medium text-[var(--color-gray-600)]">{username}</p>
          </div>
        </div>
        <blockquote className="mt-4 text-base leading-relaxed">{body}</blockquote>
      </figure>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-[var(--color-white)] to-[var(--color-gray-50)] relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-gray-900)] mb-4 sm:mb-6">
            Featured Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto px-4">
            Hear from our innovators who transformed ideas into impactful ventures through our comprehensive support ecosystem.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:25s] mb-6 sm:mb-8">
            {firstRow.map((story) => (
              <ReviewCard key={story.username} {...story} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:25s]">
            {secondRow.map((story) => (
              <ReviewCard key={story.username} {...story} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--color-white)] to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--color-white)] to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-[var(--color-white)] via-[var(--color-gray-50)] to-[var(--color-blue-50)] relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-gray-900)] mb-4 sm:mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-gray-600)] max-w-3xl mx-auto px-4">
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
                className="group bg-[var(--color-white)] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col"
              >
                {/* Header with Gradient */}
                <div className="h-32 bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-600)] relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  {/* Avatar */}
                  <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 bg-[var(--color-white)] rounded-full border-4 border-[var(--color-white)] shadow-lg flex items-center justify-center">
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
                className="group bg-[var(--color-white)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center transform hover:-translate-y-1"
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
  const getProjectColors = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-[var(--color-blue-50)] to-[var(--color-blue-100)]',
          border: 'border-[var(--color-blue-200)]',
          icon: 'text-[var(--color-blue-600)]',
          accent: 'bg-[var(--color-blue-500)]'
        };
      case 'green':
        return {
          bg: 'from-[var(--color-green-50)] to-[var(--color-green-100)]',
          border: 'border-[var(--color-green-200)]',
          icon: 'text-[var(--color-green-600)]',
          accent: 'bg-[var(--color-green-500)]'
        };
      case 'red':
        return {
          bg: 'from-[var(--color-red-50)] to-[var(--color-red-100)]',
          border: 'border-[var(--color-red-200)]',
          icon: 'text-[var(--color-red-600)]',
          accent: 'bg-[var(--color-red-500)]'
        };
      default:
        return {
          bg: 'from-[var(--color-gray-50)] to-[var(--color-gray-100)]',
          border: 'border-[var(--color-gray-200)]',
          icon: 'text-[var(--color-gray-600)]',
          accent: 'bg-[var(--color-gray-500)]'
        };
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
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
          {openCalls.map((call, index) => {
            const colors = getProjectColors(call.color);
            return (
              <div 
                key={index} 
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                
                {/* Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent}`}></div>
                
                {/* Content */}
                <div className="relative p-8 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                      {getIcon(call.icon)}
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      call.status === 'Open' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : call.status === 'Coming Soon'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  
                  {/* Title & Description */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[var(--color-gray-900)] mb-4 group-hover:text-[var(--color-blue-700)] transition-colors duration-300">
                      {call.title}
                    </h3>
                    <p className="text-[var(--color-gray-600)] leading-relaxed mb-6">
                      {call.description}
                    </p>
                    
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-lg font-bold text-[var(--color-gray-900)]">{call.funding}</div>
                        <div className="text-xs text-[var(--color-gray-600)]">Funding</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-lg font-bold text-[var(--color-gray-900)]">{call.timeline}</div>
                        <div className="text-xs text-[var(--color-gray-600)]">Duration</div>
                      </div>
                    </div>
                    
                    {/* Impact Badge */}
                    <div className="mb-6">
                      <div className="inline-flex items-center px-3 py-2 bg-[var(--color-blue-50)] border border-[var(--color-blue-200)] rounded-full">
                        <div className="w-2 h-2 bg-[var(--color-blue-500)] rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-[var(--color-blue-700)]">{call.impact}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {call.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="px-3 py-1 bg-white/70 text-[var(--color-gray-700)] text-xs font-medium rounded-full border border-[var(--color-gray-200)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button - Always at bottom */}
                  <div className="mt-auto">
                    <button 
                      className={`group/btn inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        call.status === 'Open'
                          ? 'bg-[var(--color-gray-900)] text-[var(--color-white)] hover:bg-[var(--color-blue-600)]'
                          : 'bg-[var(--color-gray-400)] text-[var(--color-white)] cursor-not-allowed'
                      }`}
                      disabled={call.status !== 'Open'}
                    >
                      <span>{call.status === 'Open' ? 'Apply Now' : 'Opening Soon'}</span>
                      <FaExternalLinkAlt className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
      <MissionVisionSection />
      <FeaturedProjectsSection />
      <TeamSection />
      <OpenCallsSection />
    </div>
  );
}
