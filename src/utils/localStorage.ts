
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
// import { createReducer } from "@reduxjs/toolkit";
import { isServer } from "./environment";
import cartReducer from "../store/cartSlice";

export const saveToLocalStorage = (state: any) => {
  if (isServer()) {
    console.info("Server-side -- skipping localStorage");
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("State", serializedState);
  } catch (e) {
    console.warn(e);
  }
};

export const loadFromLocalStorage = () => {
  if (isServer()) {
    console.info("Server-side -- skipping localStorage");
    return;
  }

  try {
    const serializedState = localStorage.getItem("State");
    if (serializedState === null) return undefined;
    const parsedState = JSON.parse(serializedState);

    if (parsedState) {
      return {
        ...parsedState,
        cart: cartReducer(parsedState.cart, { type: "INIT" }),
      };
    }

    return parsedState;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};
