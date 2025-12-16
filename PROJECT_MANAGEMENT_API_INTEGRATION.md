# Project Management API Integration Guide

## Overview

The backend has implemented a comprehensive **Project Management** system for managing grant applications that have been approved and converted into projects. This includes project evaluation criteria, assessment submissions, and project-specific reviews.

---

## 🎯 Core Concepts

### 1. **Projects**

- Approved grant applications are converted into **Projects**
- Projects have allocated budgets and planned durations
- Projects belong to specific grant cycles

### 2. **Cycle Assessment Criteria**

- Program managers create evaluation criteria for projects in a cycle
- Each criteria has a name, description, and optional template file
- Criteria are used to evaluate project progress/submissions

### 3. **Cycle Assessments (Submissions)**

- Applicants submit assessment responses for their projects
- Each submission is tied to a specific criteria
- Submissions include a review statement and optional file upload

### 4. **Project Reviews**

- Reviewers are invited to review project assessment submissions
- Reviews include recommendations and analysis
- Separate from initial application reviews

---

## 📡 New API Endpoints

### **Project Management Controller** (`/pt-management`)

#### 1. **Create Project** (POST)

- **Endpoint:** `/pt-management/create-project`
- **Auth:** Required (Program Manager only)
- **Body:**
  ```typescript
  {
    applicationId: string; // UUID of approved application
    allocatedBudget: QuotedBudget; // Budget breakdown
    plannedDuration: {
      startDate: Date;
      endDate: Date;
    }
  }
  ```
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      applicationId: string;
      projectId: string;
    }
  }
  ```

#### 2. **Get Cycle Projects** (GET)

- **Endpoint:** `/pt-management/get-cycle-projects?cycleSlug=xxx&page=1&numberOfResults=10`
- **Auth:** Required (Program Manager only)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      applications: GrantApplication[];  // Applications that are projects
    }
  }
  ```

#### 3. **Get Project Details** (GET)

- **Endpoint:** `/pt-management/get-project-details?cycleSlug=xxx&applicationSlug=xxx`
- **Auth:** Required
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      project: Project; // Full project details
    }
  }
  ```

#### 4. **Create Cycle Criteria** (POST)

- **Endpoint:** `/pt-management/create-cycle-criteria`
- **Auth:** Required (Program Manager only)
- **Body:**
  ```typescript
  {
    cycleId: string;
    name: string;
    briefReview: string;
    templateFile?: DocumentObject;
  }
  ```
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      criteriaName: string;
    }
  }
  ```

#### 5. **Get Cycle Criterias** (GET)

- **Endpoint:** `/pt-management/get-cycle-criterias?cycleSlug=xxx`
- **Auth:** Required (Program Manager only)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      criterias: CycleAssessmentCriteria[];
    }
  }
  ```

#### 6. **Get Applicant Project Cycle Review Criteria** (GET)

- **Endpoint:** `/pt-management/get-applicant-project-cycle-review-criteria?cycleSlug=xxx`
- **Auth:** Required (Applicant with project in cycle)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      criterias: CycleAssessmentCriteria[];
    }
  }
  ```

#### 7. **Get Applicant Cycle Assessment Submission** (GET)

- **Endpoint:** `/pt-management/get-applicant-cycle-assessment-submission?cycleSlug=xxx&criteriaSlug=xxx`
- **Auth:** Required (Applicant)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      criteria: CycleAssessmentCriteria;
      cycleSubmission: CycleAssessment | null;
    }
  }
  ```

#### 8. **Create Applicant Project Assessment Submission** (POST)

- **Endpoint:** `/pt-management/create-applicant-project-assessment-submission`
- **Auth:** Required (Applicant)
- **Body:**
  ```typescript
  {
    criteriaId: string;
    cycleSlug: string;
    reviewStatement: string;
    reviewSubmissionFile: DocumentObject;
  }
  ```
- **Response:**
  ```typescript
  {
    status: 201 | 200; // 201 = created, 200 = updated
    message: string;
    res: {
      submission: CycleAssessment;
    }
  }
  ```

#### 9. **Get Cycle Criteria Assessments** (GET)

- **Endpoint:** `/pt-management/get-cycle-criteria-assessments?cycleSlug=xxx&criteriaSlug=xxx&page=1&numberOfResults=10`
- **Auth:** Required (Program Manager only)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      submissions: CycleAssessment[];
      criteria: CycleAssessmentCriteria;
    }
  }
  ```

