import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Database,
  Download,
  LayoutDashboard,
  Settings,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";

const guideSections = [
  {
    title: "Cash to Bank",
    Icon: Landmark,
    description: [
      "Step 1: Add cash to Cash in Possession. It will automatically assign denominations from higher to lower value.",
      "Step 2 (Optional): Change the cash-to-bank denomination if you want to send a different amount or combination.",
      "Step 3: Click Sent to bank, enter the Slip No. in the pop-up, and the system will adjust the denomination in Cash in Possession. You will then be left with only the remaining cash after the transfer.",
    ],
  },
  {
    title: "Shift Entry Table",
    Icon: Database,
    description: [
      { text: "Surcharge Columns:", type: "header" },
      "A. Add total amount of surcharge (surcharge from QR Ticket + surcharge from CSC-SV) in Surcharge other than purse column",
      "Enter total surcharge through purse column, this amount automatically adjusted in previous column remaining cash surcharge only",
      "B. Add total amount of surcharge in first column of NCMC surcharge, then add total amount of surcharge through NCMC purse. First column amount will remain with cash only",
    ],
  },
  {
    title: "Choose a date and navigate",
    Icon: CalendarDays,
    description:
      "Use the date picker in the top bar to choose the working date. Use the navigation links to open the dashboard, shift entry, TVM earnings, final earnings, station overview, and WhatsApp report.",
  },
  {
    title: "Use the dashboard",
    Icon: LayoutDashboard,
    description:
      "Review cash totals, enter cash counts, and manage imprest, advances, and miscellaneous entries. The dashboard summarizes the selected date.",
  },
  {
    title: "Back up and transfer data",
    Icon: Download,
    description:
      "Open Settings for automatic weekly folder backups, JSON backup export/import, and Shift or TVM CSV exports. Folder backups require a supported browser such as Chrome or Edge.",
  },
  {
    title: "Check storage and settings",
    Icon: Database,
    description:
      "Register data is stored locally in this browser. Check the database status in Settings and confirm it is saved before leaving the app.",
  },
];

export default function UserGuide() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-5">
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-card-border bg-card p-5 shadow-md sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ac2 text-white">
            <BookOpen className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Help center
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-card-text">
              User guide
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick guide to using the earning register.
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-button-border bg-button px-4 py-2 text-sm font-semibold text-button-text transition hover:border-button-border/30 hover:bg-button/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:self-auto"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {guideSections.map(({ title, Icon, description }) => (
          <section
            key={title}
            className="rounded-2xl border border-card-border bg-card p-5 text-card-text shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ac/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-bold tracking-tight">{title}</h2>
            </div>
            {Array.isArray(description) ? (
              <ol className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                {description.map((step) => {
                  const isHeader = typeof step === "object" && step.type === "header";
                  const content = typeof step === "string" ? step : step.text;

                  return (
                    <li
                      key={content}
                      className={`flex gap-2 ${isHeader ? "font-semibold text-card-text" : ""}`}
                    >
                      {!isHeader && <span className="mt-0.5 text-primary">•</span>}
                      <span>{content}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-6 text-card-small">
                {description}
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
        <div className="flex items-start gap-3">
          <Settings
            className="mt-0.5 size-5 shrink-0 text-amber-600"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-bold text-card-text">A note about replacing data</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Importing a JSON backup replaces register data after confirmation.
              Loading sample data also replaces entries for the selected month.
              Export a backup first if you need to keep a copy of your current data.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}