# EXACT FIXES FOR UI INTEGRATION ERRORS

## File 1: `/src/components/applicant/AssessmentSubmissionForm.tsx`

### Change 1: Import statements (lines 3-6)
```typescript
// REPLACE:
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { CycleCriteria } from '@/types/project-management.types';

// WITH:
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { CycleAssessmentCriteria } from '@/types/project-management.types';
```

### Change 2: Interface definition (line 10)
```typescript
// REPLACE:
  criteria: CycleCriteria;

// WITH:
  criteria: CycleAssessmentCriteria;
```

### Change 3: Hook usage (lines 28-29)
```typescript
// REPLACE:
  const { submitAssessment, isAssessmentLoading } = useProjectManagement();
  const { uploadFile, uploading, uploadError, resetUpload } = useCloudinaryUpload();

// WITH:
  const { createApplicantAssessmentSubmission, isLoading } = useProjectAssessment();
  const { uploadFile, uploading } = useCloudinaryUpload();
  const [uploadError, setUploadError] = useState<string | null>(null);
```

### Change 4: Remove resetUpload from cleanup (lines 42-46)
```typescript
// REMOVE THIS useEffect:
  useEffect(() => {
    return () => {
      resetUpload();
    };
  }, []);

// It's not needed since resetUpload doesn't exist
```

### Change 5: Update file upload error handling (lines 61-69)
```typescript
// REPLACE:
    try {
      const result = await uploadFile(file);
      if (result) {
        setUploadedFile({
          name: file.name,
          url: result.url,
          publicId: result.public_id,
        });
        setErrors({ ...errors, file: '' });
      }
    } catch (error) {
      setErrors({ ...errors, file: 'Failed to upload file. Please try again.' });
    }

// WITH:
    setUploadError(null);
    const result = await uploadFile(file);
    if (result) {
      setUploadedFile({
        name: file.name,
        url: result.url,
        publicId: result.public_id,
      });
      setErrors({ ...errors, file: '' });
    } else {
      setUploadError('Failed to upload file');
      setErrors({ ...errors, file: 'Failed to upload file. Please try again.' });
    }
```

### Change 6: Update submit function (lines 89-102)
```typescript
// REPLACE:
    const response = await submitAssessment({
      criteriaId,
      cycleSlug,
      reviewStatement,
      reviewSubmissionFile: uploadedFile || undefined,
    });

    setIsSubmitting(false);

    if (response) {
      onSuccess?.();
    }

// WITH:
    const response = await createApplicantAssessmentSubmission({
      criteriaId,
      cycleSlug,
      reviewStatement,
      reviewSubmissionFile: uploadedFile || undefined,
    });

    setIsSubmitting(false);

    if (response.success) {
      onSuccess?.();
    } else {
      setErrors({ submit: response.error || 'Failed to submit assessment' });
    }
```

### Change 7: Update button disabled state (find around line 240)
```typescript
// REPLACE:
disabled={isAssessmentLoading || uploading || isSubmitting}

// WITH:
disabled={isLoading || uploading || isSubmitting}
```

---

## File 2: `/src/app/applicant/projects/[slug]/assessments/page.tsx`

### Change 1: Import statement (line 4)
```typescript
// REPLACE:
import { useProjectManagement } from '@/hooks/useProjectManagement';

// WITH:
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
```

### Change 2: Hook usage (lines ~26-32)
```typescript
// REPLACE:
  const {
    applicantCriterias,
    applicantSubmission,
    isApplicantCriteriasLoading,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
  } = useProjectManagement();

// WITH:
  const {
    applicantCriterias,
    applicantCurrentSubmission,
    isLoadingApplicantCriterias,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
  } = useProjectAssessment();
```

### Change 3: Loading state check (find where used)
```typescript
// REPLACE:
if (isApplicantCriteriasLoading) {

// WITH:
if (isLoadingApplicantCriterias) {
```

### Change 4: Add type annotations to map functions
```typescript
// Find all .map() calls and add type: (criteria: any)
// Example:
{applicantCriterias.map((criteria: any) => (
  // ...
))}
```

---

## File 3: `/src/components/pm/CycleCriteriaManagement.tsx`

This file has an issue with `criteria.slug` not existing. Need to check what properties ProjectCriteria actually has.

### Solution: Read the types first
```bash
# Check ProjectCriteria type definition
grep -A 20 "export.*ProjectCriteria" src/types/project-management.types.ts
```

If slug doesn't exist, use `criteria.id` instead:
```typescript
// REPLACE:
onClick={() => setSelectedCriteria({ slug: criteria.slug, name: criteria.name })}

// WITH:
onClick={() => setSelectedCriteria({ slug: criteria.id, name: criteria.name })}
```

---

## File 4: `/src/app/reviewer/project-reviews/page.tsx`

### Change: Pagination property names
```typescript
// REPLACE ALL instances of:
projectReviewsPagination.currentPage

// WITH:
projectReviewsPagination.page
```

This appears in multiple places:
- Page display: `Page {projectReviewsPagination.page}`
- Previous button href: `?page=${projectReviewsPagination.page - 1}`
- Next button href: `?page=${projectReviewsPagination.page + 1}`
- Disabled conditions

---

## File 5: `/src/app/reviewer/project-reviews/[slug]/page.tsx`

### Change 1: Hook destructuring
```typescript
// REPLACE:
  const {
    isLoadingCurrentAssessment,
    currentAssessmentError,
    getProjectReviewDetails,
    clearCurrentAssessment,
  } = useReviewer();

// WITH:
  const {
    currentAssessment,
    isLoadingProjectReviews,
    projectReviewsError,
    getProjectReviewDetails,
  } = useReviewer();
```

### Change 2: Remove cleanup with clearCurrentAssessment
```typescript
// REMOVE this useEffect:
  useEffect(() => {
    return () => {
      clearCurrentAssessment();
    };
  }, []);
```

### Change 3: Update loading check
```typescript
// REPLACE:
if (isLoadingCurrentAssessment) {

// WITH:
if (isLoadingProjectReviews) {
```

### Change 4: Update error check
```typescript
// REPLACE:
if (currentAssessmentError || !currentAssessment) {

// WITH:
if (projectReviewsError || !currentAssessment) {
```

---

## File 6: `/src/app/reviewer/project-review-invite/page.tsx`

### Change: Add type assertion for status
```typescript
// REPLACE:
  const handleResponse = async (status: InviteStatus) => {

// WITH:
  const handleResponse = async (status: InviteStatus.ACCEPTED | InviteStatus.REJECTED) => {
```

OR if that doesn't work, add assertion at call site:
```typescript
// In submitProjectAssessmentReviewInviteStatus call:
status: status as InviteStatus.ACCEPTED | InviteStatus.REJECTED,
```

---

## VERIFICATION COMMAND

After making all changes, run:
```bash
cd /home/shyam/GrantEzy/GrantEzy-client
npx tsc --noEmit
```

Should show 0 errors.

---

## IMPLEMENTATION ORDER

1. Fix CriteriaSubmissionsView.tsx ✅ (DONE - recreated)
2. Fix AssessmentSubmissionForm.tsx
3. Fix applicant assessments page
4. Fix CycleCriteriaManagement.tsx (check ProjectCriteria type first)
5. Fix reviewer pages (pagination & hook properties)
6. Run TypeScript check
7. Test each workflow
