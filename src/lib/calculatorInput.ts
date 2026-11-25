const allowedExpression = /^[\d\s+\-*/().]+$/;

export function evaluateCellSum(typedText: string): number | undefined {
  const expression = typedText.trim().replace(/,/g, "");
  if (!expression || !allowedExpression.test(expression) || !/\d/.test(expression)) {
    return undefined;
  }

  let result: unknown;
  try {
    result = Function(`"use strict"; return (${expression});`)();
  } catch (error) {
    if (error instanceof SyntaxError) return undefined;
    throw error;
  }

  return typeof result === "number" && Number.isFinite(result)
    ? Math.round(result * 100) / 100
    : undefined;
}

export function settledCellText(typedText: string): string {
  if (!/[+\-*/]/.test(typedText.trim().replace(/^-/, ""))) return typedText;
  const total = evaluateCellSum(typedText);
  return total === undefined ? typedText : String(total);
}
