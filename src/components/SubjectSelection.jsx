import { useNavigate } from "react-router-dom";
import { BookOpen, Play, BookOpenCheck, LogOut, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState, ExamCard, SectionHeader } from "./Exams_Names";
import LoadingGlow from "./LoadingGlow.jsx";
import { signOut } from "../store/slices/authSlice";
import { fetch_names_of_student_exams } from "../store/slices/exams_slice";
import {
  fetchSubjects,
  selectCollege,
  selectSubject,
} from "../store/slices/selectionSlice";

const SubjectSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { subjects, selectedCollege, loading, error } = useSelector(
    (state) => state.selection
  );
  const { names_of_exams } = useSelector((state) => state.exams);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadSavedCollege = () => {
      if (!selectedCollege) {
        const saved_college_str = localStorage.getItem("college");
        if (saved_college_str) {
          const saved_college = JSON.parse(saved_college_str);
          dispatch(selectCollege(saved_college));
        }
      }
    };

    loadSavedCollege();
  }, [dispatch, selectedCollege]);

  useEffect(() => {
    if (!selectedCollege || !user?.ID) {
      navigate("/signin", { replace: true });
    }
    if (subjects.length === 0) {
      dispatch(
        fetchSubjects({ college_id: selectedCollege?.id, ID: user?.ID })
      );
    }
  }, [dispatch, selectedCollege, user, navigate, subjects.length]);

  useEffect(() => {
    if (names_of_exams.length === 0) {
      dispatch(
        fetch_names_of_student_exams({
          ID: user.ID,
          college_id: selectedCollege.id,
        })
      );
    }
  }, [dispatch, user.ID, selectedCollege.id, names_of_exams.length]);

  const onRefresh = async () => {
    setRefreshing(true);

    await dispatch(
      fetchSubjects({ college_id: selectedCollege?.id, ID: user?.ID })
    );
    await dispatch(
      fetch_names_of_student_exams({
        college_id: selectedCollege?.id,
        ID: user?.ID,
      })
    );
    setRefreshing(false);
  };

  const handleSubjectSelect = (subject) => {
    dispatch(selectSubject(subject));
    navigate("/exam");
  };

  const handleSignOut = () => {
    localStorage.clear();
    dispatch(signOut());
    navigate("/signin", { replace: true });
  };

  const handle_profile = () => {
    navigate("/profile");
  };

  if (loading) {
    return <LoadingGlow />;
  }

  return (
    <div
      dir="rtl"
      className="flex font-arabic flex-col min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white mb-12 shadow-md border-b border-gray-100 px-5 py-4 rounded-b-3xl">
        <div
          dir="rtl"
          className="flex flex-row items-center justify-center max-w-7xl mx-auto"
        >
          {/* الأزرار اليمنى */}
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={handleSignOut}
              className="bg-white px-4 py-2 rounded-xl active:opacity-70 transition-opacity flex items-center gap-2"
            >
              <LogOut size={16} className="text-red-600" />
              <span className="text-red-600  text-sm">تسجيل الخروج</span>
            </button>
            <button
              onClick={handle_profile}
              className="bg-white px-4 py-2 rounded-xl active:opacity-70 transition-opacity flex items-center gap-2"
            >
              <BarChart3 size={16} className="text-brand" />
              <span className="text-brand  text-sm">الإحصائيات</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-16 mb-12 px-4">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 rounded p-4">
            <p className="text-red-700 text-2xl">{error}</p>
          </div>
        )}

        <div className="flex flex-row flex-wrap items-center justify-center gap-3">
          {subjects.length > 0 &&
            subjects.map((subject) => {
              return (
                <div
                  dir="rtl"
                  key={subject.ID}
                  className="w-full flex items-center mb-4 px-3"
                >
                  <div
                    dir="rtl"
                    className="w-full bg-white rounded-xl shadow-md p-4"
                  >
                    {/* Header Icon */}
                    <div className="flex flex-row justify-between items-center mb-3">
                      <BookOpenCheck className="text-brand" size={24} />
                    </div>
                    {/* محتوى المادة */}
                    <div dir="rtl" className="mb-4 text-right">
                      <h3 className="text-lg text-gray-900  mb-1">
                        {subject.name}
                      </h3>

                      {subject.info ? (
                        <p className="text-sm text-gray-700 leading-5">
                          {subject.info}
                        </p>
                      ) : null}
                    </div>

                    {/* الزر */}
                    <button
                      className={`bg-brand rounded-lg py-3 flex flex-row items-center justify-center gap-2 w-full transition-opacity ${
                        !subject.visible
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                      disabled={!subject.visible}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectSelect(subject);
                      }}
                    >
                      <Play size={20} className="text-white fill-white" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-12">
          {/* عرض الامتحانات المتاحة */}
          {names_of_exams && names_of_exams.length > 0 && (
            <div className="mt-6">
              {/* Section Header */}
              <SectionHeader
                title="المواد المتوفرة لكليتك"
                count={names_of_exams.total}
                icon={BookOpen}
              />
              {/* Exams List */}
              {names_of_exams.map((exam, index) => (
                <ExamCard
                  key={index}
                  exam={exam}
                  onClick={() => {
                    const phone = exam.admin.phone_number?.replace(
                      /[^0-9]/g,
                      ""
                    );
                    if (phone) {
                      window.open(`https://wa.me/${phone}`, "_blank");
                    }
                  }}
                />
              ))}
            </div>
          )}
          {/* Empty State */}
          {names_of_exams &&
            names_of_exams.exams &&
            names_of_exams.exams.length === 0 && <EmptyState />}
        </div>

        {subjects.length === 0 && !loading ? (
          <div dir="rtl" className="text-center py-12">
            <p className="text-lg text-gray-500 text-center m-12">
              حاليا لا توجد أي مواد متاحة لك
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SubjectSelection;
