// notes that can be sent to the bank (no ₹50)
export const bankNoteValues = [500, 200, 100];
export const bankRoundingAmount = 100;

// TOM operators: imprest is issued only to 80 and 81, the others get advance only
export const tomOperators = [
  { tomNumber: '80', imprestAmount: 500 },
  { tomNumber: '81', imprestAmount: 500 },
  { tomNumber: '51', imprestAmount: 0 },
  { tomNumber: '52', imprestAmount: 0 },
];

// replace with the sections defined in your business rule
export const penaltySections = [
  'Travelling without valid ticket', 'Unauthorised entry / exit', 'Misuse of concession card', 'Excess travel / overstay', 'Other',
];