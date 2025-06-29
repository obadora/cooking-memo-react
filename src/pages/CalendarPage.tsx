// CalendarPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MonthlyCalendar from "../components/ui/MonthlyCalendar";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    // 日付をISO文字列に変換してルートパラメータとして渡す
    const dateString =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0"); // YYYY-MM-DD形式
    navigate(`/recipe/${dateString}`);
  };

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 flex-shrink-0">
          カレンダー
        </h1>
        <div className="flex-1">
          <MonthlyCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
