import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { set_previous_badge_like_the_new } from "../store/slices/authSlice";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Grid,
} from "@mui/material";
import { School } from "@mui/icons-material";
import { resetExam } from "../store/slices/examSlice";
import { set_badge } from "../store/slices/authSlice";

const ExamResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [badgeInfo, setBadgeInfo] = useState(null);
  const dispatchedRef = useRef(false);
  const { results, isSubmitted, loading } = useSelector((state) => state.exam);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isSubmitted) {
      navigate("/subject");
      return;
    }

    if (!user?.ID || dispatchedRef.current) return;

    const pointsToAdd = Number(results?.correctAnswers || 0);
    if (pointsToAdd <= 0) {
      dispatchedRef.current = true;
      return;
    }

    (async () => {
      try {
        const payload = await dispatch(
          set_badge({ ID: user.ID, points: pointsToAdd })
        ).unwrap();

        setBadgeInfo(payload);
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
    <div className="h-full bg-gray-50">
      <Container maxWidth="lg" className="py-8 flex flex-col mt-16">
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
                      الأجوبة الصحيحة : {results.correctAnswers} من{" "}
                      {results.totalQuestions}
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
                    <span className="font-arabic text-xl text-brand">عودة</span>
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ExamResults;
