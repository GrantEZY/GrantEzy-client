# Testing Guide - Project Management UI

## Quick Start

```bash
cd /home/shyam/GrantEzy/GrantEzy-client
npm run dev
```

---

## Test Workflows

### 1. PM (Program Manager) Workflow

**URL:** `/pm/cycles/[cycleSlug]`

**Steps:**

1. Navigate to a cycle
2. Go to "Criteria" tab
3. Create a new assessment criteria (if needed)
4. Click "View Submissions" button on any criteria card
5. **Expected:** Modal opens showing all assessment submissions
6. **Verify:**
   - Submissions load correctly
   - Applicant information displays
   - Status badges show (Submitted/Pending)
   - Document links work
   - Pagination works (if >10 submissions)

---

### 2. Applicant Workflow

**URL:** `/applicant/projects/[slug]`

**Steps:**

1. Navigate to a project details page
2. Click "Project Assessments" button in header
3. **Expected:** Assessment tracking page opens
4. **Verify:**
   - Progress tracker shows X/Y completed with percentage
   - All criteria cards display
   - Status badges correct (Submitted/Pending)
   - Click on a criteria card
5. **Expected:** Modal form opens
6. **Verify:**
   - Criteria details display (name, brief, template link)
   - Form has review statement textarea
   - File upload works (drag/drop or click)
   - Cloudinary upload shows progress
   - Can remove uploaded file
   - Submit button disabled until valid
7. Submit assessment
8. **Expected:** Success, modal closes, list refreshes

---

### 3. Reviewer Workflow

#### 3A. Accept Invitation

**URL:** `/reviewer/project-review-invite?token=...&slug=...&assessmentId=...`

**Steps:**

1. Click invitation link from email
2. **Verify:**
   - Project and criteria details display
   - Accept/Decline buttons present
3. Click "Accept"
4. **Expected:** Redirect to project reviews list

#### 3B. View Assigned Reviews

**URL:** `/reviewer/project-reviews`

**Steps:**

1. Navigate to project reviews page
2. **Verify:**
   - Statistics cards show (Total, Pending, Completed)
   - Table lists all assigned reviews
   - Status and recommendation badges display
   - Pagination works
3. Click on a review row
4. **Expected:** Navigate to details page

#### 3C. Submit Review

**URL:** `/reviewer/project-reviews/[slug]`

**Steps:**

1. On review details page
2. **Verify:**
   - Assessment details display
   - Applicant's submission shows (statement + file)
   - Four recommendation options display:
     - PERFECT
     - CAN_SPEED_UP
     - NO_IMPROVEMENT
     - NEED_SERIOUS_ACTION
   - Review analysis textarea present
3. Select recommendation
4. Enter analysis (minimum 50 characters)
5. Submit review
6. **Expected:** Success message, redirect to list

---

## Common Issues & Solutions

### Issue: Import error for CriteriaSubmissionsView

**Solution:** Restart VS Code or TypeScript server

```
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: 404 on API calls

**Solution:** Ensure backend is running on correct port

```bash
cd /home/shyam/GrantEzy/GrantEzy-server
npm run start:dev
```

### Issue: Authentication errors

**Solution:** Ensure you're logged in with correct role

- PM pages require PM role
- Applicant pages require Applicant role
- Reviewer pages require Reviewer role

### Issue: Empty data/no records

**Solution:** Create test data via backend or other UI flows

- Projects need existing applications
- Assessments need projects with cycle criteria
- Reviews need assessment invitations

---

## API Endpoints Being Called

### PM

- `GET /project-management/assessment-submissions?cycleSlug=X&criteriaSlug=Y`

### Applicant

- `GET /project-management/applicant/criterias/:cycleSlug`
- `GET /project-management/applicant/submission/:cycleSlug/:criteriaSlug`
- `POST /project-management/applicant/submit`

### Reviewer

- `GET /reviewer/project-reviews`
- `GET /reviewer/project-reviews/:assessmentSlug`
- `POST /reviewer/project-review`
- `POST /reviewer/project-review-invite/status`

---

## Browser Console Checks

Open DevTools (F12) and check:

1. **Network Tab:**
   - All API calls return 200 or expected status
   - No 404s or 500s
   - Response data matches UI display

2. **Console Tab:**
   - No React errors
   - No TypeScript errors
   - No "undefined" warnings

3. **React DevTools:**
   - Component state updates correctly
   - Props passed correctly
   - No unnecessary re-renders

---

## Checklist

### PM

- [ ] Can view cycle criteria
- [ ] "View Submissions" button works
- [ ] Modal opens and closes correctly
- [ ] Submissions load and display
- [ ] Empty state shows when no submissions

### Applicant

- [ ] "Project Assessments" button visible
- [ ] Assessments page loads
- [ ] Progress tracker calculates correctly
- [ ] Can select criteria
- [ ] Form modal opens
- [ ] Can upload file
- [ ] Can submit assessment
- [ ] Form validates required fields
- [ ] Success updates list

### Reviewer

- [ ] Can access invite link
- [ ] Can accept/decline invitation
- [ ] Reviews list loads
- [ ] Statistics calculate correctly
- [ ] Pagination works
- [ ] Can view review details
- [ ] Applicant submission displays
- [ ] Can select recommendation
- [ ] Can submit review
- [ ] Form validation works

---

## Performance Checks

- [ ] Pages load in <2 seconds
- [ ] File uploads complete successfully
- [ ] No memory leaks (check DevTools Performance)
- [ ] Smooth UI interactions (no lag)
- [ ] Proper loading states during API calls

---

## Accessibility Checks

- [ ] All buttons have hover states
- [ ] Forms have labels
- [ ] Error messages are clear
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient

---

## Mobile Responsiveness

Test on mobile viewport:

- [ ] Tables scroll horizontally if needed
- [ ] Modals fit on screen
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Text is readable
- [ ] Forms are usable

---

**If all checks pass:** ✅ UI Integration is working correctly!
**If issues found:** Check browser console and network tab for specific errors.
