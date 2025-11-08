import type { IContract } from "src/types/contract";

import React, { useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Stack,
  Checkbox,
  Accordion,
  TextField,
  Typography,
  IconButton,
  AccordionDetails,
  FormControlLabel,
  AccordionSummary,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { formatNumber } from "src/utils/format-number";

import { grey } from "src/theme/core";
import { setModal } from "src/store/slices/modalSlice";

import { Iconify } from "../iconify";

interface IReadOnlyTextFieldProps {
  value: string | number;
  label: string;
}

const ReadOnlyTextField = ({ value, label }: IReadOnlyTextFieldProps) => (
  <TextField
    value={value}
    margin="dense"
    label={label}
    fullWidth
    disabled
    InputProps={{
      sx: {
        color: "black",
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "black",
        },
      },
    }}
    InputLabelProps={{
      shrink: true,
      sx: {
        color: "black",
        "&.Mui-disabled": {
          color: "black",
        },
      },
    }}
  />
);

interface IProps {
  contract: IContract;
  showName?: boolean;
  readOnly?: boolean;
}

const RenderContractFields: React.FC<IProps> = ({
  contract,
  showName = false,
  readOnly = false,
}) => {
  const dispatch = useAppDispatch();
  const { paymentDeadline } = useMemo(() => {
    const deadlineDate = new Date(contract.startDate);
    deadlineDate.setMonth(deadlineDate.getMonth() + contract.period);

    return {
      paymentDeadline: deadlineDate.toISOString().split("T")[0],
    };
  }, [contract]);
  const dateFormat = (dateString: string) => dateString?.split("T")[0] || "";

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        mb={2}
      >
        <Typography variant="h6">Shartnoma ma&#39;lumotlari</Typography>
        {!readOnly && (
          <IconButton
            aria-label="update"
            size="small"
            onClick={() => {
              dispatch(
                setModal({
                  modal: "contractModal",
                  data: { type: "edit", data: contract },
                })
              );
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        )}
      </Stack>

      {showName && (
        <Grid xs={12}>
          <ReadOnlyTextField
            value={contract.productName}
            label="Mahsulot nomi"
          />
        </Grid>
      )}
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.originalPrice)}
          label="Asl narxi"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.price)}
          label="Sotuv narxi"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.initialPayment)}
          label={`Oldindan to'lov`}
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={dateFormat(contract.initialPaymentDueDate)}
          label="Oldindan to'lov sanasi"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.percentage)}
          label="Foiz"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.period)}
          label="Muddat (oy)"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.monthlyPayment)}
          label={`Oylik to'lov`}
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.totalPrice)}
          label="Umumiy narx"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.totalPaid)}
          label="To'langan summa"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={formatNumber(contract.remainingDebt)}
          label="Qolgan summa"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={dateFormat(contract.startDate)}
          label="Shartnoma sanasi"
        />
      </Grid>
      <Grid xs={6} md={4}>
        <ReadOnlyTextField
          value={dateFormat(paymentDeadline)}
          label="To'lov muddati"
        />
      </Grid>
      <Grid xs={12}>
        <TextField
          value={contract.notes || ""}
          label="Izoh"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          disabled
          InputProps={{
            sx: {
              color: "black",
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black",
              },
            },
          }}
        />
      </Grid>
      <Grid xs={12}>
        <Accordion
          sx={{
            mt: 2,
            bgcolor: grey[300],
            borderRadius: 1,
          }}
        >
          <AccordionSummary expandIcon={<FaChevronDown />}>
            <Typography variant="subtitle1">
              Qo&lsquo;shimcha ma&#39;lumotlar
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox checked={contract.info.box} readOnly name="box" />
                  }
                  label="Karobka"
                />
              </Grid>
              <Grid xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={contract.info.mbox}
                      readOnly
                      name="mbox"
                    />
                  }
                  label="Muslim karobka"
                />
              </Grid>
              <Grid xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={contract.info.receipt}
                      readOnly
                      name="receipt"
                    />
                  }
                  label="Tilxat"
                />
              </Grid>
              <Grid xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={contract.info.iCloud}
                      readOnly
                      name="icloud"
                    />
                  }
                  label="iCloud"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default RenderContractFields;
