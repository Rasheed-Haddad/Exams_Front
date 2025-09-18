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
    nick_name: "",
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
    <div
      dir="rtl"
      className="h-screen bg-gradient-to-br from-brand to-indigo-100 flex items-start justify-center p-4"
    >
      <Container maxWidth="sm">
        <Paper elevation={10} className="p-8 mt-14 rounded-2xl shadow-lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="p"
              component="h1"
              className="font-bold text-3xl text-brand mb-4 font-arabic"
            >
              سجل الدخول
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              <span className="font-arabic text-lg">{error}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <TextField
              dir="rtl"
              fullWidth
              label={
                <span dir="rtl" className="font-arabic text-sm text-brand">
                  الاسم والكنية باللغة العربية
                </span>
              }
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
              label={
                <span className="font-arabic text-sm text-brand">
                  الاسم المستعار (يظهر للآخرين)
                </span>
              }
              name="nick_name"
              type="text"
              value={Student_Data.nick_name}
              onChange={(e) => {
                // السماح فقط بالأحرف العربية (من الألف إلى الياء) بدون مسافات
                const value = e.target.value.replace(/[^ء-ي]/g, "");
                // تحديد الطول الأقصى 10
                if (value.length <= 10) {
                  handleChange({
                    target: { name: "nick_name", value },
                  });
                }
              }}
              variant="outlined"
              required
              className="mb-4"
            />

            <TextField
              dir="rtl"
              fullWidth
              label={
                <span className="font-arabic text-sm text-brand">
                  الرقم الجامعي
                </span>
              }
              name="ID"
              type="text"
              value={Student_Data.ID}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleChange(e);
                }
              }}
              variant="outlined"
              required
              className="mb-4"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />

            <TextField
              dir="rtl"
              fullWidth
              label={
                <span className="font-arabic text-sm text-brand">
                  كلمة المرور
                </span>
              }
              name="password"
              type="text"
              value={Student_Data.password}
              onChange={handleChange}
              variant="outlined"
              required
              className="mb-6"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="h-12 text-lg font-arabic text-white"
              sx={{
                backgroundColor: "#8C52FF",
                "&:hover": {
                  backgroundColor: "#7a45e6", // ظل غامق بسيط للهوفر
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="#8C52FF" />
              ) : (
                <span className="font-arabic text-lg text-white">
                  تسجيل الدخول
                </span>
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};
export default SignIn;
