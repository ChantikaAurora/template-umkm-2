import { LayoutDashboard, Store, ShoppingBag, MessageCircle, FileText, Calendar, Users, AppWindow, Image, Home, BarChart3, Settings, User, PlusCircle } from 'lucide-react';

export interface MenuItem { label: string; href: string; icon: any; roles: string[]; }

export const menuItems: MenuItem[] = [
  { label: 'Dashboard',       href: '/dashboard',                     icon: LayoutDashboard, roles: ['SUPERADMIN','ADMIN','UMKM_OWNER','VISITOR'] },
  { label: 'Daftar UMKM',     href: '/dashboard/register-umkm',       icon: PlusCircle,      roles: ['VISITOR'] },
  { label: 'User Management', href: '/dashboard/users',               icon: Users,           roles: ['SUPERADMIN'] },
  { label: 'Apps Management', href: '/dashboard/apps',                icon: AppWindow,       roles: ['SUPERADMIN'] },
  { label: 'UMKM Data',       href: '/dashboard/umkm',                icon: Store,           roles: ['SUPERADMIN','ADMIN'] },
  { label: 'Produk',          href: '/dashboard/products',            icon: ShoppingBag,     roles: ['SUPERADMIN','ADMIN','UMKM_OWNER'] },
  { label: 'Tambah Produk',   href: '/dashboard/products/new',        icon: PlusCircle,      roles: ['UMKM_OWNER'] },
  { label: 'WhatsApp Orders', href: '/dashboard/whatsapp-orders',     icon: MessageCircle,   roles: ['SUPERADMIN','ADMIN','UMKM_OWNER'] },
  { label: 'Promo Slider',    href: '/dashboard/promos',              icon: Image,           roles: ['SUPERADMIN','UMKM_OWNER'] },
  { label: 'Cerita / Blog',   href: '/dashboard/cerita',              icon: FileText,        roles: ['SUPERADMIN','ADMIN','UMKM_OWNER'] },
  { label: 'Tulis Cerita',    href: '/dashboard/cerita/new',          icon: PlusCircle,      roles: ['UMKM_OWNER'] },
  { label: 'Event',           href: '/dashboard/event',               icon: Calendar,        roles: ['SUPERADMIN','ADMIN'] },
  { label: 'Homepage Content',href: '/dashboard/homepage-content',    icon: Home,            roles: ['SUPERADMIN'] },
  { label: 'Reports',         href: '/dashboard/reports',             icon: BarChart3,       roles: ['SUPERADMIN','ADMIN'] },
  { label: 'Settings',        href: '/dashboard/settings',            icon: Settings,        roles: ['SUPERADMIN'] },
  { label: 'Profile',         href: '/dashboard/profile',             icon: User,            roles: ['SUPERADMIN','ADMIN','UMKM_OWNER','VISITOR'] },
];
