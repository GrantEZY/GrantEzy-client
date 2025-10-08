"use client";

import {
  FaBolt,
  FaBullseye,
  FaExternalLinkAlt,
  FaEye,
  FaHeartbeat,
  FaRocket,
} from "react-icons/fa";

import { leadership, openCalls, successStories, team } from "@/constants";

import { Marquee } from "@/components/magicui/marquee";

import { cn } from "@/lib/utils";

// Icon mapping function
const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactElement } = {
    FaRocket: <FaRocket className="text-2xl" />,
    FaBolt: <FaBolt className="text-2xl" />,
    FaHeartbeat: <FaHeartbeat className="text-2xl" />,
  };
  return icons[iconName] || <FaRocket className="text-2xl" />;
};

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-gray-50)] via-[var(--color-white)] to-[var(--color-blue-50)]">
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-[var(--color-blue-100)] px-3 py-2 text-xs font-medium text-[var(--color-blue-700)] sm:px-4 sm:text-sm">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-[var(--color-blue-600)]"></span>
            Innovation & Entrepreneurship Hub
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl leading-tight font-bold text-[var(--color-gray-900)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Empowering
            <span className="block bg-gradient-to-r from-[var(--color-blue-600)] to-[var(--color-blue-700)] bg-clip-text text-transparent">
              Tomorrow&apos;s
            </span>
            <span className="block">Innovators</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-4xl px-4 text-base leading-relaxed text-[var(--color-gray-600)] sm:text-lg md:text-xl lg:text-2xl">
            Transforming groundbreaking ideas into impactful ventures through
            comprehensive support, mentorship, and funding opportunities at IIIT
            Sri City.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row sm:gap-6 sm:pt-8">
            <button className="group transform rounded-xl bg-[var(--color-blue-600)] px-6 py-3 text-base font-semibold text-[var(--color-white)] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-blue-700)] hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg">
              <span className="flex items-center justify-center">
                Explore Open Calls
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
            </button>

            <button className="group rounded-xl border-2 border-[var(--color-blue-600)] px-6 py-3 text-base font-semibold text-[var(--color-blue-600)] transition-all duration-300 hover:bg-[var(--color-blue-600)] hover:text-[var(--color-white)] sm:px-8 sm:py-4 sm:text-lg">
              Learn Our Story
            </button>
          </div>

          {/* Stats Preview */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[var(--color-gray-200)] pt-12 sm:mt-16 sm:gap-6 sm:pt-16 md:grid-cols-4 lg:gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-[var(--color-gray-900)] sm:text-2xl lg:text-3xl">
                ₹2.5Cr+
              </div>

              <div className="text-xs text-[var(--color-gray-600)] sm:text-sm">
                Funding Disbursed
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-[var(--color-gray-900)] sm:text-2xl lg:text-3xl">
                89+
              </div>

              <div className="text-xs text-[var(--color-gray-600)] sm:text-sm">
                Projects Funded
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-[var(--color-gray-900)] sm:text-2xl lg:text-3xl">
                24
              </div>

              <div className="text-xs text-[var(--color-gray-600)] sm:text-sm">
                Active Startups
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-[var(--color-gray-900)] sm:text-2xl lg:text-3xl">
                100%
              </div>

              <div className="text-xs text-[var(--color-gray-600)] sm:text-sm">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] py-12 sm:py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-gray-900)] sm:mb-6 sm:text-4xl lg:text-5xl">
            Our Purpose & Vision
          </h2>

          <p className="mx-auto max-w-3xl px-4 text-lg text-[var(--color-gray-600)] sm:text-xl">
            Guided by a clear mission and ambitious vision, we are shaping the
            future of innovation and entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Mission */}
          <div className="group relative h-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>

            <div className="relative flex h-full transform flex-col rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-white)] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 lg:p-10">
              <div className="mb-6 flex flex-col items-start sm:mb-8 sm:flex-row sm:items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 transition-transform duration-300 group-hover:scale-110 sm:mr-6 sm:mb-0 sm:h-16 sm:w-16">
                  <FaBullseye className="text-xl text-[var(--color-white)] sm:text-2xl" />
                </div>

                <h3 className="text-2xl font-bold text-[var(--color-gray-900)] sm:text-3xl">
                  Our Mission
                </h3>
              </div>

              <div className="flex-grow">
                <p className="mb-6 text-base leading-relaxed text-[var(--color-gray-700)] sm:mb-8 sm:text-lg">
                  To create a thriving ecosystem that nurtures innovative ideas,
                  provides comprehensive support to aspiring entrepreneurs, and
                  bridges the gap between academic research and real-world
                  applications through strategic partnerships and funding
                  opportunities.
                </p>

                {/* Mission Points */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>

                    <span className="text-sm sm:text-base">
                      Foster innovation culture
                    </span>
                  </div>

                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>

                    <span className="text-sm sm:text-base">
                      Bridge academia & industry
                    </span>
                  </div>

                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>

                    <span className="text-sm sm:text-base">
                      Enable sustainable growth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative h-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>

            <div className="relative flex h-full transform flex-col rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-white)] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 lg:p-10">
              <div className="mb-6 flex flex-col items-start sm:mb-8 sm:flex-row sm:items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 transition-transform duration-300 group-hover:scale-110 sm:mr-6 sm:mb-0 sm:h-16 sm:w-16">
                  <FaEye className="text-xl text-[var(--color-white)] sm:text-2xl" />
                </div>

                <h3 className="text-2xl font-bold text-[var(--color-gray-900)] sm:text-3xl">
                  Our Vision
                </h3>
              </div>

              <div className="flex-grow">
                <p className="mb-6 text-base leading-relaxed text-[var(--color-gray-700)] sm:mb-8 sm:text-lg">
                  To be recognized as a leading innovation hub in India,
                  producing world-class entrepreneurs and startups that create
                  significant societal impact while contributing to the
                  nation&apos;s economic growth and technological advancement.
                </p>

                {/* Vision Points */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>

                    <span className="text-sm sm:text-base">
                      Leading innovation hub
                    </span>
                  </div>

                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>

                    <span className="text-sm sm:text-base">
                      World-class entrepreneurs
                    </span>
                  </div>

                  <div className="flex items-center text-[var(--color-gray-600)]">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>

                    <span className="text-sm sm:text-base">
                      Societal impact
                    </span>
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
    project: _project,
    impact: _impact,
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
          <img
            alt=""
            className="rounded-full"
            height="40"
            src={img}
            width="40"
          />

          <div className="flex flex-col">
            <figcaption className="text-base font-bold text-[var(--color-black)]">
              {name}
            </figcaption>

            <p className="text-sm font-medium text-[var(--color-gray-600)]">
              {username}
            </p>
          </div>
        </div>

        <blockquote className="mt-4 text-base leading-relaxed">
          {body}
        </blockquote>
      </figure>
    );
  };

  return (
    <section className="relative bg-gradient-to-br from-[var(--color-white)] to-[var(--color-gray-50)] py-12 sm:py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-gray-900)] sm:mb-6 sm:text-4xl lg:text-5xl">
            Featured Success Stories
          </h2>

          <p className="mx-auto max-w-3xl px-4 text-lg text-[var(--color-gray-600)] sm:text-xl">
            Hear from our innovators who transformed ideas into impactful
            ventures through our comprehensive support ecosystem.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee className="mb-6 [--duration:25s] sm:mb-8" pauseOnHover>
            {firstRow.map((story) => (
              <ReviewCard key={story.username} {...story} />
            ))}
          </Marquee>

          <Marquee className="[--duration:25s]" pauseOnHover reverse>
            {secondRow.map((story) => (
              <ReviewCard key={story.username} {...story} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--color-white)] to-transparent sm:w-16"></div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-white)] to-transparent sm:w-16"></div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="relative bg-gradient-to-br from-[var(--color-white)] via-[var(--color-gray-50)] to-[var(--color-blue-50)] py-12 sm:py-16 lg:py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-gray-900)] sm:mb-6 sm:text-4xl lg:text-5xl">
            Meet Our Team
          </h2>

          <p className="mx-auto max-w-3xl px-4 text-lg text-[var(--color-gray-600)] sm:text-xl">
            A dedicated team of visionaries, researchers, and industry experts
            committed to fostering innovation and entrepreneurship.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-20">
          <h3 className="mb-12 text-center text-3xl font-bold text-[var(--color-gray-800)]">
            Leadership
          </h3>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2">
            {leadership.map((leader, index) => (
              <div
                className="group flex h-full transform flex-col overflow-hidden rounded-2xl bg-[var(--color-white)] shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                key={index}
              >
                {/* Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-600)]">
                  <div className="absolute inset-0 bg-black/10"></div>

                  {/* Avatar */}
                  <div className="absolute -bottom-12 left-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--color-white)] bg-[var(--color-white)] shadow-lg">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] text-2xl font-bold text-[var(--color-blue-600)]">
                        {leader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col p-8 pt-16">
                  <h4 className="mb-2 text-2xl font-bold text-[var(--color-gray-900)]">
                    {leader.name}
                  </h4>

                  <p className="mb-4 font-semibold text-[var(--color-blue-600)]">
                    {leader.position}
                  </p>

                  <p className="mb-6 flex-grow leading-relaxed text-[var(--color-gray-600)]">
                    {leader.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-6">
                    <h5 className="mb-3 text-sm font-semibold text-[var(--color-gray-700)]">
                      Expertise
                    </h5>

                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill, skillIndex) => (
                        <span
                          className="rounded-full border border-[var(--color-blue-200)] bg-[var(--color-blue-50)] px-3 py-1 text-xs font-medium text-[var(--color-blue-700)]"
                          key={skillIndex}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Links - Always at bottom */}
                  <div className="mt-auto flex gap-4 border-t border-[var(--color-gray-200)] pt-4">
                    <a
                      className="flex items-center text-[var(--color-gray-600)] transition-colors duration-200 hover:text-[var(--color-blue-600)]"
                      href={`mailto:${leader.email}`}
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>

                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>

                      <span className="text-sm">Email</span>
                    </a>

                    <a
                      className="flex items-center text-[var(--color-gray-600)] transition-colors duration-200 hover:text-[var(--color-blue-600)]"
                      href={leader.linkedin}
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          fillRule="evenodd"
                        ></path>
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
          <h3 className="mb-12 text-center text-3xl font-bold text-[var(--color-gray-800)]">
            Core Team
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div
                className="group transform rounded-xl bg-[var(--color-white)] p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={index}
              >
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-blue-100)] to-[var(--color-blue-200)] text-xl font-bold text-[var(--color-blue-600)] transition-transform duration-300 group-hover:scale-110">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="absolute top-0 right-0 h-6 w-6 rounded-full bg-[var(--color-blue-500)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>

                {/* Info */}
                <h4 className="mb-2 text-lg font-bold text-[var(--color-gray-900)]">
                  {member.name}
                </h4>

                <p className="mb-3 font-semibold text-[var(--color-blue-600)]">
                  {member.position}
                </p>

                {/* Department Badge */}
                <div className="inline-flex items-center rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-sm text-[var(--color-gray-600)]">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[var(--color-blue-500)]"></div>

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
      case "blue":
        return {
          bg: "from-[var(--color-blue-50)] to-[var(--color-blue-100)]",
          border: "border-[var(--color-blue-200)]",
          icon: "text-[var(--color-blue-600)]",
          accent: "bg-[var(--color-blue-500)]",
        };
      case "green":
        return {
          bg: "from-[var(--color-green-50)] to-[var(--color-green-100)]",
          border: "border-[var(--color-green-200)]",
          icon: "text-[var(--color-green-600)]",
          accent: "bg-[var(--color-green-500)]",
        };
      case "red":
        return {
          bg: "from-[var(--color-red-50)] to-[var(--color-red-100)]",
          border: "border-[var(--color-red-200)]",
          icon: "text-[var(--color-red-600)]",
          accent: "bg-[var(--color-red-500)]",
        };
      default:
        return {
          bg: "from-[var(--color-gray-50)] to-[var(--color-gray-100)]",
          border: "border-[var(--color-gray-200)]",
          icon: "text-[var(--color-gray-600)]",
          accent: "bg-[var(--color-gray-500)]",
        };
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-blue-50)] py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-4xl font-bold text-[var(--color-gray-900)] md:text-5xl">
            Open Opportunities
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-[var(--color-gray-600)]">
            Discover funding opportunities and programs designed to accelerate
            your innovation journey and transform ideas into impact.
          </p>
        </div>

        {/* Calls Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {openCalls.map((call, index) => {
            const colors = getProjectColors(call.color);
            return (
              <div
                className="group relative flex h-full transform flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                key={index}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 transition-opacity duration-300 group-hover:opacity-70`}
                ></div>

                {/* Accent Line */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 ${colors.accent}`}
                ></div>

                {/* Content */}
                <div className="relative flex h-full flex-col p-8">
                  {/* Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={`${colors.icon} transition-transform duration-300 group-hover:scale-110`}
                    >
                      {getIcon(call.icon)}
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        call.status === "Open"
                          ? "border border-green-200 bg-green-100 text-green-700"
                          : call.status === "Coming Soon"
                            ? "border border-yellow-200 bg-yellow-100 text-yellow-700"
                            : "border border-blue-200 bg-blue-100 text-blue-700"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-grow">
                    <h3 className="mb-4 text-2xl font-bold text-[var(--color-gray-900)] transition-colors duration-300 group-hover:text-[var(--color-blue-700)]">
                      {call.title}
                    </h3>

                    <p className="mb-6 leading-relaxed text-[var(--color-gray-600)]">
                      {call.description}
                    </p>

                    {/* Impact Metrics */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white/50 p-3 text-center">
                        <div className="text-lg font-bold text-[var(--color-gray-900)]">
                          {call.funding}
                        </div>

                        <div className="text-xs text-[var(--color-gray-600)]">
                          Funding
                        </div>
                      </div>

                      <div className="rounded-lg bg-white/50 p-3 text-center">
                        <div className="text-lg font-bold text-[var(--color-gray-900)]">
                          {call.timeline}
                        </div>

                        <div className="text-xs text-[var(--color-gray-600)]">
                          Duration
                        </div>
                      </div>
                    </div>

                    {/* Impact Badge */}
                    <div className="mb-6">
                      <div className="inline-flex items-center rounded-full border border-[var(--color-blue-200)] bg-[var(--color-blue-50)] px-3 py-2">
                        <div className="mr-2 h-2 w-2 rounded-full bg-[var(--color-blue-500)]"></div>

                        <span className="text-sm font-medium text-[var(--color-blue-700)]">
                          {call.impact}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {call.tags.map((tag, tagIndex) => (
                        <span
                          className="rounded-full border border-[var(--color-gray-200)] bg-white/70 px-3 py-1 text-xs font-medium text-[var(--color-gray-700)]"
                          key={tagIndex}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button - Always at bottom */}
                  <div className="mt-auto">
                    <button
                      className={`group/btn inline-flex w-full transform items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${
                        call.status === "Open"
                          ? "bg-[var(--color-gray-900)] text-[var(--color-white)] hover:bg-[var(--color-blue-600)]"
                          : "cursor-not-allowed bg-[var(--color-gray-400)] text-[var(--color-white)]"
                      }`}
                      disabled={call.status !== "Open"}
                    >
                      <span>
                        {call.status === "Open" ? "Apply Now" : "Opening Soon"}
                      </span>

                      <FaExternalLinkAlt className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center rounded-xl border border-[var(--color-gray-200)] bg-white px-8 py-4 shadow-lg">
            <div className="mr-4 text-[var(--color-gray-700)]">
              <strong>Have questions?</strong> Our team is here to help guide
              you through the application process.
            </div>

            <button className="rounded-lg bg-[var(--color-blue-600)] px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-blue-700)]">
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
