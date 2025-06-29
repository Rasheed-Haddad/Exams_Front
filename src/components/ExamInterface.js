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
import {
  NavigateNext,
  NavigateBefore,
  AccessTime,
  ExitToApp,
} from "@mui/icons-material";
import {
  fetchExamQuestions,
  setAnswer,
  nextQuestion,
  previousQuestion,
  goToQuestion,
  startTimer,
  stopTimer,
  decrementTimer,
  submitExam,
  resetExam,
} from "../store/slices/examSlice";

const ExamInterface = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    loading,
    error,
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
    dispatch(
      setAnswer({
        questionIndex: currentQuestionIndex,
        answer: parseInt(value),
      })
    );
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleQuestionNavigation = (index) => {
    dispatch(goToQuestion(index));
  };

  const handleSubmitExam = async () => {
    dispatch(stopTimer());

    const timeSpent = Math.floor((1500 - timeRemaining) / 60);

    try {
      await dispatch(
        submitExam({
          subject: selectedSubject,
          answers,
          timeSpent,
          Student_State,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Box textAlign="center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
            <span className="font-arabic text-4lx m-12">قريبا</span>
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/subject")}
            className="mt-4"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div
          dir="rtl"
          className="flex gap-7 justify-start items-center max-w-7xl mx-auto"
        >
          <Button
            variant="outlined"
            onClick={() => setShowExitDialog(true)}
            className=" gap-4 text-gray-600 border-gray-300"
          >
            <span className="font-arabic text-sm">انسحاب</span>
          </Button>

          <div>
            <Typography
              variant="p"
              className="font-bold font-arabic text-xl text-gray-800"
            >
              {selectedSubject?.name}
            </Typography>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600">
              <AccessTime />
              <Typography variant="h6" className="font-mono font-bold">
                {formatTime(timeRemaining)}
              </Typography>
            </div>
          </div>
        </div>
      </Box>

      <Container
        maxWidth="lg"
        className="py-6 flex items-center justify-center"
      >
        <Grid container spacing={3}>
          {/* Question Panel */}
          <Grid>
            <Card className="mb-4">
              <CardContent className="p-6">
                {/* Progress Bar */}
                <Box className="mb-6">
                  <div
                    dir="rtl"
                    className="flex justify-between items-center mb-2"
                  >
                    <Typography variant="body2" color="textSecondary">
                      السؤال {currentQuestionIndex + 1} من {questions.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      تم إكمال {Math.round(progress)}%
                    </Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    className="h-2 rounded-full"
                  />
                </Box>

                {/* Question */}
                <div dir="rtl">
                  <Typography
                    variant="h6"
                    className="mb-6 text-gray-800 leading-relaxed"
                  >
                    <span className="font-bold text-2xl text-blue-600">
                      {currentQuestionIndex + 1}.
                    </span>{" "}
                    <span className="font-arabic text-3xl ">
                      {currentQuestion.question}
                    </span>
                  </Typography>

                  {/* Options */}
                  <FormControl component="fieldset" className="w-full">
                    <RadioGroup
                      value={answers[currentQuestionIndex] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="space-y-3"
                    >
                      {currentQuestion.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={(index + 1).toString()}
                          control={<Radio />}
                          label={
                            <Typography variant="body1" className="ml-2">
                              <span className="font-arabic text-xl ">
                                {option}
                              </span>
                            </Typography>
                          }
                          className="m-0 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Navigation Buttons */}
                  <Box className="flex justify-between items-center mt-8">
                    <Button
                      variant="outlined"
                      className="gap-4"
                      startIcon={<NavigateNext />}
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      <span className="font-arabic text-2xl">السابق</span>
                    </Button>

                    <div className="flex gap-2">
                      {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => setShowSubmitDialog(true)}
                          size="large"
                          className="px-8"
                        >
                          <span className="font-arabic text-2xl">تسليم</span>
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          className="gap-4"
                          endIcon={<NavigateBefore />}
                          onClick={handleNext}
                          size="large"
                        >
                          <span className="font-arabic text-2xl">التالي</span>
                        </Button>
                      )}
                    </div>
                  </Box>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Submit Confirmation Dialog */}
      <div dir="rtl">
        <Dialog
          dir="rtl"
          open={showSubmitDialog}
          onClose={() => setShowSubmitDialog(false)}
        >
          <DialogTitle>
            <span className="font-arabic text-2xl font-bold">
              تسليم الامتحان
            </span>
          </DialogTitle>
          <DialogContent>
            <Typography className="mb-4">
              <span className="font-arabic text-xl ">
                متأكد أنك أنهيت الاختبار وتريد الحصول على درجتك
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
            <Button onClick={() => setShowSubmitDialog(false)}>
              <span className="font-arabic text-xl">الغاء</span>
            </Button>
            <Button
              onClick={handleSubmitExam}
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
            <span className="font-arabic text-xl">الغاء</span>
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
