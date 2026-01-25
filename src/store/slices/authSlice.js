import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// ================== Async Thunks ==================

// تسجيل الدخول (طالب أو مدرس)
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/signin", credentials);

      const { user, token } = response.data;

      if (user.role === "student") {
        await Promise.all([
          localStorage.setItem("token", token),
          localStorage.setItem("userRole", "student"),
          localStorage.setItem("name", user.name),
          localStorage.setItem("ID", String(user.ID)),
          localStorage.setItem("_id", user.id),
          localStorage.setItem("password", credentials.password),
          localStorage.setItem("nick_name", user.nick_name),
          localStorage.setItem("badge", user.badge),
          localStorage.setItem("points", String(user.points)),
        ]);

        return {
          user: {
            ID: String(user.ID),
            _id: user.id,
            name: user.name,
            nick_name: user.nick_name,
            password: credentials.password,
            points: user.points,
            badge: user.badge,
            previous_badge: user.badge,
            scores: user.scores || [],
            rank: "",
            role: "student",
            college_id: user.college_id,
            top10Students: [],
            totalStudents: 0,
          },
          token,
        };
      } else {
        await Promise.all([
          localStorage.setItem("token", token),
          localStorage.setItem("userRole", "teacher"),
          localStorage.setItem("teacherId", user.id),
          localStorage.setItem("teacherName", user.name),
          localStorage.setItem("teacherPhone", user.phone_number),
        ]);

        return {
          user: {
            id: user.id,
            name: user.name,
            phone_number: user.phone_number,
            total_profit: user.total_profit,
            role: "teacher",
          },
          token,
        };
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "حدث خطأ",
      );
    }
  },
);

// تعيين الكلية (للطلاب فقط)
export const set_college = createAsyncThunk(
  "auth/set_college",
  async ({ ID, college_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/setcollege", {
        ID,
        college_id,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "حدث خطأ أثناء حفظ الكلية",
      );
    }
  },
);

// جلب معلومات الطالب
export const get_student_info = createAsyncThunk(
  "auth/info",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const response = await api.post("/info", { ID });

      await Promise.all([
        localStorage.setItem("name", response.data.name),
        localStorage.setItem("ID", String(response.data.ID)),
        localStorage.setItem("password", response.data.password),
        localStorage.setItem("_id", response.data._id),
        localStorage.setItem("nick_name", response.data.nick_name),
        localStorage.setItem("badge", response.data.badge),
        localStorage.setItem("points", String(response.data.points)),
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "حدث خطأ أثناء جلب معلومات الطالب",
      );
    }
  },
);

// تعيين الشارة (للطلاب فقط)
export const set_badge = createAsyncThunk(
  "auth/setbadge",
  async ({ ID, points }, { rejectWithValue }) => {
    try {
      const res = await api.post("/setbadge", {
        ID,
        points,
      });

      await Promise.all([
        localStorage.setItem("badge", res.data.badge),
        localStorage.setItem("points", String(res.data.points)),
      ]);

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue(message);
    }
  },
);

// جلب الترتيب ولوحة المتصدرين (للطلاب فقط)
export const get_rank = createAsyncThunk(
  "auth/rank",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const response = await api.post("/rank", { ID });
      // الاستجابة تحتوي على:
      // - rank: ترتيب الطالب
      // - studentPoints: نقاط الطالب
      // - studentBadge: شارة الطالب
      // - top10Students: قائمة أفضل 10 طلاب
      // - totalStudents: إجمالي عدد الطلاب
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "حدث خطأ أثناء جلب الترتيب",
      );
    }
  },
);

// جلب معلومات المدرس مع التحليلات المتقدمة
export const get_teacher_info = createAsyncThunk(
  "auth/teacher_info",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/getadmininfo", { _id: id });

      await Promise.all([
        localStorage.setItem("teacherName", response.data.admin.name),
        localStorage.setItem("teacherPhone", response.data.admin.phone_number),
        localStorage.setItem(
          "teacherProfit",
          String(response.data.admin.total_profit),
        ),
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "حدث خطأ أثناء جلب معلومات المدرس",
      );
    }
  },
);

// تهيئة التطبيق (جلب البيانات من localStorage)
export const initializeAuth = createAsyncThunk("auth/initialize", async () => {
  const userRole = await localStorage.getItem("userRole");

  if (userRole === "student") {
    const [_id, points, badge, nick_name, password, token, name, ID] =
      await Promise.all([
        localStorage.getItem("_id"),
        localStorage.getItem("points"),
        localStorage.getItem("badge"),
        localStorage.getItem("nick_name"),
        localStorage.getItem("password"),
        localStorage.getItem("token"),
        localStorage.getItem("name"),
        localStorage.getItem("ID"),
      ]);

    return {
      userRole: "student",
      _id,
      points,
      badge,
      nick_name,
      password,
      token,
      name,
      ID,
    };
  } else if (userRole === "teacher") {
    const [token, teacherId, teacherName, teacherPhone, teacherProfit] =
      await Promise.all([
        localStorage.getItem("token"),
        localStorage.getItem("teacherId"),
        localStorage.getItem("teacherName"),
        localStorage.getItem("teacherPhone"),
        localStorage.getItem("teacherProfit"),
      ]);

    return {
      userRole: "teacher",
      token,
      teacherId,
      teacherName,
      teacherPhone,
      teacherProfit,
    };
  }

  return { userRole: null };
});

