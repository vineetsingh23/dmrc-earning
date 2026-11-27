import { cardClass, cardHeadingClass } from "../../globalStyles";
import {
  MachineCategoryStatisticsOfDate,
  type EarningMachineCategory,
} from "../../lib/machineCategoryStatistics";
import type { RegisterState } from "../../lib/registerTypes";
import {
  addDays,
  dailyCashlessOfDate,
  dailyCashlessStatisticsOfDate,
  dailyEarningOfDate,
  datesWithEntriesUpTo,
  formatRupees,
} from "../../lib/earningCalculations";

interface StationStatisticsCardProps {
  registerState: RegisterState;
  date: string;
}

type BestDay = { date: string; amount: number } | null;

export function findBestDay(
  dates: string[],
  measureOfDate: (entryDate: string) => number,
): BestDay {
  let bestDay: BestDay = null;

  dates.forEach((entryDate) => {
    const measuredAmount = measureOfDate(entryDate);
    if (measuredAmount > 0 && (!bestDay || measuredAmount > bestDay.amount)) {
      bestDay = { date: entryDate, amount: measuredAmount };
    }
  });

  return bestDay;
}

export default function StationStatisticsCard({
  registerState,
  date,
}: StationStatisticsCardProps) {
  const datesTillDate = datesWithEntriesUpTo(registerState, date);
  const datesInSelectedMonth = datesTillDate.filter((entryDate) =>
    entryDate.startsWith(date.slice(0, 7)),
  );
  const machineCategoryStats = MachineCategoryStatisticsOfDate(
    registerState,
    date,
  );
  const statistics: { title: string; bestDay: BestDay }[] = [
    {
      title: "Highest earning this month",
      bestDay: findBestDay(datesInSelectedMonth, (entryDate) =>
        dailyEarningOfDate(registerState, entryDate),
      ),
    },
    {
      title: "Highest earning till date",
      bestDay: findBestDay(datesTillDate, (entryDate) =>
        dailyEarningOfDate(registerState, entryDate),
      ),
    },
    {
      title: "Highest TVM QR sale this month",
      bestDay: findBestDay(datesInSelectedMonth, (entryDate) =>
        MachineCategoryStatisticsOfDate(registerState, entryDate).TVM.qrSale,
      ),
    },
    {
      title: "Highest TVM QR sale till date",
      bestDay: findBestDay(datesTillDate, (entryDate) =>
        MachineCategoryStatisticsOfDate(registerState, entryDate).TVM.qrSale,
      ),
    },
    {
      title: "Highest TOM QR sale this month",
      bestDay: findBestDay(datesInSelectedMonth, (entryDate) =>
        MachineCategoryStatisticsOfDate(registerState, entryDate).TOM.qrSale,
      ),
    },
    {
      title: "Highest TOM QR sale till date",
      bestDay: findBestDay(datesTillDate, (entryDate) =>
        MachineCategoryStatisticsOfDate(registerState, entryDate).TOM.qrSale,
      ),
    },
    {
      title: "Highest cashless earning this month",
      bestDay: findBestDay(datesInSelectedMonth, (entryDate) =>
        dailyCashlessOfDate(registerState, entryDate),
      ),
    },
    {
      title: "Highest cashless earning till date",
      bestDay: findBestDay(datesTillDate, (entryDate) =>
        dailyCashlessOfDate(registerState, entryDate),
      ),
    },
  ];

  const previousDate = addDays(date, -1);
  const currentCashlessStatistics = dailyCashlessStatisticsOfDate(
    registerState,
    date,
  );
  const previousCashlessStatistics = dailyCashlessStatisticsOfDate(
    registerState,
    previousDate,
  );
  const cashlessTransactions = [
    {
      title: "Total AFC earning",
      current: currentCashlessStatistics.afcEarning,
      previous: previousCashlessStatistics.afcEarning,
    },
    {
      title: "Total UPI",
      current: currentCashlessStatistics.upiTotal,
      previous: previousCashlessStatistics.upiTotal,
    },
    {
      title: "Total POS",
      current: currentCashlessStatistics.posTotal,
      previous: previousCashlessStatistics.posTotal,
    },
    {
      title: "UPI by TOM 80 + 81",
      current: currentCashlessStatistics.tom8081Upi,
      previous: previousCashlessStatistics.tom8081Upi,
    },
    {
      title: "UPI by TOM 50 + 51",
      current: currentCashlessStatistics.tom5152Upi,
      previous: previousCashlessStatistics.tom5152Upi,
    },
    {
      title: "UPI by TVM",
      current: currentCashlessStatistics.tvmUpi,
      previous: previousCashlessStatistics.tvmUpi,
    },
  ];
  const machineCategoryRows: {
    key: EarningMachineCategory | "overall";
    label: string;
  }[] = [
    { key: "CC", label: "CC (80, 81, 82)" },
    { key: "TOM", label: "TOM (51, 52, ...)" },
    { key: "TVM", label: "TVM (1, 2, 3, ...)" },
    { key: "RCTM", label: "RCTM" },
    { key: "overall", label: "Overall total" },
  ];
  const cardSeparator = `${cardHeadingClass} mb-0! mt-4! text-sm font-bold uppercase tracking-[0.12em]`;
  const staticCardClass = "grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4";
  const statisticsCard =
    "flex flex-col items-center rounded-2xl bg-card-header p-2 text-card-text shadow-md shadow-card-shadow  transition-colors duration-200 hover:bg-success-text/10";

  return (
    <div>
      <h2 className={cardSeparator}>Statistics</h2>
      <div className={cardClass}>
        <div className={staticCardClass}>
          {statistics.map(({ title, bestDay }) => (
            <div key={title} className={statisticsCard}>
              <small className="block text-card-text">{title}</small>
              {bestDay ? (
                <>
                  <b className="text-xl text-big-number">
                    {formatRupees(bestDay.amount)}
                  </b>
                  <small className="block text-card-text">{bestDay.date}</small>
                </>
              ) : (
                <b>—</b>
              )}
            </div>
          ))}
        </div>
      </div>

      <h2 className={cardSeparator}>Cashless Transactions · day-over-day</h2>
      <div className={cardClass}>
        <div className={staticCardClass}>
          {cashlessTransactions.map(({ title, current, previous }) => {
            const changePercent =
              previous === 0 ? null : ((current - previous) / previous) * 100;
            const changeClass =
              current > previous
                ? "text-success-text"
                : current < previous
                  ? "text-danger-text"
                  : "text-card-text";

            return (
              <div key={title} className={statisticsCard}>
                <small className="block text-card-text">{title}</small>
                <b className="text-xl text-big-number">{formatRupees(current)}</b>
                <small className="block text-card-text">
                  Previous day ({previousDate}): {formatRupees(previous)}
                </small>
                <small className={changeClass}>
                  {changePercent === null
                    ? current === 0
                      ? "No change from zero"
                      : "New · previous day was zero"
                    : `${changePercent > 0 ? "↑" : changePercent < 0 ? "↓" : "—"} ${Math.abs(changePercent).toFixed(1)}% ${changePercent > 0 ? "increase" : changePercent < 0 ? "decrease" : "no change"}`}
                </small>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className={cardSeparator}>Earning by Machine Category · {date}</h2>
      <div className={`${cardClass} overflow-x-auto`}>
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-table-border text-card-text">
              <th className="px-3 py-3 text-left">Category</th>
              <th className="px-3 py-3 text-right">QR Sale</th>
              <th className="px-3 py-3 text-right">Add Value</th>
              <th className="px-3 py-3 text-right">UPI</th>
              <th className="px-3 py-3 text-right">POS</th>
            </tr>
          </thead>
          <tbody>
            {machineCategoryRows.map(({ key, label }) => {
              const row = machineCategoryStats[key];
              const isOverall = key === "overall";

              return (
                <tr
                  key={key}
                  className={`border-b border-table-border ${isOverall ? "bg-table font-bold" : ""}`}
                >
                  <td className="px-3 py-3">{label}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRupees(row.qrSale)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRupees(row.addValue)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRupees(row.upi)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatRupees(row.pos)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
