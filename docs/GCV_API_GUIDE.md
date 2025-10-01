# GCV (Grant Committee View) API Integration

This document provides a comprehensive guide for using the GCV APIs in the frontend.

## 📁 Files Created

1. **`src/types/gcv.types.ts`** - All TypeScript types and interfaces
2. **`src/services/gcv.service.ts`** - API service layer
3. **`src/store/gcv.store.ts`** - Zustand state management
4. **`src/hooks/useGcv.ts`** - Custom React hook
5. **`src/lib/config/api.config.ts`** - Updated with GCV endpoints

## 🎯 Features Implemented

### GCV Member Management
- ✅ Get all GCV members (with pagination & filtering)
- ✅ Add new GCV member
- ✅ Update GCV user role (add/remove COMMITTEE_MEMBER role)

### Program Management
- ✅ Create program
- ✅ Get all programs (with pagination & filtering)
- ✅ Update program
- ✅ Delete program
- ✅ Add program manager (replaces existing manager)

## 🔧 Usage Examples

### 1. Setup in Component

```typescript
import { useGcv } from "@/hooks/useGcv";
import { UpdateRole, TRL, ProgramStatus } from "@/types/gcv.types";

function GCVComponent() {
  const {
    // GCV Members
    members,
    membersPagination,
    isMembersLoading,
    membersError,
    getAllGCVMembers,
    addGCVMember,
    updateGCVUserRole,

    // Programs
    programs,
    programsPagination,
    isProgramsLoading,
    programsError,
    createProgram,
    getPrograms,
    updateProgram,
    deleteProgram,
    addProgramManager,
  } = useGcv();

  // Your component logic...
}
```

### 2. Get All GCV Members

```typescript
// Fetch GCV members with pagination
const fetchMembers = async () => {
  try {
    await getAllGCVMembers({
      page: 1,
      numberOfResults: 10,
      filter: {
        role: UserRoles.COMMITTEE_MEMBER,
        otherFilters: {
          isGCVmember: true,
        },
      },
    });
    
    console.log("Members:", members);
    console.log("Pagination:", membersPagination);
  } catch (error) {
    console.error("Error:", membersError);
  }
};
```

### 3. Add GCV Member

```typescript
const handleAddMember = async () => {
  const success = await addGCVMember({
    email: "newmember@example.com",
  });

  if (success) {
    console.log("Member added successfully!");
    // Refresh the members list
    await getAllGCVMembers({ page: 1, numberOfResults: 10 });
  } else {
    console.error("Failed to add member:", membersError);
  }
};
```

### 4. Update GCV User Role

```typescript
// Add COMMITTEE_MEMBER role
const handleAddRole = async () => {
  const success = await updateGCVUserRole({
    email: "user@example.com",
    type: UpdateRole.ADD_ROLE,
  });

  if (success) {
    console.log("Role added successfully!");
  }
};

// Remove COMMITTEE_MEMBER role
const handleRemoveRole = async () => {
  const success = await updateGCVUserRole({
    email: "user@example.com",
    type: UpdateRole.DELETE_ROLE,
  });

  if (success) {
    console.log("Role removed successfully!");
  }
};
```

### 5. Create Program

```typescript
const handleCreateProgram = async () => {
  const success = await createProgram({
    organization: {
      name: "IIITS",
      type: OrganisationType.IIIT,
      isNew: false, // Set to true if creating new organization
    },
    details: {
      name: "AI Innovation Program",
      description: "A program to fund AI research",
      category: "Research",
    },
    duration: {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
    },
    budget: {
      amount: 1000000,
      currency: "USD",
    },
    minTRL: TRL.TRL1,
    maxTRL: TRL.TRL5,
  });

  if (success) {
    console.log("Program created successfully!");
    // Refresh programs list
    await getPrograms({ page: 1, numberOfResults: 10 });
  } else {
    console.error("Failed to create program:", programsError);
  }
};
```

### 6. Get All Programs

