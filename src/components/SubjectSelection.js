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
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { BookOutlined, PlayArrowOutlined } from "@mui/icons-material";
import { fetchSubjects, selectSubject } from "../store/slices/selectionSlice";
import { signOut } from "../store/slices/authSlice";
const SubjectSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection
  );

  useEffect(() => {
    if (!selectedCollege) {
      navigate("/college");
      return;
    }
    dispatch(fetchSubjects(selectedCollege.id));
  }, [dispatch, selectedCollege, navigate]);

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/exam");
  };

  const handleBack = () => {
    navigate("/college");
  };

  const handleSignOut = () => {
    localStorage.removeItem("university");
    localStorage.removeItem("college");
    dispatch(signOut());
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div
          dir="rtl"
          className="flex justify-start gap-7 items-center max-w-7xl mx-auto"
        >
          <div className="flex gap-2 font-arabic text-2xl">
            <Button
              variant="outlined"
              onClick={handleBack}
              className="text-gray-600 border-gray-300"
            >
              رجوع
            </Button>
          </div>
          <div className="font-arabic text2xl">
            <Button
              variant="outlined"
              onClick={handleSignOut}
              className="text-gray-600 border-gray-300"
            >
              تسجيل الخروج
            </Button>
          </div>
          <div className="font-arabic text-2xl">
            <Typography
              variant="p"
              className="font-bold font-2xl font-arabic text-gray-800"
            >
              الاختبارات المتاحة
            </Typography>
          </div>
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
          {subjects.map((subject) => (
            <Grid key={subject.ID}>
              <Card className="h-60 w-60 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <BookOutlined className="text-green-500 text-3xl" />
                  </div>
                  <div className="flex flex-col">
                    <div className="h-32 font-arabic ">
                      <Typography
                        variant="p"
                        className="font-arabic text-2xl text-gray-800 mb-2"
                      >
                        {subject.name}
                      </Typography>
                      <br />
                      <div className="mt-5">
                        <span className="font-arabic text-sm text-gray-700">
                          {subject.info || ""}
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrowOutlined />}
                        className="mt-4 float-end bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubjectSelect(subject);
                        }}
                      >
                        <p className="font-arabic text-lg">البدء</p>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {subjects.length === 0 && !loading && (
          <Box textAlign="center" className="py-12">
            <Typography variant="h6" color="textSecondary">
              <p className="font-arabic text-lg m-12">
                حاليا لا توجد أي اختبارات مضافة, في حال أردت إضافة اختبار
                والمشاركة في موقعنا يرجى التواصل معنا عبر الرقم : 0937922870
              </p>
            </Typography>
            <Button
              variant="outlined"
              onClick={handleBack}
              className="mt-4 w-48"
            >
              عودة
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SubjectSelection;
