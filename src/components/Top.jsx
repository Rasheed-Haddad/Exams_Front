import { fetch_students } from "../store/slices/students_slice";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchIcon } from "lucide-react";

export default function Top_Component() {
  const dispatch = useDispatch();
  const Students = useSelector((state) => state.students);
  const Exams = useSelector((state) => state.exams);
  const [Search_Term, set_Search_Term] = useState("");
  const filtered_Exams = Array.isArray(Exams.exams)
    ? Exams.exams.filter(
        (exam) =>
          exam?.name?.toLowerCase().includes(Search_Term.toLowerCase()) ||
          exam?.ID?.toString().toLowerCase().includes(Search_Term.toLowerCase())
      )
    : [];

  useEffect(() => {
    dispatch(fetch_students());
  }, [dispatch]);

  return (
    <div className="space-y-4 font-arabic sm:space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* شريط البحث */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center max-w-full sm:max-w-md bg-white border border-gray-300 rounded-md px-3 py-2">
            <SearchIcon
              size={18}
              className="text-gray-500 ml-2 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="البحث عن اختبار"
              className="bg-transparent border-none focus:outline-none flex-1 text-sm sm:text-base text-gray-800"
              value={Search_Term}
              onChange={(e) => set_Search_Term(e.target.value)}
            />
          </div>
        </div>

        {/* الكروت */}
        <div className="p-3 sm:p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filtered_Exams.map((exam) => {
            const grades = Students.students.flatMap((student) =>
              student.scores
                .filter(
                  (subject) =>
                    subject.subject_id === exam.ID &&
                    subject.is_open_mode === false
                )
                .map((subject) => subject.score)
            );

            const students = Students.students.flatMap((student) =>
              student.scores
                .filter(
                  (subject) =>
                    subject.subject_id === exam.ID &&
                    subject.is_open_mode === false
                )
                .map((subject) => ({
                  name: student.name,
                  score: subject.score,
                }))
            );

            const top_5 = students
              .sort((a, b) => b.score - a.score)
              .slice(0, 5);

            const averageGrade =
              grades.length > 0
                ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)
                : 0;

            const avgColor =
              averageGrade >= 85
                ? "bg-green-100 text-green-800"
                : averageGrade >= 70
                ? "bg-brand/20 text-brand"
                : averageGrade >= 50
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800";

            const getMedal = (index) => {
              if (index === 0) return "🥇";
              if (index === 1) return "🥈";
              if (index === 2) return "🥉";
              return "";
            };

            return (
              <div
                key={exam.ID}
                className="border border-gray-200 hover:border-brand hover: rounded-xl p-4 sm:p-5 transition bg-white"
              >
                {/* العنوان */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1 sm:gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                    {exam.name}
                  </h2>
                  <span className="text-xs text-gray-500  whitespace-nowrap">
                    رمز : {exam.ID}
                  </span>
                </div>

                {/* الإحصائيات */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-700 mb-3">
                  <span>عدد مرات التقديم : {grades.length}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm font-bold ${avgColor} whitespace-nowrap`}
                  >
                    متوسط العلامات : {averageGrade} %
                  </span>
                </div>

                {/* أعلى 5 طلاب */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    أعلى 5 طلاب :
                  </h3>
                  <div className="space-y-1.5 sm:space-y-1 bg-gray-50 rounded-md p-2">
                    {top_5.map((student, idx) => {
                      const studentColor =
                        student.score >= 85
                          ? "bg-green-100 text-green-900"
                          : student.score >= 70
                          ? "bg-brand/20 text-brand"
                          : student.score >= 50
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800";

                      return (
                        <div
                          key={idx}
                          className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded text-xs sm:text-sm  flex items-center gap-2 ${studentColor}`}
                        >
                          <span className="text-sm sm:text-base">
                            {getMedal(idx)}
                          </span>
                          <span className="flex-1 truncate">
                            {student.name} :
                          </span>
                          <span className="font-bold whitespace-nowrap">
                            {student.score.toFixed(1)} %
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered_Exams.length === 0 && (
            <div className="text-center text-gray-500 py-6 col-span-full text-sm sm:text-base">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
