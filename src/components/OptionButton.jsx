const OptionButton = ({
  option,
  optionNumber,
  isSelected,
  isCorrect,
  hasAnswered,
  handleAnswerChange,
  solvedExam,
}) => {
  let bgColor = "bg-white";
  if (hasAnswered) {
    if (isCorrect) bgColor = "bg-green-500";
    else if (isSelected && !isCorrect) bgColor = "bg-red-500";
  }
  if (solvedExam && isCorrect) bgColor = "bg-green-500";

  const textColor = bgColor === "bg-white" ? "text-black" : "text-white";

  return (
    <div dir="rtl">
      <button
        onClick={() => handleAnswerChange(optionNumber.toString())}
        disabled={hasAnswered || solvedExam}
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 mb-3 mt-3 text-right transition-opacity active:opacity-80 disabled:cursor-default ${bgColor}`}
      >
        <span className={`text-base font-arabic ${textColor}`}>{option}</span>
      </button>
    </div>
  );
};

export default OptionButton;
