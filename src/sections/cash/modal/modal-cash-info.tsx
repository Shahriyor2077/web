// import type { RootState } from "src/store";

// import { useCallback } from "react";
// import { useSelector } from "react-redux";
// import { MdCancel, MdCheckCircle } from "react-icons/md";

// import {
//   Box,
//   Chip,
//   List,
//   Stack,
//   Button,
//   Dialog,
//   Avatar,
//   Tooltip,
//   Divider,
//   ListItem,
//   Typography,
//   DialogTitle,
//   ListItemText,
//   DialogActions,
//   DialogContent,
// } from "@mui/material";

// import { useAppDispatch } from "src/hooks/useAppDispatch";

// import { closeModal } from "src/store/slices/modalSlice";
// import authApi from "src/server/auth";

// const ModalCashInfo = () => {
//   const dispatch = useAppDispatch();
//   const { cashInfoModal } = useSelector((state: RootState) => state.modal);
//   const cash = cashInfoModal.data;
//   const res = await authApi.get(`/customer/get-customer-by-id/${id}`);

//   const { data } = res;

//   const customer = data;

//   const handleClose = useCallback(() => {
//     dispatch(closeModal("cashInfoModal"));
//   }, [dispatch]);

//   return (
//     <Dialog open={!!cashInfoModal?.type} maxWidth="md" fullWidth>
//       <DialogTitle>Yangi To‘lov Qo‘shish</DialogTitle>
//       <DialogContent>
//         <Stack spacing={3}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             gap={2}
//           >
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Avatar
//                 sx={{ width: 50, height: 50 }}
//                 alt={customer?.firstName}
//               />
//               <Typography variant="h6">{`${customer?.firstName} ${customer?.lastName}`}</Typography>
//               {customer?.isActive ? (
//                 <Tooltip title="Tasdiqlangan mijoz" placement="top">
//                   <Typography>
//                     <MdCheckCircle color="green" />
//                   </Typography>
//                 </Tooltip>
//               ) : (
//                 <Tooltip title="Hali tasdiqlanmagan" placement="top">
//                   <Typography>
//                     <MdCancel color="red" />
//                   </Typography>
//                 </Tooltip>
//               )}
//             </Stack>
//           </Stack>

//           <List dense>
//             <ListItem>
//               <ListItemText
//                 primary="Passport seriyasi"
//                 secondary={customer?.passportSeries || "___"}
//               />
//             </ListItem>
//             <Divider component="li" />
//             <ListItem>
//               <ListItemText
//                 primary="Telefon raqami"
//                 secondary={customer?.phoneNumber || "___"}
//               />
//             </ListItem>
//             <Divider component="li" />
//             <ListItem>
//               <ListItemText
//                 primary="Tug'ilgan sana"
//                 secondary={
//                   customer?.birthDate
//                     ? new Date(customer?.birthDate).toLocaleDateString()
//                     : "___"
//                 }
//               />
//             </ListItem>

//             <Divider component="li" />
//             <ListItem>
//               <ListItemText
//                 primary="Telegram"
//                 secondary={
//                   customer?.telegramId ? `@${customer?.telegramId}` : "___"
//                 }
//               />
//             </ListItem>
//             <Divider component="li" />
//             <ListItem>
//               <ListItemText
//                 primary="Manzil"
//                 secondary={customer?.address || "___"}
//               />
//             </ListItem>
//             <Divider component="li" />
//             <ListItem>
//               <ListItemText
//                 primary="Mas'ul menejer"
//                 secondary={
//                   <Box sx={{ display: "inline-block", p: 0 }}>
//                     <Chip
//                       avatar={<Avatar src={undefined} />}
//                       label={`${customer?.manager?.firstName || "___"} ${customer?.manager?.lastName || "___"}`}
//                       variant="outlined"
//                       sx={{ mt: 1, cursor: "pointer", m: 0 }}
//                       // onClick={(e) => {
//                       //   e.stopPropagation();
//                       //   if (customer?.manager._id) {
//                       //     dispatch(setEmployeeId(customer?.manager?._id));
//                       //     navigate("/admin/employee");
//                       //   }
//                       // }}
//                     />
//                   </Box>
//                 }
//               />
//             </ListItem>
//           </List>
//         </Stack>
//       </DialogContent>

//       <DialogActions>
//         <Button color="error" onClick={handleClose}>
//           Bekor qilish
//         </Button>
//         <Button type="submit">Saqlash</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ModalCashInfo;
import type { RootState } from "src/store";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { MdCancel, MdCheckCircle } from "react-icons/md";

import {
  Box,
  Chip,
  List,
  Stack,
  Button,
  Dialog,
  Avatar,
  Tooltip,
  Divider,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";
import { setCustomerId } from "src/store/slices/customerSlice";

const ModalCashInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cashInfoModal } = useSelector((state: RootState) => state.modal);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const id = cashInfoModal?.data?.customerId; // modalga o‘tgan mijoz ID

  const handleClose = useCallback(() => {
    dispatch(closeModal("cashInfoModal"));
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await authApi.get(`/customer/get-customer-by-id/${id}`);
        setCustomer(res.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  return (
    <Dialog open={!!cashInfoModal?.type} maxWidth="md" fullWidth>
      <DialogTitle>Yangi To‘lov Qo‘shish</DialogTitle>
      <DialogContent>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" p={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  alt={customer?.firstName}
                />
                <Typography variant="h6">
                  {customer
                    ? `${customer?.firstName} ${customer?.lastName}`
                    : "___"}
                </Typography>
                {customer?.isActive ? (
                  <Tooltip title="Tasdiqlangan mijoz" placement="top">
                    <Typography>
                      <MdCheckCircle color="green" />
                    </Typography>
                  </Tooltip>
                ) : (
                  <Tooltip title="Hali tasdiqlanmagan" placement="top">
                    <Typography>
                      <MdCancel color="red" />
                    </Typography>
                  </Tooltip>
                )}
              </Stack>
            </Stack>

            <List dense>
              <ListItem>
                <ListItemText
                  primary="Passport seriyasi"
                  secondary={customer?.passportSeries || "___"}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Telefon raqami"
                  secondary={customer?.phoneNumber || "___"}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Tug'ilgan sana"
                  secondary={
                    customer?.birthDate
                      ? new Date(customer?.birthDate).toLocaleDateString()
                      : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Telegram"
                  secondary={
                    customer?.telegramId ? `@${customer?.telegramId}` : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Manzil"
                  secondary={customer?.address || "___"}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Mas'ul menejer"
                  secondary={
                    <Box sx={{ display: "inline-block", p: 0 }}>
                      <Chip
                        avatar={<Avatar src={undefined} />}
                        label={`${customer?.manager?.firstName || "___"} ${
                          customer?.manager?.lastName || "___"
                        }`}
                        variant="outlined"
                        // sx={{ mt: 1, cursor: "pointer", m: 0 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  if (id) {
                    dispatch(setCustomerId(id));
                    navigate("/admin/user");
                    handleClose();
                  }
                }}
              >
                Batafsil
              </Button>
            </List>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Yopish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCashInfo;
