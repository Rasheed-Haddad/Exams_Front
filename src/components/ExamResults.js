import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { set_previous_badge_like_the_new } from "../store/slices/authSlice";
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
  Dialog,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccessTime,
  QuestionAnswer,
  School,
} from "@mui/icons-material";
import { resetExam } from "../store/slices/examSlice";
import { resetSelections } from "../store/slices/selectionSlice";
import { set_badge } from "../store/slices/authSlice";

const ExamResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [badgeInfo, setBadgeInfo] = useState(null);
  const dispatchedRef = useRef(false); // يمنع الطلب المتكرر
  const { results, isSubmitted, loading } = useSelector((state) => state.exam);
  const { selectedSubject, selectedCollege, selectedUniversity } = useSelector(
    (state) => state.selection
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isSubmitted) {
      navigate("/subject");
      return;
    }

    // تأكد أن المستخدم موجود وأننا لم نرسل الطلب سابقاً
    if (!user?.ID || dispatchedRef.current) return;

    const pointsToAdd = Number(results?.correctAnswers || 0);
    if (pointsToAdd <= 0) {
      // حتى إذا صفر، ممكن نطلب تحديث الشارة (أو نتجنب الطلب). هنا نتجنب الطلب.
      dispatchedRef.current = true;
      return;
    }

    (async () => {
      try {
        const payload = await dispatch(
          set_badge({ ID: user.ID, points: pointsToAdd })
        ).unwrap();

        // payload => { points, badge }
        setBadgeInfo(payload);
        setBadgeModalOpen(true);
        dispatchedRef.current = true;
      } catch (err) {
        console.error("Failed to set badge:", err);
        dispatchedRef.current = true; // حتى لا يعيد المحاولة باستمرار — عدّل حسب الحاجة
      }
    })();
  }, [isSubmitted, dispatch, navigate, user?.ID, results?.correctAnswers]);
  const handleNewExam = () => {
    dispatch(set_previous_badge_like_the_new(badgeInfo?.badge));
    dispatch(resetExam());
    navigate("/subject");
  };

  if (loading) {
    return (
      <>
        <div className="bg-gray-50 flex items-center justify-center mb-12 mt-32">
          <h1 className="glow-text">قدها وقدود</h1>

          <style jsx>{`
            .glow-text {
              font-size: 3rem;
              font-weight: 100;
              color: #8c52ff;
              animation: glow 1.5s ease-in-out infinite,
                float 3s ease-in-out infinite;
            }

            @keyframes glow {
              0%,
              100% {
                text-shadow: 0 0 5px #8c52ff, 0 0 10px #8c52ff, 0 0 20px #8c52ff;
              }
              50% {
                text-shadow: 0 0 15px #8c52ff, 0 0 30px #8c52ff,
                  0 0 45px #8c52ff;
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-5px);
              }
            }
          `}</style>
        </div>
        <Typography variant="h6" sx={{ color: "#8C52FF" }}>
          جار تحميل النتائج....
        </Typography>
      </>
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
    const firstName = user.name.split(" ")[0];

    if (score >= 90) return `${firstName} رسميا من نيردات الدفعة`;
    if (score >= 80) return `معدلك بأمان يا ${firstName}`;
    if (score >= 70) return "كويسة ";
    if (score >= 60) return "السيطرة تحت الوضع";
    return `قيمة ${firstName} ما بتتحدد بورقة وقلم`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div
          dir="rtl"
          className="flex justify-center items-center max-w-7xl mx-auto"
        >
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
                    className="font-bold  mb-2"
                    style={{
                      color:
                        getGradeColor(results.score) === "success"
                          ? "#2e7d32"
                          : getGradeColor(results.score) === "error"
                          ? "#d32f2f"
                          : "#1976d2",
                    }}
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
                      <span className="font-bold text-3xl ">
                        {getGradeLetter(results.score)}{" "}
                      </span>
                      <span className="font-arabic font-bold text-3xl m-4 mb-8">
                        {" "}
                        : الدرجة
                      </span>
                    </Typography>
                  </div>
                  <Typography
                    variant="p"
                    color="textSecondary"
                    className="mb-4 mt-8"
                    style={{
                      color:
                        getGradeColor(results.score) === "success"
                          ? "#2e7d32"
                          : getGradeColor(results.score) === "error"
                          ? "#d32f2f"
                          : "#1976d2",
                    }}
                  >
                    <span className="font-arabic text-2xl ">
                      {getPerformanceMessage(results.score)}
                    </span>
                  </Typography>
                </div>

                {/* Score Progress */}
                <Box className="mb-6">
                  <div className="my-8">
                    <Typography
                      variant="p"
                      className="mb-2"
                      style={{
                        color:
                          getGradeColor(results.score) === "success"
                            ? "#2e7d32"
                            : getGradeColor(results.score) === "error"
                            ? "#d32f2f"
                            : "#1976d2",
                      }}
                    >
                      <span className="font-arabic text-xl  mb-4">نتيجتك</span>
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
                    startIcon={<School style={{ color: "#8C52FF" }} />}
                    onClick={handleNewExam}
                    size="large"
                    className="px-6"
                    sx={{ borderColor: "#8C52FF" }}
                  >
                    <span className="font-arabic text-xl text-brand">
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
                      <span className="font-arabic text-sm">دقيقة</span>{" "}
                    </Typography>
                    <Typography variant="p" className="text-sm">
                      {results.timeSpent}{" "}
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      <span className="font-arabic text-sm">
                        : مدة إتمام الامتحان
                      </span>
                    </Typography>
                    <AccessTime className="text-green-500" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Typography variant="p" className=" text-sm">
                      {results.totalQuestions}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-arabic text-sm">
                        : الأسئلة التي تمت الإجابة عنها
                      </span>{" "}
                    </Typography>
                    <QuestionAnswer className="text-brand" />
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
      {/* DIALOG */}

      <Dialog
        dir="rtl"
        open={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            maxWidth: "unset",
            maxHeight: "unset",
            margin: 0,
          },
        }}
      >
        {/* تأثير قصاصات الورق الاحتفالية */}
        {badgeModalOpen && <Confetti numberOfPieces={200} gravity={0.2} />}

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="bg-white rounded-2xl p-8 text-center shadow-2xl w-80 mx-auto "
        >
          <h2 className="text-4xl font-extrabold font-arabic mb-6 text-yellow-500 drop-shadow-lg">
            تهانينا
          </h2>

          <p className="text-xl mb-6 font-arabic">
            رتبتك :
            <span className="block text-3xl font-arabic font-bold text-purple-600 mt-2">
              {badgeInfo?.badge}
            </span>
          </p>

          <p className="text-xl font-arabic text-gray-700 mb-4">
            نقاطك :
            <span className="block text-2xl font-arabic font-bold text-green-500 mt-6">
              {badgeInfo?.points}
            </span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBadgeModalOpen(false)}
            className="bg-brand font-arabic hover:bg-purple-400 text-white px-4 py-3 rounded-full text-xl shadow-lg transition-colors mb-4"
          >
            إغلاق
          </motion.button>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default ExamResults;
