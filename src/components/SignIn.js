import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { signIn, clearError } from "../store/slices/authSlice";

const SignIn = () => {
  const [Student_Data, set_Student_Data] = useState({
    name: "",
    ID: "",
    password: "",
  });
  const token = localStorage.getItem("token") || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated || token) {
      navigate("/university");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    set_Student_Data({
      ...Student_Data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signIn(Student_Data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={8} className="p-8 rounded-2xl">
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h3"
              component="h1"
              className="font-bold text-blue-500 mb-4"
            >
              سجل الدخول
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              <span className="font-arabic text-2xl">{error}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <TextField
              dir="rtl"
              fullWidth
              label="الاسم والكنية باللغة العربية"
              name="name"
              type="text"
              value={Student_Data.name}
              onChange={handleChange}
              variant="outlined"
              required
              className="mb-4"
            />

            <TextField
              dir="rtl"
              fullWidth
              label="الرقم الجامعي"
              name="ID"
              type="text"
              value={Student_Data.ID}
              onChange={handleChange}
              variant="outlined"
              required
              className="mb-6"
            />
            <TextField
              dir="rtl"
              fullWidth
              label="كلمة المرور"
              name="password"
              type="text"
              value={Student_Data.password}
              onChange={handleChange}
              variant="outlined"
              required
              className="mb-4"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="h-12 text-lg font-semibold"
            >
              {loading ? <CircularProgress size={24} /> : "تسجيل الدخول"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default SignIn;
