import api from "../../api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const request_exams = createAsyncThunk(
  "exams/request",
  async (
    {
      student_ID,
      exams_ids,
      college_id,
      university_id,
      total_price,
      process_id,
      student_notes,
    },
    { rejectWithValue },
  ) => {
    try {
      const respone = await api.post("/request", {
        student_ID,
        exams_ids,
        college_id,
        university_id,
        total_price,
        process_id,
        student_notes,
      });
      return respone.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل تأكيد الطلب",
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  },
);

export const fetch_names_of_student_exams = createAsyncThunk(
  "exams/names",
  async ({ ID, college_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/getexamsnames", {
        ID: ID,
        college_id: college_id,
      });
      return response.data.exams;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || "فشل جلب المواد");
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  },
);

export const fetch_requests_of_the_student = createAsyncThunk(
  "exams/requests",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const response = await api.post("/getrequestsofthestudent", {
        ID: ID,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل جلب الطلبات",
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  },
);

const initialState = {
  status: "",
  error: null,
  loading: false,
  names_of_exams: [],
  requests: [],
};

const examsSlice = createSlice({
  name: "exams",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearExamsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(request_exams.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(request_exams.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.message;
        state.error = null;
      })
      .addCase(request_exams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetch_names_of_student_exams.pending, (state) => {
        state.error = null;
      })
      .addCase(fetch_names_of_student_exams.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetch_names_of_student_exams.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.names_of_exams = action.payload;
      })
      .addCase(fetch_requests_of_the_student.fulfilled, (state, action) => {
        state.requests = action.payload;
      });
  },
});

export const { clearError, clearExamsError } = examsSlice.actions;
export default examsSlice.reducer;
