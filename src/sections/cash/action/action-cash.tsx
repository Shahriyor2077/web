import type { ICash } from "src/types/cash";

// }
import { useCallback } from "react";

import { IconButton } from "@mui/material";
// import Popover from "@mui/material/Popover";
// import MenuList from "@mui/material/MenuList";
// import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
// import { setCashData } from "src/store/slices/cashSlice";

import { Iconify } from "src/components/iconify";

export default function ActionCash({ cash }: { cash: ICash }) {
  const dispatch = useAppDispatch();
  // const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
  //   null
  // );

  // const handleOpenPopover = useCallback(
  //   (event: React.MouseEvent<HTMLButtonElement>) => {
  //     setOpenPopover(event.currentTarget);
  //   },
  //   []
  // );

  // const handleClosePopover = useCallback(() => {
  //   setOpenPopover(null);
  // }, []);

  const handleSelect = useCallback(() => {
    dispatch(
      setModal({
        modal: "cashModal",
        data: { type: "edit", data: cash },
      })
    );
    // dispatch(setCashData(cash));
    // handleClosePopover();
  }, [dispatch, cash]);

  return (
    <>
      {/* <IconButton onClick={handleOpenPopover}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton> */}
      <IconButton onClick={handleSelect}>
        <Iconify icon="solar:pen-bold" />
      </IconButton>

      {/* <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          <MenuItem onClick={handleSelect}>
            <Iconify icon="solar:pen-bold" />
            Tahrirlash
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
