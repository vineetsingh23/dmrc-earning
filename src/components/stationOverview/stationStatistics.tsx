import {cardContainer } from "../../globalStyles";
// import { formatRupees, highestEarningSoFar } from "../../lib/earningCalculations";999
import {type  RegisterState } from "../../lib/registerTypes";
import {
  addDays, dailyCashlessStatisticsOfDate, dailyEarningOfDate, dailyQrSaleOfDate,
  datesWithEntriesUpTo, formatRupees, tvmAddValueOfDate, tvmQrSaleOfDate,
} from '../../lib/earningCalculations';




interface StationStatisticsCardProps {
  registerState: RegisterState;
  date: string
}

type BestDay ={date:string; amount: number } | null;

function findBestDay(dates: string[], measureOfDate:(entryDate:string)=> number):BestDay{

  let bestDay : BestDay = null
  dates.forEach(entryDate => {
    const measuredAmount = measureOfDate(entryDate);
    if(measuredAmount> 0 && 
      (!bestDay || measuredAmount > bestDay.amount))
      bestDay = {date: entryDate, amount:measuredAmount}
  })

  return bestDay

} 
const staticCardClass = 'w-full max-w-none flex flex-col gap-3 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 text-center rounded-2xl border border-slate-200  p-4 text-slate-800 shadow-sm transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/40 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:shadow-lg';

export default function StationStatisticsCard({registerState,date}: StationStatisticsCardProps) {
    const datesTillDate = datesWithEntriesUpTo(registerState, date);
  const datesInSelectedMonth = datesTillDate.filter(entryDate => entryDate.startsWith(date.slice(0, 7)));
  const statistics: { title: string; bestDay: BestDay }[] = [
    { title: 'Highest earning this month', bestDay: findBestDay(datesInSelectedMonth, entryDate => dailyEarningOfDate(registerState, entryDate)) },
    { title: 'Highest earning till date', bestDay: findBestDay(datesTillDate, entryDate => dailyEarningOfDate(registerState, entryDate)) },
    { title: 'Highest Earning TVM this month', bestDay: findBestDay(datesInSelectedMonth, entryDate => dailyQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest Earning TVM till date', bestDay: findBestDay(datesTillDate, entryDate => dailyQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest Earning TOM this month', bestDay: findBestDay(datesTillDate, entryDate => tvmQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest Earning TOM till date', bestDay: findBestDay(datesTillDate, entryDate => tvmQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest Cashless Earning this month', bestDay: findBestDay(datesTillDate, entryDate => tvmAddValueOfDate(registerState, entryDate)) },
    { title: 'Highest Cashless Earning till date', bestDay: findBestDay(datesTillDate, entryDate => tvmAddValueOfDate(registerState, entryDate)) },
  ];

  const previousDate = addDays(date, -1);
  const currentCashlessStatistics = dailyCashlessStatisticsOfDate(registerState, date);
  const previousCashlessStatistics: ReturnType<typeof dailyCashlessStatisticsOfDate> = dailyCashlessStatisticsOfDate(registerState, previousDate);
  const cashlessTransactions = [
    { title: 'Total AFC earning', current: currentCashlessStatistics.afcEarning, previous: previousCashlessStatistics.afcEarning },
    { title: 'Total UPI', current: currentCashlessStatistics.upiTotal, previous: previousCashlessStatistics.upiTotal },
    { title: 'Total POS', current: currentCashlessStatistics.posTotal, previous: previousCashlessStatistics.posTotal },
    { title: 'UPI by TOM 80 + 81', current: currentCashlessStatistics.tom8081Upi, previous: previousCashlessStatistics.tom8081Upi },
    { title: 'UPI by TOM 50 + 51', current: currentCashlessStatistics.tom5051Upi, previous: previousCashlessStatistics.tom5051Upi },
    { title: 'UPI by TVM', current: currentCashlessStatistics.tvmUpi, previous: previousCashlessStatistics.tvmUpi },
  ];
const cardSeparator = 'mt-4 text-blue-600 dark:text-blue-400 text-md font-extrabold'
  return (
    <div>

    <h2 className={cardSeparator}>Statistics</h2>
   <div className={cardContainer}>
      <div className="grid grid-cols-4 w-full gap-4">
        {statistics.map(({ title, bestDay }) => (
          <div key={title} className={staticCardClass}>
            <small className="block text-mu">{title}</small>
            {bestDay
              ? <><b className="text-xl">{formatRupees(bestDay.amount)}</b><small className="block text-mu">{bestDay.date}</small></>
              : <b>—</b>}
          </div>
        ))}
      </div>
    </div>

     <h2 className={cardSeparator}>Cashless Transactions · day-over-day</h2>
   <div className={cardContainer}>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cashlessTransactions.map(({ title, current, previous }) => {
          const changePercent = previous === 0 ? null : ((current - previous) / previous) * 100;
          const changeClass = current > previous
            ? 'text-emerald-700 dark:text-emerald-300'
            : current < previous
              ? 'text-red-700 dark:text-red-300'
              : 'text-mu';

          return (
          <div key={title} className={staticCardClass}>
            <small className="block text-mu">{title}</small>
            <b className="text-xl">{formatRupees(current)}</b>
            <small className="block text-mu">Previous day ({previousDate}): {formatRupees(previous)}</small>
            <small className={changeClass}>
              {changePercent === null
                ? (current === 0 ? 'No change from zero' : 'New · previous day was zero')
                : `${changePercent > 0 ? '↑' : changePercent < 0 ? '↓' : '—'} ${Math.abs(changePercent).toFixed(1)}% ${changePercent > 0 ? 'increase' : changePercent < 0 ? 'decrease' : 'no change'}`}
            </small>
          </div>
          );
        })}
      </div>
    </div>

        </div>

  )
}


