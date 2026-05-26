import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  set_badge,
  set_previous_badge_like_the_new,
} from "../store/slices/authSlice";
import { resetExam } from "../store/slices/examSlice";
import { replace, useNavigate } from "react-router-dom";

const ExamResults = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [badgeInfo, setBadgeInfo] = useState(null);
  const dispatchedRef = useRef(false);
  const { results, isSubmitted, loading } = useSelector((state) => state.exam);
  const { user } = useSelector((state) => state.auth);
  const { selectedSubject } = useSelector((state) => state.selection);

  useEffect(() => {
    if (!isSubmitted) {
      navigate("/subject", replace);
      return;
    }

    if (!user?.ID || dispatchedRef.current) return;

    const pointsToAdd = Number(results?.correctAnswers || 0);
    if (pointsToAdd <= 0) {
      dispatchedRef.current = true;
      return;
    }

    (async () => {
      try {
        const payload = await dispatch(
          set_badge({ ID: user.ID, points: pointsToAdd }),
        ).unwrap();
        setBadgeInfo(payload);
        dispatchedRef.current = true;
      } catch (err) {
        console.error("Failed to set badge:", err);
        dispatchedRef.current = true;
      }
    })();
  }, [isSubmitted, dispatch, user?.ID, results?.correctAnswers]);

  const handleNewExam = () => {
    dispatch(set_previous_badge_like_the_new(badgeInfo?.badge));
    navigate("/subject", replace);
    setTimeout(() => {
      dispatch(resetExam());
    }, 100);
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "#2e7d32";
    if (score >= 80) return "#0288d1";
    if (score >= 70) return "#ed6c02";
    if (score >= 60) return "#1976d2";
    return "#d32f2f";
  };

  const getGradeLetter = (score) => {
    if (score >= 98) return "A+";
    if (score >= 95) return "A";
    if (score >= 90) return "A-";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "B-";
    if (score >= 70) return "C+";
    if (score >= 65) return "C";
    if (score >= 60) return "C-";
    if (score >= 55) return "D+";
    if (score >= 50) return "D";
    return "F";
  };

  const getPerformanceMessage = (score) => {
    const firstName = user?.name?.split(" ")[0] || "";
    if (score >= 90) return `${firstName} رسميا من نيردات الدفعة`;
    if (score >= 80) return `معدلك بأمان يا ${firstName}`;
    if (score >= 70) return "كويسة ";
    if (score >= 60) return "السيطرة تحت الوضع";
    return `قيمة ${firstName} ما بتتحدد بورقة وقلم`;
  };

  const scoreColor = getGradeColor(results.score);

  return (
    <div className="flex-1 font-arabic min-h-screen bg-white overflow-y-auto">
      <div className="py-8 px-4 mt-8">
        <div className="bg-white rounded-2xl p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* ── GRADE LETTER ── */}
            <div className="mb-7 flex flex-col items-center">
              <span
                style={{
                  fontSize: 100,
                  color: scoreColor,
                  lineHeight: "110px",
                  textAlign: "center",
                }}
              >
                {getGradeLetter(results.score)}
              </span>
            </div>

            {/* ── PERFORMANCE MESSAGE ── */}
            <div className="mt-16 mb-6">
              <span
                style={{ fontSize: 22, color: scoreColor, textAlign: "center" }}
                className="block"
              >
                {getPerformanceMessage(results.score)}
              </span>
            </div>

            {/* ── INFO CARD ── */}
            <div
              style={{
                borderWidth: 1.5,
                borderColor: scoreColor,
                borderRadius: 12,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 16,
                paddingRight: 16,
                backgroundColor: `${scoreColor}08`,
                border: `1.5px solid ${scoreColor}`,
              }}
              className="w-full flex flex-col items-center"
            >
              <span style={{ color: scoreColor }} className="mb-1 block">
                المادة : {selectedSubject?.name}
              </span>
              <span style={{ color: scoreColor }} className="mb-1 block">
                الطالب : {user?.name}
              </span>
              <span style={{ color: scoreColor }} className="block">
                الرقم الجامعي : {user?.ID}
              </span>
            </div>

            {/* ── BACK BUTTON ── */}
            <div className="mt-4 w-full">
              <button
                style={{
                  borderWidth: 2,
                  border: `2px solid ${scoreColor}`,
                  borderRadius: 12,
                  padding: "12px 28px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={handleNewExam}
              >
                <span style={{ color: scoreColor, fontSize: 20 }}>عودة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
