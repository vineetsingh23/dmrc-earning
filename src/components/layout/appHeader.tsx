import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Moon, Sun } from 'lucide-react';
import { navigationPages } from './navigationPages';

interface AppHeaderProps {
  stationName: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  showNavigation?: boolean;
}

export default function AppHeader({
  stationName,
  selectedDate,
  onDateChange,
  isDarkMode,
  onToggleDarkMode,
  showNavigation = true,
}: AppHeaderProps) {
  const dateInputReference = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    try { dateInputReference.current?.showPicker(); } catch { dateInputReference.current?.focus(); }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-bd bg-card/95 shadow-sm backdrop-blur">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-2 md:min-h-16 md:grid-cols-[1fr_auto_1fr] md:px-6">
        <div className="flex max-w-60 items-center gap-6">
          {/* <TrainFront className="size-7 shrink-0 text-ac" aria-hidden="true" /> */}
            <img src='/Delhi_Metro.png' className='size-10 w-23'/>
          <div className="min-w-0">
            <p className="truncate text-md font-bold text-tx">Earning Register</p>
            <p className="truncate text-sm text-mu">{stationName}</p>
          </div>
        </div>

        {showNavigation && (
          <nav aria-label="Main navigation" className="w-full flex gap-4">
            {navigationPages.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-ac text-onac' : 'text-mu hover:bg-ca hover:text-tx'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-self-end gap-2 md:col-start-3">
          <div className="flex items-center gap-2 rounded-lg border border-bd bg-inp px-2 py-1.5">
            <button type="button" onClick={openDatePicker} aria-label="Open calendar" className="text-mu transition hover:text-ac">
              <CalendarDays className="size-4" aria-hidden="true" />
            </button>
            <input
              ref={dateInputReference}
              type="date"
              aria-label="Select date"
              value={selectedDate}
              onChange={event => onDateChange(event.target.value)}
              className="date-input bg-transparent text-sm outline-hidden"
            />
          </div>
          {showNavigation && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ac text-onac' : 'text-mu hover:bg-ca hover:text-tx'
                }`
              }
            >
              Settings
            </NavLink>
          )}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="rounded-lg border border-bd bg-card p-2 text-mu transition hover:border-ac hover:text-ac"
          >
            {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}