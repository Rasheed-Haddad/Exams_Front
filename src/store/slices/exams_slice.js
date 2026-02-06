import api from "../../api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetch_exams_for_the_admin = createAsyncThunk(
  "exams/fetch",
  async ({ _id, search_term }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://qaddha-wqdood-employers.onrender.com/getexamsbyadminid",
        { _id, search_term }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const delete_exam_for_the_admin = createAsyncThunk(
  "exams/deleteExam",
  async (exam_id, { rejectWithValue }) => {
    console.log(exam_id);
    try {
      await axios.delete(
        `https://qaddha-wqdood-employers.onrender.com/deleteexam`,
        {
          data: {
            exam_id,
          },
        }
      );
      return exam_id;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل حذف الامتحان"
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  }
);

export const add_student_to_exam = createAsyncThunk(
  "exam/addstudent",
  async ({ STUDENT_ID, EXAM_ID }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://qaddha-wqdood-employers.onrender.com/addstudenttoexam`,
        {
          STUDENT_ID,
          EXAM_ID,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل إضافة الطالب"
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  }
);

export const request_exam_for_the_admin = createAsyncThunk(
  "exams/request",
  async (
    {
      name,
      college_id,
      info,
      time,
      visible,
      open_mode,
      price,
      admin_id,
      questions,
    },
    { rejectWithValue }
  ) => {
    try {
      const respone = await api.post("/request", {
        name,
        college_id,
        info,
        time,
        visible,
        open_mode,
        price,
        admin_id,
        questions,
      });
      return respone.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل إضافة الطالب"
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  }
);

export const update_exam_for_the_admin = createAsyncThunk(
  "exams/updateExam",
  async (
    {
      _id,
      new_name,
      new_info,
      new_questions,
      new_time,
      new_visible,
      new_open_mode,
      new_price,
      new_available_to,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `https://qaddha-wqdood-employers.onrender.com/updateexam`,
        {
          _id,
          new_name,
          new_info,
          new_questions,
          new_time,
          new_visible,
          new_open_mode,
          new_price,
          new_available_to,
        }
      );
      return response.data.message;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل تحديث الامتحان"
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  }
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
  }
);

const initialState = {
  exams: [],
  status: "",
  error: null,
  loading: false,
  names_of_exams: [],
};

const examsSlice = createSlice({
  name: "exams",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearExamsError:(state) =>{
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // جلب الامتحانات
      .addCase(fetch_exams_for_the_admin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch_exams_for_the_admin.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetch_exams_for_the_admin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // إضافة امتحان
      .addCase(request_exam_for_the_admin.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(request_exam_for_the_admin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.message;
        state.error = null;
      })
      .addCase(request_exam_for_the_admin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // تحديث امتحان
      .addCase(update_exam_for_the_admin.pending, (state) => {
        state.status = "";
        state.loading = true;
        state.error = null;
      })
      .addCase(update_exam_for_the_admin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.error = null;
      })
      .addCase(update_exam_for_the_admin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // حذف امتحان
      .addCase(delete_exam_for_the_admin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_exam_for_the_admin.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.filter((exam) => exam._id !== action.payload);
        state.error = null;
        state.status = action.payload;
      })
      .addCase(delete_exam_for_the_admin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(add_student_to_exam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(add_student_to_exam.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(add_student_to_exam.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetch_names_of_student_exams.pending, (state) => {
        state.loading = true;
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
      });
  },
});

export const { clearError,clearExamsError } = examsSlice.actions;
export default examsSlice.reducer;
