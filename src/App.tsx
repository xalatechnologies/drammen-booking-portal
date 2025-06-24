
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import FacilitiesPage from "./pages/admin/FacilitiesPage";
import TranslationDemoPage from "./pages/admin/TranslationDemoPage";
import { LocalizationTestComprehensive } from "./components/localization/LocalizationTestComprehensive";
import SystemTestPage from "./pages/SystemTestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/facilities" element={<FacilitiesPage />} />
        <Route path="/admin/translation-demo" element={<TranslationDemoPage />} />
        <Route path="/localization-test" element={<LocalizationTestComprehensive />} />
        <Route path="/system-test" element={<SystemTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
