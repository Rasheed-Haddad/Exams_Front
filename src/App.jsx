import { Provider } from "react-redux";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store";
import SignIn from "./components/SignIn";
import UniversitySelection from "./components/UniversitySelection";
import CollegeSelection from "./components/CollegeSelection";
import SubjectSelection from "./components/SubjectSelection";
import ExamInterface from "./components/ExamInterface";
import ExamResults from "./components/ExamResults";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import IOSInstallBanner from "./components/IOSInstallBanner";
import "./App.css";
import AndroidBlocker from "./components/AndroidBlocker";
import LectureSelection from "./components/Lecture";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <AndroidBlocker>
      <Provider store={store}>
        <CssBaseline />

        <Router>
          <div className="App min-h-screen bg-gray-50">
            <IOSInstallBanner />

            <Routes>
              {/* Public Routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Navigate to="/signin" replace />} />

              {/* Admin Routes - Nested inside Layout */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
                    <Layout />
                  </ProtectedRoute>
                }
              />

              {/* Student Protected Routes */}
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
              <Route path="Lecture" element={<LectureSelection />} />

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

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </AndroidBlocker>
  );
}

export default App;
