import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import examsReducer from "./slices/exams_slice";
import examSlice from "./slices/examSlice";
import selectionSlice from "./slices/selectionSlice";
import student_reducer from "./slices/students_slice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    selection: selectionSlice,
    exam: examSlice,
    ui: uiReducer,
    exams: examsReducer,
    students: student_reducer,
  },
});

export default store;
