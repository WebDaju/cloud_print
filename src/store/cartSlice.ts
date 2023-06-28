/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

type CartState = { items: any[] };

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  } as CartState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{id:string, quantity: number; product: any,total:number }>
    ) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const updatedItems = state.items.filter((item) => item.product.id !== id);
      state.items = updatedItems;
    },

    removeAll(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((item) => item !== id);
    },
    emptyCart(state) {
      state.items = [];
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

export const { addItem, removeItem, removeAll, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
