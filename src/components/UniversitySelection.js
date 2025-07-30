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
  Chip,
} from "@mui/material";
import {
  SchoolOutlined,
  LocationOnOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import {
  fetchColleges,
  fetchUniversities,
  selectUniversity,
} from "../store/slices/selectionSlice";
import { signOut } from "../store/slices/authSlice";
import { useLocation } from "react-router-dom";
const UniversitySelection = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { universities, loading, error } = useSelector(
    (state) => state.selection
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);
  useEffect(() => {
    const savedUniversity =
      JSON.parse(localStorage.getItem("university")) || null;

    if (savedUniversity) {
      dispatch(selectUniversity(savedUniversity));
      dispatch(fetchColleges(savedUniversity.id));

      if (location.pathname !== "/college") {
        navigate("/college");
      }
    }
  }, [dispatch, selectUniversity, navigate, location]);
  const handleUniversitySelect = (university) => {
    dispatch(selectUniversity(university));
    localStorage.setItem("university", JSON.stringify(university));
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
          className="flex justify-between items-center max-w-7xl mx-auto"
        >
          <div>
            <Typography variant="p" className="font-bold text-4xl text-brand">
              <span className="font-arabic text-4xl">اختر جامعتك</span>
            </Typography>
          </div>
          <Button
            variant="outlined"
            endIcon={<LogoutOutlined />}
            onClick={handleSignOut}
            className="gap-7 w-40 font-arabic"
            sx={{
              color: "#8C52FF",
              borderColor: "#8C52FF",
              "&:hover": {
                backgroundColor: "rgba(140, 82, 255, 0.1)",
                borderColor: "#8C52FF",
              },
            }}
          >
            تسجيل الخروج
          </Button>
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
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {universities.map((university) => (
            <Grid key={university.id}>
              <Card
                className=" h-52 w-64 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleUniversitySelect(university)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <SchoolOutlined className="text-brand text-3xl" />
                  </div>

                  <Typography
                    variant="p"
                    className=" text-brand mb-3 text-xl font-arabic"
                  >
                    {university.name}
                  </Typography>

                  <div className="flex items-center text-brand mb-4">
                    <LocationOnOutlined className="text-sm mr-1" />
                    <Typography variant="p" className="text-sm font-arabic">
                      {university.location}
                    </Typography>
                  </div>

                  <Button
                    variant="contained"
                    fullWidth
                    className="mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUniversitySelect(university);
                    }}
                    sx={{
                      fontFamily: "Cairo",
                      fontSize: "1rem",
                      backgroundColor: "#8C52FF",
                      "&:hover": {
                        backgroundColor: "#7a45e6", // ظل غامق بسيط عند التحويم
                      },
                    }}
                  >
                    اختيار
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {universities.length === 0 && !loading && (
          <Box textAlign="center" className="py-12 font-arabic text-lg">
            <Typography variant="p" color="textSecondary">
              لا يوجد جامعات متوفرة حاليا
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default UniversitySelection;
