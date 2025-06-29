import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
type CalendarProps = {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
};

const MonthlyCalendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const today = new Date();

  // 月の最初の日を取得
  const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // 月の最後の日を取得
  const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // 月の日数を取得
  const getDaysInMonth = (date: Date): number => {
    return getLastDayOfMonth(date).getDate();
  };

  // 月の最初の日の曜日を取得（0: 日曜日, 1: 月曜日, ...）
  const getStartDayOfWeek = (date: Date): number => {
    return getFirstDayOfMonth(date).getDay();
  };

  // 前月へ移動
  const goToPreviousMonth = (): void => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // 次月へ移動
  const goToNextMonth = (): void => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // 日付をクリックした時の処理
  const handleDateClick = (dateInfo: {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
  }): void => {
    onDateSelect?.(dateInfo.date);
  };

  // 日付が今日かどうかチェック
  const isToday = (date: Date): boolean => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // 日付が選択されているかチェック
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  // クラス名を決定する関数
  const getDateClassName = (
    dateInfo: { day: number; isCurrentMonth: boolean; date: Date },
    index: number
  ): string => {
    let className = "text-sm flex items-center justify-center ";

    if (isSelected(dateInfo.date)) {
      className += "font-bold text-blue-600";
    } else if (isToday(dateInfo.date)) {
      className +=
        "font-bold text-blue-600 bg-blue-100 rounded-full w-6 h-6 text-xs";
    } else if (!dateInfo.isCurrentMonth) {
      className += "text-gray-400 font-medium";
    } else if (index % 7 === 0) {
      className += "text-red-500 font-medium";
    } else if (index % 7 === 6) {
      className += "text-blue-500 font-medium";
    } else {
      className += "text-gray-700 font-medium";
    }

    return className;
  };

  // カレンダーの日付配列を生成
  const generateCalendarDays = (): {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
  }[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDayOfWeek = getStartDayOfWeek(currentDate);
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // 前月の日付
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
      });
    }

    // 現在月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      });
    }

    // 次月の日付（5週分まで埋める）
    const totalCells = 35; // 5週 × 7日
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        day: nextMonthDay,
        isCurrentMonth: false,
        date: new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          nextMonthDay
        ),
      });
      nextMonthDay++;
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-gray-700">
          {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-semibold py-3 ${
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {calendarDays.map((dateInfo, index) => (
          <div
            key={`${dateInfo.date.getFullYear()}-${dateInfo.date.getMonth()}-${dateInfo.date.getDate()}`}
            className={`
              h-full min-h-20 border rounded-lg cursor-pointer transition-colors p-2 flex flex-col
              ${
                dateInfo.isCurrentMonth
                  ? "border-gray-300 bg-white hover:bg-gray-50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }
            `}
            onClick={() => handleDateClick(dateInfo)}
          >
            {/* 日付表示 */}
            <div className="flex justify-between items-start mb-1">
              <span className={getDateClassName(dateInfo, index)}>
                {dateInfo.day}
              </span>
            </div>

            {/* スケジュール表示エリア */}
            <div className="flex-1 flex flex-col gap-1">
              {/* サンプルのスケジュール項目（現在月のみ表示） */}
              {dateInfo.isCurrentMonth && (
                <>
                  {isToday(dateInfo.date) && (
                    <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded truncate">
                      今日
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
