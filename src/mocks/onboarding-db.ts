export type Workspace = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
};

const RESERVED_SLUGS = new Set(["demo", "admin", "www"]);
const workspacesBySlug = new Map<string, Workspace>();
const workspacesByOwner = new Map<string, Workspace>();

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlugTaken(slug: string): boolean {
  const normalized = slug.trim().toLowerCase();
  return RESERVED_SLUGS.has(normalized) || workspacesBySlug.has(normalized);
}

export type CreateWorkspaceInput = {
  name?: string;
  slug?: string;
  ownerId: string;
};

export type CreateWorkspaceResult =
  | { ok: true; workspace: Workspace }
  | { ok: false; status: 400 | 409; message: string };

export function tryCreateWorkspace(
  input: CreateWorkspaceInput
): CreateWorkspaceResult {
  const name = input.name?.trim() ?? "";
  const slug = input.slug?.trim().toLowerCase() ?? "";

  if (name.length < 2 || !SLUG_PATTERN.test(slug) || slug.length < 3) {
    return { ok: false, status: 400, message: "Invalid workspace payload" };
  }

  if (workspacesByOwner.has(input.ownerId)) {
    return {
      ok: false,
      status: 409,
      message: "You already have a workspace",
    };
  }

  if (isSlugTaken(slug)) {
    return { ok: false, status: 409, message: "Slug này đã được dùng" };
  }

  return {
    ok: true,
    workspace: createWorkspaceRecord(input.ownerId, name, slug),
  };
}

export function createWorkspaceRecord(
  ownerId: string,
  name: string,
  slug: string
): Workspace {
  const workspace: Workspace = {
    id: crypto.randomUUID(),
    ownerId,
    name,
    slug,
  };
  workspacesBySlug.set(slug, workspace);
  workspacesByOwner.set(ownerId, workspace);
  return workspace;
}

export function getWorkspaceForOwner(ownerId: string): Workspace | null {
  return workspacesByOwner.get(ownerId) ?? null;
}

export function restoreWorkspace(workspace: Workspace) {
  workspacesBySlug.set(workspace.slug, workspace);
  workspacesByOwner.set(workspace.ownerId, workspace);
}
