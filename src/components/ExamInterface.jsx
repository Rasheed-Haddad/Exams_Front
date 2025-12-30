import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

import { AccessTime } from "@mui/icons-material";
import {
  fetchExamQuestions,
  setAnswer,
  nextQuestion,
  next_10_Questions,
  previous_10_Questions,
  startTimer,
  stopTimer,
  decrementTimer,
  submitExam,
  resetExam,
  previousQuestion,
  get_top_scores,
} from "../store/slices/examSlice";

const ExamInterface = () => {
  const correctSound = new Audio("correct.mp3");
  const wrongSound = new Audio("wrong.mp3");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [solved_exam, set_solved_exam] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { selectedSubject } = useSelector((state) => state.selection);
  const {
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isSubmitted,
    isActive,
    duration,
    loading,
    error,
    top_scores,
  } = useSelector((state) => state.exam);
  const Student_State = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedSubject) {
      navigate("/subject");
      return;
    }

    dispatch(resetExam());
  }, [dispatch, selectedSubject, navigate]);

  useEffect(() => {
    if (selectedSubject) {
      dispatch(fetchExamQuestions(selectedSubject));
      dispatch(get_top_scores({ ID: selectedSubject.ID }));
    }
  }, [dispatch, selectedSubject]);

  useEffect(() => {
    if (questions.length > 0 && !isActive) {
      dispatch(startTimer());
    }
  }, [dispatch, questions, isActive]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }
    if (timeRemaining === 0) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, dispatch]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (value) => {
    if (answers[currentQuestionIndex] === undefined) {
      const selected = parseInt(value);
      const correct = questions[currentQuestionIndex].answer;

      dispatch(
        setAnswer({
          questionIndex: currentQuestionIndex,
          answer: selected,
        })
      );

      // ✅ تشغيل الصوت مرة واحدة بناءً على الإجابة
      if (selected == correct) {
        correctSound.play();
      } else {
        wrongSound.play();
      }

      // الانتقال التلقائي مع حركة انتقالية
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            dispatch(nextQuestion());
          } else {
            setShowSubmitDialog(true);
          }
          setIsTransitioning(false);
        }, 300);
      }, 1300);
    }
  };

  const handleSubmitExam = async (is_open_mode) => {
    dispatch(stopTimer());

    const timeSpent = Math.floor((duration * 60 - timeRemaining) / 60);

    try {
      await dispatch(
        submitExam({
          subject: selectedSubject,
          answers,
          timeSpent,
          Student_State,
          is_open_mode, // <<< ضفناها هون
        })
      ).unwrap();

      // الآن isSubmitted صار true داخل الشريحة (slice)
      navigate("/results");
    } catch (err) {
      console.error("Failed to submit exam:", err);
      // يمكن تعرض رسالة خطأ للمستخدم هنا
    }
  };

  const handleExitExam = () => {
    dispatch(stopTimer());
    navigate("/subject");
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const handle_next_question = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      dispatch(nextQuestion());
      setIsTransitioning(false);
    }, 300);
  };

  const handle_next_10_questions = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      dispatch(next_10_Questions());
      setIsTransitioning(false);
    }, 300);
  };

  const handle_previous_question = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      dispatch(previousQuestion());
      setIsTransitioning(false);
    }, 300);
  };

  const handle_previous_10_questions = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      dispatch(previous_10_Questions());
      setIsTransitioning(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Box textAlign="center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <Typography variant="h6">جار تحميل الأسئلة</Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container maxWidth="md">
          <Alert severity="error" className="mb-4">
            <span className="font-arabic text-2xl">{error}</span>
          </Alert>
          <Button variant="contained" onClick={() => navigate("/subject")}>
            <p className="font-arabic text-2xl ">عودة</p>
          </Button>
        </Container>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container maxWidth="md">
          <Typography variant="h6" textAlign="center">
            <span className="font-arabic text-4lx m-12 text-brand">قريبا</span>
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/subject")}
            className="mt-4"
            sx={{ color: "white", backgroundColor: "#8C52FF" }}
          >
            <p className="font-arabic text-2xl ">عودة</p>
          </Button>
        </Container>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div
      className="min-h-screen bg-gray-50 justify-center"
      style={{ paddingBottom: selectedSubject.open_mode ? "180px" : "0" }}
    >
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div
          dir="rtl"
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center max-w-7xl mx-auto"
        >
          {/* جدول لائحة الصدارة */}
          {top_scores.length !== 0 ? (
            <div className="w-full sm:w-auto overflow-x-auto items-center justify-center flex flex-col">
              <table className="min-w-[240px] w-full sm:min-w-[320px] border-collapse rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-brand text-white font-arabic">
                    <th className="px-3 py-2 font-arabic text-sm sm:text-base text-center">
                      الاسم
                    </th>
                    <th className="px-3 py-2 font-arabic text-sm sm:text-base text-center">
                      اللقب
                    </th>
                    <th className="px-3 py-2 font-arabic text-sm sm:text-base text-center">
                      العلامة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top_scores.map((rank, index) => {
                    let bgColor = "";
                    if (index === 0) bgColor = "bg-brand_2";
                    else if (index === 1) bgColor = "bg-gray-300";
                    else if (index === 2) bgColor = "bg-amber-500";

                    return (
                      <tr key={index} className={`${bgColor} text-center`}>
                        <td className="px-3 py-1 font-arabic text-sm sm:text-base">
                          {rank.nick_name}
                        </td>
                        <td className="px-3 py-1 font-arabic text-sm sm:text-base">
                          {rank.badge}
                        </td>
                        <td className="px-3 py-1 font-arabic text-sm sm:text-base">
                          {rank.score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* أزرار التحكم في الشاشات الكبيرة */}
          <div className=" flex gap-2">
            <Button
              variant="outlined"
              onClick={() => setShowExitDialog(true)}
              className="gap-2 text-brand border-brand"
              sx={{ borderColor: "#8C52FF", color: "#8C52FF" }}
            >
              <span className="font-arabic text-sm">انسحاب</span>
            </Button>
            {selectedSubject.open_mode && (
              <Button
                variant="contained"
                onClick={() => set_solved_exam(!solved_exam)}
                sx={{ backgroundColor: "#8C52FF", color: "white" }}
              >
                <span className="font-arabic text-sm">
                  {solved_exam ? "إخفاء الحل" : "حل "}
                </span>
              </Button>
            )}
            <div className="flex items-center justify-center gap-4">
              {/* المؤقت */}
              <div className="flex items-center gap-2 text-brand">
                <AccessTime />
                <Typography variant="h6" className="font-arabic text-base">
                  {formatTime(timeRemaining)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Container className="py-6 flex flex-col items-center justify-center ">
        <Grid container spacing={3}>
          {/* Question Panel */}
          <Grid>
            <Card className="mb-4">
              <CardContent className="p-6">
                {/* Progress Bar */}
                <Box className="mb-6">
                  <div
                    dir="rtl"
                    className=" flex justify-between gap-3 items-center mb-2 text-brand font-arabic text-lg"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#8C52FF",
                        fontSize: "20px",
                      }}
                    >
                      {currentQuestionIndex + 1} من {questions.length}
                    </Typography>
                    <div>
                      <span className="text-brand text-sm font-arabic max-w-48  opacity-80">
                        {currentQuestion.lecture}
                      </span>
                    </div>
                  </div>
                </Box>

                {/* Question */}
                <div
                  dir="rtl"
                  className={`px-3 py-4 sm:px-6 flex flex-col items-center transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-0 translate-x-8"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {/* السؤال */}
                  <div className="mb-6 text-center w-full">
                    <span className="text-gray-800 font-arabic text-xl sm:text-xl">
                      {currentQuestion.question}
                    </span>
                  </div>

                  {/* الخيارات */}
                  <FormControl component="fieldset" className="w-full max-w-md">
                    <div className="flex flex-col items-center w-full space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const water_marks = [
                          Student_State.user.ID,
                          Student_State.user.name,
                          Student_State.user.nick_name,
                        ];
                        const isSelected =
                          answers[currentQuestionIndex] == index + 1;
                        const isCorrect = currentQuestion.answer == index + 1;
                        const hasAnswered =
                          answers[currentQuestionIndex] !== undefined;

                        let bgColor = "";
                        if (hasAnswered) {
                          if (isCorrect) {
                            bgColor = "bg-green-500 text-white";
                          } else if (isSelected && !isCorrect) {
                            bgColor = "bg-red-500 text-white";
                          }
                        }
                        if (solved_exam) {
                          if (isCorrect) {
                            bgColor = "bg-green-500 text-white";
                          }
                        }

                        return option !== "." ? (
                          <div key={index} className="w-full">
                            <button
                              onClick={() =>
                                handleAnswerChange((index + 1).toString())
                              }
                              disabled={hasAnswered || solved_exam}
                              className={`w-full text-right font-arabic text-base sm:text-lg leading-snug 
                          rounded-xl border border-gray-200 shadow-sm 
                          px-4 py-3 transition-all duration-200 
                          ${bgColor}
                          hover:scale-[1.02] active:scale-[0.98]
                          `}
                            >
                              {option}
                            </button>
                            {/* العلامة المائية بين الخيارات */}
                            {water_marks[index] && (
                              <div className="text-center mt-1 mb-1">
                                <span className="text-brand text-[15px] font-arabic opacity-50">
                                  {water_marks[index]}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* أزرار التنقل الثابتة في الأسفل */}
      {selectedSubject.open_mode && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <div className="max-w-md mx-auto gap-1" dir="rtl">
            {/* الصف الأول: السابق — التالي */}
            <div className="flex justify-between gap-1 mb-1">
              <button
                className="bg-brand px-4 py-3 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                onClick={handle_previous_question}
                disabled={currentQuestionIndex === 0}
              >
                <span className="text-white text-center text-lg font-arabic">
                  السابق
                </span>
              </button>

              <button
                className="bg-brand px-4 py-3 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                onClick={handle_next_question}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                <span className="text-white text-center text-lg font-arabic">
                  التالي
                </span>
              </button>
            </div>

            {/* الصف الثاني: عشر أسئلة للوراء — عشر أسئلة للأمام */}
            <div className="flex justify-between gap-1">
              <button
                className="bg-brand px-4 py-3 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                onClick={handle_previous_10_questions}
                disabled={currentQuestionIndex < 10}
              >
                <span className="text-white text-center text-lg font-arabic">
                  - 10
                </span>
              </button>

              <button
                className="bg-brand px-4 py-3 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                onClick={handle_next_10_questions}
                disabled={currentQuestionIndex > questions.length - 11}
              >
                <span className="text-white text-center text-lg font-arabic">
                  + 10
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      <div dir="rtl">
        <Dialog dir="rtl" open={showSubmitDialog}>
          <DialogTitle>
            <span className="font-arabic text-2xl ">تسليم الامتحان</span>
          </DialogTitle>
          <DialogContent>
            <Typography className="mb-4">
              <span className="font-arabic text-xl ">
                انتهى الامتحان, ستحصل على درجاتك الان
              </span>
            </Typography>
            <Box className="p-3 bg-gray-50 rounded-lg">
              <Typography variant="body2" className="mb-2">
                <strong className="font-arabic text-lg">
                  ملخص الامتحان :{" "}
                </strong>
              </Typography>
              <Typography variant="body2">
                <span className="font-arabic text-sm">
                  • تمت الإجابة على :{" "}
                </span>
                <span dir="rtl">
                  {getAnsweredQuestionsCount()}/{questions.length}
                </span>
              </Typography>
              <Typography variant="body2">
                <span className="font-arabic text-sm">• الوقت المتبقي : </span>{" "}
                {formatTime(timeRemaining)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions className="gap-7">
            <Button
              onClick={() => {
                handleSubmitExam(selectedSubject.open_mode);
              }}
              variant="contained"
              color="success"
            >
              <span className="font-arabic text-xl">تأكيد</span>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Exit Confirmation Dialog */}

      <Dialog
        dir="rtl"
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
      >
        <DialogTitle>
          <span className="font-arabic text-xl">الانسحاب</span>
        </DialogTitle>
        <DialogContent>
          <Typography>
            <span className="font-arabic text-xl">
              ستخسر تقدمك, هل متأكد أنك تريد الانسحاب
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>
            <span className="font-arabic text-xl ml-8">الغاء</span>
          </Button>
          <Button onClick={handleExitExam} variant="contained" color="error">
            <span className="font-arabic text-xl">تأكيد</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExamInterface;
