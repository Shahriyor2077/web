import type { RootState } from "src/store";
import type { TypedUseSelectorHook} from "react-redux";

import { memo } from "react";
import { useSelector } from "react-redux";

import ContractsView from "./contract-view";
import ModalContract from "../modal/modal-contract";
import ModalCustomer from "../../customer/modal/modal-customer";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const ContractView = () => {
  const { contractId } = useTypedSelector((state) => state.contract);

  console.log("render contract");

  return (
    <>
      {/* <ContractView /> */}
      {/* {contractId ? <ContractDetails /> : <ContractsView />} */}
      {contractId ? <div /> : <ContractsView />}
      <ModalContract />
      <ModalCustomer show />
    </>
  );
};

export default memo(ContractView);
