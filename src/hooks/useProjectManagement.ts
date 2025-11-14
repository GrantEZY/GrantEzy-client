/**
 * Custom hook for Project Management store
 * Provides easy access to project state and actions
 */
import { useProjectStore } from "../store/project.store";

export const useProjectManagement = () => {
  // Projects state
  const projects = useProjectStore((state) => state.projects);
  const projectsPagination = useProjectStore((state) => state.projectsPagination);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);

  // Current project
  const currentProject = useProjectStore((state) => state.currentProject);
  const isProjectLoading = useProjectStore((state) => state.isProjectLoading);
  const projectError = useProjectStore((state) => state.projectError);

  // Criterias
  const criterias = useProjectStore((state) => state.criterias);
  const isCriteriasLoading = useProjectStore((state) => state.isCriteriasLoading);
  const criteriasError = useProjectStore((state) => state.criteriasError);

  // Actions
  const createProject = useProjectStore((state) => state.createProject);
  const getCycleProjects = useProjectStore((state) => state.getCycleProjects);
  const getProjectDetails = useProjectStore((state) => state.getProjectDetails);
  const clearProjects = useProjectStore((state) => state.clearProjects);
  const clearProject = useProjectStore((state) => state.clearProject);

  const createCycleCriteria = useProjectStore((state) => state.createCycleCriteria);
  const getCycleCriterias = useProjectStore((state) => state.getCycleCriterias);
  const clearCriterias = useProjectStore((state) => state.clearCriterias);

  const clearAll = useProjectStore((state) => state.clearAll);

  return {
    // Projects
    projects,
    projectsPagination,
    isProjectsLoading,
    projectsError,
    getCycleProjects,
    clearProjects,

    // Current project
    currentProject,
    isProjectLoading,
    projectError,
    createProject,
    getProjectDetails,
    clearProject,

    // Criterias
    criterias,
    isCriteriasLoading,
    criteriasError,
    createCycleCriteria,
    getCycleCriterias,
    clearCriterias,

    // Clear all
    clearAll,
  };
};
