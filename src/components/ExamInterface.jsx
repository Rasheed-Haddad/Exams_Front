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

      // الانتقال التلقائي
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          dispatch(nextQuestion());
        } else {
          setShowSubmitDialog(true);
        }
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
    dispatch(nextQuestion());
  };

  const handle_next_10_questions = () => {
    dispatch(next_10_Questions());
  };

  const handle_previous_question = () => {
    dispatch(previousQuestion());
  };

  const handle_previous_10_questions = () => {
    dispatch(previous_10_Questions());
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
    <div className="min-h-screen bg-gray-50 justify-center">
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
                  <tr className="bg-brand text-white font-bold">
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
                        <td className="px-3 py-1 font-arabic text-sm sm:text-base font-bold">
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
                  {solved_exam ? "إخفاء الحل" : "حل الاختبار"}
                </span>
              </Button>
            )}
            <div className="flex items-center justify-center gap-4">
              {/* المؤقت */}
              <div className="flex items-center gap-2 text-brand">
                <AccessTime />
                <Typography
                  variant="h6"
                  className="font-mono font-bold text-base"
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Container className="py-6 flex items-center justify-center ">
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
                      السؤال {currentQuestionIndex + 1} من {questions.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#8C52FF", fontSize: "20px" }}
                    >
                      تم إكمال {Math.round(progress)}%
                    </Typography>
                  </div>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    className="h-2 rounded-full"
                    sx={{
                      backgroundColor: "#e0d6fb", // لون الخلفية الهادئ
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#8C52FF", // لون الشريط نفسه
                      },
                    }}
                  />
                </Box>

                {/* Question */}
                <div
                  dir="rtl"
                  className="px-3 py-4 sm:px-6 flex flex-col items-center"
                >
                  {/* السؤال */}
                  <div className="mb-6 text-center w-full">
                    <Typography
                      variant="h6"
                      className="text-gray-800 leading-relaxed font-arabic text-lg sm:text-xl"
                    >
                      {currentQuestion.question}
                    </Typography>
                  </div>

                  {/* الخيارات */}
                  <FormControl component="fieldset" className="w-full max-w-md">
                    <div className="flex flex-col items-center w-full space-y-3">
                      {currentQuestion.options.map((option, index) => {
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

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              handleAnswerChange((index + 1).toString())
                            }
                            disabled={hasAnswered || solved_exam}
                            className={`w-full text-right font-arabic text-base sm:text-lg leading-snug 
                        rounded-xl border border-gray-200 shadow-sm 
                        px-4 py-3 transition-all duration-200 
                        ${bgColor} 
                        `}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                </div>

                <div
                  dir="rtl"
                  className={`${
                    selectedSubject.open_mode ? "" : "hidden"
                  } flex flex-wrap flex-col sm:flex-row items-center justify-center mt-8 gap-4`}
                >
                  {/* عشر أسئلة للوراء */}
                  <Button
                    variant="contained"
                    className="w-full sm:w-40 flex items-center justify-center order-1"
                    onClick={handle_previous_10_questions}
                    sx={{ backgroundColor: "#8C52FF", color: "white" }}
                    disabled={currentQuestionIndex < 10}
                  >
                    <span className="font-arabic text-xl mr-2 flex items-center justify-center">
                      عشر أسئلة للوراء
                    </span>
                  </Button>

                  {/* السابق */}
                  <Button
                    variant="contained"
                    className="w-full sm:w-32 order-2"
                    onClick={handle_previous_question}
                    sx={{ backgroundColor: "#8C52FF", color: "white" }}
                    disabled={currentQuestionIndex === 0}
                  >
                    <span className="font-arabic text-xl">السابق</span>
                  </Button>

                  {/* التالي */}
                  <Button
                    variant="contained"
                    className="w-full sm:w-32 order-3"
                    onClick={handle_next_question}
                    sx={{ backgroundColor: "#8C52FF", color: "white" }}
                    disabled={currentQuestionIndex == questions.length - 1}
                  >
                    <span className="font-arabic text-xl mr-2">التالي</span>
                  </Button>

                  {/* عشر أسئلة للأمام */}
                  <Button
                    variant="contained"
                    className="w-full sm:w-40 flex items-center justify-center order-4"
                    onClick={handle_next_10_questions}
                    sx={{ backgroundColor: "#8C52FF", color: "white" }}
                    disabled={currentQuestionIndex > questions.length - 11}
                  >
                    <span className="font-arabic text-xl mr-2 flex items-center justify-center">
                      عشر أسئلة للأمام
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Submit Confirmation Dialog */}
      <div dir="rtl">
        <Dialog dir="rtl" open={showSubmitDialog}>
          <DialogTitle>
            <span className="font-arabic text-2xl font-bold">
              تسليم الامتحان
            </span>
          </DialogTitle>
          <DialogContent>
            <Typography className="mb-4">
              <span className="font-arabic text-xl ">
                انتهى الامتحان, ستحصل على درجاتك الان
              </span>
            </Typography>
            <Box className="p-3 bg-gray-50 rounded-lg">
              <Typography variant="body2" className="mb-2">
                <strong className="font-arabic font-bold text-lg">
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
          <span className="font-arabic font-bold text-xl">الانسحاب</span>
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