#### 10. **Invite Reviewer for Project Assessment** (POST)

- **Endpoint:** `/pt-management/invite-reviewer-for-project-assessment`
- **Auth:** Required (Program Manager only)
- **Body:**
  ```typescript
  {
    assessmentId: string;
    email: string;
  }
  ```
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: null;
  }
  ```

---

### **Reviewer Controller Updates** (`/reviewer`)

#### 11. **Get User Project Reviews** (GET)

- **Endpoint:** `/reviewer/get-user-project-reviews?page=1&numberOfResults=10`
- **Auth:** Required (Reviewer)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      reviews: ProjectReview[];
    }
  }
  ```

#### 12. **Get Project Review Details** (GET)

- **Endpoint:** `/reviewer/get-project-review-details?assessmentSlug=xxx`
- **Auth:** Required (Reviewer)
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      review: ProjectReview;
      assessment: CycleAssessment;
      project: Project;
      criteria: CycleAssessmentCriteria;
    }
  }
  ```

#### 13. **Submit Project Assessment Review** (POST)

- **Endpoint:** `/reviewer/submit-project-assessment-review`
- **Auth:** Required (Reviewer)
- **Body:**
  ```typescript
  {
    assessmentId: string;
    recommendation: ProjectReviewRecommendation; // PERFECT | GOOD | NEEDS_IMPROVEMENT | POOR
    reviewAnalysis: string;
  }
  ```
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      submissionId: string;
      reviewId: string;
      status: ReviewStatus;
    }
  }
  ```

#### 14. **Submit Project Assessment Review Invite Status** (POST)

- **Endpoint:** `/reviewer/submit-project-assessment-review-invite-status`
- **Auth:** Public
- **Body:**
  ```typescript
  {
    token: string;
    slug: string;
    assessmentId: string;
    status: 'ACCEPTED' | 'REJECTED';
  }
  ```
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      applicationId: string;
      status: InviteStatus;
      reviewId: string | null;
    }
  }
  ```

---

### **Co-Applicant Controller Updates** (`/co-applicant`)

#### 15. **Get User Projects** (GET)

- **Endpoint:** `/co-applicant/get-user-projects`
- **Auth:** Required
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      applications: GrantApplication[];  // Applications where user is co-applicant and are projects
    }
  }
  ```

#### 16. **Get Project Details** (GET)

- **Endpoint:** `/co-applicant/get-project-details?cycleSlug=xxx&applicationSlug=xxx`
- **Auth:** Required
- **Response:**
  ```typescript
  {
    status: number;
    message: string;
    res: {
      project: Project;
    }
  }
  ```

---

## 📦 New Data Types/Aggregates

### **Project Aggregate**

```typescript
{
  id: string;
  applicationId: string;
  application: GrantApplication;
  allocatedBudget: QuotedBudget;
  plannedDuration: {
    startDate: Date;
    endDate: Date;
  }
  createdAt: Date;
  updatedAt: Date;
}
```

### **CycleAssessmentCriteria Aggregate**

