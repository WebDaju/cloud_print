/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import cartReducer from "./cartSlice";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { isServer } from "../utils/environment";
import userDetailSlice from "./userDetailSlice";
import customUserDetailSlice from "./customUserDetailSlice";

const combinedReducer = combineReducers({
  cart: cartReducer,
  userDetail: userDetailSlice,
  customUserDetail:customUserDetailSlice
});

const makeStore = () => {
  const configuredStore = configureStore({
    reducer: combinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

    preloadedState: loadFromLocalStorage(),
    devTools: process.env.NODE_ENV !== "production",
  });

  if (!isServer()) {
    configuredStore.subscribe(() => {
      saveToLocalStorage(configuredStore.getState());
    });
  }

  return configuredStore;
};

export const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: true });
