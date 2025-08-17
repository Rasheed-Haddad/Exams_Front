import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store";
import SignIn from "./components/SignIn";
import UniversitySelection from "./components/UniversitySelection";
import CollegeSelection from "./components/CollegeSelection";
import SubjectSelection from "./components/SubjectSelection";
import ExamInterface from "./components/ExamInterface";
import ExamResults from "./components/ExamResults";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { Typography } from "@mui/material";
import Profile from "./components/Profile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <div className="flex items-center justify-center bg-brand pb-2">
              <Typography
                variant="p"
                className="text-sm text-white  font-arabic "
              >
                جميع حقوق المحتوى محفوظة © قدها وقدود – يمنع النسخ أو التصوير أو
                النشر
              </Typography>
            </div>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Navigate to="/signin" replace />} />

              <Route
                path="/university"
                element={
                  <ProtectedRoute>
                    <UniversitySelection />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/college"
                element={
                  <ProtectedRoute>
                    <CollegeSelection />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subject"
                element={
                  <ProtectedRoute>
                    <SubjectSelection />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/exam"
                element={
                  <ProtectedRoute>
                    <ExamInterface />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <ExamResults />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
