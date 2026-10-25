import { cardClass, cardContainer } from "../../globalStyles";
// import { formatRupees, highestEarningSoFar } from "../../lib/earningCalculations";999
import {type  RegisterState } from "../../lib/registerTypes";
import {
  dailyEarningOfDate, dailyQrSaleOfDate, datesWithEntriesUpTo, formatRupees, tvmAddValueOfDate, tvmQrSaleOfDate,
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
const staticCardClass = 'w-full max-w-none flex flex-col gap-3 text-center rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-teal-800/40 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:shadow-lg';

export default function StationStatisticsCard({registerState,date}: StationStatisticsCardProps) {
    const datesTillDate = datesWithEntriesUpTo(registerState, date);
  const datesInSelectedMonth = datesTillDate.filter(entryDate => entryDate.startsWith(date.slice(0, 7)));
  const statistics: { title: string; bestDay: BestDay }[] = [
    { title: 'Highest earning · this month', bestDay: findBestDay(datesInSelectedMonth, entryDate => dailyEarningOfDate(registerState, entryDate)) },
    { title: 'Highest earning · till date', bestDay: findBestDay(datesTillDate, entryDate => dailyEarningOfDate(registerState, entryDate)) },
    { title: 'Highest QR sale · this month', bestDay: findBestDay(datesInSelectedMonth, entryDate => dailyQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest QR sale · till date', bestDay: findBestDay(datesTillDate, entryDate => dailyQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest QR sale from TVM · till date', bestDay: findBestDay(datesTillDate, entryDate => tvmQrSaleOfDate(registerState, entryDate)) },
    { title: 'Highest Add Value from TVM · till date', bestDay: findBestDay(datesTillDate, entryDate => tvmAddValueOfDate(registerState, entryDate)) },
  ];

  return (
    <div>

    <h2 className="mb-2 font-semibold">Statistics</h2>
   <div className={cardContainer}>
      <div className="flex gap-4">
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
        </div>
  )
}



