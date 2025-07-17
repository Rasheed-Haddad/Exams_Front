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
          className="flex justify-between items-center max-w-7xl mx-auto gap-6 flex-wrap"
        >
          <div className="flex gap-2 font-arabic text-2xl">
            <Button
              variant="outlined"
              onClick={handleBack}
              className="text-gray-600 border-gray-300"
            >
              تحديث
            </Button>
            <Button
              variant="outlined"
              onClick={handleSignOut}
              className="text-gray-600 border-gray-300"
            >
              تسجيل الخروج
            </Button>
          </div>

          <Typography
            variant="p"
            className="font-bold font-2xl font-arabic text-gray-800"
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
            className="w-full sm:w-96 font-arabic"
            inputProps={{ className: "font-arabic text-lg" }}
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
                  <Card className="h-60 w-60 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <BookOutlined className="text-green-500 text-3xl" />
                      </div>
                      <div className="flex flex-col">
                        <div className="h-32 font-arabic ">
                          <Typography
                            variant="p"
                            className="font-arabic text-lg text-gray-800 mb-2"
                          >
                            {subject.name}
                          </Typography>
                          <br />
                          <div className="mt-2">
                            <span className="font-arabic text-sm text-gray-700">
                              {subject.info || ""}
                            </span>
                          </div>
                        </div>
                        <div className="">
                          <Button
                            variant="contained"
                            fullWidth
                            disabled={!subject.visible}
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