```typescript
const fetchPrograms = async () => {
  try {
    await getPrograms({
      page: 1,
      numberOfResults: 10,
      filter: {
        otherFilters: {
          organizationName: "IIITS",
          status: ProgramStatus.ACTIVE,
        },
      },
    });

    console.log("Programs:", programs);
    console.log("Pagination:", programsPagination);
  } catch (error) {
    console.error("Error:", programsError);
  }
};
```

### 7. Update Program

```typescript
const handleUpdateProgram = async (programId: string) => {
  const success = await updateProgram({
    id: programId,
    details: {
      name: "Updated Program Name",
      description: "Updated description",
    },
    budget: {
      amount: 2000000,
      currency: "USD",
    },
    minTRL: TRL.TRL2,
    maxTRL: TRL.TRL6,
  });

  if (success) {
    console.log("Program updated successfully!");
    // Refresh programs list
    await getPrograms({ page: 1, numberOfResults: 10 });
  }
};
```

### 8. Delete Program

```typescript
const handleDeleteProgram = async (programId: string) => {
  const success = await deleteProgram({
    id: programId,
  });

  if (success) {
    console.log("Program deleted successfully!");
    // Refresh programs list
    await getPrograms({ page: 1, numberOfResults: 10 });
  }
};
```

### 9. Add Program Manager

```typescript
const handleAddManager = async (programId: string) => {
  const success = await addProgramManager({
    id: programId,
    email: "manager@example.com",
  });

  if (success) {
    console.log("Program manager added successfully!");
    // Note: This replaces the existing manager if one exists
    await getPrograms({ page: 1, numberOfResults: 10 });
  }
};
```

## 📊 State Structure

### GCV Members State
```typescript
{
  members: GCVMember[];              // Array of GCV members
  membersPagination: PaginationMeta; // Pagination info
  isMembersLoading: boolean;         // Loading state
  membersError: string | null;       // Error message
}
```

### Programs State
```typescript
{
  programs: Program[];               // Array of programs
  programsPagination: PaginationMeta; // Pagination info
  isProgramsLoading: boolean;        // Loading state
  programsError: string | null;      // Error message
}
```

## 🎨 Complete Component Example

```typescript
"use client";

import { useEffect } from "react";
import { useGcv } from "@/hooks/useGcv";
import { UpdateRole, TRL, OrganisationType } from "@/types/gcv.types";

export default function GCVPage() {
  const {
    // Members
    members,
    membersPagination,
    isMembersLoading,
    membersError,
    getAllGCVMembers,
    addGCVMember,

    // Programs
    programs,
    programsPagination,
    isProgramsLoading,
    programsError,
    getPrograms,
    createProgram,
    deleteProgram,
  } = useGcv();

  // Fetch data on mount
  useEffect(() => {
    getAllGCVMembers({ page: 1, numberOfResults: 10 });
    getPrograms({ page: 1, numberOfResults: 10 });
  }, []);

  const handleAddMember = async () => {
    const success = await addGCVMember({
      email: "newmember@example.com",
    });

    if (success) {
      await getAllGCVMembers({ page: 1, numberOfResults: 10 });
    }
  };

  const handleCreateProgram = async () => {
    const success = await createProgram({
      organization: {
        name: "IIITS",
        type: OrganisationType.IIIT,
        isNew: false,
      },
      details: {
        name: "AI Innovation Program",
        description: "A program to fund AI research",
        category: "Research",
      },
      duration: {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
      },
      budget: {
        amount: 1000000,
        currency: "USD",
      },
      minTRL: TRL.TRL1,
      maxTRL: TRL.TRL5,
    });

    if (success) {
      await getPrograms({ page: 1, numberOfResults: 10 });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">GCV Management</h1>

      {/* Members Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">GCV Members</h2>
        
        <button
          onClick={handleAddMember}
          disabled={isMembersLoading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Member
        </button>

        {isMembersLoading && <p>Loading members...</p>}
        {membersError && <p className="text-red-500">{membersError}</p>}

        <div className="grid gap-4">
          {members.map((member) => (
            <div key={member.personId} className="p-4 border rounded">
              <p className="font-semibold">
                {member.person.firstName} {member.person.lastName}
              </p>
              <p className="text-gray-600">{member.contact.email}</p>
              <p className="text-sm text-gray-500">
                Roles: {member.role.join(", ")}
              </p>
            </div>
          ))}
        </div>

        {membersPagination && (
          <div className="mt-4 text-sm text-gray-600">
            Page {membersPagination.page} of {membersPagination.totalPages} 
            ({membersPagination.total} total members)
          </div>
        )}
      </section>

      {/* Programs Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Programs</h2>
        
        <button
          onClick={handleCreateProgram}
          disabled={isProgramsLoading}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Program
        </button>

        {isProgramsLoading && <p>Loading programs...</p>}
        {programsError && <p className="text-red-500">{programsError}</p>}

        <div className="grid gap-4">
          {programs.map((program) => (
            <div key={program.id} className="p-4 border rounded">
              <h3 className="font-semibold">{program.details.name}</h3>
              <p className="text-gray-600">{program.details.description}</p>
              <p className="text-sm">Status: {program.status}</p>
              <p className="text-sm">
                Budget: {program.budget.currency} {program.budget.amount}
              </p>
              <p className="text-sm">
                TRL Range: {program.minTRL} - {program.maxTRL}
              </p>
              
              <button
                onClick={() => deleteProgram({ id: program.id })}
                className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {programsPagination && (
          <div className="mt-4 text-sm text-gray-600">
            Page {programsPagination.page} of {programsPagination.totalPages} 
            ({programsPagination.total} total programs)
          </div>
        )}
      </section>
    </div>
  );
}
```

