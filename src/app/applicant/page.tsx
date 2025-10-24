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
        
        // Fetch programs from backend with larger page size to get more programs and cycles
        const response = await publicService.getActiveProgramCycles({
          page: 1,
          numberOfResults: 200, // Increased to get more programs
        });
        
        // DEBUG: Let's analyze what the programs API returns
        console.log("📡 Programs API full response:", response);
        
        if (response.res && response.res.programs) {
          console.log(`📊 Found ${response.res.programs.length} programs`);
          
          // Debug each program to see how many cycles they have
          response.res.programs.forEach((program: any, index: number) => {
            const cycleCount = program.cycles ? program.cycles.length : 0;
            console.log(`📋 Program ${index + 1}: "${program.details?.name}" has ${cycleCount} cycles`);
            
            if (program.cycles && program.cycles.length > 0) {
              program.cycles.forEach((cycle: any, cycleIndex: number) => {
                console.log(`  📅 Cycle ${cycleIndex + 1}: Status="${cycle.status}", Slug="${cycle.slug}"`);
              });
            }
          });
          
          setPrograms(response.res.programs);
        } else {
          console.log("❌ No programs found in response");
        }
      } catch (err) {
        console.error("💥 Failed to fetch programs:", err);
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
      
      console.log("Fetching all available cycles for program:", program.details?.name);
      
      const allCycles: ProgramCycle[] = [];
      
      // Strategy 1: Use cycles already loaded with the program
      if (program.cycles && Array.isArray(program.cycles) && program.cycles.length > 0) {
        console.log(`✅ Found ${program.cycles.length} cycles in program object`);
        program.cycles.forEach((cycle: any) => {
          allCycles.push({
            ...cycle,
            program: {
              id: program.id,
              name: program.details?.name || "Unnamed Program",
              description: program.details?.description || "",
            }
          });
        });
      } else {
        console.log("📡 No cycles in program object, trying alternative approaches...");
        
        // Strategy 2: Try to get cycles using programSlug filter
        try {
          console.log(`📡 Fetching cycles specifically for program slug: ${program.slug}`);
          const response = await publicService.getActiveProgramCycles({
            programSlug: program.slug,
            page: 1,
            numberOfResults: 50,
          });
          
          console.log("📡 Program-specific cycles response:", response);
          
          if (response.res && response.res.programs && response.res.programs.length > 0) {
            const foundProgram = response.res.programs[0]; // Should be our program
            if (foundProgram.cycles && foundProgram.cycles.length > 0) {
              console.log(`✅ Found ${foundProgram.cycles.length} cycles via program-specific API`);
              foundProgram.cycles.forEach((cycle: any) => {
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
          }
        } catch (programSpecificError) {
          console.error("❌ Failed to fetch program-specific cycles:", programSpecificError);
        }
        
        // Strategy 3: Fallback to cycle details endpoint (gets at least one cycle)
        if (allCycles.length === 0) {
          console.log("📡 Trying cycle details endpoint as final fallback...");
          try {
            const cycleDetails = await publicService.getProgramCycleDetails(program.slug);
            console.log("📡 Cycle details response:", cycleDetails);
            
            if (cycleDetails.status === 200 && cycleDetails.res) {
              console.log("✅ Found 1 cycle via cycle details endpoint");
              console.log("📋 Raw cycle data:", cycleDetails.res);
              
              allCycles.push({
                ...cycleDetails.res,
                program: {
                  id: program.id,
                  name: program.details?.name || "Unnamed Program", 
                  description: program.details?.description || "",
                }
              });
            }
          } catch (detailsError) {
            console.error("❌ Failed to fetch cycle details:", detailsError);
          }
        }
      }
      
      // Log all cycle statuses to understand what we're working with
      console.log("📊 All cycles found:");
      allCycles.forEach((cycle, index) => {
        console.log(`  Cycle ${index + 1}: "${cycle.title}" - Status: "${cycle.status}" - ID: ${cycle.id} - Slug: ${cycle.slug}`);
      });

      // For now, show ALL cycles regardless of status so user can see them
      // We can adjust filtering later based on what statuses we actually see
      console.log(`📊 FINAL RESULT: Showing all ${allCycles.length} cycles found`);
      setProgramCycles(allCycles);
      
      if (allCycles.length === 0) {
        console.log("❌ No cycles found for this program at all");
      }
      
    } catch (e) {
      console.error("💥 Failed to fetch cycles for program:", e);
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
