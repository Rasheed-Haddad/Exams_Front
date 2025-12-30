import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Play,
  ArrowRight,
  Grid,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSubject } from "../store/slices/selectionSlice";

const LectureSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSubject } = useSelector((state) => state.selection);
  const [lectures, setLectures] = useState([]);
  const [selectedLectures, setSelectedLectures] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [noLectureDivision, setNoLectureDivision] = useState(false);

  useEffect(() => {
    if (!selectedSubject) {
      navigate(-1);
      return;
    }

    // استخراج المحاضرات الفريدة
    const allLectures = selectedSubject.questions
      .map((q) => q.lecture || "")
      .filter((lecture) => lecture.trim() !== "");

    // التحقق من عدم وجود تقسيم للمحاضرات
    if (allLectures.length === 0) {
      setNoLectureDivision(true);
      return;
    }

    // إزالة التكرار
    const uniqueLectures = Array.from(new Set(allLectures));
    setLectures(uniqueLectures);
  }, [selectedSubject, navigate]);

  const toggleLecture = (lecture) => {
    if (selectedLectures.includes(lecture)) {
      setSelectedLectures(selectedLectures.filter((l) => l !== lecture));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedLectures, lecture];
      setSelectedLectures(newSelected);
      if (newSelected.length === lectures.length) {
        setSelectAll(true);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedLectures([]);
      setSelectAll(false);
    } else {
      setSelectedLectures([...lectures]);
      setSelectAll(true);
    }
  };

  const handleStartExam = () => {
    if (!selectAll && selectedLectures.length === 0 && !noLectureDivision) {
      alert("يرجى اختيار محاضرة واحدة على الأقل");
      return;
    }

    // إنشاء نسخة معدلة من المادة تحتوي فقط على الأسئلة المحددة
    let filteredQuestions = selectedSubject?.questions;

    if (!noLectureDivision && !selectAll) {
      filteredQuestions = selectedSubject?.questions.filter((q) =>
        selectedLectures.includes(q.lecture)
      );
    }

    if (filteredQuestions.length === 0) {
      alert("لا توجد أسئلة في المحاضرات المحددة");
      return;
    }

    // تحديث المادة المختارة بالأسئلة المفلترة
    const filteredSubject = {
      ...selectedSubject,
      questions: filteredQuestions,
      selectedLectures: noLectureDivision
        ? ["الكل"]
        : selectAll
        ? ["الكل"]
        : selectedLectures,
    };

    dispatch(selectSubject(filteredSubject));
    navigate("/exam");
  };

  const getQuestionCount = (lecture) => {
    return (
      selectedSubject?.questions.filter((q) => q.lecture === lecture).length ||
      0
    );
  };

  if (!selectedSubject) {
    return null;
  }

  // حالة عدم وجود تقسيم للمحاضرات
  if (noLectureDivision) {
    return (
      <div
        style={{ direction: "rtl" }}
        className="flex flex-col min-h-screen bg-white"
      >
        {/* Header */}
        <div className="bg-brand shadow-2xl px-6 pt-12 pb-6 rounded-b-[32px]">
          <div className="flex flex-row items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowRight size={20} color="#fff" />
            </button>
            <span className="text-white text-2xl font-arabic flex-1">
              {selectedSubject.name}
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center px-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={48} color="#8c52ff" />
            </div>

            <span className="text-2xl font-arabic text-gray-800 mb-3 text-center">
              المحاضرات غير مقسمة بعد
            </span>

            <span className="text-base text-gray-600 text-center mb-6 leading-7">
              هذه المادة تحتوي على {selectedSubject.questions.length} سؤال غير
              مقسم إلى محاضرات. يمكنك البدء بالاختبار مباشرة.
            </span>

            <button
              onClick={handleStartExam}
              className="bg-brand rounded-2xl py-4 px-8 flex flex-row items-center justify-center gap-3 w-full hover:opacity-90 transition-all"
            >
              <Play size={24} color="#fff" fill="#fff" />
              <span className="text-white font-arabic text-lg">
                ابدأ الاختبار
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // حالة وجود تقسيم للمحاضرات
  return (
    <div
      style={{ direction: "rtl" }}
      className="flex flex-col min-h-screen bg-white pb-24"
    >
      {/* Header */}
      <div className="bg-brand shadow-2xl px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex flex-row items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowRight size={20} color="#fff" />
          </button>
          <div className="flex-1">
            <span className="text-white text-2xl block">
              {selectedSubject.name}
            </span>
            <span className="text-white/80 text-sm mt-3 block">
              اختار المحاضرات اللي داخلة معك
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex-1 px-6 -mt-4 overflow-y-auto"
        style={{ paddingBottom: "8rem" }}
      >
        {/* Select All Option */}
        <button
          onClick={toggleSelectAll}
          className="bg-white rounded-3xl shadow-lg p-5 mb-4 border-2 border-brand w-full hover:shadow-xl transition-all"
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8c52ff] to-[#a855f7] rounded-2xl flex items-center justify-center">
                <Grid size={24} color="#fff" />
              </div>
              <div className="flex-1 text-right">
                <span className="text-lg font-arabic text-gray-800 block">
                  جميع المحاضرات
                </span>
                <span className="text-sm  font-arabic text-gray-500 block">
                  {selectedSubject.questions.length} سؤال
                </span>
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
              const isSelected = selectedLectures.includes(lecture);
              const questionCount = getQuestionCount(lecture);

              return (
                <button
                  key={index}
                  onClick={() => toggleLecture(lecture)}
                  className={`bg-white rounded-2xl shadow-md p-4 border-2 w-full hover:shadow-lg transition-all ${
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
                        <span
                          className={`text-base font-arabic block ${
                            isSelected ? "text-brand" : "text-gray-800"
                          }`}
                        >
                          {lecture}
                        </span>
                        <span className="text-sm  font-arabic text-gray-500 block">
                          {questionCount} سؤال
                        </span>
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
        <div className="h-12" />
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-2xl">
        <button
          onClick={handleStartExam}
          className={`rounded-2xl py-4 px-6 flex flex-row items-center justify-center gap-3 w-full transition-all ${
            selectAll || selectedLectures.length > 0
              ? "bg-brand hover:opacity-90"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!selectAll && selectedLectures.length === 0}
        >
          <Play size={24} color="#fff" fill="#fff" />
          <span className="text-white font-arabic text-lg">
            {selectAll
              ? `ابدأ الاختبار (${selectedSubject.questions.length} سؤال)`
              : selectedLectures.length > 0
              ? `ابدأ الاختبار (${selectedLectures.reduce(
                  (sum, lec) => sum + getQuestionCount(lec),
                  0
                )} سؤال)`
              : "اختر محاضرة على الأقل"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LectureSelection;
