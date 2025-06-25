// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./CalendarPage";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/recipe/:date" element={<RecipeList />} />
          <Route path="/recipe/:date/detail" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
