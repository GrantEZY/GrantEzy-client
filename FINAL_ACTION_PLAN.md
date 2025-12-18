# UI Integration - Final Status and Action Items

## ✅ COMPLETED WORK

### Components Created (7 files):
1. `/src/components/pm/CriteriaSubmissionsView.tsx` - ✅ RECREATED CORRECTLY
2. `/src/components/applicant/AssessmentSubmissionForm.tsx` - ⚠️ NEEDS FIXES
3. `/src/app/applicant/projects/[slug]/assessments/page.tsx` - ⚠️ NEEDS FIXES
4. `/src/components/reviewer/ProjectReviewSubmissionForm.tsx` - ✅ NO ERRORS
5. `/src/app/reviewer/project-reviews/page.tsx` - ⚠️ NEEDS FIX (pagination)
6. `/src/app/reviewer/project-reviews/[slug]/page.tsx` - ⚠️ NEEDS FIXES (hook properties)
7. `/src/app/reviewer/project-review-invite/page.tsx` - ⚠️ NEEDS FIX (type assertion)

### Pages Enhanced (3 files):
1. `/src/app/applicant/projects/[slug]/page.tsx` - ✅ NO ERRORS
2. `/src/app/reviewer/page.tsx` - ✅ NO ERRORS  
3. `/src/components/pm/CycleCriteriaManagement.tsx` - ⚠️ NEEDS FIX (criteria.slug)

---

## 🔧 CONFIRMED TYPE & HOOK INFORMATION

### ProjectCriteria Type (from project.types.ts):
```typescript
export interface ProjectCriteria {
  id: string;          // ✅ HAS THIS
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
  createdAt: string;
  updatedAt: string;
  // ❌ NO 'slug' property
}
```

### PaginationMeta Type (from reviewer.types.ts & project.types.ts):
```typescript
export interface PaginationMeta {
  page: number;              // ✅ Use THIS (not currentPage)
  numberOfResults: number;
  totalResults: number;
  totalPages: number;
}
```

### useProjectAssessment Hook exports:
```typescript
// Method name is: createApplicantAssessmentSubmission
// NOT: submitAssessment
```

---

## 📋 EXACT FIXES REQUIRED

### Priority 1: CycleCriteriaManagement.tsx

**Line ~320-330 (in the View Submissions button click handler):**
```typescript
// FIND:
onClick={() => setSelectedCriteria({ slug: criteria.slug, name: criteria.name })}

// REPLACE WITH:
onClick={() => setSelectedCriteria({ slug: criteria.id, name: criteria.name })}
```

**Explanation:** ProjectCriteria doesn't have `slug`, only `id`. Use `id` instead.

---

### Priority 2: Reviewer Project Reviews Page (pagination)

**File:** `/src/app/reviewer/project-reviews/page.tsx`

**Find ALL instances (5 places) and replace:**
```typescript
// FIND:
projectReviewsPagination.currentPage

// REPLACE WITH:
projectReviewsPagination.page
```

**Locations:**
1. Page display: Line ~150
2. Previous button condition: Line ~220
3. Previous button href: Line ~225
4. Next button condition: Line ~235
5. Next button href: Line ~240

---

### Priority 3: AssessmentSubmissionForm.tsx

This file needs multiple changes. **EASIEST APPROACH: Recreate the file** using the template below.

