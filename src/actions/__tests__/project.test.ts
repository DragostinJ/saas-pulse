import { describe, it, expect, vi } from 'vitest';
import { createProject } from '@/actions/project';
import { auth } from '@clerk/nextjs/server';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'user_test_123' }),
}));

// Mock Next.js revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createProject Server Action', () => {
  it('should return an error when project name is empty', async () => {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('organizationId', 'org_123');

    const result = await createProject(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Project name is required');
  });

  it('should return an error when organizationId is empty', async () => {
    const formData = new FormData();
    formData.append('name', 'Valid Project');
    formData.append('organizationId', '');

    const result = await createProject(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Organization ID is required');
  });

  it('should return an error when user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any);

    const formData = new FormData();
    formData.append('name', 'Valid Project');
    formData.append('organizationId', 'org_123');

    const result = await createProject(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized request');
  });
});
