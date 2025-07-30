import { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";
import { BookOutlined, PlayArrowOutlined } from "@mui/icons-material";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";
import { signOut } from "../store/slices/authSlice";
//localStorage.removeItem("name");
//localStorage.removeItem("ID");
//localStorage.removeItem("password");
//localStorage.removeItem("university");
const SubjectSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection
  );
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

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

    dispatch(
      fetchSubjects({ college_id: selectedCollege.id, ID: Number(user.ID) })
    );
  }, [dispatch, selectedCollege, user]);

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

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user || !user.ID || !Array.isArray(subjects)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={60} sx={{ color: "#8C52FF" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
        <div
          dir="rtl"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto gap-4"
        >
          {/* زر تسجيل الخروج */}
          <div className="flex justify-between sm:justify-start gap-2 font-arabic text-lg">
            <Button
              variant="outlined"
              onClick={handleSignOut}
              className="text-brand border-brand hover:bg-gray-50 transition"
              sx={{ color: "#8C52FF", borderColor: "#8C52FF" }}
            >
              تسجيل الخروج
            </Button>
          </div>

          {/* عنوان الصفحة */}
          <Typography
            variant="p"
            className="font-bold text-xl font-arabic text-brand text-center"
          >
            الاختبارات المتاحة لك
          </Typography>

          {/* شريط البحث */}
          <TextField
            dir="rtl"
            placeholder="ابحث عن اختبار..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 font-arabic"
            inputProps={{ className: "font-arabic text-brand" }}
            sx={{ color: "#8C52FF", borderColor: "#8C52FF" }}
          />
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
          {filteredSubjects.length > 0 &&
            filteredSubjects.map((subject) => {
              return (
                <Grid key={subject.ID}>
                  <Card className="h-72 w-64 hover:shadow-lg  transition-shadow duration-300 cursor-pointer transform hover:scale-105">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <BookOutlined className="text-brand text-3xl" />
                      </div>

                      {/* النصوص - خذ كل المساحة المتاحة ما عدا الزر */}
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
                      </div>

                      {/* الزر - دائمًا في الأسفل */}
                      <div className="mt-6">
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!subject.visible}
                          startIcon={<PlayArrowOutlined />}
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectSelect(subject);
                          }}
                          sx={{ backgroundColor: "#8C52FF" }}
                        >
                          <p className="font-arabic text-lg">البدء</p>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>

        {filteredSubjects.length === 0 && !loading && (
          <Box textAlign="center" className="py-12">
            <Typography variant="h6" color="textSecondary">
              <p className="font-arabic text-lg m-12">
                حاليا لا تتوفر أي اختبارات لك, لأي استفسار تواصل مع الرقم
                0937922870
              </p>
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SubjectSelection;
