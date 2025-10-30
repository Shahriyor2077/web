import type { ICash } from "src/types/cash";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  cashs: ICash[];
  isLoading: boolean;
}

const initialState: UserState = {
  cashs: [],
  isLoading: false,
};

const cashSlice = createSlice({
  name: "cash",
  initialState,
  reducers: {
    setCashs(state, action: PayloadAction<ICash[] | []>) {
      state.isLoading = false;
      state.cashs = action.payload;
    },
    start(state) {
      state.isLoading = true;
    },
    success(state) {
      state.isLoading = false;
    },
    failure(state) {
      state.isLoading = false;
    },
  },
});

export const { setCashs, start, success, failure } = cashSlice.actions;
export default cashSlice.reducer;
