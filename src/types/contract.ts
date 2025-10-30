import type { ICustomer } from "./customer";

export interface IPayment {
  amount: number;
  date: Date;
  method: string;
  isPaid: boolean;
  notes: string;
  _id: string;
}

export interface IContractInfo {
  box: boolean;
  mbox: boolean;
  receipt: boolean;
  iCloud: boolean;
}

export interface IContract {
  customer?: ICustomer;
  productName: string;
  originalPrice: number;
  price: number;
  initialPayment: number;
  percentage: number;
  period: number;
  initialPaymentDueDate: string;
  monthlyPayment: number;
  notes: string;
  totalPrice: number;

  startDate: string;
  _id: string;
  clientId: string;
  remainingDebt: number;
  totalPaid: number;
  nextPaymentDate: string;
  isActive: boolean;
  isDelete: boolean;
  status: "active" | "completed" | "cancelled";
  payments: IPayment[] | [];
  info: IContractInfo;
}

export interface IAddContract {
  customer: string;
  productName: string;
  originalPrice: number;
  price: number;
  initialPayment: number;
  percentage: number;
  period: number;
  initialPaymentDueDate: string;
  monthlyPayment: number;
  notes: string;
  box: boolean;
  mbox: boolean;
  receipt: boolean;
  iCloud: boolean;
  totalPrice: number;
}

export interface IEditContract extends IAddContract {
  id: string;
}
