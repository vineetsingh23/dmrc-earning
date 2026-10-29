import { useState } from "react";
import { NavLink } from "react-router-dom";

interface AppSidebarProps {
  onLogout: () => void;
  storageLabel: string;
  storageError: string | undefined;
}

const linkClass = (isActive: boolean) =>
  `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
  }`;

function SidebarIcon({ name }: { name: string }) {
  return <i className={`fi ${name} w-5 shrink-0 text-center text-base`} aria-hidden="true" />;
}

export default function AppSidebar({ onLogout, storageLabel, storageError }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [isTablesOpen, setIsTablesOpen] = useState(true);

  const navLink = (path: string, label: string, icon: string, end = false) => (
    <NavLink
      key={path}
      to={path}
      end={end}
      title={isCollapsed ? label : undefined}
      aria-label={isCollapsed ? label : undefined}
      className={({ isActive }) => linkClass(isActive)}
    >
      <SidebarIcon name={icon} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`${isCollapsed ? "w-[4.5rem]" : "w-64"} sticky top-0 flex h-[calc(100vh-68px)] shrink-0 flex-col border-r border-slate-200 bg-white p-2 transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-900 md:top-[68px] md:p-3`}
      aria-label="Sidebar navigation"
    >
      <div className={`mb-3 flex ${isCollapsed ? "justify-center" : "justify-end"}`}>
        <button
          type="button"
          onClick={() => setIsCollapsed(collapsed => !collapsed)}
          aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
          aria-expanded={!isCollapsed}
          className="grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <SidebarIcon name={isCollapsed ? "fi-rr-angle-double-right" : "fi-rr-angle-double-left"} />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Main navigation">
        {navLink("/", "Dashboard", "fi-rr-home", true)}

        <button
          type="button"
          title={isCollapsed ? "Tables" : undefined}
          aria-label="Tables"
          aria-expanded={isTablesOpen}
          onClick={() => setIsTablesOpen(open => !open)}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        >
          <SidebarIcon name="fi-rr-table-list" />
          {!isCollapsed && (
            <>
              <span className="flex-1">Earning Tables</span>
              <SidebarIcon name={isTablesOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} />
            </>
          )}
        </button>
        {isTablesOpen && (
          <div className={`${isCollapsed ? "" : "ml-3 border-l border-slate-200 pl-2 dark:border-slate-700"} flex flex-col gap-1`}>
            {navLink("/shift-entry", "Shift Earning", "fi-rr-edit")}
            {navLink("/tvm-earning", "TVM Earning", "fi-rr-calculator")}
            {navLink("/final-earning", "Final Earning Report", "fi-rr-document")}
          </div>
        )}
        

        {navLink("/station-overview", "Earning Overview", "fi-rr-chart-histogram")}
        {navLink("/daily-report", "WhatsApp", "fi fi-brands-whatsapp")}
      </nav>

      <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p className="truncate px-2 pb-2 text-xs text-slate-500 dark:text-slate-400" role="status" title={storageError || storageLabel}>
          {!isCollapsed && storageLabel}
          {isCollapsed && <span className="sr-only">{storageLabel}</span>}
        </p>
        <button
          type="button"
          onClick={onLogout}
          title={isCollapsed ? "Logout" : undefined}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-300"
        >
          <SidebarIcon name="fi-rr-sign-out-alt" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        <a
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noreferrer"
          title="Icons by Flaticon"
          className="mt-2 block truncate px-2 text-[10px] text-slate-400 hover:text-blue-600"
        >
          Created By: Vineet Kumar Singh (12649)
        </a>
      </div>
    </aside>
  );
}