```typescript
{
  id: string;
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **CycleAssessment Aggregate**

```typescript
{
  id: string;
  criteriaId: string;
  criteria: CycleAssessmentCriteria;
  applicationId: string;
  application: GrantApplication;
  reviewStatement: string;
  reviewSubmissionFile: DocumentObject;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **ProjectReview Aggregate**

```typescript
{
  id: string;
  status: ReviewStatus;
  recommendation: ProjectReviewRecommendation | null; // PERFECT | GOOD | NEEDS_IMPROVEMENT | POOR
  reviewAnalysis: string;
  reviewerId: string;
  reviewer: User;
  submissionId: string;
  reviewSubmission: CycleAssessment;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **ProjectReviewRecommendation Enum**

```typescript
enum ProjectReviewRecommendation {
  PERFECT = 'PERFECT',
  GOOD = 'GOOD',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  POOR = 'POOR',
}
```

---

## 🎨 Frontend Integration Tasks

### **1. Program Manager (PM) Dashboard**

#### Pages to Create:

- `/pm/projects/[cycleSlug]` - List all projects in a cycle
- `/pm/projects/[cycleSlug]/[applicationSlug]` - Project details page
- `/pm/project-criteria/[cycleSlug]` - Manage cycle assessment criteria
- `/pm/project-assessments/[cycleSlug]/[criteriaSlug]` - View all submissions for a criteria

#### Features to Implement:

- **Create Project Flow:**
  - Select approved application
  - Set allocated budget (modify from requested budget)
  - Set project start/end dates
  - Call `/pt-management/create-project`

- **Manage Cycle Criteria:**
  - Create new assessment criteria for cycle
  - Upload template files
  - Call `/pt-management/create-cycle-criteria`

- **View Project Assessments:**
  - List all submissions for a criteria
  - View submission details
  - Invite reviewers for specific submissions
  - Call `/pt-management/get-cycle-criteria-assessments`
  - Call `/pt-management/invite-reviewer-for-project-assessment`

### **2. Applicant Dashboard**

#### Pages to Create:

- `/applicant/my-projects` - List user's projects
- `/applicant/my-projects/[cycleSlug]` - View project and available criteria
- `/applicant/my-projects/[cycleSlug]/submit/[criteriaSlug]` - Submit assessment

#### Features to Implement:

- **View My Projects:**
  - Show projects where user is primary or co-applicant
  - Display project status, budget, timeline
  - Call `/pt-management/get-project-details`

- **View Assessment Criteria:**
  - List all criteria for the project's cycle
  - Show which criteria have been submitted
  - Call `/pt-management/get-applicant-project-cycle-review-criteria`

- **Submit Assessment:**
  - Form to enter review statement
  - Upload submission file
  - Download template file if provided
  - Call `/pt-management/create-applicant-project-assessment-submission`

### **3. Co-Applicant Dashboard**

#### Pages to Create:

- `/co-applicant/my-projects` - List projects where user is co-applicant

#### Features to Implement:

- **View My Projects:**
  - Show all projects where user is co-applicant
  - View project details (read-only)
  - Call `/co-applicant/get-user-projects`
  - Call `/co-applicant/get-project-details`

### **4. Reviewer Dashboard**

#### Pages to Create:

- `/reviewer/project-reviews` - List project assessment reviews
- `/reviewer/submit-project-review/[assessmentSlug]` - Submit project review

#### Features to Implement:

- **View Project Reviews:**
  - Separate tab/section for project reviews vs application reviews
  - Show assigned project assessments
  - Filter by status (pending, completed)
  - Call `/reviewer/get-user-project-reviews`

- **Submit Project Review:**
  - Display project details
  - Display criteria details
  - Display applicant's submission
  - Download submission file
  - Form to submit review:
    - Recommendation (PERFECT/GOOD/NEEDS_IMPROVEMENT/POOR)
    - Review analysis (text)
  - Call `/reviewer/get-project-review-details`
  - Call `/reviewer/submit-project-assessment-review`

- **Accept/Reject Project Review Invite:**
  - Email link flow for project assessment reviews
  - Call `/reviewer/submit-project-assessment-review-invite-status`

---

## 🔧 Services to Create

### **1. Project Management Service**

```typescript
// src/services/project-management.service.ts

class ProjectManagementService {
  // PM endpoints
  createProject(data: CreateProjectDTO): Promise<ApiResponse<CreateProjectData>>;
  getCycleProjects(params: GetCycleProjectsDTO): Promise<ApiResponse<GetCycleProjects>>;
  getProjectDetails(params: GetProjectDetailsDTO): Promise<ApiResponse<GetProjectDetails>>;
  createCycleCriteria(data: CreateCycleCriteriaDTO): Promise<ApiResponse<CreateCriteriaDetails>>;
  getCycleCriterias(params: GetCycleCriteriasDTO): Promise<ApiResponse<CycleCriteriasDetails>>;
  getCycleCriteriaAssessments(
    params: GetCycleCriteriaAssessmentsDTO
  ): Promise<ApiResponse<AssessmentsData>>;
  inviteReviewerForAssessment(data: InviteReviewerDTO): Promise<ApiResponse<null>>;

  // Applicant endpoints
  getApplicantCycleCriterias(
    params: GetCycleCriteriasDTO
  ): Promise<ApiResponse<CycleCriteriasDetails>>;
  getApplicantAssessmentSubmission(
    params: GetSubmissionDTO
  ): Promise<ApiResponse<AssessmentSubmission>>;
  createAssessmentSubmission(data: SubmitAssessmentDTO): Promise<ApiResponse<SubmissionData>>;
}
```

### **2. Update Reviewer Service**

```typescript
// Add to existing src/services/reviewer.service.ts

class ReviewerService {
  // ... existing methods

  // New project review methods
  getUserProjectReviews(params: GetUserReviewsDTO): Promise<ApiResponse<ProjectReviewsData>>;
  getProjectReviewDetails(assessmentSlug: string): Promise<ApiResponse<ProjectReviewDetails>>;
  submitProjectReview(data: ProjectReviewSubmissionDTO): Promise<ApiResponse<SubmitReviewData>>;
  updateProjectReviewInviteStatus(
    data: UpdateInviteStatusDTO
  ): Promise<ApiResponse<InviteStatusData>>;
}
```

### **3. Update Co-Applicant Service**

```typescript
// Add to existing src/services/co-applicant.service.ts

class CoApplicantService {
  // ... existing methods

  // New project methods
  getUserProjects(): Promise<ApiResponse<UserProjectsData>>;
  getProjectDetails(params: GetProjectDetailsDTO): Promise<ApiResponse<ProjectDetailsData>>;
}
```

---

## 📝 Types to Create

```typescript
// src/types/project-management.types.ts

export interface Project {
  id: string;
  applicationId: string;
  application: GrantApplication;
  allocatedBudget: QuotedBudget;
  plannedDuration: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleAssessmentCriteria {
  id: string;
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleAssessment {
  id: string;
  criteriaId: string;
  criteria: CycleAssessmentCriteria;
  applicationId: string;
  application: GrantApplication;
  reviewStatement: string;
  reviewSubmissionFile: DocumentObject;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectReview {
  id: string;
  status: ReviewStatus;
  recommendation: ProjectReviewRecommendation | null;
  reviewAnalysis: string;
  reviewerId: string;
  reviewer: User;
  submissionId: string;
  reviewSubmission: CycleAssessment;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectReviewRecommendation {
  PERFECT = 'PERFECT',
  GOOD = 'GOOD',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  POOR = 'POOR',
}

// DTOs
export interface CreateProjectDTO {
  applicationId: string;
  allocatedBudget: QuotedBudget;
  plannedDuration: {
    startDate: Date;
    endDate: Date;
  };
}

export interface CreateCycleCriteriaDTO {
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
}

export interface SubmitAssessmentDTO {
  criteriaId: string;
  cycleSlug: string;
  reviewStatement: string;
  reviewSubmissionFile: DocumentObject;
}

export interface ProjectReviewSubmissionDTO {
  assessmentId: string;
  recommendation: ProjectReviewRecommendation;
  reviewAnalysis: string;
}
```

---

## 🗂️ Zustand Stores to Create/Update

### **1. Project Management Store**

```typescript
// src/store/project-management.store.ts

interface ProjectManagementState {
  // Projects
  projects: GrantApplication[];
  currentProject: Project | null;

  // Criteria
  cycleCriterias: CycleAssessmentCriteria[];
  currentCriteria: CycleAssessmentCriteria | null;

  // Assessments
  assessments: CycleAssessment[];
  currentAssessment: CycleAssessment | null;

  // Loading states
  isLoadingProjects: boolean;
  isLoadingCriteria: boolean;
  isLoadingAssessments: boolean;

  // Actions
  setProjects: (projects: GrantApplication[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setCycleCriterias: (criterias: CycleAssessmentCriteria[]) => void;
  setAssessments: (assessments: CycleAssessment[]) => void;
  // ... etc
}
```

### **2. Update Reviewer Store**

```typescript
// Add to src/store/reviewer.store.ts

interface ReviewerState {
  // ... existing state

  // New project review state
  projectReviews: ProjectReview[];
  currentProjectReview: ProjectReview | null;
  currentAssessment: CycleAssessment | null;
  currentProjectReviewProject: Project | null;
  currentProjectReviewCriteria: CycleAssessmentCriteria | null;

  // Actions
  setProjectReviews: (reviews: ProjectReview[]) => void;
  setCurrentProjectReviewDetails: (data: {
    review: ProjectReview;
    assessment: CycleAssessment;
    project: Project;
    criteria: CycleAssessmentCriteria;
  }) => void;
}
```

---

## 🎯 Priority Order for Implementation

### **Phase 1: Core PM Functionality**

1. Create types and interfaces
2. Create project-management service
3. Create project-management store
4. PM: Create project flow
5. PM: View cycle projects page

### **Phase 2: Assessment Criteria**

6. PM: Create/manage cycle criteria page
7. Applicant: View available criteria
8. Applicant: Submit assessment

### **Phase 3: Review Submissions**

9. PM: View criteria submissions
10. PM: Invite reviewers for assessments
11. Reviewer: View project reviews list
12. Reviewer: Submit project review

### **Phase 4: Co-Applicant Access**

13. Co-applicant: View my projects
14. Co-applicant: View project details

---

## 🔗 Navigation Updates Needed

### **Program Manager Sidebar**

- Add "Projects" section
- Add "Project Assessments" section

### **Applicant Sidebar**

- Add "My Projects" link

### **Co-Applicant Sidebar**

- Add "My Projects" link

### **Reviewer Sidebar**

- Add tabs/filters to distinguish:
  - Application Reviews
  - Project Assessment Reviews

---

## ✅ Testing Checklist

- [ ] PM can create projects from approved applications
- [ ] PM can view all projects in a cycle
- [ ] PM can create assessment criteria for a cycle
- [ ] Applicants can view their projects
- [ ] Applicants can see available criteria for their projects
- [ ] Applicants can submit assessments with files
- [ ] PM can view all submissions for a criteria
- [ ] PM can invite reviewers for specific submissions
- [ ] Reviewers receive email invites for project assessments
- [ ] Reviewers can accept/reject invites
- [ ] Reviewers can view project assessment details
- [ ] Reviewers can submit reviews with recommendations
- [ ] Co-applicants can view projects they're part of

---

## 📚 Additional Notes

- **Email Templates:** New email templates exist for project assessment reviewer invites
- **Status Tracking:** Project reviews use same `ReviewStatus` enum as application reviews
- **Authorization:** Most endpoints check role-based permissions
- **Pagination:** Many list endpoints support pagination
- **File Uploads:** Use existing Cloudinary infrastructure for assessment files
- **Slug-based Routing:** Most resources use slugs for URLs (cycle, criteria, assessment)

---

## 🚀 Next Steps

1. Review this document with the team
2. Prioritize which features to implement first
3. Create detailed UI/UX mockups for new pages
4. Implement Phase 1 features
5. Test thoroughly
6. Roll out incrementally