**Key Changes:**
- Import `useProjectAssessment` (not useProjectManagement)
- Import `CycleAssessmentCriteria` (not CycleCriteria)
- Use `createApplicantAssessmentSubmission` method
- Handle upload errors locally (Cloudinary hook doesn't expose uploadError/resetUpload)
- Use correct loading state variables

**OR** manually apply changes from `EXACT_FIXES_NEEDED.md` (7 changes).

---

### Priority 4: Applicant Assessments Page

**File:** `/src/app/applicant/projects/[slug]/assessments/page.tsx`

**Change 1 - Import (line 4):**
```typescript
// FIND:
import { useProjectManagement } from '@/hooks/useProjectManagement';

// REPLACE WITH:
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
```

**Change 2 - Hook destructuring (find around line 26-32):**
```typescript
// FIND:
  const {
    applicantCriterias,
    applicantSubmission,
    isApplicantCriteriasLoading,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
  } = useProjectManagement();

// REPLACE WITH:
  const {
    applicantCriterias,
    applicantCurrentSubmission,
    isLoadingApplicantCriterias,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
  } = useProjectAssessment();
```

**Change 3 - Loading state check (find where used):**
```typescript
// FIND:
if (isApplicantCriteriasLoading) {

// REPLACE WITH:
if (isLoadingApplicantCriterias) {
```

**Change 4 - Add type annotations:**
```typescript
// Find all .map() calls on applicantCriterias array
// Add type annotation: (criteria: any) =>

// Example:
{applicantCriterias.map((criteria: any) => (
  <div key={criteria.id}>
    ...
  </div>
))}
```

---

### Priority 5: Reviewer Project Review Details Page

**File:** `/src/app/reviewer/project-reviews/[slug]/page.tsx`

**Change 1 - Hook destructuring:**
```typescript
// FIND:
  const {
    isLoadingCurrentAssessment,
    currentAssessmentError,
    getProjectReviewDetails,
    clearCurrentAssessment,
  } = useReviewer();

// REPLACE WITH:
  const {
    currentAssessment,
    isLoadingProjectReviews,
    projectReviewsError,
    getProjectReviewDetails,
  } = useReviewer();
```

**Change 2 - Remove cleanup effect:**
```typescript
// REMOVE this entire useEffect:
  useEffect(() => {
    return () => {
      clearCurrentAssessment();
    };
  }, []);
```

**Change 3 - Update loading check:**
```typescript
// FIND:
if (isLoadingCurrentAssessment) {

// REPLACE WITH:
if (isLoadingProjectReviews) {
```

**Change 4 - Update error check:**
```typescript
// FIND:
if (currentAssessmentError || !currentAssessment) {

// REPLACE WITH:
if (projectReviewsError || !currentAssessment) {
```

---

### Priority 6: Project Review Invite Page

**File:** `/src/app/reviewer/project-review-invite/page.tsx`

**Change - Function signature:**
```typescript
// FIND:
  const handleResponse = async (status: InviteStatus) => {

// REPLACE WITH:
  const handleResponse = async (status: InviteStatus.ACCEPTED | InviteStatus.REJECTED) => {
```

---

## 🚀 IMPLEMENTATION STEPS

1. **Fix CycleCriteriaManagement.tsx**
   - Single find/replace: `criteria.slug` → `criteria.id`

2. **Fix Reviewer Project Reviews Page**
   - Five find/replace: `currentPage` → `page`

3. **Fix Applicant Assessments Page**
   - 4 changes (import, hook, loading state, type annotations)

4. **Fix Reviewer Project Review Details Page**
   - 4 changes (hook destructuring, remove cleanup, update checks)

5. **Fix Project Review Invite Page**
   - 1 change (function signature)

6. **Fix or Recreate AssessmentSubmissionForm.tsx**
   - Option A: Apply 7 manual changes from EXACT_FIXES_NEEDED.md
   - Option B: Recreate file from scratch (cleaner)

7. **Verify TypeScript Compilation**
   ```bash
   cd /home/shyam/GrantEzy/GrantEzy-client
   npx tsc --noEmit
   ```

8. **Test Each Workflow**
   - PM: View criteria submissions
   - Applicant: Submit assessments
   - Reviewer: Accept invites, submit reviews

---

## 📊 ERROR SUMMARY

**Before Fixes:**
- 8 files with TypeScript errors
- ~25+ individual type/property errors

**After CriteriaSubmissionsView Recreation:**
- 7 files remaining with errors
- ~20 individual errors remaining

**After All Fixes:**
- 0 TypeScript errors expected
- All workflows functional

---

## ⏱️ ESTIMATED TIME

- **Manual fixes:** 15-20 minutes (careful find/replace)
- **Testing:** 10-15 minutes
- **Total:** ~30-35 minutes

---

## 🎯 SUCCESS CRITERIA

✅ `npx tsc --noEmit` shows 0 errors  
✅ All pages load without console errors  
✅ PM can view criteria submissions  
✅ Applicants can view and submit assessments  
✅ Reviewers can accept invites and submit reviews  
✅ Navigation between pages works correctly  
✅ Data flows correctly from backend APIs  

---

## 📚 REFERENCE DOCUMENTS

1. `UI_INTEGRATION_STATUS.md` - Complete overview
2. `EXACT_FIXES_NEEDED.md` - Detailed change instructions
3. This file - Quick reference and action plan

---

**Status:** Ready for fixes
**Next Action:** Apply changes from Priority 1-6
**Blocker:** None - all information confirmed
