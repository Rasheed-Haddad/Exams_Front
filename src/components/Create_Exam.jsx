import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Cloud,
  CloudOff,
  Download,
  Move,
  Plus,
  Save,
  ArrowRight,
} from "lucide-react";
import {
  request_exam_for_the_admin,
  update_exam_for_the_admin,
} from "../store/slices/exams_slice";

// مكون الحقول الأساسية المنفصل
const BasicFieldsSection = memo(({ formData, handleChange, isEditing }) => {
  return (
    <div className="gap-3 font-arabic bg-white p-4 rounded-lg border border-gray-200 mx-3 mb-4">
      {/* Checkboxes */}
      <div className="flex flex-row gap-4 mb-2">
        <div className="flex flex-row items-center gap-2">
          <input
            type="checkbox"
            checked={formData.visible}
            onChange={(e) => handleChange("visible", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">مرئي</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <input
            type="checkbox"
            checked={formData.open_mode}
            onChange={(e) => handleChange("open_mode", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">وضع مفتوح</span>
        </div>
      </div>

      {/* الحقول */}
      {[
        { label: "اسم المادة", name: "name" },
        { label: "رمز الكلية", name: "college_id" },
        { label: "الوقت بالدقيقة", name: "time" },
        { label: "السعر", name: "price" },
      ].map((field) => (
        <div key={field.name} className="mb-3">
          <label className="block text-xs mb-1 text-gray-600">
            {field.label}
          </label>
          <input
            type="text"
            value={formData[field.name]?.toString() || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-white outline-none focus:border-brand"
          />
        </div>
      ))}

      {/* الطلاب المسجلين */}
      {isEditing && (
        <div className="mb-3">
          <label className="block text-xs mb-1 text-gray-600">
            الطلاب المسجلين على الاختبار
          </label>
          <textarea
            dir="ltr"
            value={formData.available_to.toString()}
            onChange={(e) => handleChange("available_to", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-white outline-none focus:border-brand"
            rows={3}
            placeholder="أدخل الأرقام الجامعية للطلاب"
          />
        </div>
      )}

      {/* وصف الاختبار */}
      <div className="mb-3">
        <label className="block text-xs mb-1 text-gray-600">وصف الاختبار</label>
        <textarea
          value={formData.info}
          onChange={(e) => handleChange("info", e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-white outline-none focus:border-brand"
          rows={3}
          placeholder="أدخل وصف الاختبار"
        />
      </div>
    </div>
  );
});

const Create_Exam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exams, loading } = useSelector((state) => state.exams);
  const isEditing = Boolean(id);
  const { user } = useSelector((state) => state.auth);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const examToEdit = isEditing ? exams.find((e) => e._id == id) : null;

  const DRAFT_STORAGE_KEY = "exam_draft_";

  const [formData, setFormData] = useState({
    name: "",
    college_id: "",
    info: "",
    time: "",
    visible: false,
    available_to: [],
    open_mode: false,
    price: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        lecture: "",
      },
    ],
  });

  const [moveToPosition, setMoveToPosition] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(null);

  const draftKey = isEditing
    ? `${DRAFT_STORAGE_KEY}${id}`
    : `${DRAFT_STORAGE_KEY}new`;

  // تحميل المسودة عند فتح الصفحة
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const shouldRestore = window.confirm(
            "وجدنا مسودة محفوظة من جلسة سابقة. هل تريد استعادتها؟"
          );

          if (shouldRestore) {
            const draft = JSON.parse(savedDraft);
            setFormData(draft);
            setLastSavedTime(new Date(draft.savedAt));
          } else {
            localStorage.removeItem(draftKey);
            if (examToEdit) {
              setFormData({
                ...examToEdit,
                available_to: Array.isArray(examToEdit.available_to)
                  ? examToEdit.available_to.join(", ")
                  : examToEdit.available_to,
                questions: examToEdit.questions.map((q) => ({
                  ...q,
                  lecture: q.lecture || "",
                })),
              });
            }
          }
        } else {
          if (examToEdit) {
            setFormData({
              ...examToEdit,
              available_to: Array.isArray(examToEdit.available_to)
                ? examToEdit.available_to.join(", ")
                : examToEdit.available_to,
              questions: examToEdit.questions.map((q) => ({
                ...q,
                lecture: q.lecture || "",
              })),
            });
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    loadDraft();
  }, [examToEdit, draftKey]);

  // حفظ تلقائي
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 5000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData]);

  const saveDraft = () => {
    try {
      const draftData = {
        ...formData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      setIsSaved(true);
      setLastSavedTime(new Date());
    } catch (error) {
      console.error("Error saving draft:", error);
      setIsSaved(false);
    }
  };

  const deleteDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      console.log("✅ Draft deleted successfully");
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  };

  const allLectures = useMemo(() => {
    const lectures = formData.questions
      .map((q) => q.lecture)
      .filter((l) => l && l.trim() !== "");
    return Array.from(new Set(lectures));
  }, [formData.questions]);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsSaved(false);
  }, []);

  const handleQuestionChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
    setIsSaved(false);
  }, []);

  const handleOptionChange = useCallback(
    (questionIndex, optionIndex, value) => {
      setFormData((prev) => {
        const updatedQuestions = [...prev.questions];
        const updatedOptions = [...updatedQuestions[questionIndex].options];
        updatedOptions[optionIndex] = value;
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: updatedOptions,
        };
        return {
          ...prev,
          questions: updatedQuestions,
        };
      });
      setIsSaved(false);
    },
    []
  );

  const handleCorrectOptionChange = useCallback((questionIndex, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answer: value,
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
    setIsSaved(false);
  }, []);

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: 0,
          lecture: "",
        },
      ],
    }));
    setIsSaved(false);
  };

  const addQuestionAfter = (index) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index + 1, 0, {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        lecture: "",
      });
      return {
        ...prev,
        questions: newQuestions,
      };
    });
    setIsSaved(false);
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) {
      alert("يجب أن يحتوي الاختبار على سؤال واحد على الأقل");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    setIsSaved(false);
  };

  const moveQuestionUp = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      [newQuestions[index - 1], newQuestions[index]] = [
        newQuestions[index],
        newQuestions[index - 1],
      ];
      return {
        ...prev,
        questions: newQuestions,
      };
    });
    setIsSaved(false);
  };

  const moveQuestionDown = (index) => {
    if (index === formData.questions.length - 1) return;
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];
      return {
        ...prev,
        questions: newQuestions,
      };
    });
    setIsSaved(false);
  };

  const moveQuestionToPosition = (currentIndex, newPosition) => {
    const targetIndex = parseInt(newPosition) - 1;

    if (
      isNaN(targetIndex) ||
      targetIndex < 0 ||
      targetIndex >= formData.questions.length
    ) {
      alert("الرجاء إدخال رقم صحيح بين 1 و " + formData.questions.length);
      return;
    }

    if (currentIndex === targetIndex) {
      return;
    }

    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      const [movedQuestion] = newQuestions.splice(currentIndex, 1);
      newQuestions.splice(targetIndex, 0, movedQuestion);
      return {
        ...prev,
        questions: newQuestions,
      };
    });

    setMoveToPosition((prev) => ({ ...prev, [currentIndex]: "" }));
    setIsSaved(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.info || !formData.time) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    const invalidQuestions = formData.questions.filter(
      (q) => !q.question || q.options.some((opt) => !opt)
    );
    if (invalidQuestions.length > 0) {
      alert("يرجى ملء جميع الأسئلة والخيارات");
      return;
    }

    try {
      if (isEditing) {
        await dispatch(
          update_exam_for_the_admin({
            _id: examToEdit._id,
            new_name: formData.name,
            new_info: formData.info,
            new_questions: formData.questions,
            new_time: formData.time,
            new_visible: formData.visible,
            new_open_mode: formData.open_mode,
            new_price: formData.price,
            new_available_to:
              typeof formData.available_to === "string"
                ? formData.available_to.split(",").map((s) => s.trim())
                : formData.available_to,
          })
        ).unwrap();
      } else {
        await dispatch(
          request_exam_for_the_admin({
            name: formData.name,
            college_id: formData.college_id,
            info: formData.info,
            time: formData.time,
            visible: formData.visible || false,
            open_mode: formData.open_mode || false,
            price: formData.price || 0,
            admin_id: user.id,
            questions: formData.questions,
          })
        ).unwrap();

        deleteDraft();
      }

      alert(isEditing ? "تم تحديث الامتحان بنجاح" : "تم إرسال الطلب بنجاح");
      navigate("/admin/exams");
    } catch (error) {
      alert(error || "حدث خطأ أثناء الإرسال");
    }
  };

  const exportExamAsJSON = () => {
    const exportData = {
      ...formData,
      available_to:
        typeof formData.available_to === "string"
          ? formData.available_to.split(",").map((s) => s.trim())
          : formData.available_to,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name || "exam"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSuggestions = useCallback(
    (currentValue) => {
      if (!currentValue || currentValue.trim() === "") return [];
      return allLectures.filter(
        (lecture) =>
          lecture.toLowerCase().includes(currentValue.toLowerCase()) &&
          lecture !== currentValue
      );
    },
    [allLectures]
  );

  return (
    <div className="flex-1 font-arabic bg-gray-50 min-h-screen pb-8">
      <div dir="rtl" className="p-4 gap-4">
        {/* العنوان */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex flex-row items-center gap-2">
            <Link to="/admin/exams">
              <button>
                <ArrowRight size={24} className="text-brand" />
              </button>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
              {isSaved ? (
                <Cloud size={16} className="text-green-500" />
              ) : (
                <CloudOff size={16} className="text-red-500" />
              )}
              <span
                className="text-xs mr-1"
                style={{ color: isSaved ? "#10b981" : "#ef4444" }}
              >
                {isSaved ? "محفوظ" : "جاري الحفظ..."}
              </span>
            </div>

            <button
              onClick={exportExamAsJSON}
              className="bg-brand px-3 py-2 rounded-lg flex flex-row items-center gap-1.5"
            >
              <Download size={16} className="text-white" />
            </button>
          </div>
        </div>

        {!isEditing && lastSavedTime && (
          <p className="text-xs text-gray-500 text-center mb-4">
            آخر حفظ: {lastSavedTime.toLocaleTimeString("ar")}
          </p>
        )}

        {/* زر الحفظ العلوي */}
        <button
          onClick={handleSubmit}
          className="bg-brand w-full py-3 rounded-lg mb-4"
          disabled={loading}
        >
          <span className="text-white text-center text-base ">
            {isEditing ? "حفظ التغييرات" : "إنشاء الاختبار"}
          </span>
        </button>
      </div>

      <BasicFieldsSection
        formData={formData}
        handleChange={handleChange}
        isEditing={isEditing}
      />

      {/* الأسئلة */}
      {formData.questions.map((question, qIndex) => {
        const suggestions =
          showSuggestions === qIndex ? getSuggestions(question.lecture) : [];

        return (
          <div
            key={qIndex}
            dir="rtl"
            className="p-4 border border-gray-300 rounded-xl bg-white mx-3 mb-4 shadow-sm"
          >
            <div className="flex flex-row items-center justify-between mb-3">
              <span className="text-xl font-arabic text-brand">
                #{qIndex + 1}
              </span>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="px-3 py-1.5 bg-red-50 rounded-lg border border-red-200"
              >
                <span className="text-red-600 text-xs font-medium">حذف</span>
              </button>
            </div>

            {/* أزرار التحريك */}
            <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex flex-row items-center gap-2 flex-wrap">
                <input
                  type="number"
                  value={moveToPosition[qIndex] || ""}
                  onChange={(e) =>
                    setMoveToPosition((prev) => ({
                      ...prev,
                      [qIndex]: e.target.value,
                    }))
                  }
                  placeholder={`1-${formData.questions.length}`}
                  className="border border-blue-300 p-2 rounded-lg text-sm w-20 bg-white outline-none"
                />
                <button
                  onClick={() =>
                    moveQuestionToPosition(qIndex, moveToPosition[qIndex])
                  }
                  className="bg-brand px-3 py-2 rounded-lg flex flex-row items-center gap-1"
                >
                  <Move size={14} className="text-white" />
                  <span className="text-white text-xs font-medium">نقل</span>
                </button>
                <button
                  onClick={() => moveQuestionUp(qIndex)}
                  disabled={qIndex === 0}
                  className="p-1"
                >
                  <ArrowUp
                    size={24}
                    color={qIndex === 0 ? "#d1d5db" : "#3b82f6"}
                  />
                </button>
                <button
                  onClick={() => moveQuestionDown(qIndex)}
                  disabled={qIndex === formData.questions.length - 1}
                  className="p-1"
                >
                  <ArrowDown
                    size={24}
                    color={
                      qIndex === formData.questions.length - 1
                        ? "#d1d5db"
                        : "#3b82f6"
                    }
                  />
                </button>
              </div>
            </div>

            {/* حقل المحاضرة */}
            <div className="mb-3 relative">
              <input
                type="text"
                value={question.lecture}
                onChange={(e) => {
                  handleQuestionChange(qIndex, "lecture", e.target.value);
                  setShowSuggestions(e.target.value.trim() ? qIndex : null);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                className="w-full border-2 border-purple-300 bg-purple-50 p-3 rounded-xl text-sm outline-none"
                placeholder="📚 اسم المحاضرة"
              />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purple-200 rounded-lg shadow-lg z-50 max-h-32 overflow-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleQuestionChange(qIndex, "lecture", suggestion);
                        setShowSuggestions(null);
                      }}
                      className="w-full p-3 border-b border-gray-100 text-right hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* نص السؤال */}
            <div className="mb-3">
              <textarea
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                className="w-full border-2 border-blue-400 bg-blue-50 p-4 rounded-xl text-base font-medium outline-none"
                placeholder="❓ نص السؤال"
                rows={3}
              />
            </div>

            {/* الخيارات */}
            <div className="space-y-2 mb-4">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="flex flex-row items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-arabic text-gray-600">
                      {optIndex + 1}
                    </span>
                  </div>
                  <textarea
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    className="flex-1 border border-gray-300 bg-gray-50 p-3 rounded-lg text-sm outline-none"
                    placeholder={`الخيار ${optIndex + 1}`}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* الإجابة الصحيحة */}
            <div className="mb-3">
              <div className="flex flex-row gap-2">
                {[1, 2, 3, 4].map((optNum) => (
                  <button
                    key={optNum}
                    onClick={() => handleCorrectOptionChange(qIndex, optNum)}
                    className={`flex-1 py-3 rounded-lg ${
                      question.answer == optNum ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`text-center text-base font-arabic ${
                        question.answer == optNum
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {optNum}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* إضافة سؤال بعد هذا */}
            <button
              onClick={() => addQuestionAfter(qIndex)}
              className="bg-green-500 px-3 py-2 rounded-lg flex flex-row items-center justify-center w-full"
            >
              <Plus size={14} className="text-white mr-1" />
              <span className="text-white text-xs font-medium">
                إضافة سؤال هنا
              </span>
            </button>
          </div>
        );
      })}

      {/* Footer */}
      <div dir="rtl" className="p-4 space-y-3">
        <button
          onClick={addQuestion}
          className="bg-green-500 w-full py-3 rounded-lg flex flex-row items-center justify-center"
        >
          <Plus size={18} className="text-white mr-2" />
          <span className="text-white font-medium">إضافة سؤال</span>
        </button>
        <button
          onClick={handleSubmit}
          className="bg-brand w-full py-3 rounded-lg flex flex-row items-center justify-center"
          disabled={loading}
        >
          <Save size={18} className="text-white mr-2" />
          <span className="text-white font-medium">
            {isEditing ? "حفظ التغييرات" : "إنشاء الاختبار"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Create_Exam;
