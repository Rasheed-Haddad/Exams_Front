import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExamSkeleton from "./ExamSkeleton";
import OptionButton from "./OptionButton";
import {
  cancelExam,
  decrementTimer,
  fetchExamQuestions,
  get_top_scores,
  nextQuestion,
  previousQuestion,
  resetExam,
  setAnswer,
  startTimer,
  stopTimer,
  submitExam,
} from "../store/slices/examSlice";
import { replace, useNavigate } from "react-router-dom";

// ============================================================
//  SOUND PRELOADING SYSTEM - for instant playback
// ============================================================
const soundCache = {};

const loadSounds = async () => {
  const sounds = {
    correct: "/public/correct.mp3",
    wrong: "/public/wrong.mp3",
    next: "/public/next.mp3",
    exit: "/public/exit.mp3",
  };

  for (const [key, path] of Object.entries(sounds)) {
    try {
      const audio = new Audio(path);
      audio.preload = "auto";
      soundCache[key] = audio;
    } catch (err) {
      console.warn(`Failed to preload sound: ${key}`, err);
    }
  }
};

const playSoundInstant = async (key) => {
  const sound = soundCache[key];
  if (sound) {
    try {
      sound.currentTime = 0;
      await sound.play();
    } catch (err) {
      console.warn(`Failed to play sound: ${key}`, err);
    }
  }
};

