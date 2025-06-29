// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CalendarPage from "./CalendarPage";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";
import RecipeListPage from "./RecipeListPage";
import RecipeItemDetail from "./RecipeItemDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/recipes/detail" element={<RecipeItemDetail />} />
          <Route path="/recipe/:date" element={<RecipeList />} />
          <Route path="/recipe/:date/detail" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
