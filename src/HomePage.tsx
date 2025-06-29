import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">
            今まで作った料理のメモ
          </h1>
          <p className="text-gray-600">レシピの管理と調理記録を残す</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/calendar")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            カレンダー
          </button>

          <button
            onClick={() => navigate("/recipes")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            レシピ一覧
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
