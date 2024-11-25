import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import SymptomForm from "./symptomform";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/symptom-checker" element={<SymptomForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
