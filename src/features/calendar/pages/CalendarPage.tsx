// CalendarPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MonthlyCalendar from "../components/MonthlyCalendar";

interface CookingRecordData {
  id?: number;
  title: string;
  description?: string;

  cook_time?: number;
  servings?: number;
  source_url?: string;
  cooking_records: CookingRecords[]; // 日付の配列
}

interface CookingRecords {
  cooking_date: string;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [cookingRecords, setCookingRecords] = useState<CookingRecordData[]>([]);
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

  // 月ごとのCookingRecordを取得する関数
  const fetchCookingRecordsForMonth = async (year: number, month: number) => {
    try {
      console.log(`Fetching cooking records for ${year}-${month}...`);
      // const monthString = `${year}-${String(month).padStart(2, "0")}`;

      // 月ごとのCookingRecordを取得するAPIエンドポイント
      // const response = await fetch(
      //   `http://localhost:8000/cooking-records/month/${monthString}`
      // );
      // すべてのCookingRecordを取得するAPIエンドポイント
      const response = await fetch(`http://localhost:8000/recipes`);

      if (response.ok) {
        const data = await response.json();
        console.log("Cooking records fetched:", data);
        setCookingRecords(data);
      } else {
        console.error(
          "Failed to fetch cooking records, status:",
          response.status
        );
        setCookingRecords([]);
      }
    } catch (error) {
      console.error("Error fetching cooking records:", error);
      setCookingRecords([]);
    }
  };

  // 特定の日付のCookingRecordを取得する関数
  const getCookingRecordsForDate = (date: Date): CookingRecordData[] => {
    const dateString =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    console.log(`\n=== Filtering for date: ${dateString} ===`);
    console.log("All cooking records:", cookingRecords);
    console.log(
      "Cooking record dates:",
      // cookingRecords.map((r) => r.cooking_records[0].cooking_date)
      cookingRecords.map((record) =>
        record.cooking_records.map((r) => r.cooking_date)
      )
    );

    const filteredRecords = cookingRecords.filter((record) => {
      // null チェック
      if (!record.cooking_records[0]) {
        return false;
      }
      // const recordDate = record.cooking_records[0].cooking_date;
      const dates = record.cooking_records.map((r) => {
        // ISO形式なら日付部分だけ抽出
        if (r.cooking_date.includes("T")) {
          return r.cooking_date.split("T")[0];
        }
        return r.cooking_date;
      });
      // dateStringと一致する日付があればtrue
      return dates.includes(dateString);
    });
    console.log(
      `Found ${filteredRecords.length} cooking records for ${dateString}:`,
      filteredRecords
    );

    return filteredRecords;
  };

  // 現在の月のCookingRecordを取得
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    console.log(`CalendarPage useEffect triggered for ${year}-${month}`);
    fetchCookingRecordsForMonth(year, month);
  }, [currentMonth]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              レシピ一覧
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-default">
              カレンダー
            </button>
            <button
              onClick={() => console.log("ログイン機能は未実装です")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <MonthlyCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            getCookingRecordsForDate={getCookingRecordsForDate}
            onMonthChange={setCurrentMonth}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
