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
        }
      );
      return {
        user: {
          ID: response.data.user.ID,
          name: response.data.user.name,
        },
        token: response.data.token, // ← أضف هذا السطر المهم
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue("تحقق من اتصالك بالانترنت");
    }
  }
);
const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const ID = localStorage.getItem("ID");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    user: { name: name || "", ID: ID || "" },
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("ID");
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
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { signOut, clearError } = authSlice.actions;
export default authSlice.reducer;
