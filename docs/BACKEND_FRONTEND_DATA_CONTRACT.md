# Backend-Frontend Data Contract

This document defines the data structures and field names that MUST be used consistently between backend and frontend to avoid integration issues.

## Project Entity Structure

### Backend (Database/API Response)
```typescript
interface Project {
  id: string;
  slug: string;
  applicationId: string;
  status: ProjectStatus; // ACTIVE, COMPLETED, ON_HOLD, CANCELLED
  allotedBudget: QuotedBudget; // ⚠️ Note: "alloted" not "allocated"
  duration: Duration; // ⚠️ Note: "duration" not "plannedDuration"
  progress: any | null;
  metrics: ProjectMetrics | null;
  mentorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  application?: GrantApplication; // Relation loaded when needed
  mentor?: User; // Relation loaded when needed
}
```

### Frontend (TypeScript Types)
```typescript
// src/types/project.types.ts
export interface Project {
  id: string;
  slug: string;
  applicationId: string;
  status: ProjectStatus | string;
  allotedBudget: QuotedBudget; // ✅ Matches backend
  duration: ProjectDuration; // ✅ Matches backend
  progress?: any;
  metrics?: any;
  mentorId?: string | null;
  createdAt: string;
  updatedAt: string;
  application?: Application;
  mentor?: any;
}
```

## Budget Structure

### Backend (MoneyDTO and QuotedBudgetDTO)
```typescript
interface Money {
  amount: number; // ✅ ONLY field for money value
  currency: string; // e.g., "INR", "USD"
}

interface BudgetComponent {
  BudgetReason: string;
  Budget: Money; // ⚠️ Capital "B" in Budget
}

interface QuotedBudget {
  ManPower: BudgetComponent[]; // ⚠️ Capital "M" and "P"
  Equipment: BudgetComponent[];
  OtherCosts: BudgetComponent[];
  Consumables: BudgetComponent; // Single item, not array
  Travel: BudgetComponent;
  Contigency: BudgetComponent; // ⚠️ Note spelling
  Overhead: BudgetComponent;
}
```

### ❌ INCORRECT Frontend Usage
```typescript
// DON'T DO THIS - These fields don't exist!
item.Budget?.totalAmount // ❌ Wrong - use Budget.amount
item.Budget?.quantity // ❌ Doesn't exist
item.Budget?.rate // ❌ Doesn't exist
```

### ✅ CORRECT Frontend Usage
```typescript
// Display budget items
budget.ManPower.map(item => ({
  reason: item.BudgetReason,
  amount: item.Budget.amount, // ✅ Correct
  currency: item.Budget.currency
}))

// Calculate totals
const total = budget.ManPower.reduce((sum, item) => 
  sum + (item.Budget?.amount || 0), 0
);
```

## Duration/Timeline Structure

### Backend
```typescript
interface Duration {
  startDate: Date;
  endDate: Date | null; // Can be null for ongoing projects
}
```

### Frontend Usage
```typescript
// ✅ Correct
project.duration.startDate
project.duration.endDate

// ❌ Wrong - Old field name
project.plannedDuration // Don't use this!
```

## API Request vs Response Field Names

### Create Project Request (INPUT)
```typescript
// Frontend sends TO backend
interface CreateProjectRequest {
  applicationId: string;
  allocatedBudget: QuotedBudget; // ⚠️ Input uses "allocated"
  plannedDuration: ProjectDuration; // ⚠️ Input uses "plannedDuration"
}
```

### Project Response (OUTPUT)
```typescript
// Backend sends TO frontend
interface Project {
  allotedBudget: QuotedBudget; // ⚠️ Stored as "alloted"
  duration: Duration; // ⚠️ Stored as "duration"
}
```

**Important:** The backend accepts `allocatedBudget` and `plannedDuration` in the CREATE request, but stores and returns them as `allotedBudget` and `duration`.

## Application vs Project Data Access

### PM/Reviewer Endpoints
- Return `Project[]` entities directly
- Access budget: `project.allotedBudget`
- Access duration: `project.duration`
- Access status: `project.status`

