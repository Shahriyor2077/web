import type { RootState } from "src/store";

import { useState } from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Unstable_Grid2";
import { Box, Paper, Button } from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { DashboardContent } from "src/layouts/dashboard";
import { setContractId } from "src/store/slices/contractSlice";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";
import CustomerInfo from "src/components/customer-infos/customerInfo";
import PayCommentModal from "src/components/render-payment-history/pay-comment-modal";
import RenderPaymentHistory from "src/components/render-payment-history/renderPaymentHistory";

import Calculate from "./calculate";

const ContractDetails = () => {
  const dispatch = useAppDispatch();
  const [selectedComment, setSelectedComment] = useState("");
  const { contract, isLoading } = useSelector(
    (state: RootState) => state.contract
  );
  const { customer } = useSelector((state: RootState) => state.customer);

  if (!contract && isLoading) {
    return <Loader />;
  }
  return (
    <DashboardContent>
      <Box
        display="flex"
        alignItems="center"
        mb={5}
        justifyContent="space-between"
      >
        <Button
          color="inherit"
          startIcon={<Iconify icon="weui:back-filled" />}
          onClick={() => dispatch(setContractId(null))}
        >
          Ortga
        </Button>
      </Box>

      <Grid container spacing={3} my={2}>
        <Grid xs={12} display="flex" flexDirection="column" gap={3}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            {contract?.customer && <CustomerInfo customer={customer} top />}
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          {contract && <Calculate contract={contract} />}
        </Grid>
        <Grid xs={12} md={6}>
          {contract?.payments && (
            <RenderPaymentHistory payments={contract?.payments} />
          )}
        </Grid>
      </Grid>
      <PayCommentModal
        open={selectedComment}
        onClose={() => setSelectedComment("")}
      />
    </DashboardContent>
  );
};

export default ContractDetails;
