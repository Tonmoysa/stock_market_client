import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";

const App = () => {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<StockTable />} />
            <Route path="/chart" element={<StockChart />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
