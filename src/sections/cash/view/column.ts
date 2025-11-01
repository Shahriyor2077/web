import type { Column } from "src/components/table/types";

export const columnsCash: Column[] = [
  {
    id: "fullName",
    label: "Ism-Familiya",
    sortable: true,
    // renderCell: (row) => {
    //   const currency = row.currency === "usd" ? "$" : "so'm";
    //   return `${row.initialPaymentDueDate} ${row.customerName}`;
    // },
    // renderCell: (row) => {
    //   const day = new Date(row.startDate).getDate(); // faqat kunni oladi
    //   return `${day} ${row.fullName}`;
    // },
  },
  // { id: "fullName", label: "Ism-Familiya", sortable: true },
  // { id: "phoneNumber", label: "Telefon raqami", sortable: true },
  { id: "manager", label: "Menejer", sortable: true },
  {
    id: "debtAmount",
    label: "Qarizdorlik summasi",
    format: (value: number) => `${value.toLocaleString()} $`,
  },
  {
    id: "paidAmount",
    label: "Undirilgan summa",
    format: (value: number) => `${value.toLocaleString()} $`,
  },

  { id: "status", label: "Holat", sortable: true },
  { id: "overdueDays", label: "Kechikish kunlari" },
  { id: "notes", label: "Izoh", sortable: true },
];
