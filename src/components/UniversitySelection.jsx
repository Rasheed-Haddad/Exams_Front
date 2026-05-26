import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColleges,
  fetchUniversities,
  selectUniversity,
} from "../store/slices/selectionSlice";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => {
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
      className="bg-white w-[90%] rounded-xl shadow-md min-h-[170px] p-4 flex flex-col justify-between"
    >
      {/* Icon placeholder */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gray-200 mb-3" />

        {/* Name placeholder */}
        <div className="w-3/4 h-4 rounded-md bg-gray-200 mb-2" />
        <div className="w-1/2 h-3 rounded-md bg-gray-200" />

        {/* Location placeholder */}
        <div className="flex flex-row items-center justify-end gap-1 mt-1 w-full">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-1/3 h-3 rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Button placeholder */}
      <div className="w-full h-8 rounded-lg bg-gray-200 mt-auto" />
    </div>
  );
};

const UniversitySelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { universities, loading, error } = useSelector(
    (state) => state.selection,
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  useEffect(() => {
    const checkSavedUniversity = async () => {
      const savedUniversityStr = localStorage.getItem("university");
      const savedUniversity = savedUniversityStr
        ? JSON.parse(savedUniversityStr)
        : null;

      if (savedUniversity) {
        dispatch(selectUniversity(savedUniversity));
        dispatch(fetchColleges(savedUniversity.id));
        navigate("/college");
      }
    };
    checkSavedUniversity();
  }, [dispatch]);

  const handleUniversitySelect = async (university) => {
    dispatch(selectUniversity(university));
    localStorage.setItem("university", JSON.stringify(university));
    navigate("/college");
  };

  return (
    <div dir="rtl" className="flex-1 bg-brand min-h-screen">
      <div className="py-8 px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-arabic text-center">{error}</p>
          </div>
        )}

        <div className="flex flex-row flex-wrap justify-center gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : universities.map((university) => (
                <div
                  key={university.id}
                  className="bg-white w-[90%] rounded-xl shadow-md cursor-pointer active:scale-95 transition-transform"
                  onClick={() => handleUniversitySelect(university)}
                >
                  <div className="flex-1 p-4 flex flex-col justify-center min-h-[170px]">
                    <div className="flex flex-col items-center">
                      <div className="flex flex-row items-center mb-3">
                        {/* school icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#8c52ff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>

                      <p className="text-brand font-arabic mb-2 text-lg leading-6 text-right line-clamp-3">
                        {university.name}
                      </p>
                    </div>

                    <button
                      className="bg-brand rounded-lg py-2 mt-auto w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUniversitySelect(university);
                      }}
                    >
                      <span className="text-white font-arabic text-xs text-center">
                        اختيار
                      </span>
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {universities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا يوجد جامعات متوفرة حاليا</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitySelection;
