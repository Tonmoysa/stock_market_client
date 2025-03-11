import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newStock, setNewStock] = useState({
    trade_code: "",
    date: "",
    open: "",
    high: "",
    low: "",
    close: "",
    volume: "",
  });

  // Fetch data from API
  const fetchData = (url = "https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/?page=1") => {
    setLoading(true);
    setError("");
    axios
      .get(url)
      .then((response) => {
        console.log("API Response:", response.data);
        setStocks(Array.isArray(response.data.results) ? response.data.results : []);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setError("Failed to load data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes for editing
  const handleInputChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  // Handle input changes for new stock
  const handleNewStockChange = (e, field) => {
    setNewStock({
      ...newStock,
      [field]: e.target.value,
    });
  };

  // Enable edit mode for a row
  const handleEdit = (index) => {
    setEditingRow(index);
    setEditedData(stocks[index]);
  };

  // Save edited data
  const handleSave = (id) => {
    setLoading(true);
    setError("");
    axios
      .put(`https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/${id}/`, editedData)
      .then((response) => {
        console.log("Updated:", response.data);
        const updatedStocks = [...stocks];
        updatedStocks[editingRow] = response.data;
        setStocks(updatedStocks);
        setEditingRow(null);
      })
      .catch((error) => {
        console.error("Error updating stock data:", error);
        setError("Failed to update data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Delete a row
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      setLoading(true);
      setError("");
      axios
        .delete(`https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/${id}/`)
        .then(() => {
          console.log("Deleted:", id);
          setStocks(stocks.filter((stock) => stock.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting stock data:", error);
          setError("Failed to delete data. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Create new stock
  const handleCreate = () => {
    if (
      !newStock.trade_code ||
      !newStock.date ||
      newStock.open < 0 ||
      newStock.high < 0 ||
      newStock.low < 0 ||
      newStock.close < 0 ||
      newStock.volume < 0
    ) {
      setError("Please fill all fields correctly. Negative values are not allowed.");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post("https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/", newStock)
      .then((response) => {
        console.log("Created:", response.data);
        setStocks([response.data, ...stocks]);
        setNewStock({
          trade_code: "",
          date: "",
          open: "",
          high: "",
          low: "",
          close: "",
          volume: "",
        });
      })
      .catch((error) => {
        console.error("Error creating stock data:", error);
        setError("Failed to create data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Stock Data (Editable & Deletable)</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {/* Create New Stock Form */}
          <div className="mb-4">
            <h4>Add New Stock</h4>
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-7 g-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Trade Code"
                  value={newStock.trade_code}
                  onChange={(e) => handleNewStockChange(e, "trade_code")}
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Date"
                  value={newStock.date}
                  onChange={(e) => handleNewStockChange(e, "date")}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Open"
                  value={newStock.open}
                  onChange={(e) => handleNewStockChange(e, "open")}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="High"
                  value={newStock.high}
                  onChange={(e) => handleNewStockChange(e, "high")}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Low"
                  value={newStock.low}
                  onChange={(e) => handleNewStockChange(e, "low")}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Close"
                  value={newStock.close}
                  onChange={(e) => handleNewStockChange(e, "close")}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Volume"
                  value={newStock.volume}
                  onChange={(e) => handleNewStockChange(e, "volume")}
                />
              </div>
              <div className="col">
                <button className="btn btn-success w-100" onClick={handleCreate}>
                  Add Stock
                </button>
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Trade Code</th>
                  <th>Date</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length > 0 ? (
                  stocks.map((stock, index) => (
                    <tr key={index}>
                      {editingRow === index ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={editedData.trade_code}
                              onChange={(e) => handleInputChange(e, "trade_code")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editedData.date}
                              onChange={(e) => handleInputChange(e, "date")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedData.open}
                              onChange={(e) => handleInputChange(e, "open")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedData.high}
                              onChange={(e) => handleInputChange(e, "high")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedData.low}
                              onChange={(e) => handleInputChange(e, "low")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedData.close}
                              onChange={(e) => handleInputChange(e, "close")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editedData.volume}
                              onChange={(e) => handleInputChange(e, "volume")}
                            />
                          </td>
                          <td>
                            <button className="btn btn-success" onClick={() => handleSave(stock.id)}>
                              Save
                            </button>
                            <button className="btn btn-secondary mx-2" onClick={() => setEditingRow(null)}>
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{stock.trade_code}</td>
                          <td>{stock.date}</td>
                          <td>{stock.open}</td>
                          <td>{stock.high}</td>
                          <td>{stock.low}</td>
                          <td>{stock.close}</td>
                          <td>{stock.volume}</td>
                          <td>
                            <button className="btn btn-primary" onClick={() => handleEdit(index)}>
                              Edit
                            </button>
                            <button className="btn btn-danger mx-2" onClick={() => handleDelete(stock.id)}>
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={() => fetchData(prevPage)}
              disabled={!prevPage}
            >
              Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={() => fetchData(nextPage)}
              disabled={!nextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StockTable;