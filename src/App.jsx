import { Provider } from "react-redux";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import InstallPWA from "./components/InstallPWA";
import AndroidBlocker from "./components/AndroidBlocker";
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
import "./App.css";

function App() {
  // تسجيل Service Worker يدوياً (في حال لم يتم تسجيله تلقائياً)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service Worker موجود من Vite Plugin
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <CssBaseline />
      <AndroidBlocker>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            {/* زر التثبيت - خارج Routes ليظهر في كل الصفحات */}
            <InstallPWA />

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

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* صفحة 404 */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </div>
        </Router>
      </AndroidBlocker>
    </Provider>
  );
}

export default App;
