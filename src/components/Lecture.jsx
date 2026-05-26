import { BookOpen, CheckCircle, Circle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSubject } from "../store/slices/selectionSlice";
import { setSelectedLectures } from "../store/slices/examSlice";
import { useNavigate } from "react-router-dom";

const LectureSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSubject } = useSelector((state) => state.selection);
  const [lectures, setLectures] = useState([]);
  // ✅ تم تغيير اسم setter المحلي لتجنب التضارب مع الـ Redux action
  const [pickedLectures, setPickedLectures] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [noLectureDivision, setNoLectureDivision] = useState(false);

  useEffect(() => {
    if (!selectedSubject) {
      window.history.back();
      return;
    }

    const fromQuestions = selectedSubject.questions
      .map((q) => q.lecture || "")
      .filter((l) => l.trim() !== "");

    const fromSummary = (selectedSubject.summary ?? [])
      .map((s) => s.meta?.lecture_title || "")
      .filter((l) => l.trim() !== "");

    const all = Array.from(new Set([...fromQuestions, ...fromSummary]));

    if (all.length === 0) {
      setNoLectureDivision(true);
      return;
    }
    setLectures(all);
  }, [selectedSubject]);

  const toggleLecture = (lecture) => {
    if (pickedLectures.includes(lecture)) {
      setPickedLectures(pickedLectures.filter((l) => l !== lecture));
      setSelectAll(false);
    } else {
      const newSelected = [...pickedLectures, lecture];
      setPickedLectures(newSelected);
      if (newSelected.length === lectures.length) {
        setSelectAll(true);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setPickedLectures([]);
      setSelectAll(false);
    } else {
      setPickedLectures([...lectures]);
      setSelectAll(true);
    }
  };

  const handleStartExam = () => {
    if (!selectAll && pickedLectures.length === 0 && !noLectureDivision) {
      alert("يرجى اختيار محاضرة واحدة على الأقل");
      return;
    }

    const chosenLectures =
      noLectureDivision || selectAll ? lectures : pickedLectures;

    // فلتر الأسئلة
    let filteredQuestions = selectedSubject?.questions;
    if (!noLectureDivision && !selectAll) {
      filteredQuestions = selectedSubject.questions.filter((q) =>
        pickedLectures.includes(q.lecture),
      );
    }

    if (filteredQuestions.length === 0) {
      alert("لا توجد أسئلة في المحاضرات المحددة");
      return;
    }

    const filteredSubject = {
      ...selectedSubject,
      questions: filteredQuestions,
    };

    dispatch(selectSubject(filteredSubject));
    // ✅ الآن يستدعي Redux action بشكل صحيح
    dispatch(setSelectedLectures(chosenLectures));
    navigate("/summary");
  };

  const getQuestionCount = (lecture) => {
    return (
      selectedSubject?.questions.filter((q) => q.lecture === lecture).length ||
      0
    );
  };

  if (!selectedSubject) return null;

  // حالة عدم وجود تقسيم للمحاضرات
  if (noLectureDivision) {
    return (
      <div
        dir="rtl"
        className="flex font-arabic flex-col min-h-screen bg-white"
      >
        {/* Header */}
        <div className="bg-brand shadow-2xl font-arabic px-6 pt-12 pb-6 rounded-b-[32px]">
          <div className="flex flex-row items-center gap-3 mb-2">
            <button
              onClick={() => window.history.back()}
              className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <span className="text-white font-arabic text-2xl flex-1">
              {selectedSubject.name}
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center px-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center w-full">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={48} color="#8c52ff" />
            </div>

            <span className="text-2xl text-gray-800 font-arabic mb-3 text-center block">
              المحاضرات غير مقسمة بعد
            </span>

            <span className="text-base font-arabic text-gray-600 text-center mb-6 leading-7 block">
              هذه المادة تحتوي على {selectedSubject.questions.length} سؤال غير
              مقسم إلى محاضرات. يمكنك البدء بالمكثفة مباشرة.
            </span>

            <button
              onClick={handleStartExam}
              className="bg-brand rounded-2xl py-4 px-8 flex flex-row items-center justify-center gap-3 w-full"
            >
              <Play size={24} color="#fff" fill="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // حالة وجود تقسيم للمحاضرات
  return (
    <div
      dir="rtl"
      className="flex font-arabic flex-col min-h-screen bg-brand mb-12"
    >
      {/* Header */}
      <div className="bg-brand px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex flex-row items-center gap-3 mb-4">
          <button
            onClick={() => window.history.back()}
            className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <span className="text-white text-2xl">{selectedSubject.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-4 overflow-y-auto">
        {/* Select All Option */}
        <button
          onClick={toggleSelectAll}
          className="bg-white rounded-3xl p-5 mb-4 border-2 border-brand w-full"
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8c52ff] to-[#a855f7] rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </div>
              <div className="flex-1 text-right">
                <p className="text-lg text-gray-800">جميع المحاضرات</p>
                <p className="text-sm text-gray-500">
                  {selectedSubject.questions.length} سؤال
                </p>
              </div>
            </div>
            {selectAll ? (
              <CheckCircle size={28} color="#8C52FF" fill="#C5FF52" />
            ) : (
              <Circle size={28} color="#d1d5db" />
            )}
          </div>
        </button>

        {/* Lectures List */}
        <div className="mb-6">
          <div className="flex flex-col gap-3">
            {lectures.map((lecture, index) => {
              const isSelected = pickedLectures.includes(lecture);
              const questionCount = getQuestionCount(lecture);

              return (
                <button
                  key={index}
                  onClick={() => toggleLecture(lecture)}
                  className={`bg-white rounded-2xl p-4 border-2 w-full ${
                    isSelected ? "border-brand" : "border-transparent"
                  }`}
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-brand" : "bg-gray-100"
                        }`}
                      >
                        <BookOpen
                          size={20}
                          color={isSelected ? "#fff" : "#6b7280"}
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <p
                          className={`text-base ${isSelected ? "text-brand" : "text-gray-800"}`}
                        >
                          {lecture}
                        </p>
                        <p className="text-sm text-gray-500">
                          {questionCount} سؤال
                        </p>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle size={24} color="#8C52FF" fill="#C5FF52" />
                    ) : (
                      <Circle size={24} color="#d1d5db" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-32" />
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand px-6 py-4">
        <button
          onClick={handleStartExam}
          disabled={!selectAll && pickedLectures.length === 0}
          className={`rounded-2xl py-4 px-6 flex flex-row items-center border border-white justify-center gap-3 w-full ${
            selectAll || pickedLectures.length > 0 ? "bg-brand" : "bg-gray-300"
          }`}
        >
          <span className="text-xl text-white">ابدأ</span>
        </button>
      </div>
    </div>
  );
};

export default LectureSelection;
