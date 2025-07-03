import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExamQuestions = createAsyncThunk(
  "exam/fetchExamQuestions",
  async (subject, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        questions: subject.questions || [],
        duration: subject.time,
        totalQuestions: subject ? subject.questions?.length || 0 : 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// TODO: Replace with actual API call
export const submitExam = createAsyncThunk(
  "exam/submitExam",
  async (
    { subject, answers, timeSpent, Student_State },
    { rejectWithValue }
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
      const response = await axios.post(
        "https://exams-back.onrender.com/results",
        {
          student_ID: Student_State.user.ID,
          subject_id: subject.ID,
          score: score,
        }
      );
      return {
        score: Math.round(score),
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
        passed: score >= 60,
      };
    } catch (error) {
      return rejectWithValue("تحقق من اتصالك بالانترنت");
    }
  }
);

const examSlice = createSlice({
  name: "exam",
  initialState: {
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
  },
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
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch questions
      .addCase(fetchExamQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.duration = action.payload.duration;
        state.timeRemaining = action.payload.duration * 60; // Convert to seconds
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.isSubmitted = false;
        state.results = null;
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit exam
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
} = examSlice.actions;

export default examSlice.reducer;
