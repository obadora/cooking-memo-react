import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RecipeSearchParams } from "../../../types/search";
import type { Tag } from "../../../types/tag";
import { API_BASE_URL } from '../../../config/api';

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
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  cook_time?: number;
  servings?: number;
  source_url?: string;
  recipe_photos: RecipePhoto[];
  cooking_date?: string;
}

const RecipeSearchPage = () => {
  const [searchParams, setSearchParams] = useState<RecipeSearchParams>({
    title: "",
    page: 1,
    limit: 12,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchParams.title?.trim() && selectedTags.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchParams.title) params.append("title", searchParams.title);
      if (selectedTags.length > 0) {
        selectedTags.forEach((tagId) =>
          params.append("tag_ids", tagId.toString())
        );
        // console.log("Selected tags:", selectedTags);
      }
      if (searchParams.page)
        params.append("page", searchParams.page.toString());
      if (searchParams.limit)
        params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.sort_order)
        params.append("sort_order", searchParams.sort_order);
      // console.log("Selected tags:", params.getAll("tag_ids"));
      const response = await fetch(
        `${API_BASE_URL}/recipes/search?${params.toString()}`
      );
      const data = await response.json();
      console.log("Search results:", data);
      if (data.data) {
        setRecipes(data.data);
        setTotalPages(Math.ceil(data.total / searchParams.limit!));
      } else {
        setRecipes(data);
        setTotalPages(1);
      }
      setHasSearched(true);
    } catch (error) {
      console.error("検索に失敗しました:", error);
      setRecipes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe: RecipeData) => {
    navigate(`/recipes/detail`, { state: { recipe, fromSearch: true } });
  };

  const handlePageChange = (pageNumber: number) => {
    setSearchParams({ ...searchParams, page: pageNumber });
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`);
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("タグの取得に失敗しました:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (hasSearched && searchParams.page !== 1) {
      handleSearch();
    }
  }, [searchParams.page]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              レシピ一覧
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              カレンダー
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-default">
              検索
            </button>
            <button
              onClick={() => console.log("ログイン機能は未実装です")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              ログイン
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            レシピ検索
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  レシピ名
                </label>
                <input
                  type="text"
                  value={searchParams.title || ""}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, title: e.target.value })
                  }
                  placeholder="検索したいレシピ名を入力"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={
                    loading ||
                    (!searchParams.title?.trim() && selectedTags.length === 0)
                  }
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    loading ||
                    (!searchParams.title?.trim() && selectedTags.length === 0)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {loading ? "検索中..." : "検索"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                      selectedTags.includes(tag.id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  選択中のタグ: {selectedTags.length}個
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  並び順
                </label>
                <select
                  value={searchParams.sort_by || "created_at"}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      sort_by: e.target.value as RecipeSearchParams["sort_by"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">作成日時</option>
                  <option value="updated_at">更新日時</option>
                  <option value="title">レシピ名</option>
                  <option value="cook_time">調理時間</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  順序
                </label>
                <select
                  value={searchParams.sort_order || "desc"}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      sort_order: e.target.value as "asc" | "desc",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">降順</option>
                  <option value="asc">昇順</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">検索中...</div>
          </div>
        )}

        {!loading && hasSearched && (
          <>
            {recipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl">検索結果がありません</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {recipes.length}件のレシピが見つかりました
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      onClick={() => handleRecipeClick(recipe)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        {recipe.recipe_photos &&
                        recipe.recipe_photos.length > 0 ? (
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
                          {recipe.servings && (
                            <span>{recipe.servings}人分</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handlePageChange(searchParams.page! - 1)}
                      disabled={searchParams.page === 1}
                      className={`px-4 py-2 rounded ${
                        searchParams.page === 1
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
                            searchParams.page === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(searchParams.page! + 1)}
                      disabled={searchParams.page === totalPages}
                      className={`px-4 py-2 rounded ${
                        searchParams.page === totalPages
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
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeSearchPage;
