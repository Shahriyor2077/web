import { memo } from "react";

import CustomerView from "./customer-view";
import ModalCustomer from "../modal/modal-customer";

const CustomersView = () => {
  console.log("render user");

  return (
    <>
      <CustomerView />
      <ModalCustomer />
    </>
  );
};

export default memo(CustomersView);
