import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import selectionSlice from "./slices/selectionSlice";
import examSlice from "./slices/examSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    selection: selectionSlice,
    exam: examSlice,
  },
});

export default store;
