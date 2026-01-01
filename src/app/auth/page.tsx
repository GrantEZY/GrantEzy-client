"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRoles, UserCommitmentStatus } from '@/types/auth.types';

// Role-based redirect mapping
const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case UserRoles.ADMIN:
      return '/admin';
    case UserRoles.COMMITTEE_MEMBER:
      return '/gcv';
    case UserRoles.PROGRAM_MANAGER:
      return '/pm';
    case UserRoles.APPLICANT:
      return '/applicant';
    case UserRoles.TEAM_MATE:
      return '/co-applicant';
    case UserRoles.REVIEWER:
      return '/reviewer';
    default:
      return '/';
  }
};

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [role, setRole] = useState(UserRoles.ADMIN);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign Up State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [commitment, setCommitment] = useState(UserCommitmentStatus.FULL_TIME);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set initial role based on redirect parameter
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect === '/gcv') {
      setRole(UserRoles.COMMITTEE_MEMBER);
    } else if (redirect === '/pm') {
      setRole(UserRoles.PROGRAM_MANAGER);
    } else if (redirect === '/applicant') {
      setRole(UserRoles.APPLICANT);
    } else if (redirect === '/co-applicant') {
      setRole(UserRoles.TEAM_MATE);
    } else if (redirect === '/reviewer') {
      setRole(UserRoles.REVIEWER);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await login({ email: loginEmail, password: loginPassword, role });

      if (result.success) {
        const backendRole = result.user?.role || role;
        const queryRedirect = searchParams.get('redirect');
        const defaultRedirect = getRoleBasedRedirect(
          Array.isArray(backendRole) ? backendRole[0] : backendRole
        );
        const redirect = queryRedirect || defaultRedirect;
        router.push(redirect);
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess(false);

    // Validate passwords match
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      setSignupLoading(false);
      return;
    }

    // Validate password length
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      setSignupLoading(false);
      return;
    }

    try {
      const result = await register({
        firstName,
        lastName,
        email: signupEmail,
        password: signupPassword,
        commitment,
      });

      if (result.success) {
        setSignupSuccess(true);
        setTimeout(() => {
          setIsSignUp(false);
          setSignupSuccess(false);
        }, 2000);
      } else {
        setSignupError(result.error || 'Registration failed');
      }
    } catch (err) {
      setSignupError('An unexpected error occurred');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] p-5">
      {/* Quick Access Links - Above the form */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-700 mb-3 font-medium">Quick Access:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <a
            href="/auth?redirect=/admin"
            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
          >
            Admin
          </a>
          <a
            href="/auth?redirect=/gcv"
            className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
          >
            Committee Member
          </a>
          <a
            href="/auth?redirect=/pm"
            className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
          >
            Program Manager
          </a>
          <a
            href="/auth?redirect=/applicant"
            className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
          >
            Applicant
          </a>
          <a
            href="/auth?redirect=/reviewer"
            className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md transition-colors"
          >
            Reviewer
          </a>
        </div>
      </div>

      <div className="relative overflow-hidden w-[1000px] max-w-full min-h-[650px] bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
        
        {/* --- SIGN UP FORM --- */}
        <div
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 
          ${isSignUp ? "translate-x-full opacity-100 z-[5]" : "opacity-0 z-[1]"}`}
        >
          <form onSubmit={handleSignUp} className="bg-white flex flex-col items-center justify-center h-full px-10 py-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <SocialIcons />
            <span className="text-xs mb-3 mt-2">or use your email for registration</span>
            
            {signupSuccess && (
              <div className="w-full mb-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 text-center">
                Registration successful! Switching to sign in...
              </div>
            )}
            
            {signupError && (
              <div className="w-full mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 text-center">
                {signupError}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <select
              className="bg-[#eee] border-none my-2 py-2.5 px-4 text-[13px] rounded-lg w-full outline-none"
              value={commitment}
              onChange={(e) => setCommitment(e.target.value as UserCommitmentStatus)}
              required
            >
              {Object.values(UserCommitmentStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <PasswordInput
              placeholder="Password (min. 6 characters)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              showPassword={showSignupPassword}
              onTogglePassword={() => setShowSignupPassword(!showSignupPassword)}
              required
            />
            <PasswordInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
            <Button disabled={signupLoading}>
              {signupLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </div>

        {/* --- SIGN IN FORM --- */}
        <div
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-[2]
          ${isSignUp ? "translate-x-full" : ""}`}
        >
          <form onSubmit={handleSignIn} className="bg-white flex flex-col items-center justify-center h-full px-10">
            <h1 className="text-3xl font-bold mb-3">Sign In</h1>
            <SocialIcons />
            <span className="text-xs mb-3 mt-2">or use your email password</span>
            
            {loginError && (
              <div className="w-full mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 text-center">
                {loginError}
              </div>
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <PasswordInput
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              showPassword={showLoginPassword}
              onTogglePassword={() => setShowLoginPassword(!showLoginPassword)}
              required
            />
            <select
              className="bg-[#eee] border-none my-2 py-2.5 px-4 text-[13px] rounded-lg w-full outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRoles)}
              required
            >
              {Object.values(UserRoles).map((userRole) => (
                <option key={userRole} value={userRole}>
                  {userRole.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <a href="#" className="text-xs text-[#333] my-3 hover:underline">Forget Your Password?</a>
            <Button disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-[10px] text-gray-500 mt-3">Test: admin@test.com / password123</p>
          </form>
        </div>

        {/* --- TOGGLE CONTAINER (Overlay) --- */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-[1000]
          ${isSignUp 
            ? "-translate-x-full rounded-[0_150px_100px_0]" 
            : "rounded-[150px_0_0_100px]"
          }`}
        >
          <div
            className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out
            ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}
          >
            {/* Left Panel (For Sign In Prompt) */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transform transition-transform duration-600 ease-in-out
              ${isSignUp ? "translate-x-0" : "-translate-x-[200%]"}`}
            >
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-[0.3px] mb-8">
                Enter your personal details to use all of site features
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wider cursor-pointer mt-2 hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Right Panel (For Sign Up Prompt) */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 right-0 transform transition-transform duration-600 ease-in-out
              ${isSignUp ? "translate-x-[200%]" : "translate-x-0"}`}
            >
              <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-[0.3px] mb-8">
                Register with your personal details to use all of site features
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wider cursor-pointer mt-2 hover:bg-white/10 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function SocialIcons() {
  return (
    <div className="flex space-x-2 my-2">
      <a href="#" className="border border-[#ccc] rounded-[20%] w-10 h-10 flex items-center justify-center text-[#333] hover:bg-gray-100 transition-colors">
        <FaGooglePlusG className="text-lg" />
      </a>
      <a href="#" className="border border-[#ccc] rounded-[20%] w-10 h-10 flex items-center justify-center text-[#333] hover:bg-gray-100 transition-colors">
        <FaFacebookF className="text-lg" />
      </a>
      <a href="#" className="border border-[#ccc] rounded-[20%] w-10 h-10 flex items-center justify-center text-[#333] hover:bg-gray-100 transition-colors">
        <FaGithub className="text-lg" />
      </a>
      <a href="#" className="border border-[#ccc] rounded-[20%] w-10 h-10 flex items-center justify-center text-[#333] hover:bg-gray-100 transition-colors">
        <FaLinkedinIn className="text-lg" />
      </a>
    </div>
  );
}

interface InputProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Input({ type, placeholder, value, onChange, required }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="bg-[#eee] border-none my-2 py-2.5 px-4 text-[13px] rounded-lg w-full outline-none"
    />
  );
}

interface PasswordInputProps {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  required?: boolean;
}

function PasswordInput({ placeholder, value, onChange, showPassword, onTogglePassword, required }: PasswordInputProps) {
  return (
    <div className="relative w-full my-2">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-[#eee] border-none py-2.5 px-4 pr-10 text-[13px] rounded-lg w-full outline-none"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ children, disabled }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="bg-blue-600 text-white text-xs font-semibold py-2.5 px-11 border border-transparent rounded-lg uppercase tracking-wider mt-2.5 cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
