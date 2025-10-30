import type { IContract } from "src/types/contract";

import React from "react";
import { FaPrint } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Paper,
  Stack,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import RenderContractFields from "src/components/render-contract-fields/renderContractFields";
import RenderPaymentHistory from "src/components/render-payment-history/renderPaymentHistory";

interface IProps {
  customerContracts?: IContract[];
}

const CustomerContract: React.FC<IProps> = ({ customerContracts }) => {
  console.log("dfdgf", customerContracts);

  const sortedContracts = [...(customerContracts ?? [])].sort((a, b) => {
    const order = { active: 0, cancelled: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div>
      <Stack spacing={3}>
        <Typography variant="h6">Xarid qilingan mahsulotlar</Typography>

        {sortedContracts?.map((contract) => (
          <Paper
            elevation={2}
            sx={{ mb: 2, borderRadius: 2, p: 1 }}
            key={contract._id}
          >
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary expandIcon={<IoChevronDownOutline size={20} />}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  alignItems="center"
                >
                  <Typography fontWeight="bold">
                    {contract.productName}
                  </Typography>
                  <Typography fontWeight="bold">
                    {contract.startDate.split("T")[0]}
                  </Typography>
                  <Typography fontWeight="bold">
                    {contract.period} oy
                  </Typography>
                  <Typography fontWeight="bold">
                    {contract.monthlyPayment} oyiga
                  </Typography>
                  <Typography
                    color={
                      contract.status === "active"
                        ? "green"
                        : contract.status === "completed"
                          ? "orange"
                          : "red"
                    }
                  >
                    {contract.status === "active"
                      ? "Faol"
                      : contract.status === "completed"
                        ? "Yakunlangan"
                        : "Bekor qilingan"}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                  gap: 2,
                }}
              >
                <Grid container spacing={1}>
                  <RenderContractFields contract={contract} />
                </Grid>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">To`lov tarixi:</Typography>
                  <RenderPaymentHistory payments={contract.payments} />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    gap={2}
                    p={3}
                    bgcolor="ButtonHighlight"
                    borderRadius={3}
                    minWidth={500}
                  >
                    <Stack
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyItems="end"
                    >
                      <Typography>Shartnoma.pdf</Typography>
                      <FaPrint />
                    </Stack>
                    <Stack
                      sx={{ cursor: "pointer" }}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography>To`lov tavsifi</Typography>
                      <FaPrint />
                    </Stack>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Stack>
    </div>
  );
};

export default CustomerContract;
