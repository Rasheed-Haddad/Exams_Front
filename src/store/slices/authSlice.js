import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// TODO: Replace with actual API call
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (Student_Data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://exams-back.onrender.com/signin",
        {
          ID: Student_Data.ID,
          name: Student_Data.name,
          nick_name: Student_Data.nick_name,
          password: Student_Data.password,
        }
      );
      return {
        user: {
          ID: response.data.user.ID,
          name: response.data.user.name,
          nick_name: response.data.user.nick_name,
          password: response.data.user.password,
          points: response.data.user.points,
          badge: response.data.user.badge,
          scores: response.data.user.scores || [],
        },
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const set_college = createAsyncThunk(
  "auth/set_college",
  async ({ ID, college_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://exams-back.onrender.com/setcollege",
        {
          ID,
          college_id,
        }
      );
      return response.data; // مهم ترجع البيانات
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "حدث خطأ أثناء حفظ الكلية"
      );
    }
  }
);

export const get_student_info = createAsyncThunk(
  "auth/info",
  async ({ ID }) => {
    const response = await axios.post("https://exams-back.onrender.com/info", {
      ID,
    });
    return response.data;
  }
);

export const set_badge = createAsyncThunk(
  "auth/setbadge",
  async ({ ID, points }, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://exams-back.onrender.com/setbadge", {
        ID,
        points,
      });
      return res.data; // نتوقع { points, badge, message }
    } catch (err) {
      // أفضل تمرير رسالة مفيدة
      const message = err.response?.data?.message || err.message;
      return rejectWithValue(message);
    }
  }
);

export const get_rank = createAsyncThunk("auth/rank", async ({ ID }) => {
  const response = await axios.post("https://exams-back.onrender.com/rank", {
    ID,
  });
  return response.data;
});

const points = localStorage.getItem("points");
const badge = localStorage.getItem("badge");
const nick_name = localStorage.getItem("nick_name");
const password = localStorage.getItem("password");
const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const ID = localStorage.getItem("ID");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    user: {
      name: name || "",
      nick_name: nick_name || "",
      ID: ID || "",
      password: password || "",
      points: points || 0,
      badge: badge || "",
      previous_badge: badge || "",
      scores: [],
      rank: "",
    },
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    set_previous_badge_like_the_new: (state, action) => {
      state.user.previous_badge = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.clear();
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token); // ✅ الصحيح
        localStorage.setItem("name", action.payload.user.name);
        localStorage.setItem("ID", action.payload.user.ID);
        localStorage.setItem("password", action.payload.user.password);
        localStorage.setItem("nick_name", action.payload.user.nick_name);
        localStorage.setItem("badge", action.payload.user.badge);
        state.user.nick_name = action.payload.user.nick_name;
        state.user.badge = action.payload.user.badge;
        state.user.points = action.payload.user.points;
        state.password = action.payload.user.password;
        state.user.scores = action.payload.user.scores;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(set_badge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(set_badge.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.points = action.payload.points;
          state.user.badge = action.payload.badge;
        }
        localStorage.setItem("badge", action.payload.badge);
        localStorage.setItem("points", action.payload.points);
      })
      .addCase(set_badge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(get_rank.fulfilled, (state, action) => {
        if (state.user) {
          state.user.rank = action.payload.rank;
        }
      })
      .addCase(get_student_info.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_student_info.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("name", action.payload.name);
        localStorage.setItem("ID", action.payload.ID);
        localStorage.setItem("password", action.payload.password);
        localStorage.setItem("nick_name", action.payload.nick_name);
        localStorage.setItem("badge", action.payload.badge);
        state.user.nick_name = action.payload.nick_name;
        state.user.badge = action.payload.badge;
        state.user.points = action.payload.points;
        state.password = action.payload.password;
        state.user.scores = action.payload.scores;
        state.error = null;
      });
  },
});

export const { signOut, clearError, set_previous_badge_like_the_new } =
  authSlice.actions;
export default authSlice.reducer;
