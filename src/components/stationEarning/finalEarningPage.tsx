import { useMemo } from "react";
import EarningSheetTable, { type SheetStyle } from "./earningSheetTable";
import type { RegisterState } from "../../lib/registerTypes";
import { sumRowsByField } from "../../lib/earningCalculations";
import { tableCellClass, tableHeaderCellClass } from "../../globalStyles";
import { useDashboardFigures } from "../../hooks/useDashboardFigures";
import { parseNumber, type ColumnNode } from "../../lib/earningColumns";

interface FinalEarningPageProps {
  columns:ColumnNode[];
  registerState: RegisterState;
  date: string;
}

const penaltyTypeColumnIndex = 4;
const penaltyAmountColumnIndex = 8;

// Roomier cells and centered text while preserving the shared table palette.
const finalEarningSheetStyle: SheetStyle = {
  headerCellClass: `${tableHeaderCellClass} px-4 py-3 text-sm font-bold`,
  headerColorClasses: [""],
  bodyCellClass: `${tableCellClass} px-4 py-6 text-center font-bold`,
  footerCellClass: "",
};

// one row of totals: Shift Entry and TVM Earning of the selected date, side by side under shared headers
export default function FinalEarningPage({
  columns,
  registerState,
  date,
}: FinalEarningPageProps) {
  // inside the component
  const figures = useDashboardFigures(registerState, date);
  const sentToBankToday = figures.existingTransfer?.amount ?? 0;
  const finalRow = useMemo(
    () => {
      const shiftTotals = sumRowsByField(Object.values(registerState.shiftEntries[date] ?? {}));
      const tvmTotals = sumRowsByField(Object.values(registerState.tvmEntries?.[date] ?? {}));
      const penaltyTotals = (registerState.detailLists?.[date]?.penaltyDetails ?? []).reduce(
        (totals, row) => {
          const amount = parseNumber(row[penaltyAmountColumnIndex]);
          const type = row[penaltyTypeColumnIndex];
          if (type === "manualPenaltyAmount") {
            totals.manualPenaltyAmount += amount;
            totals.manualPenaltyQuantity += 1;
          }
          if (type === "hhtPenaltyCashAmount") {
            totals.hhtPenaltyCashAmount += amount;
            totals.hhtPenaltyCashQuantity += 1;
          }
          if (type === "hhtPenaltyPurseAmount") {
            totals.hhtPenaltyPurseAmount += amount;
            totals.hhtPenaltyPurseQuantity += 1;
          }
          return totals;
        },
        {
          manualPenaltyAmount: 0,
          manualPenaltyQuantity: 0,
          hhtPenaltyCashAmount: 0,
          hhtPenaltyCashQuantity: 0,
          hhtPenaltyPurseAmount: 0,
          hhtPenaltyPurseQuantity: 0,
        },
      );

      return {
        finalRowLabel: "Total",
        ...shiftTotals,
        ...tvmTotals,
        manualPenaltyAmount: String(
          parseNumber(shiftTotals.manualPenaltyAmount) +
          parseNumber(tvmTotals.manualPenaltyAmount) +
          penaltyTotals.manualPenaltyAmount,
        ),
        hhtPenaltyCashAmount: String(
          parseNumber(shiftTotals.hhtPenaltyCashAmount) +
          parseNumber(tvmTotals.hhtPenaltyCashAmount) +
          penaltyTotals.hhtPenaltyCashAmount,
        ),
        hhtPenaltyPurseAmount: String(
          parseNumber(shiftTotals.hhtPenaltyPurseAmount) +
          parseNumber(tvmTotals.hhtPenaltyPurseAmount) +
          penaltyTotals.hhtPenaltyPurseAmount,
        ),
        manualPenaltyQuantity: String(
          parseNumber(shiftTotals.manualPenaltyQuantity) +
          parseNumber(tvmTotals.manualPenaltyQuantity) +
          penaltyTotals.manualPenaltyQuantity,
        ),
        hhtPenaltyCashQuantity: String(
          parseNumber(shiftTotals.hhtPenaltyCashQuantity) +
          parseNumber(tvmTotals.hhtPenaltyCashQuantity) +
          penaltyTotals.hhtPenaltyCashQuantity,
        ),
        hhtPenaltyPurseQuantity: String(
          parseNumber(shiftTotals.hhtPenaltyPurseQuantity) +
          parseNumber(tvmTotals.hhtPenaltyPurseQuantity) +
          penaltyTotals.hhtPenaltyPurseQuantity,
        ),
        previousDayCashOnHand: String(figures.previousDaysCash + sentToBankToday),
        totalCashToBank: String(sentToBankToday),
        bankSlipNumber: figures.existingTransfer?.slipNumber ?? "",
        todayCashOnHand: String(figures.totalCashInHand),
      };
    },
    [registerState, date, figures, sentToBankToday],
  );

  return (
    <div className="space-y-3">
      <EarningSheetTable
        columns={columns}
        gridName="final"
        frozenColumnCount={0}
        rowCount={1}
        readRow={() => finalRow}
        showTotalRow={false}
        sheetStyle={finalEarningSheetStyle}
      />
      <p className="text-sm text-mu">Read-only totals for the selected date.</p>
    </div>
  );
}
