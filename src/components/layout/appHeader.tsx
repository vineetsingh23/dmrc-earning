import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Moon, Settings, Sun } from 'lucide-react';
import { navigationPages } from './navigationPages';
import { appHeaderClass } from '../../globalStyles';

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
    <header className={appHeaderClass}>
      <div className="mx-auto grid max-w-screen grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 px-2 py-2 md:min-h-16 md:grid-cols-[1fr_auto_1fr] md:px-4">
        <div className="flex min-w-70 items-center gap-4">
          <img src='/Delhi_Metro.png' className='size-10 w-23'/>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ac">Earning Register</p>
            <p className="truncate text-sm text-tx">{stationName}</p>
          </div>
        </div>

        {showNavigation && (
          <nav aria-label="Main navigation" className="w-full flex gap-2">
            {navigationPages.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'isActive' : 'isNotActive'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-self-end gap-2 md:col-start-3">
          <div className="flex items-center gap-2 rounded-lg border border-bd hover:bg-ac2 hover:text-tx px-2 py-1.5 transition-colors ease-in-out duration-200 font-semibold">
            <button type="button" onClick={openDatePicker} aria-label="Open calendar" className="">
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
                `inline-flex shrink-0 items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'isActive' : 'isNotActive'
                }`
              }
            >
              <Settings/>
            </NavLink>
          )}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="rounded-lg border border-bd p-2 bg-blue-950 transition hover:border-ac hover:text-ac"
          >
            {isDarkMode ? <Sun className="size-5 text-yellow-300 " aria-hidden="true"/> : <Moon className="size-5 fill-blue-100 text-blue-100" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}