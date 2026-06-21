export type Role = 'SUPERADMIN' | 'ADMIN' | 'UMKM_OWNER' | 'VISITOR';
export type Permission = 'manage_users' | 'manage_umkm' | 'approve_content' | 'manage_products' | 'manage_stories' | 'manage_events' | 'view_reports' | 'manage_apps' | 'manage_homepage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPERADMIN: ['manage_users','manage_umkm','approve_content','manage_products','manage_stories','manage_events','view_reports','manage_apps','manage_homepage'],
  ADMIN:      ['manage_umkm','approve_content','manage_products','manage_stories','manage_events','view_reports'],
  UMKM_OWNER: ['manage_products','manage_stories'],
  VISITOR:    [],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
