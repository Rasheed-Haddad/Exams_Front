import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_college } from "../store/slices/authSlice";
import {
  fetchColleges,
  fetchSubjects,
  selectCollege,
} from "../store/slices/selectionSlice";
import { replace, useNavigate } from "react-router-dom";

const SkeletonCollegeCard = () => {
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    let increasing = true;
    const interval = setInterval(() => {
      setOpacity((prev) => {
        if (prev >= 1) increasing = false;
        if (prev <= 0.4) increasing = true;
        return increasing ? prev + 0.05 : prev - 0.05;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ opacity }}
      className="w-[95%] h-24 bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
    >
      {/* أيقونة placeholder */}
      <div className="w-5 h-5 rounded-full bg-gray-200" />

      {/* اسم الكلية placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="w-2/3 h-4 rounded-md bg-gray-200" />
        <div className="w-1/3 h-3 rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

const CollegeSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colleges, selectedUniversity, loading, error } = useSelector(
    (state) => state.selection,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadSavedCollege = async () => {
      const saved_college_str = localStorage.getItem("college");
      const saved_college = saved_college_str
        ? JSON.parse(saved_college_str)
        : null;

      if (saved_college && user?.ID) {
        dispatch(selectCollege(saved_college));
        dispatch(
          fetchSubjects({
            college_id: saved_college.id,
            ID: user?.ID,
            search_term: "",
          }),
        );
        navigate("/subject");
      }
    };

    loadSavedCollege();
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      navigate("/signIn", replace);
    }
    if (!selectedUniversity) {
      navigate("/university", replace);
      return;
    }
    dispatch(fetchColleges(selectedUniversity.id));
  }, [dispatch, selectedUniversity]);

  const handleCollegeSelect = async (college) => {
    dispatch(selectCollege(college));
    localStorage.setItem("college", JSON.stringify(college));
    dispatch(set_college({ ID: user?.ID, college_id: college.id }));
    navigate("/subject");
  };

  const handleBack = () => {
    navigate("/university", replace);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand mb-12">
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        {error && (
          <div className="mb-6 bg-red-100 border font-arabic border-red-400 rounded p-4">
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex flex-row flex-wrap justify-center pb-12 gap-4 px-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCollegeCard key={i} />
              ))
            : colleges.map((college) => (
                <button
                  key={college.id}
                  className="w-[95%] h-24 bg-white rounded-xl shadow-md active:scale-95 transition-transform"
                  onClick={() => handleCollegeSelect(college)}
                >
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8c52ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="16" height="20" x="4" y="2" rx="2" />
                        <path d="M9 22v-4h6v4" />
                        <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-center flex-1 px-2">
                      <span className="text-lg font-arabic text-brand text-center">
                        {college.name}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
        </div>

        {colleges.length === 0 && !loading && (
          <div className="text-center py-12 flex flex-col gap-6">
            <span className="text-xl text-gray-500 text-center">قريبا</span>
            <button
              className="border border-brand rounded py-2 px-4 mt-4 mx-auto"
              onClick={handleBack}
            >
              <span className="text-brand text-center">عودة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSelection;
