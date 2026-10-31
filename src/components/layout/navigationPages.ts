import { ClipboardList, FileSpreadsheet, LayoutGrid, MessageCircleCheck, Ticket, type LucideIcon } from 'lucide-react';

export interface NavigationPage { label: string; path: string; Icon: LucideIcon }

export const navigationPages: NavigationPage[] = [
  { label: 'Dashboard', path: '/', Icon: LayoutGrid },
  { label: 'Shift Entry', path: '/shift-entry', Icon: ClipboardList },
  { label: 'TVM Earning', path: '/tvm-earning', Icon: Ticket },
  { label: 'Final Earning', path: '/final-earning', Icon: FileSpreadsheet },
  { label: 'Station Overview', path: '/station-overview', Icon: FileSpreadsheet },
  { label: 'WhatsApp Report', path: '/daily-report', Icon: MessageCircleCheck },
];