## 🔐 API Endpoints

All endpoints are prefixed with `/gcv`:

### GCV Members
- `GET /gcv/get-members` - Get all GCV members
- `POST /gcv/add-member` - Add new GCV member
- `PATCH /gcv/update-member-role` - Update GCV user role

### Programs
- `POST /gcv/create-program` - Create new program
- `GET /gcv/get-programs` - Get all programs
- `PATCH /gcv/update-program` - Update program
- `DELETE /gcv/delete-program` - Delete program
- `POST /gcv/add-program-manager` - Add program manager

## 📝 Type Safety

All APIs are fully type-safe with TypeScript. The enums and interfaces ensure:
- ✅ Correct request payloads
- ✅ Type-safe responses
- ✅ Autocomplete in IDE
- ✅ Compile-time error checking

## 🎭 Enums Available

```typescript
// User role update type
enum UpdateRole {
  ADD_ROLE = "ADD_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
}

// Program status
enum ProgramStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

// Technology Readiness Level
enum TRL {
  TRL1 = "TRL1", // ... through TRL9
}

// Organization type (from admin.types.ts)
enum OrganisationType {
  IIT = "IIT",
  NIT = "NIT",
  IIIT = "IIIT",
  // ... etc
}
```

## ⚠️ Important Notes

1. **Program Manager**: When adding a program manager, it **replaces** the existing manager (only one manager per program).

2. **Error Handling**: All functions return `boolean` for success/failure. Check error states for details:
   ```typescript
   const success = await addGCVMember(data);
   if (!success) {
     console.error(membersError); // Contains error message
   }
   ```

3. **Pagination**: Remember to handle pagination for large datasets:
   ```typescript
   if (membersPagination) {
     const hasNextPage = membersPagination.page < membersPagination.totalPages;
   }
   ```

4. **State Management**: The store automatically handles loading states and errors. Use them in your UI:
   ```typescript
   {isMembersLoading && <Spinner />}
   {membersError && <ErrorMessage>{membersError}</ErrorMessage>}
   ```

## 🚀 Next Steps

1. Create UI components for GCV member management
2. Create UI components for program management
3. Add form validation for program creation
4. Implement pagination controls
5. Add search and filter functionality

---

All APIs are now fully integrated with type safety and proper error handling! 🎉
