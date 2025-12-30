import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";

export default function Money() {
  const Students = useSelector((state) => state.students);
  const Subjects = useSelector((state) => state.exams);
  const [Search_Term, set_Search_Term] = useState("");
  const filtered_Subjects = (Subjects?.exams || []).filter((subject) =>
    subject.name.toLowerCase().includes(Search_Term.toLowerCase())
  );
  const totalRevenue = (Subjects?.exams || []).reduce((sum, subject) => {
    const registeredCount = (Students?.students || []).filter((student) =>
      subject.available_to.includes(String(student.ID))
    ).length;
    return sum + subject.price * registeredCount;
  }, 0);

  // حساب أكثر وأقل مادة من حيث الأرباح
  const subjectsWithStats = (Subjects?.exams || []).map((subject) => {
    const registeredCount = (Students?.students || []).filter((student) =>
      subject.available_to.includes(String(student.ID))
    ).length;
    return {
      ...subject,
      registeredCount,
      revenue: subject.price * registeredCount,
    };
  });

  const highestRevenue = subjectsWithStats.reduce(
    (max, curr) => (curr.revenue > max.revenue ? curr : max),
    { revenue: 0 }
  );
  const lowestRevenue = subjectsWithStats
    .filter((s) => s.price > 0)
    .reduce((min, curr) => (curr.revenue < min.revenue ? curr : min), {
      revenue: Infinity,
    });

  const mostRegistered = subjectsWithStats.reduce(
    (max, curr) => (curr.registeredCount > max.registeredCount ? curr : max),
    { registeredCount: 0 }
  );
  return (
    <div className="space-y-4 font-arabic sm:space-y-6 lg:space-y-8">
      {/* ملخص الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 sm:p-4 rounded-lg shadow text-center">
          <p className="text-sm sm:text-base lg:text-lg font-arabic text-gray-700">
            أعلى أرباح
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-extrabold text-yellow-700 truncate">
            {highestRevenue.name}
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            {highestRevenue.revenue.toLocaleString("en")} ليرة سورية
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 sm:p-4 rounded-lg shadow text-center">
          <p className="text-sm sm:text-base lg:text-lg font-arabic text-gray-700">
            أقل أرباح
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-extrabold text-red-700 truncate">
            {lowestRevenue.name}
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            {lowestRevenue.revenue.toLocaleString("en")} ليرة سورية
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 sm:p-4 rounded-lg shadow text-center">
          <p className="text-sm sm:text-base lg:text-lg font-arabic text-gray-700">
            إجمالي الأرباح
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-green-700">
            {totalRevenue.toLocaleString("en")} ليرة سوريةْ
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 sm:p-4 rounded-lg shadow text-center">
          <p className="text-sm sm:text-base lg:text-lg font-arabic text-gray-700">
            أكثر طلاب مسجلين
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-extrabold text-blue-700 truncate">
            {mostRegistered.name}
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            {mostRegistered.registeredCount} طالب
          </p>
        </div>
      </div>

      {/* البحث */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center max-w-full sm:max-w-md bg-gray-100 rounded-md px-3 py-2">
            <SearchIcon
              size={18}
              className="sm:w-5 sm:h-5 text-gray-500 ml-2 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="🔍 البحث عن مادة"
              className="bg-transparent border-none focus:outline-none flex-1 text-sm sm:text-base lg:text-lg text-gray-800"
              value={Search_Term}
              onChange={(e) => set_Search_Term(e.target.value)}
            />
          </div>
        </div>

        {/* البطاقات */}
        <div className="p-3 sm:p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filtered_Subjects.map((subject) => {
            const registeredCount = (Students?.students || []).filter(
              (student) => subject.available_to.includes(String(student.ID))
            ).length;

            const revenue = subject.price * registeredCount;

            const revenueColor =
              revenue >= 1000
                ? "bg-green-100 text-green-900"
                : revenue >= 500
                ? "bg-blue-100 text-blue-800"
                : revenue > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800";

            return subject.price > 0 ? (
              <div
                key={subject.ID}
                className="border hover:scale-[0.97] transition-transform duration-300 rounded-lg p-4 sm:p-5 bg-gradient-to-b from-white to-gray-50"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-1 sm:gap-2">
                  <h2 className="text-base sm:text-lg lg:text-xl font-arabic text-gray-800 break-words">
                    {subject.name}
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    رمز: {subject.ID}
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg text-gray-700">
                  <span className="flex items-center gap-1">
                    💵 السعر: {subject.price.toLocaleString("en")} ليرة
                  </span>
                  <span className="flex items-center gap-1">
                    👥 المسجلين: {registeredCount}
                  </span>
                  <span
                    className={`px-3 py-1.5 sm:py-1 rounded-full  text-xs sm:text-sm lg:text-base inline-block ${revenueColor}`}
                  >
                    💰 الأرباح: {revenue.toLocaleString("en")} ليرة
                  </span>
                </div>
              </div>
            ) : (
              ""
            );
          })}

          {filtered_Subjects.length === 0 && (
            <div className="text-center text-gray-500 py-6 col-span-full text-sm sm:text-base lg:text-lg">
              لا توجد مواد مطابقة للبحث
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
