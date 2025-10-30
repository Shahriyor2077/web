export type CurrencyDetails = {
  dollar: number;
  sum: number;
};

export interface ICash {
  _id: string;
  fullName: string;
  phoneNumber: string;
  debtAmount: number;
  paidAmount: number;
  manager: string;
  status: string;
  overdueDays: number;
  notes: string;
  currencyDetails: CurrencyDetails;
  currencyCourse: number;
}
