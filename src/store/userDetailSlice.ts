/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

type userdetailState = { detail: any };

export const userDetailSlice = createSlice({
  name: "userDetail",
  initialState: {
    detail: {} as userdetailState["detail"],
  } as userdetailState,
  reducers: {
    addUserDetail(
      state,
      action: PayloadAction<{
        name: string;
        phone: number;
        email: string;
        address: string;
      }>
    ) {
      const { name, phone, email, address } = action.payload;
      state.detail = {
        name,
        phone,
        email,
        address,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { addUserDetail } = userDetailSlice.actions;

export default userDetailSlice.reducer;
