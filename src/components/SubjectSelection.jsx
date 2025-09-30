import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { BookOutlined, PlayArrowRounded } from "@mui/icons-material";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";
import { signOut } from "../store/slices/authSlice";

const SubjectSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedCollege) {
      const saved_college = JSON.parse(localStorage.getItem("college"));
      if (saved_college) {
        dispatch(selectCollege(saved_college));
      }
    }
  }, [dispatch, selectedCollege]);

  useEffect(() => {
    if (!selectedCollege || !user?.ID) return;
    if (subjects.length == 0) {
      dispatch(
        fetchSubjects({ college_id: selectedCollege.id, ID: Number(user.ID) })
      );
    }
  }, [dispatch, selectedCollege, user]);

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/exam");
  };

  const handleSignOut = () => {
    localStorage.removeItem("university");
    localStorage.removeItem("college");
    dispatch(signOut());
    navigate("/signin");
  };

  const handle_profile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-32">
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
              text-shadow: 0 0 15px #8c52ff, 0 0 30px #8c52ff, 0 0 45px #8c52ff;
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px); /* نزول وطلوع أوضح */
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
        <div
          dir="rtl"
          className="flex flex-col  sm:flex-row sm:items-center sm:justify-center max-w-7xl mx-auto gap-4"
        >
          <div className="flex items-center justify-center gap-2">
            {/* زر تسجيل الخروج */}
            <div className="flex justify-center sm:justify-start gap-2 font-arabic text-lg">
              <Button
                variant="outlined"
                onClick={handleSignOut}
                sx={{ color: "#8C52FF", borderColor: "#8C52FF" }}
              >
                <span className="font-arabic text-brand text-sm">
                  تسجيل الخروج
                </span>
              </Button>
            </div>
            <div className="flex justify-center sm:justify-start gap-2 font-arabic text-lg">
              <div className="relative inline-block">
                <Button
                  variant="outlined"
                  onClick={handle_profile}
                  className="text-brand border-brand hover:bg-gray-50 transition"
                  sx={{ color: "#8C52FF", borderColor: "#8C52FF" }}
                >
                  <span className="font-arabic text-brand text-sm">
                    الإحصائيات
                  </span>
                </Button>

                {/* شارة NEW */}
                <span className="absolute -top-2 h-5 items-center justify-center flex -left-2 -rotate-12 bg-green-500 text-white text-[8px] font-bold px-0.5 py-0.5 rounded-full shadow-md">
                  NEW
                </span>
              </div>
            </div>
          </div>

          {/* عنوان الصفحة */}
          <Typography
            variant="p"
            className="font-bold text-xl font-arabic text-brand text-center"
          >
            الاختبارات المتاحة لك
          </Typography>
        </div>
      </Box>

      <Container maxWidth="lg" className="py-8">
        {error && (
          <Alert severity="error" className="mb-6">
            <span className="font-arabic text-2xl">{error}</span>
          </Alert>
        )}

        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {subjects.length > 0 &&
            subjects.map((subject) => {
              return (
                <Grid key={subject.ID}>
                  <Card className="h-80 w-64 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <BookOutlined className="text-brand text-3xl" />
                      </div>

                      <div className="flex-grow font-arabic overflow-hidden">
                        <Typography
                          variant="p"
                          className="font-arabic text-lg text-gray-800 mb-2"
                        >
                          {subject.name}
                        </Typography>

                        <div className="mt-2">
                          <span className="font-arabic text-sm text-gray-700">
                            {subject.info || ""}
                          </span>
                        </div>

                        {/* عدد الأسئلة */}
                        <div className="mt-2">
                          <span className="font-arabic text-sm text-gray-700">
                            عدد الأسئلة :{" "}
                            {subject.questions.length || "غير محدد"}
                          </span>
                        </div>

                        <div className="mt-1">
                          <span className="font-arabic text-sm text-gray-700">
                            المدة :{" "}
                            {subject.time
                              ? `${subject.time} دقيقة`
                              : "غير محددة"}
                          </span>
                        </div>
                      </div>

                      {/* الزر - دائمًا في الأسفل */}
                      <div className="mt-6">
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!subject.visible}
                          startIcon={
                            <PlayArrowRounded style={{ fontSize: "25px" }} />
                          }
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectSelect(subject);
                          }}
                          sx={{ backgroundColor: "#8C52FF" }}
                        ></Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>

        {subjects.length === 0 && !loading ? (
          <Box textAlign="center" className="py-12">
            <Typography variant="h6" color="textSecondary">
              <p className="font-arabic text-lg m-12">
                للتسجيل على المواد المتاحة لكليتك, يرجى التواصل عبر واتسأب على
                الرقم 0937922870
              </p>
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
};

export default SubjectSelection;
