/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from "react";
import type { RootState } from "src/store";
import type { IAddCustomer, IEditCustomer } from "src/types/customer";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";
import { getManagers } from "src/store/actions/employeeActions";
import { addCustomer, updateCustomer } from "src/store/actions/customerActions";

// import { addCustomer, updateCustomer } from "src/store/actions/customerActions";

interface IForm {
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  // percent: number;
  address: string;
  birthDate: Date | null;
  managerId: string;
}

interface IProps {
  show?: boolean;
}

const ModalCustomer: FC<IProps> = ({ show = false }) => {
  const dispatch = useAppDispatch();
  const { customerModal } = useSelector((state: RootState) => state.modal);
  const { managers, isLoading } = useSelector(
    (state: RootState) => state.employee
  );

  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelper, setPhoneHelper] = useState("");
  const [passportError, setPassportError] = useState(false);
  const [passportHelper, setPassportHelper] = useState("");
  const [checking, setChecking] = useState(false);
  // const hasFetchedManager = useRef(false);

  const customer = customerModal || {};

  const defaultFormValues: IForm = {
    firstName: "",
    lastName: "",
    passportSeries: "",
    phoneNumber: "+998",
    // percent: 30,
    address: "",
    birthDate: null,
    managerId: "",
  };

  const [formValues, setFormValues] = useState<IForm>(defaultFormValues);

  useEffect(() => {
    if (customerModal?.type === "edit" && customer.data) {
      setFormValues({
        firstName: customer.data.firstName || "",
        lastName: customer.data.lastName || "",
        passportSeries: customer.data.passportSeries || "",
        phoneNumber: customer.data.phoneNumber || "+998",
        // percent: customer.data.percent || 30,
        address: customer.data.address || "",
        birthDate: customer.data.birthDate
          ? new Date(customer.data.birthDate)
          : null,
        managerId: customer.data.manager?._id || "",
      });
    }
  }, [customer, customerModal?.type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "birthDate") {
      newValue = new Date(value);
    }

    if (name === "passportSeries") {
      newValue = value.toUpperCase();
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Har doim +998 bilan boshlanishini ta'minlaymiz
    if (!input.startsWith("+998")) return;

    const formatted = input.replace(/[^\d+]/g, ""); // Raqamdan boshqa belgilarni olib tashlash

    // Maksimal uzunlikni cheklaymiz
    if (formatted.length > 13) return;

    setFormValues((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  useEffect(() => {
    const phone = formValues.phoneNumber;

    if (/^\+998\d{9}$/.test(phone)) {
      setPhoneHelper("");
      setPhoneError(false);
      if (customer?.data?.phoneNumber !== formValues.phoneNumber) {
        
        const checkPhone = async () => {
          try {
            setChecking(true);
            console.log("res", phone);
            const phoneNumber = phone.replace("+", "");
            const res = await authApi.get(
              `/customer/check-phone?phone=${phoneNumber}`
            );
            if (res.data.exists) {
              setPhoneError(true);
              setPhoneHelper("Bu telefon raqam allaqachon mavjud");
            }
          } catch (err) {
            setPhoneError(true);
            setPhoneHelper("Server bilan bog‘lanishda xatolik");
          } finally {
            setChecking(false);
          }
        };

        checkPhone();
      }
    } else {
      setPhoneError(false);
      setPhoneHelper("");
    }
  }, [formValues.phoneNumber]);

  const handlePhoneBlur = () => {
    const phone = formValues.phoneNumber;
    if (!/^\+998\d{9}$/.test(phone)) {
      setPhoneError(true);
      setPhoneHelper("Telefon raqam to‘liq va +998 bilan boshlanishi kerak");
    }
  };

  useEffect(() => {
    const passport = formValues.passportSeries;

    if (/^[A-Z]{2}\d{7}$/.test(passport)) {
      if (customer?.data?.passportSeries !== formValues.passportSeries) {
        const checkPassport = async () => {
          try {
            const res = await authApi.get(
              `/customer/check-passport?passport=${passport}`
            );
            if (res.data.exists) {
              setPassportError(true);
              setPassportHelper("Bu passport seriyasi allaqachon mavjud");
            } else {
              setPassportError(false);
              setPassportHelper("");
            }
          } catch (err) {
            setPassportError(true);
            setPassportHelper("Server bilan bog‘lanishda xatolik");
          }
        };

        checkPassport();
      }
    } else {
      setPassportError(false);
      setPassportHelper("");
    }
  }, [formValues.passportSeries]);

  const handlePassportBlur = () => {
    const passport = formValues.passportSeries;

    if (!/^[A-Z]{2}\d{7}$/.test(passport)) {
      setPassportError(true);
      setPassportHelper(
        "2 ta harf va 7 ta raqamdan iborat bo‘lishi kerak (masalan: AA1234567)"
      );
    }
  };

  const handleClose = useCallback(() => {
    setFormValues(defaultFormValues);
    dispatch(closeModal("customerModal"));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formJson = {
        ...formValues,
        // percent: Number(formValues.percent),
        id: customer.data?._id,
      };
      console.log("formJson", formJson);

      if (customerModal?.type === "edit") {
        dispatch(updateCustomer(formJson as unknown as IEditCustomer));
      } else {
        dispatch(addCustomer(formValues as IAddCustomer, show));
      }

      handleClose();
    },
    [formValues, customer, customerModal?.type, dispatch, handleClose]
  );

  const handleCustomerFocus = useCallback(() => {
    // if (!hasFetchedManager.current && managers.length === 0) {
    dispatch(getManagers());
    //   hasFetchedManager.current = true;
    // }
  }, [managers.length, dispatch]);

  const isFormValid =
    formValues.firstName.trim() !== "" &&
    (formValues.passportSeries === "" ||
      /^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)) &&
    (formValues.phoneNumber === "" ||
      /^\+998\d{9}$/.test(formValues.phoneNumber)) &&
    // formValues.percent > 0 &&
    formValues.managerId !== "" &&
    !phoneError &&
    !passportError &&
    !checking;

  return (
    <Dialog
      open={!!customerModal?.type}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      // maxWidth="sm"
      fullWidth
    >
      {!!customerModal?.type && (
        <>
          <DialogTitle>
            {customerModal?.type === "edit"
              ? "Mijozni Tahrirlash"
              : "Yangi Mijoz Qo'shish"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid xs={12} md={6}>
                <TextField
                  value={formValues.firstName}
                  onChange={handleChange}
                  autoFocus
                  required
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  label="Ismi"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  value={formValues.lastName}
                  onChange={handleChange}
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  label="Familiyasi"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  // value={formValues.passportSeries}
                  // onChange={handleChange}
                  // margin="dense"
                  // id="passportSeries"
                  // name="passportSeries"
                  // label="Passport seriyasi"
                  // fullWidth
                  // error={
                  //   formValues.passportSeries.length > 0 &&
                  //   !/^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)
                  // }
                  // helperText={
                  //   formValues.passportSeries.length > 0 &&
                  //   !/^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)
                  //     ? "2 ta harf va 7 ta raqamdan iborat bo'lishi kerak (masalan: AA1234567)"
                  //     : ""
                  // }
                  value={formValues.passportSeries}
                  onChange={handleChange}
                  onBlur={handlePassportBlur}
                  margin="dense"
                  id="passportSeries"
                  name="passportSeries"
                  label="Passport seriyasi"
                  fullWidth
                  error={passportError}
                  helperText={passportHelper}
                  inputProps={{
                    maxLength: 9,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  // value={formValues.phoneNumber}
                  // onChange={handleChange}
                  // required
                  // margin="dense"
                  // id="phoneNumber"
                  // name="phoneNumber"
                  // label="Telefon raqam"
                  // fullWidth
                  // error={
                  //   formValues.phoneNumber.length > 0 &&
                  //   !/^\+998\d{9}$/.test(formValues.phoneNumber)
                  // }
                  // helperText={
                  //   formValues.phoneNumber.length > 0 &&
                  //   !/^\+998\d{9}$/.test(formValues.phoneNumber)
                  //     ? "Telefon raqam to'liq kiriting"
                  //     : ""
                  // }
                  // inputProps={{
                  //   // inputMode: "numeric",
                  //   // pattern: "[0-9]*",
                  //   maxLength: 13,
                  //   minLength: 13,
                  // }}
                  value={formValues.phoneNumber}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  required
                  margin="dense"
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Telefon raqam"
                  fullWidth
                  error={phoneError}
                  helperText={phoneHelper}
                  inputProps={{
                    maxLength: 13,
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  value={
                    formValues.birthDate
                      ? formValues.birthDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  margin="dense"
                  id="birthDate"
                  name="birthDate"
                  label="Tug'ilgan sana"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onKeyDown={(e) => e.preventDefault()}
                />
              </Grid>
              {/* <Grid xs={12} md={6}>
                <TextField
                  value={formValues.percent}
                  onChange={handleChange}
                  margin="dense"
                  id="percent"
                  name="percent"
                  label="Yillik foiz"
                  type="number"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid> */}
              <Grid xs={12}>
                <TextField
                  value={formValues.address}
                  onChange={handleChange}
                  margin="dense"
                  id="address"
                  name="address"
                  label="Manzil"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid xs={12}>
                <Autocomplete
                  onFocus={handleCustomerFocus}
                  options={managers}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  loading={isLoading}
                  loadingText="Yuklanmoqda..."
                  noOptionsText="Menejer topilmadi"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Foydalanuvchini tanlang"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(_event, value) => {
                    if (value?._id) {
                      setFormValues((prev) => ({
                        ...prev,
                        managerId: value?._id,
                      }));
                    }
                  }}
                  value={customer.data?.manager}
                  sx={{ margin: "dense" }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button
              type="submit"
              color={
                customerModal?.type === "edit" && !customerModal.data?.isActive
                  ? "success"
                  : "primary"
              }
              disabled={!isFormValid}
            >
              {customerModal?.type === "edit" && !customerModal.data?.isActive
                ? "Tasdiqlash"
                : "Saqlash"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ModalCustomer;
