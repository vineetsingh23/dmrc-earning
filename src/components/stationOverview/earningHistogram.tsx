import type { RegisterState } from '../../lib/registerTypes';
import { addDays, dailyCashlessOfDate, dailyEarningOfDate, formatRupees } from '../../lib/earningCalculations';
import { cardClass, cardContainer } from '../../globalStyles';

interface EarningHistogramCardProps { registerState: RegisterState; date: string }

const daysShown = 30, chartWidth = 1800, chartHeight = 180;

// bars for the 14 days up to the selected date: total earning and cashless earning side by side
export default function EarningHistogramCard({ registerState, date }: EarningHistogramCardProps) {
  const dailyFigures = Array.from({ length: daysShown }, (_, dayIndex) => {
    const dayDate = addDays(date, dayIndex - (daysShown - 1));
    return { dayDate, earning: dailyEarningOfDate(registerState, dayDate), cashless: dailyCashlessOfDate(registerState, dayDate) };
  });
  const highestValue = Math.max(1, ...dailyFigures.map(figures => Math.max(figures.earning, figures.cashless)));
  const slotWidth = chartWidth / daysShown, barWidth = (slotWidth - 10) / 4, barAreaHeight = chartHeight - 30;

  return (
    <>
      <h2 className="font-semibold bottom-0">Daily earning histogram ({daysShown} days to {date})</h2>
    <div className={`${cardContainer} max-h-40 top-0`}>
      <small className="text-mu flex flex-col">
        <ul className='flex flex-col min-w-30 text-nowrap'>
          <li className="text-ac ">■<span> Total earning</span></li>
          <li className="text-ac2 ">■<span> Selected Day</span></li>
          <li className="text-ok ">■<span> Cashless</span></li>
        </ul>
     
        {/* <span className="text-ac">■</span> selected day · <span className="text-ok">■</span> Cashless */}
      </small>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" role="img" aria-label="Daily earning histogram">
        {dailyFigures.map(({ dayDate, earning, cashless }, dayIndex) => {
          const earningBarHeight = (Math.max(0, earning) / highestValue) * barAreaHeight;
          const cashlessBarHeight = (Math.max(0, cashless) / highestValue) * barAreaHeight;
          return (
            <g key={dayDate}>
              <rect x={dayIndex * slotWidth + 5} y={chartHeight - 20 - earningBarHeight} width={barWidth} height={earningBarHeight} rx={2}
                fill={dayDate === date ? 'var(--ac)' : 'var(--ac2)'}><title>{`${dayDate} total earning: ${formatRupees(earning)}`}</title></rect>
              <rect x={dayIndex * slotWidth + 5 + barWidth} y={chartHeight - 20 - cashlessBarHeight} width={barWidth} height={cashlessBarHeight} rx={2}
                fill="var(--ok)"><title>{`${dayDate} cashless: ${formatRupees(cashless)}`}</title></rect>
              <text x={dayIndex * slotWidth + slotWidth / 2} y={chartHeight - 6} fontSize={10} textAnchor="middle" fill="var(--mu)">{dayDate.slice(8)}</text>
            </g>
          );
        })}
      </svg>
    </div>
          </>
  );
}