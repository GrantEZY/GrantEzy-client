"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import { useAuth } from "@/hooks/useAuth";
import { publicService, ProgramCycle } from "@/services/public.service";

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [programCycles, setProgramCycles] = useState<ProgramCycle[]>([]);
  const [isLoadingCycles, setIsLoadingCycles] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Fetch programs from backend
        const response = await publicService.getActiveProgramCycles({
          page: 1,
          numberOfResults: 100,
        });
        
        // DEBUG: Let's see what the main programs API returns
        console.log("Programs API full response:", response);

        if (response.res && response.res.programs) {
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
      
      // WORKAROUND: Since we can't access PM API, try different approaches to get all cycles
      console.log("Trying multiple approaches to get all cycles for program:", program.slug);
      
      // Approach 1: Try the main programs API with specific program filter
      const allCycles: ProgramCycle[] = [];
      
      try {
        console.log("Approach 1: Trying programs API with programSlug filter...");
        const programSpecificResponse = await fetch(`http://localhost:5000/api/v1/public/active-program-cycles?page=1&numberOfResults=100&programSlug=${program.slug}`);
        const programSpecificData = await programSpecificResponse.json();
        console.log("Program-specific API response:", programSpecificData);
        
        if (programSpecificData.res?.programs) {
          programSpecificData.res.programs.forEach((prog: any) => {
            if (prog.cycles && Array.isArray(prog.cycles)) {
              prog.cycles.forEach((cycle: any) => {
                allCycles.push({
                  ...cycle,
                  program: {
                    id: program.id,
                    name: program.details?.name || "Unnamed Program",
                    description: program.details?.description || "",
                  }
                });
              });
            }
          });
        }
      } catch (err) {
        console.log("Approach 1 failed:", err);
      }
      
      // Approach 2: Try the cycle details endpoint (fallback - only gets 1 cycle)
      if (allCycles.length === 0) {
        console.log("Approach 2: Fallback to cycle details endpoint...");
        const cycleResponse = await fetch(`http://localhost:5000/api/v1/public/program-cycle-details?slug=${program.slug}`);
        const cycleData = await cycleResponse.json();
        
        if (cycleData.status === 200 && cycleData.res?.cycle) {
          const cycle = {
            ...cycleData.res.cycle,
            program: {
              id: program.id,
              name: program.details?.name || "Unnamed Program",
              description: program.details?.description || "",
            }
          };
          allCycles.push(cycle);
        }
      }
      
      // TODO: The backend should provide an endpoint to get ALL cycles for a program
      // For now, we only get the active cycle, but the PM should be able to see multiple cycles
      // This is a backend limitation that needs to be addressed
      
      // SOLUTION: Use the same PM API approach that works in PM dashboard
      // This will return ALL cycles for the program, not just the active one
      try {
        console.log("Fetching ALL cycles for program using PM API approach...");
        const pmResponse = await fetch(`http://localhost:5000/api/v1/pm/get-program-cycles?page=1&numberOfResults=100`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
        });
        const pmData = await pmResponse.json();
        
        // If we get cycles from PM API, use those instead
        if (pmData.status === 200 && pmData.res?.cycles && Array.isArray(pmData.res.cycles)) {
          console.log(`✅ PM API found ${pmData.res.cycles.length} cycles for this program`);
          const pmCycles = pmData.res.cycles.map((cycle: any) => ({
            ...cycle,
            program: {
              id: program.id,
              name: program.details?.name || "Unnamed Program",
              description: program.details?.description || "",
            }
          }));
          setProgramCycles(pmCycles);
          return; // Use PM API data instead (SUCCESS!)
        } else {
          console.log("PM API response not successful:", pmData);
        }
      } catch (pmError) {
        console.log("PM API failed, falling back to public API:", pmError);
      }
      
      console.log(`📊 RESULT: Found ${allCycles.length} cycle(s) for program: ${program.details?.name}`);
      if (allCycles.length === 1) {
        console.log("⚠️  Note: Only 1 cycle found - this might be due to public API limitations.");
      }
      setProgramCycles(allCycles);
    } catch (e) {
      console.error("Failed to fetch cycles for program:", e);
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
                {programs.map((program) => (
                  <div
                    key={program.id}
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
                ))}
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
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programCycles.map((cycle) => {
                  const isActive = isActiveStatus(cycle.status);
                  const startDate = cycle.duration?.startDate || cycle.startDate;
                  const endDate = cycle.duration?.endDate || cycle.endDate;

                  return (
                    <div key={cycle.id || cycle.slug} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Applications</h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Applications Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't submitted any applications yet. Apply to an open cycle to get started.
            </p>
          </div>
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
