"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import { useAuth } from "@/hooks/useAuth";
import { useApplicant } from "@/hooks/useApplicant";
import { publicService, ProgramCycle } from "@/services/public.service";

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const { 
    myApplications,
    linkedApplications,
    isLoadingApplications, 
    fetchUserApplications,
    deleteUserApplication,
    error: applicantError 
  } = useApplicant();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [programCycles, setProgramCycles] = useState<ProgramCycle[]>([]);
  const [isLoadingCycles, setIsLoadingCycles] = useState(false);

  useEffect(() => {
    // Fetch user applications on component mount
    fetchUserApplications();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const response = await publicService.getActiveProgramCycles({
          page: 1,
          numberOfResults: 200,
        });
        
        console.log("=== BACKEND RESPONSE DEBUG ===");
        console.log("Full response:", JSON.stringify(response, null, 2));
        console.log("Programs array:", response.res?.programs);
        
        if (response.res && response.res.programs) {
          response.res.programs.forEach((program: any, index: number) => {
            console.log(`Program ${index + 1}:`, {
              name: program.details?.name,
              slug: program.slug,
              cycles: program.cycles,
              cyclesCount: program.cycles?.length || 0
            });
          });
          setPrograms(response.res.programs);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load programs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const fetchProgramCycles = async (program: any) => {
    try {
      setIsLoadingCycles(true);
      
      console.log("=== FETCHING CYCLES FOR PROGRAM ===");
      console.log("Selected program:", {
        name: program.details?.name,
        slug: program.slug,
        hasCycles: !!program.cycles,
        cyclesCount: program.cycles?.length || 0,
        cyclesData: program.cycles
      });
      
      // Use the cycles array from the program object (now loaded by backend)
      const cycles = program.cycles || [];
      
      console.log("Cycles found:", cycles.length);
      
      // Map cycles to include program information
      const allCycles: ProgramCycle[] = cycles.map((cycle: any) => ({
        ...cycle,
        program: {
          id: program.id,
          name: program.details?.name || "Unnamed Program", 
          description: program.details?.description || "",
        }
      }));

      console.log("Mapped cycles:", allCycles);
      setProgramCycles(allCycles);
      
    } catch (e) {
      console.error("Error in fetchProgramCycles:", e);
      setProgramCycles([]);
    } finally {
      setIsLoadingCycles(false);
    }
  };

  const handleProgramSelect = (program: any) => {
    setSelectedProgram(program);
    fetchProgramCycles(program);
  };

  const handleBackToPrograms = () => {
    setSelectedProgram(null);
    setProgramCycles([]);
  };

  const handleApplyToCycle = (cycleSlug: string) => {
    window.location.href = `/applicant/new-application?cycleSlug=${cycleSlug}`;
  };

  const isActiveStatus = (status: string) => {
    return status === 'OPEN' || status === 'ACTIVE';
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || "Applicant"}
          </h1>
          <p className="mt-2 text-gray-600">
            Apply for grants and track your applications
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedProgram 
                ? `Cycles - ${selectedProgram.details?.name || "Program"}` 
                : "Available Grant Programs"}
            </h2>
            {selectedProgram && (
              <button
                onClick={handleBackToPrograms}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Programs
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <h3 className="mt-2 text-sm font-medium text-red-900">Error Loading Data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          ) : !selectedProgram ? (
            programs.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Programs Available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no grant programs available for applications.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((program, index) => {
                  // Ensure unique key - use id, slug, or fallback to index
                  const uniqueKey = program.id || program.slug || `program-${index}`;
                  
                  return (
                    <div
                      key={uniqueKey}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleProgramSelect(program)}
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {program.details?.name || "Unnamed Program"}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          {program.details?.description || "No description available"}
                        </p>
                      </div>
                      <span className="ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                        {program.status || "ACTIVE"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>Organization: {program.organization?.name || "N/A"}</span>
                    </div>

                    <div className="mt-6">
                      <button className="w-full rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        View Cycles
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )
          ) : (
            isLoadingCycles ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading cycles...</p>
              </div>
            ) : programCycles.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Cycles</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This program currently has no active cycles open for applications.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Note: The system currently shows only the active cycle per program.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programCycles.map((cycle, index) => {
                  const isActive = isActiveStatus(cycle.status);
                  const startDate = cycle.duration?.startDate || cycle.startDate;
                  const endDate = cycle.duration?.endDate || cycle.endDate;
                  
                  // Ensure unique key - use id, slug, or fallback to index
                  const uniqueKey = cycle.id || cycle.slug || `cycle-${index}`;

                  return (
                    <div key={uniqueKey} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {cycle.title || `${selectedProgram?.details?.name} Cycle`}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {cycle.description || "Grant application cycle"}
                          </p>
                        </div>
                        <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {cycle.status || "UNKNOWN"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>
                          {startDate ? new Date(startDate).toLocaleDateString() : "N/A"} - {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleApplyToCycle(cycle.slug)}
                          disabled={!isActive}
                          className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
                            isActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {isActive ? "Apply Now" : "Closed"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* My Applications Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Applications</h2>
          
          {isLoadingApplications ? (
            <div className="rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Loading your applications...</p>
            </div>
          ) : myApplications && myApplications.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myApplications.map((application: any) => {
                const statusColor = application.isSubmitted 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800";
                const statusText = application.isSubmitted ? "Submitted" : "Draft";
                
                return (
                  <div
                    key={application.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.basicInfo?.title || "Untitled Application"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {application.cycle?.program?.title || "Program information not available"}
                        </p>
                      </div>
                      <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cycle:</span> {application.cycle?.title || "Cycle information not available"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Step {application.stepNumber} of 7
                      </p>
                    </div>

                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <span>
                        Created: {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-6 flex gap-2">
                      {!application.isSubmitted && (
                        <>
                          <Link
                            href={`/applicant/new-application?cycle=${application.cycle?.slug}`}
                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 text-center"
                          >
                            Continue
                          </Link>
                          <button
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this draft application?")) {
                                const success = await deleteUserApplication(application.id);
                                if (success) {
                                  // Applications list will be updated automatically by the store
                                }
                              }
                            }}
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {application.isSubmitted && (
                        <Link
                          href={`/applicant/application/${application.id}`}
                          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Applications Yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't submitted any applications yet. Apply to an open cycle to get started.
              </p>
            </div>
          )}
        </div>

        {/* Linked Applications Section - Applications where user is invited as co-applicant */}
        {linkedApplications && linkedApplications.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Applications I'm Collaborating On
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Applications where you've been invited as a co-applicant
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {linkedApplications.map((application: any) => {
                const statusColor = application.isSubmitted 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800";
                const statusText = application.isSubmitted ? "Submitted" : "Draft";
                
                return (
                  <div
                    key={application.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.basicInfo?.title || "Untitled Application"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {application.cycle?.program?.title || "Program information not available"}
                        </p>
                        <span className="mt-1 inline-flex items-center text-xs text-blue-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          Co-applicant
                        </span>
                      </div>
                      <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cycle:</span> {application.cycle?.title || "Cycle information not available"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Step {application.stepNumber} of 7
                      </p>
                    </div>

                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <span>
                        Created: {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/applicant/application/${application.id}`}
                        className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ApplicantLayout>
    </AuthGuard>
  );
}
