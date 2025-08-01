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
import { BusinessOutlined } from "@mui/icons-material";
import {
  fetchColleges,
  fetchSubjects,
  selectCollege,
} from "../store/slices/selectionSlice";
import { useLocation } from "react-router-dom";
const CollegeSelection = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colleges, selectedUniversity, loading, error } = useSelector(
    (state) => state.selection
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const saved_college = JSON.parse(localStorage.getItem("college")) || null;

    if (saved_college && user?.ID && !isNaN(user.ID)) {
      dispatch(selectCollege(saved_college));
      dispatch(
        fetchSubjects({ college_id: saved_college.id, ID: Number(user.ID) })
      );

      if (location.pathname !== "/subject") {
        navigate("/subject");
      }
    }
  }, [dispatch, user, navigate, location]);

  useEffect(() => {
    if (!selectedUniversity) {
      navigate("/university");
      return;
    }
    dispatch(fetchColleges(selectedUniversity.id));
  }, [dispatch, selectedUniversity, navigate]);

  const handleCollegeSelect = (college) => {
    dispatch(selectCollege(college));
    localStorage.setItem("college", JSON.stringify(college));
    navigate("/subject");
  };

  const handleBack = () => {
    navigate("/university");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={60} sx={{ color: "#8C52FF" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div
          dir="rtl"
          className="flex items-center justify-center max-w-7xl mx-auto"
        >
          <div>
            <Typography variant="p" className="font-bold text-4xl text-brand">
              اختر كليتك
            </Typography>
          </div>
        </div>
      </Box>

      <Container maxWidth="lg" className="py-8">
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <Grid
          container
          spacing={3}
          sx={{
            alignItems: "start",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {colleges.map((college) => (
            <Grid key={college.id}>
              <Card
                className="h-32 w-32 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleCollegeSelect(college)}
              >
                <CardContent className="p-6" sx={{ height: "20vh" }}>
                  <div className="flex items-start justify-between mb-4">
                    <BusinessOutlined className="text-brand text-3xl" />
                  </div>

                  <div className="flex flex-col gap-4 font-arabic">
                    <div className="h-28">
                      <Typography
                        variant="p"
                        className="text-xl font-arabic text-brand"
                      >
                        {college.name}
                      </Typography>
                    </div>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCollegeSelect(college);
                      }}
                    >
                      اختيار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {colleges.length === 0 && !loading && (
          <Box textAlign="center" className="py-12 gap-6">
            <Typography variant="h6" color="textSecondary">
              قريبا
            </Typography>
            <Button variant="outlined" onClick={handleBack} className="mt-4">
              عودة
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default CollegeSelection;
