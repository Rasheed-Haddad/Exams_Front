import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://qaddha-wqdood-employers.onrender.com";

export const fetch_students = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        return rejectWithValue(error.response.data.message || "فشل جلب الطلاب");
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  }
);
const initialState = {
  students: [],
  status: "idle",
  error: null,
  loading: false,
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب الطلاب
      .addCase(fetch_students.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch_students.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(fetch_students.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = studentsSlice.actions;
export default studentsSlice.reducer;
