/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

type userdetailState = { detail: any };

export const customUserDetailSlice = createSlice({
  name: "customUserDetail",
  initialState: {
    detail: {} as userdetailState["detail"],
  } as userdetailState,
  reducers: {
    addCustomUserDetail(
      state,
      action: PayloadAction<{
        name: string;
        phone: number;
        email: string;
        address: string;
        pdf: string;
        typeofPrint: string;
        binding: string;
        totalPages: number;
        bindingPrice: number;
        pricePerPage: number;
       
      }>
    ) {
      const {
        name,
        phone,
        email,
        address,
        pdf,
        typeofPrint,
        binding,
        totalPages,
      
        pricePerPage,
        bindingPrice,
      } = action.payload;
      state.detail = {
        name,
        phone,
        email,
        address,
        pdf,
        typeofPrint,
        binding,
        totalPages,
      
        pricePerPage,
        bindingPrice,
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

export const { addCustomUserDetail } = customUserDetailSlice.actions;

export default customUserDetailSlice.reducer;