// إرسال الوقت المستغرق
export const send_time_spent_on_website = createAsyncThunk(
  "user/time",
  async ({ ID, start, end }, { rejectWithValue }) => {
    try {
      const response = await api.post("/timespent", {
        ID: ID,
        start: start,
        end: end,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "حدث خطأ",
      );
    }
  },
);

// ================== الـ Slice ==================

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  analytics: null,
  analyticsLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set_previous_badge_like_the_new: (state, action) => {
      if (state.user && state.user.role === "student") {
        state.user.previous_badge = action.payload;
      }
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.analytics = null;
      localStorage.clear();
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        const payload = action.payload;

        if (payload.userRole === "student") {
          const { _id, points, badge, nick_name, password, token, name, ID } =
            payload;

          if (token && ID) {
            state.isAuthenticated = true;
            state.token = token;
            state.user = {
              _id: _id || "",
              name: name || "",
              nick_name: nick_name || "",
              ID: ID || "",
              password: password || "",
              points: points ? Number(points) : 0,
              badge: badge || "",
              previous_badge: badge || "",
              scores: [],
              rank: "",
              role: "student",
              top10Students: [],
              totalStudents: 0,
            };
          }
        } else if (payload.userRole === "teacher") {
          const { token, teacherId, teacherName, teacherPhone, teacherProfit } =
            payload;

          if (token && teacherId) {
            state.isAuthenticated = true;
            state.token = token;
            state.user = {
              id: teacherId || "",
              name: teacherName || "",
              phone_number: teacherPhone || "",
              total_profit: teacherProfit ? Number(teacherProfit) : 0,
              role: "teacher",
            };
          }
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })

      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.user.role === "student") {
          state.password = action.payload.user.password;
        }
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Set Badge (للطلاب فقط)
      .addCase(set_badge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(set_badge.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.role === "student") {
          state.user.points = action.payload.points;
          state.user.badge = action.payload.badge;
        }
      })
      .addCase(set_badge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // Get Rank (للطلاب فقط) - محدث لدعم لوحة المتصدرين
      .addCase(get_rank.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_rank.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.role === "student") {
          // تحديث ترتيب الطالب الحالي
          state.user.rank = action.payload.rank;

          // تحديث نقاط الطالب إذا كانت موجودة في الاستجابة
          if (action.payload.studentPoints !== undefined) {
            state.user.points = action.payload.studentPoints;
          }

          // تحديث شارة الطالب إذا كانت موجودة
          if (action.payload.studentBadge) {
            state.user.badge = action.payload.studentBadge;
          }

          // تحديث قائمة أفضل 10 طلاب
          if (action.payload.top10Students) {
            state.user.top10Students = action.payload.top10Students;
          }

          // تحديث إجمالي عدد الطلاب
          if (action.payload.totalStudents !== undefined) {
            state.user.totalStudents = action.payload.totalStudents;
          }
        }
      })
      .addCase(get_rank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // Get Student Info
      .addCase(get_student_info.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_student_info.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.role === "student") {
          state.user.nick_name = action.payload.nick_name;
          state.user.badge = action.payload.badge;
          state.user.points = action.payload.points;
          state.user.scores = action.payload.scores;
          if (action.payload.time !== undefined) {
            state.user.time = action.payload.time;
          }
        }
        state.password = action.payload.password;
        state.error = null;
      })
      .addCase(get_student_info.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // Get Teacher Info with Analytics
      .addCase(get_teacher_info.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(get_teacher_info.fulfilled, (state, action) => {
        state.analyticsLoading = false;

        if (state.user && state.user.role === "teacher") {
          state.user.name = action.payload.admin.name;
          state.user.phone_number = action.payload.admin.phone_number;
          state.user.total_profit = action.payload.admin.total_profit;
          state.user.id = action.payload.admin._id;
        }

        state.analytics = {
          exams: action.payload.exams,
          students: action.payload.students,
          revenue: action.payload.revenue,
          performance: action.payload.performance,
          collegeAnalytics: action.payload.collegeAnalytics,
          topLectures: action.payload.topLectures,
          requests: action.payload.requests,
          growth: action.payload.growth,
          summary: action.payload.summary,
        };

        state.error = null;
      })
      .addCase(get_teacher_info.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const {
  signOut,
  setAuthenticated,
  clearError,
  set_previous_badge_like_the_new,
} = authSlice.actions;
export default authSlice.reducer;
