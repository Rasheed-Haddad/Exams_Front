import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Chip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Home,
  Refresh,
  TrendingUp,
  AccessTime,
  QuestionAnswer,
  School,
} from "@mui/icons-material";
import { resetExam } from "../store/slices/examSlice";
import { resetSelections } from "../store/slices/selectionSlice";

const ExamResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results, isSubmitted } = useSelector((state) => state.exam);
  const { selectedSubject, selectedCollege, selectedUniversity } = useSelector(
    (state) => state.selection
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isSubmitted) {
      navigate("/subject");
    }
  }, [isSubmitted]);

  const handleRetakeExam = () => {
    dispatch(resetExam());
    navigate("/exam");
  };

  const handleNewExam = () => {
    dispatch(resetExam());
    navigate("/subject");
  };

  const handleHome = () => {
    dispatch(resetExam());
    dispatch(resetSelections());
    navigate("/university");
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography variant="h6">جار تحميل النتائج....</Typography>
      </div>
    );
  }

  const getGradeColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 80) return "info";
    if (score >= 70) return "warning";
    if (score >= 60) return "primary";
    return "error";
  };

  const getGradeLetter = (score) => {
    if (score >= 98) return "A+";
    if (score >= 95) return "A";
    if (score >= 90) return "A-";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "B-";
    if (score >= 70) return "C+";
    if (score >= 65) return "C";
    if (score >= 60) return "C-";
    if (score >= 55) return "D+";
    if (score >= 50) return "D";
    return "F";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return `${user.name} رسميا من نيردات الدفعة`;
    if (score >= 80) return `معدلك بأمان يا ${user.name}`;
    if (score >= 70) return "عليك بالدورات";
    if (score >= 60) return "يكتر خيرك";
    return "قيمتي ما بتتحدد بورقة وقلم";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div
          dir="rtl"
          className="flex justify-between items-center max-w-7xl mx-auto"
        >
          <div>
            <Typography variant="h5" className="font-bold text-gray-800">
              <span className="font-arabic text-4xl mb-8">نتائج الامتحان</span>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <span className="font-arabic text-xl mb-4">
                {selectedSubject?.name}
              </span>
            </Typography>
          </div>

          <div className="flex items-center gap-2 h-fit">
            {results.passed ? (
              <Chip
                icon={<CheckCircle sx={{ fontSize: "1.5rem" }} />}
                label=<span className="font-arabic text-xl ">نجاح</span>
                color="success"
                className=" text-4xl gap-4 w-32 h-fit"
              />
            ) : (
              <Chip
                icon={<Cancel sx={{ fontSize: "1.5rem" }} />}
                label=<span className="font-arabic text-xl ">رسوب</span>
                color="error"
                className="text-4xl gap-4 w-32 h-fit"
              />
            )}
          </div>
        </div>
      </Box>

      <Container maxWidth="lg" className="py-8 flex flex-col">
        <Grid
          container
          spacing={4}
          sx={{
            display: "inline",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Main Results Card */}
          <Grid>
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Typography
                    variant="h2"
                    className="font-bold text-gray-800 mb-2"
                  >
                    {results.score}%
                  </Typography>
                  <div className="m-8">
                    <Typography
                      variant="h4"
                      className="font-bold mb-4 text-5xl"
                      style={{
                        color:
                          getGradeColor(results.score) === "success"
                            ? "#2e7d32"
                            : getGradeColor(results.score) === "error"
                            ? "#d32f2f"
                            : "#1976d2",
                      }}
                    >
                      <span className="font-bold text-5xl">
                        {getGradeLetter(results.score)}{" "}
                      </span>
                      <span className="font-arabic font-bold text-5xl m-4 mb-8">
                        {" "}
                        : الدرجة
                      </span>
                    </Typography>
                  </div>
                  <Typography
                    variant="p"
                    color="textSecondary"
                    className="mb-4 mt-8"
                  >
                    <span className="font-arabic text-2xl">
                      {getPerformanceMessage(results.score)}
                    </span>
                  </Typography>
                </div>

                {/* Score Progress */}
                <Box className="mb-6">
                  <div className="my-8">
                    <Typography variant="p" className="mb-2">
                      <span className="font-arabic text-xl text-black mb-4">
                        نتيجتك
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={results.score}
                      className="h-3 font-bold rounded-full mb-4"
                      color={getGradeColor(results.score)}
                    />
                    <Typography
                      variant="p"
                      color="textSecondary"
                      className="font-arabic text-lg text-black"
                    >
                      ({results.correctAnswers}/{results.totalQuestions} صحيح){" "}
                      {results.score}%
                    </Typography>
                  </div>
                </Box>

                {/* Action Buttons */}
                <Box className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outlined"
                    startIcon={<School />}
                    onClick={handleNewExam}
                    size="large"
                    className="px-6"
                  >
                    <span className="font-arabic text-xl text-black">
                      الانتقال لمادة أخرى
                    </span>
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Sidebar */}
          <Grid>
            <Card>
              <CardContent className="p-6 flex flex-col">
                <div className="space-y-4 flex flex-col gap-4 items-center justify-center">
                  {/* Time Spent */}

                  <div className="flex items-center gap-2">
                    <Typography variant="h6" className="font-bold">
                      <span className="font-arabic text-lg">دقيقة</span>{" "}
                    </Typography>
                    {results.timeSpent}{" "}
                    <Typography variant="body2" className="font-semibold">
                      <span className="font-arabic text-lg">
                        : مدة إتمام الامتحان
                      </span>
                    </Typography>
                    <AccessTime className="text-green-500" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Typography variant="h6" className="font-bold">
                      {results.totalQuestions}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-lg">
                        : الأسئلة التي تمت الإجابة عنها
                      </span>{" "}
                    </Typography>
                    <QuestionAnswer className="text-purple-500" />
                  </div>

                  <Divider className="my-1" />

                  {/* Exam Details */}
                  <div className="space-y-2">
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-lg">
                        <strong>المادة : </strong> {selectedSubject?.name}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-lg">
                        <strong>الكلية:</strong> {selectedCollege?.name}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-lg">
                        <strong>الجامعة:</strong> {selectedUniversity?.name}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-lg">
                        <strong>الطالب:</strong> {user?.name}
                      </span>
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ExamResults;
