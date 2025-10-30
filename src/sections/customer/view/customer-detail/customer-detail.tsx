import type { RootState } from "src/store";

import { TbPhoto } from "react-icons/tb";
import { useSelector } from "react-redux";
import { FaPassport } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { lazy, Suspense, useEffect } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Stack,
  Paper,
  Table,
  Button,
  TableRow,
  Skeleton,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { DashboardContent } from "src/layouts/dashboard";
import { setCustomerId } from "src/store/slices/customerSlice";
import { getCustomer } from "src/store/actions/customerActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";
import CustomerInfo from "src/components/customer-infos/customerInfo";

import Statistics from "./statistics";

const CustomerContract = lazy(() => import("./customer-contract"));

export function CustomerDetails() {
  const dispatch = useAppDispatch();
  const { customer, isLoading, customerId } = useSelector(
    (state: RootState) => state.customer
  );
  const allActiveContracts = customer?.contracts?.filter(
    (c) => c.isActive && c.status === "active"
  );

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomer(customerId));
    }
  }, [customerId, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (customer == null) {
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
            onClick={() => dispatch(setCustomerId(null))}
          >
            Ortga
          </Button>
        </Box>
        <Typography variant="h4">No data</Typography>
      </DashboardContent>
    );
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
          onClick={() => dispatch(setCustomerId(null))}
        >
          Ortga
        </Button>
      </Box>

      <Grid container spacing={3} my={2}>
        <Grid xs={12}>
          <Statistics customer={customer} contracts={allActiveContracts} />
        </Grid>
        <Grid xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <CustomerInfo customer={customer} />
          </Paper>
        </Grid>
        <Grid xs={12} md={6} display="flex" flexDirection="column" gap={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography mb={3} variant="h6">
              Yuklangan hujjatlar
            </Typography>
            <Stack direction="column" spacing={2}>
              <Stack
                sx={{ cursor: "pointer" }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <FaPassport />
                <Typography>Passport.pdf</Typography>
              </Stack>
              <Stack
                sx={{ cursor: "pointer" }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <FaRegFileLines />
                <Typography>Shartnoma.pdf</Typography>
              </Stack>
              <Stack
                sx={{ cursor: "pointer" }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <TbPhoto />
                <Typography>Foto.jpg</Typography>
              </Stack>
            </Stack>
          </Paper>
          {/* <Paper elevation={3} sx={{ p: 2 }}>
            <Typography mb={3} variant="h6">
              Yaqinlashayotgan to‘lovlar
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sana</TableCell>
                    <TableCell align="right">Summa</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography mb={3} variant="h6">
              So‘nggi to‘lovlar
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sana</TableCell>
                    <TableCell align="right">Summa</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Paper> */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography mb={3} variant="h6">
              Yaqinlashayotgan to‘lovlar
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sana</TableCell>
                    <TableCell align="right">Summa</TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {allActiveContracts
                    ?.filter((c) => c.nextPaymentDate)
                    .sort(
                      (a, b) =>
                        new Date(a.nextPaymentDate).getTime() -
                        new Date(b.nextPaymentDate).getTime()
                    )
                    .slice(0, 3)
                    .map((contract, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {contract.nextPaymentDate.split("T")[0]}
                        </TableCell>
                        <TableCell align="right">
                          {contract.monthlyPayment?.toLocaleString()} $
                        </TableCell>
                      </TableRow>
                    ))}
                </tbody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid xs={12}>
          <Suspense
            fallback={
              <Stack spacing={3}>
                <Skeleton variant="rounded" width="100%" height={60} />
                <Skeleton variant="rounded" width="100%" height={60} />
              </Stack>
            }
          >
            <CustomerContract customerContracts={customer.contracts} />
          </Suspense>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
