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


export interface PenaltySection {
  section: string;
  penaltyDetail: string;
  penaltyAmount: number;
}

export const penaltySections: PenaltySection[] = [
  { section: 'Section-59', penaltyDetail: 'Drunkenness or nuisance or spitting or sitting on the floor on the train or quarreling', penaltyAmount: 200 },
  { section: 'Section-60', penaltyDetail: 'Taking offensive materials', penaltyAmount: 200 },
  { section: 'Section-62', penaltyDetail: 'Demonstration of any kind upon railway. For writing, pasting in compartment or carriage etc.', penaltyAmount: 500 },
  { section: 'Section-63', penaltyDetail: 'Travelling on roof of train', penaltyAmount: 50 },
  { section: 'Section-64', penaltyDetail: 'Unlawful entry and walking on metro track', penaltyAmount: 150 },
  { section: 'Section-64(1)', penaltyDetail: 'Unlawful entry (to enter into the coach reserved for women)', penaltyAmount: 250 },
  { section: 'Section-68', penaltyDetail: 'Obstructing officials on duty', penaltyAmount: 500 },
  { section: 'Section-69', penaltyDetail: 'Travelling without ticket or pass', penaltyAmount:50 },
  { section: 'Section-70', penaltyDetail: 'Interfering with means of communication in train or misusing alarm', penaltyAmount: 500 },
  { section: 'Section-72', penaltyDetail: 'Defacing metro properties', penaltyAmount: 200 },
  { section: 'Section-73', penaltyDetail: 'Unauthorized Sale of article on metro railway', penaltyAmount: 400 },
  { section: 'Section-75', penaltyDetail: 'Unauthorized Sale of ticket ', penaltyAmount: 200 },
  { section: 'Section-BR 9.4', penaltyDetail: 'Tailgating, Jumping over the AFC gate in case of under fare Adjustment in QR ticket', penaltyAmount: 50 },
  { section: 'Section-BR 17.3', penaltyDetail: 'Return journey', penaltyAmount: 50 },
  { section: 'Section-BR 17.1', penaltyDetail: 'Pseudo Entry or Eyit at AFC gates', penaltyAmount: 80 },
 

]