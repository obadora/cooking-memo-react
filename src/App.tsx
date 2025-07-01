// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CalendarPage } from "./features/calendar";
import {
  AllRecipesPage,
  DailyRecipesPage,
  DailyRecipeDetailPage,
  RecipeDetailPage,
} from "./features/recipe";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<AllRecipesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/recipes" element={<AllRecipesPage />} />
          <Route path="/recipes/detail" element={<RecipeDetailPage />} />
          <Route path="/recipe/:date" element={<DailyRecipesPage />} />
          <Route
            path="/recipe/:date/detail"
            element={<DailyRecipeDetailPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
