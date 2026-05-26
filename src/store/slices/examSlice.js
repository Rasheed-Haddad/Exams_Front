import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const save_note = createAsyncThunk(
  "exam/savenote",
  async (
    {
      student_ID,
      subject_id,
      section_id,
      note,
      student_nick_name,
      lecture_title,
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/savenote", {
        student_ID,
        subject_id,
        section_id,
        note,
        student_nick_name,
      });
      return {
        data: response.data,
        student_ID,
        subject_id,
        section_id,
        note,
        student_nick_name,
        lecture_title, // ← جديد
      };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل حفظ الملاحظة",
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  },
);

export const fetchExamQuestions = createAsyncThunk(
  "exam/fetchExamQuestions",
  async (subject, { rejectWithValue }) => {
    try {
      return {
        questions: subject.questions || [],
        duration: subject.time,
        totalQuestions: subject ? subject.questions?.length || 0 : 0,
        visible: subject.visible,
        summary: subject.summary || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitExam = createAsyncThunk(
  "exam/submitExam",
  async (
    { subject, answers, timeSpent, Student_State, is_open_mode },
    { rejectWithValue },
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const questions = subject.questions || [];
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (answers[index] == question.answer) {
          correctAnswers++;
        }
      });

      const score = (correctAnswers / questions.length) * 100;

      await api.post("/results", {
        student_ID: Student_State.user.ID,
        subject_id: subject.ID,
        score: score,
        is_open_mode: is_open_mode,
      });

      return {
        score: Math.round(score),
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
        passed: score >= 60,
      };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "فشل تسجيل النتيجة",
        );
      } else if (error.request) {
        return rejectWithValue("تأكد من اتصالك بالإنترنت");
      } else {
        return rejectWithValue("حدث خطأ غير متوقع");
      }
    }
  },
);

export const get_top_scores = createAsyncThunk(
  "exam/gettopscores",
  async ({ ID }) => {
    try {
      const response = await api.post("/topscores", { ID });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 1,
  duration: 0,
  isActive: false,
  isSubmitted: false,
  results: null,
  loading: false,
  error: null,
  visible: false,
  top_scores: [],
  examCancelled: false,
  summary: [],
  status: "",
  selectedLectures: [],
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    cancelExam(state) {
      state.examCancelled = true;
      state.isActive = false;
    },
    clearStatus: (state) => {
      state.status = "";
      state.error = null;
    },
    next_10_Questions: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 11) {
        state.currentQuestionIndex += 10;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    previous_10_Questions: (state) => {
      if (state.currentQuestionIndex > 9) {
        state.currentQuestionIndex -= 10;
      }
    },
    goToQuestion: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.currentQuestionIndex = index;
      }
    },
    startTimer: (state) => {
      state.isActive = true;
    },
    stopTimer: (state) => {
      state.isActive = false;
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    resetExam: (state) => {
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.timeRemaining = 0.5;
      state.duration = 0;
      state.isActive = false;
      state.isSubmitted = false;
      state.results = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // تهيئة الملخص من selectedSubject عند فتح شاشة الملخص
    // دون المساس بحالة الامتحان
    initializeSummary: (state, action) => {
      state.summary = action.payload;
    },
    setSelectedLectures: (state, action) => {
      state.selectedLectures = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.duration = action.payload.duration;
        state.timeRemaining = action.payload.duration * 60;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.isSubmitted = false;
        state.results = null;
        state.visible = action.payload.visible;
        state.summary = action.payload.summary;
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubmitted = true;
        state.isActive = false;
        state.results = action.payload;
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(get_top_scores.fulfilled, (state, action) => {
        state.top_scores = action.payload;
      })
      .addCase(save_note.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(save_note.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.status = action.payload.data.message;

        const { section_id, student_ID, note, lecture_title } = action.payload;

        // ابحث عن القسم وحدّث ملاحظاته
        for (const lecture of state.summary) {
          if (lecture.meta?.lecture_title !== lecture_title) continue; // ← فلتر
          const section = lecture.sections?.find(
            (s) => s.id?.toString() === section_id?.toString(),
          );

          if (section) {
            if (!section.notes) section.notes = [];

            const existingIndex = section.notes.findIndex(
              (n) => n.student_ID?.toString() === student_ID?.toString(),
            );

            const noteEntry = {
              student_ID,
              student_nick_name: action.payload.student_nick_name,
              note,
            };

            if (existingIndex !== -1) {
              section.notes[existingIndex] = noteEntry;
            } else {
              section.notes.push(noteEntry);
            }
            break;
          }
        }
      })
      .addCase(save_note.rejected, (state, action) => {
        state.status = "";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAnswer,
  nextQuestion,
  previousQuestion,
  goToQuestion,
  startTimer,
  stopTimer,
  decrementTimer,
  resetExam,
  clearError,
  next_10_Questions,
  previous_10_Questions,
  cancelExam,
  clearStatus,
  initializeSummary,
  setSelectedLectures,
} = examSlice.actions;

export default examSlice.reducer;
