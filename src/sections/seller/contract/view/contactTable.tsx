import type { IContract } from "src/types/contract";
import type { Column } from "src/components/table/types";

import { useTableLogic } from "src/hooks/useTableLogic";
// import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { setContractData } from "src/store/slices/contractSlice";

import { GenericTable } from "src/components/table/GnericTable";

interface ContractTableProps {
  data: IContract[];
  columns: Column[];
}

const ContractTable = ({ data, columns }: ContractTableProps) => {
  // const dispatch = useAppDispatch();
  const logic = useTableLogic<IContract>(data, columns);

  return <GenericTable data={data} columns={columns} logic={logic} />;
};

export default ContractTable;