// ============================================================
//  EXAM INTERFACE COMPONENT
// ============================================================
const ExamInterface = ({ isTabVisible = true }) => {
  const navigate = useNavigate();
  const [pressedOption, setPressedOption] = useState(null);
  const dispatch = useDispatch();
  const [solvedExam, setSolvedExam] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [animStyle, setAnimStyle] = useState({
    opacity: 1,
    translateX: 0,
    scale: 1,
  });

  const { selectedSubject } = useSelector((state) => state.selection);
  const {
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isActive,
    duration,
    loading,
    error,
    examCancelled,
  } = useSelector((state) => state.exam);
  const Student_State = useSelector((state) => state.auth);

  // ── Preload sounds on mount ──
  useEffect(() => {
    loadSounds();
    return () => {
      Object.values(soundCache).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      navigate("/subject", replace);
      return;
    }
    dispatch(resetExam());
  }, [dispatch, selectedSubject]);

  useEffect(() => {
    if (selectedSubject) {
      dispatch(fetchExamQuestions(selectedSubject));
      dispatch(get_top_scores({ ID: selectedSubject.ID }));
    }
  }, [dispatch, selectedSubject]);

  useEffect(() => {
    if (questions.length > 0 && !isActive) {
      dispatch(startTimer());
    }
  }, [dispatch, questions, isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0 && isTabVisible) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }
    if (!examCancelled && timeRemaining === 0) {
      handleSubmitExam();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, dispatch, isTabVisible]);

  // ── Smooth transition animation ──
  const animateTransition = (direction = "next") => {
    const slideValue = direction === "next" ? -50 : 50;
    setAnimStyle({ opacity: 0, translateX: -slideValue, scale: 0.95 });
    setTimeout(() => {
      setAnimStyle({ opacity: 0, translateX: slideValue, scale: 0.95 });
      setTimeout(() => {
        setAnimStyle({ opacity: 1, translateX: 0, scale: 1 });
      }, 10);
    }, 120);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Answer Handler - instant sound + animated transition ──
  const handleAnswerChange = async (value) => {
    if (answers[currentQuestionIndex] === undefined) {
      const selected = parseInt(value);
      const correct = questions[currentQuestionIndex].answer;

      setPressedOption(selected);
      dispatch(
        setAnswer({ questionIndex: currentQuestionIndex, answer: selected }),
      );

      // INSTANT SOUND
      if (selected == correct) {
        await playSoundInstant("correct");
      } else {
        await playSoundInstant("wrong");
      }

      // Auto-advance with animation
      setTimeout(() => {
        setPressedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
          animateTransition("next");
          setTimeout(() => {
            dispatch(nextQuestion());
          }, 120);
        } else {
          setShowSubmitDialog(true);
        }
      }, 1300);
    }
  };

  const handleSubmitExam = async (is_open_mode) => {
    dispatch(stopTimer());
    const timeSpent = Math.floor((duration * 60 - timeRemaining) / 60);
    try {
      await dispatch(
        submitExam({
          subject: selectedSubject,
          answers,
          timeSpent,
          Student_State,
          is_open_mode,
        }),
      ).unwrap();
      navigate("/results");
    } catch (err) {
      console.error("Failed to submit exam:", err);
    }
  };

  const handleExitExam = () => {
    playSoundInstant("exit");
    dispatch(cancelExam());
    dispatch(stopTimer());
    navigate("/subject", replace);
  };

  const getAnsweredQuestionsCount = () => Object.keys(answers).length;

  // ── Navigation Handlers - instant sound + animated transition ──
  const handle_next_question = () => {
    playSoundInstant("next");
    animateTransition("next");
    setTimeout(() => {
      dispatch(nextQuestion());
    }, 120);
  };

  const handle_previous_question = () => {
    playSoundInstant("next");
    animateTransition("prev");
    setTimeout(() => {
      dispatch(previousQuestion());
    }, 120);
  };

  if (loading) return <ExamSkeleton />;

  if (error) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-red-100 p-4 rounded-lg mb-4 w-full">
          <span className="text-red-800 text-2xl text-center block">
            {error}
          </span>
        </div>
        <button
          className="bg-brand px-6 py-3 rounded-lg"
          onClick={() => navigate("/subject", replace)}
        >
          <span className="text-white text-2xl">عودة</span>
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <span className="text-brand text-4xl mb-8 text-center block">
          قريبا
        </span>
        <button
          className="bg-brand px-6 py-3 rounded-lg"
          onClick={() => navigate("/subject", replace)}
        >
          <span className="text-white text-2xl">عودة</span>
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand px-4 pb-4">
        <div className="flex flex-row items-center justify-between">
          <button
            className="bg-brand px-4 py-2 rounded-lg"
            onClick={handleExitExam}
          >
            <span className="text-white text-sm">انسحاب</span>
          </button>

          <div className="flex flex-row items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-white text-base">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {selectedSubject.open_mode ? (
            <button
              className="bg-brand px-4 py-2 rounded-lg"
              onClick={() => setSolvedExam(!solvedExam)}
            >
              <span className="text-white text-sm">
                {solvedExam ? "إخفاء الحل" : "عرض الحل"}
              </span>
            </button>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </div>
      </div>

      {/* Question Panel */}
      <div dir="rtl" className="flex-1 overflow-y-auto">
        <div dir="rtl" className="p-4">
          <div dir="rtl" className="bg-white rounded-lg p-6 mb-4">
            <div dir="rtl" className="mb-6">
              <div className="flex flex-row justify-between items-center mb-2">
                <div>
                  <span className="text-brand text-sm max-w-48 opacity-80 block">
                    {currentQuestion.lecture}
                  </span>
                </div>
                <span className="text-brand text-lg">
                  {currentQuestionIndex + 1} من {questions.length}
                </span>
              </div>
            </div>

            {/* Animated Question Content */}
            <div
              style={{
                opacity: animStyle.opacity,
                transform: `translateX(${animStyle.translateX}px) scale(${animStyle.scale})`,
                transition: "opacity 280ms ease, transform 280ms ease",
              }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-6 w-full">
                  <span className="text-black text-xl text-center leading-relaxed block">
                    {currentQuestion.question}
                  </span>
                </div>

                {/* Options */}
                <div className="w-full max-w-md flex flex-col gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const optionNumber = index + 1;
                    const isSelected =
                      answers[currentQuestionIndex] == optionNumber;
                    const isCorrect = currentQuestion.answer == optionNumber;
                    const hasAnswered =
                      answers[currentQuestionIndex] !== undefined;
                    const isPressed = pressedOption === optionNumber;

                    return option !== "." ? (
                      <div key={index} dir="rtl">
                        <OptionButton
                          key={index}
                          option={option}
                          optionNumber={optionNumber}
                          isSelected={isSelected}
                          isCorrect={isCorrect}
                          hasAnswered={hasAnswered}
                          isPressed={isPressed}
                          handleAnswerChange={handleAnswerChange}
                          solvedExam={solvedExam}
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {selectedSubject.open_mode && (
        <div className="bg-white mb-12">
          <div
            className="flex flex-col items-center justify-center w-full gap-1"
            dir="rtl"
          >
            <div className="flex flex-row justify-between w-full">
              <button
                className="bg-brand px-4 py-3 w-[50%]"
                onClick={handle_previous_question}
                disabled={currentQuestionIndex === 0}
              >
                <span className="text-white text-center text-lg block">
                  السابق
                </span>
              </button>

              <button
                className="bg-brand px-4 py-3 w-[50%]"
                onClick={handle_next_question}
                disabled={currentQuestionIndex == questions.length - 1}
              >
                <span className="text-white text-center text-lg block">
                  التالي
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div
          dir="rtl"
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <span className="text-xl mb-4 block">ستحصل على درجاتك الان</span>

            <div className="p-3 rounded-lg mb-4">
              <span className="text-sm mb-1 block">
                تمت الإجابة على : {getAnsweredQuestionsCount()} /{" "}
                {questions.length}
              </span>
              <span className="text-sm block">
                الوقت المتبقي : {formatTime(timeRemaining)}
              </span>
            </div>

            <button
              className="bg-brand py-3 rounded-lg w-full"
              onClick={() => handleSubmitExam(selectedSubject.open_mode)}
            >
              <span className="text-white text-xl text-center block">
                تسليم
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
