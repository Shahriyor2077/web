import authApi from "src/server/auth";

import { start, success, failure, setCashs } from "../slices/cashSlice";

import type { AppThunk } from "../index";

export const getCashs = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    console.log("🔍 Fetching cash/pending payments...");
    const res = await authApi.get("/cash/get-all");
    const { data } = res;
    console.log("📊 === CASH DATA RECEIVED ===");
    console.log("Total items:", data?.length || 0);
    console.log("Data type:", Array.isArray(data) ? "Array" : typeof data);

    if (data && data.length > 0) {
      console.log("Sample item:", data[0]);
    } else {
      console.log("⚠️ No pending payments found");
    }

    dispatch(setCashs(data));
  } catch (error: any) {
    console.error("❌ Error fetching cash:", error);
    console.error("Error details:", error.response?.data || error.message);
    dispatch(failure());
  }
};

export const confirmationCash =
  (cashIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/cash/confirmation", { cashIds });
      dispatch(success());
      dispatch(getCashs());
    } catch (err) {
      dispatch(failure());
    }
  };

export const updateCash =
  (data: any): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/payment", data);
      dispatch(success());
      dispatch(getCashs());
    } catch (err) {
      dispatch(failure());
    }
  };
