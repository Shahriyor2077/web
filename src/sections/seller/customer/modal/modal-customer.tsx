/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from "react";
import type { RootState } from "src/store";
import type { IAddCustomer } from "src/types/customer";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";
import { setCustomer } from "src/store/slices/customerSlice";
import { addCustomerSeller } from "src/store/actions/customerActions";

interface IForm {
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  address: string;
  birthDate: Date | null;
}

interface IProps {
  show?: boolean;
}

const ModalCustomer: FC<IProps> = ({ show = false }) => {
  const dispatch = useAppDispatch();
  const { customerModal } = useSelector((state: RootState) => state.modal);

  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelper, setPhoneHelper] = useState("");
  const [passportError, setPassportError] = useState(false);
  const [passportHelper, setPassportHelper] = useState("");
  const [checking, setChecking] = useState(false);

  const defaultFormValues: IForm = {
    firstName: "",
    lastName: "",
    passportSeries: "",
    phoneNumber: "+998",
    address: "",
    birthDate: null,
  };

  const [formValues, setFormValues] = useState<IForm>(defaultFormValues);

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

    console.log("formatted", formatted);

    setFormValues((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  useEffect(() => {
    const phone = formValues.phoneNumber;

    if (/^\+998\d{9}$/.test(phone)) {
      setChecking(true);
      setPhoneError(false);
      setPhoneHelper("");

      // Simulyatsiya: telefonni tekshirish uchun API chaqiruv
      const checkPhone = async () => {
        try {
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
    dispatch(setCustomer(null));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(addCustomerSeller(formValues as IAddCustomer, show));
      handleClose();
    },
    [dispatch, formValues, handleClose]
  );

  const isFormValid =
    formValues.firstName.trim() !== "" &&
    (formValues.passportSeries === "" ||
      /^[A-Z]{2}\d{7}$/.test(formValues.passportSeries)) &&
    (formValues.phoneNumber === "" ||
      /^\+998\d{9}$/.test(formValues.phoneNumber)) &&
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
      fullWidth
    >
      {!!customerModal?.type && (
        <>
          <DialogTitle>Yangi mijoz qo&lsquo;shish</DialogTitle>
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
              <Grid xs={12} md={4}>
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
              <Grid xs={12} md={4}>
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
              <Grid xs={12} md={4}>
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
                />
              </Grid>
            </Grid>

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
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Saqlash
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ModalCustomer;
