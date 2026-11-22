import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Moon, Settings, Sun } from 'lucide-react';
import { navigationPages } from './navigationPages';
import { appHeaderClass, appHeaderContentClass, appHeaderControlsClass, datePickerClass, linkActiveClass, primaryButtonClass, themeButtonClass } from '../../globalStyles';

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
      <div className={appHeaderContentClass}>
        <div className="flex min-w-70 items-center gap-4">
          <img src='/Delhi_Metro.png' className='size-14 w-35'/>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-primary tracking-wide">Earning Register</p>
            <p className="truncate text-sm text-card-text">{stationName}</p>
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
                  `${primaryButtonClass} ${
                    isActive ? linkActiveClass : ''
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className={appHeaderControlsClass} >
          <div className={datePickerClass}>
            <button type="button" onClick={openDatePicker} aria-label="Open calendar" className="">
              <CalendarDays className="size-6" aria-hidden="true"/>
            </button>
            <input
              ref={dateInputReference}
              type="date"
              aria-label="Select date"
              value={selectedDate}
              onChange={event => onDateChange(event.target.value)}
              className='date-input'
            />
          </div>
          {showNavigation && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${primaryButtonClass} ${
                  isActive ? linkActiveClass : ''
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
            className={themeButtonClass}
          >
            {isDarkMode ? <Sun className="size-5 text-yellow-300 " aria-hidden="true"/> : <Moon className="size-5 fill-blue-100 text-blue-100" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}