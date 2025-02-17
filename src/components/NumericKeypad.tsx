"use client";

const vibrate = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(40); // 40ms vibration
  }
};

interface Props {
  onNumber: (num: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  currentValue: string;
}

export default function NumericKeypad({
  onNumber,
  onDelete,
  onSubmit,
  currentValue,
}: Props) {
  const handleNumber = (num: number) => {
    vibrate();
    onNumber(num);
  };

  const handleDelete = () => {
    vibrate();
    onDelete();
  };

  const handleSubmit = () => {
    vibrate();
    onSubmit();
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            className="h-14 border border-gray-100 bg-white text-xl font-bold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleDelete}
          className="h-14 border border-gray-100 bg-red-100 text-xl font-bold text-red-600 transition-colors hover:bg-red-200"
        >
          ←
        </button>
        <button
          onClick={() => handleNumber(0)}
          className="h-14 border border-gray-100 bg-white text-xl font-bold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          disabled={!currentValue}
          className="h-14 border border-gray-100 bg-blue-500 text-xl font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
