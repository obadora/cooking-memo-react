import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface RecipeStep {
  instruction: string;
  step_number?: number;
  time_estimate?: number;
}

interface RecipePhoto {
  photo_url: string;
}
interface RecipeData {
  id?: number;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[]; // オブジェクトの配列に変更
  steps: RecipeStep[]; // オブジェクトの配列に変更
  cook_time?: number;
  servings?: number;
  source_url?: string;
  recipe_photos: RecipePhoto[];
  cooking_date?: string; // TODO: 後で消す
}

const AllRecipesPage = () => {
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("レシピの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handleRecipeClick = (recipe: RecipeData) => {
    // レシピ詳細ページに遷移
    navigate(`/recipes/detail`, { state: { recipe } });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">レシピを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-default">
              レシピ一覧
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
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

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">レシピがありません</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {recipe.recipe_photos && recipe.recipe_photos.length > 0 ? (
                      <img
                        src={recipe.recipe_photos[0].photo_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">画像なし</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      {recipe.cook_time && (
                        <span>調理時間: {recipe.cook_time}分</span>
                      )}
                      {recipe.servings && <span>{recipe.servings}人分</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  前へ
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllRecipesPage;