### Applicant/Co-Applicant Endpoints
- Return `GrantApplication[]` with `project` relation
- Access budget: `application.project?.allotedBudget` OR `application.basicInfo?.budget`
- Access duration: `application.project?.duration`
- Access status: `application.project?.status` OR `application.status`

## Response Structure Patterns

### PM Get Cycle Projects
```typescript
{
  status: 200,
  message: "Cycle Projects",
  res: {
    projects: Project[], // ✅ Array of Project entities
    pagination: { ... }
  }
}
```

### Applicant Get Projects
```typescript
{
  status: 200,
  message: "User Projects",
  res: {
    applications: GrantApplication[], // ✅ Array of Applications (with project relation)
    pagination: { ... }
  }
}
```

## Common Mistakes to Avoid

### ❌ Field Name Mistakes
1. Using `allocatedBudget` instead of `allotedBudget` (in responses)
2. Using `plannedDuration` instead of `duration` (in responses)
3. Using `Budget.totalAmount` instead of `Budget.amount`
4. Using non-existent `Budget.quantity` or `Budget.rate`

### ❌ Data Access Mistakes
1. Accessing `project.allocatedBudget` when it should be `project.allotedBudget`
2. Accessing `application.allotedBudget` when it should be `application.project?.allotedBudget`
3. Not checking if relation is loaded before accessing nested data
4. Using wrong response array (`projects` vs `applications`)

### ✅ Best Practices
1. Always use TypeScript types from `src/types/project.types.ts`
2. Check backend DTOs in `GrantEzy-server/src/infrastructure/driving/dtos/` before implementing
3. Use optional chaining for nested relations: `application.project?.allotedBudget`
4. Provide fallbacks for missing data: `project.project?.status || project.status`
5. Ensure backend loads required relations in repository queries

## Backend Relations Loading

### Critical: Always Load Required Relations
```typescript
// ✅ Correct - Loads project relation
async getUserCreatedProjects(userId, page, numberOfResults) {
  return await find({
    where: { status: APPROVED, applicantId: userId },
    relations: ["project", "cycle"], // ✅ Essential!
    skip: (page - 1) * numberOfResults,
    take: numberOfResults,
  });
}

// ❌ Wrong - Missing relations
async getUserCreatedProjects(userId, page, numberOfResults) {
  return await find({
    where: { status: APPROVED, applicantId: userId },
    // Missing relations! Frontend will get undefined values
    skip: (page - 1) * numberOfResults,
    take: numberOfResults,
  });
}
```

## Testing Checklist

Before deploying changes involving projects or budgets:

- [ ] Verify field names match backend DTOs
- [ ] Check if using `allotedBudget` not `allocatedBudget` (in responses)
- [ ] Check if using `duration` not `plannedDuration` (in responses)
- [ ] Confirm using `Budget.amount` not `Budget.totalAmount`
- [ ] Remove references to non-existent `Budget.quantity` and `Budget.rate`
- [ ] Verify backend loads required relations (`project`, `cycle`, `application`)
- [ ] Test both PM and Applicant views
- [ ] Verify correct response array usage (`projects` vs `applications`)
- [ ] Check null/undefined handling with optional chaining

## Quick Reference

| Context | Endpoint Returns | Budget Access | Duration Access | Status Access |
|---------|-----------------|---------------|-----------------|---------------|
| PM Cycle Projects | `Project[]` | `project.allotedBudget` | `project.duration` | `project.status` |
| PM Project Details | `Project` | `project.allotedBudget` | `project.duration` | `project.status` |
| Applicant Projects | `Application[]` | `app.project?.allotedBudget` | `app.project?.duration` | `app.project?.status` |
| Applicant Project Details | `Project` | `project.allotedBudget` | `project.duration` | `project.status` |
| Co-Applicant Projects | `Application[]` | `app.project?.allotedBudget` | `app.project?.duration` | `app.project?.status` |

---

**Last Updated:** December 18, 2025  
**Maintainer:** Development Team  
**Related Files:**
- Frontend Types: `GrantEzy-client/src/types/project.types.ts`
- Backend DTOs: `GrantEzy-server/src/infrastructure/driving/dtos/project.management.dto.ts`
- Backend Entity: `GrantEzy-server/src/core/domain/entities/project.entity.ts`
