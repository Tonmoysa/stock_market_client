import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Brush,
} from "recharts";
import { Form, Table, Button, Container, Row, Col, Spinner } from "react-bootstrap";

const formatDate = (date) => format(new Date(date), "MMM dd, yyyy");

const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [tradeCodes, setTradeCodes] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/")
      .then((response) => {
        const data = response.data.results;
        setStockData(data);
        setTradeCodes([...new Set(data.map((item) => item.trade_code))]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    let data = [...stockData];
    if (selectedTradeCode) {
      data = data.filter((item) => item.trade_code === selectedTradeCode);
    }
    if (searchTerm) {
      data = data.filter((item) =>
        item.trade_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  }, [selectedTradeCode, stockData, searchTerm]);

  const sortedData = useMemo(() => {
    let data = [...filteredData];
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [filteredData, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSave = (row, index) => {
    axios
      .put(`https://stock-market-server-lle7.onrender.com/api/stocks/stockdata/${row.id}/`, row)
      .then((response) => {
        const updatedData = [...stockData];
        updatedData[index].status = "Data updated successfully!";
        setStockData(updatedData);
        setTimeout(() => {
          updatedData[index].status = "";
          setStockData(updatedData);
        }, 3000);
      })
      .catch((error) => {
        const updatedData = [...stockData];
        updatedData[index].status = "Error updating data!";
        setStockData(updatedData);
      });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getColor = (volume) => {
    if (volume > 100000) return "#ff0000";
    if (volume > 50000) return "#ffa500"; 
    return "#00ff00"; 
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <Container fluid className="p-4">
      <h3>Stock Charts</h3>

      {/* Dropdown for Trade Code Selection */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            onChange={(e) => setSelectedTradeCode(e.target.value)}
            value={selectedTradeCode}
          >
            <option value="">All Trade Codes</option>
            {tradeCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by Trade Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Line Chart - Close vs Date */}
      <Row className="mb-4">
        <Col>
          <h4>Line Chart - Close vs Date</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filteredData}>
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Bar Chart - Volume vs Date */}
      <Row className="mb-4">
        <Col>
          <h4>Bar Chart - Volume vs Date</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filteredData}>
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                yAxisId="right"
                dataKey="volume"
                fill="rgba(130, 202, 157, 0.7)"
                barSize={30}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Multi-Axis Chart (Line + Bar) */}
      <Row className="mb-4">
        <Col>
          <h4>Stock Price & Volume - Multi-Axis Chart</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filteredData}>
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                dot={false}
              />
              <Bar
                yAxisId="right"
                dataKey="volume"
                fill="rgba(130, 202, 157, 0.7)"
                barSize={30}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Scatter Plot - Close vs Volume */}
      <Row className="mb-4">
        <Col>
          <h4>Scatter Plot - Close vs Volume</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="close" name="Close Price" />
              <YAxis dataKey="volume" name="Volume" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    return (
                      <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
                        <p>Date: {formatDate(payload[0].payload.date)}</p>
                        <p>Close: {payload[0].payload.close}</p>
                        <p>Volume: {payload[0].payload.volume}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter
                data={filteredData}
                name="Close vs Volume"
                shape="circle"
                line
                isAnimationActive={true}
                animationDuration={1000}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.volume)}
                    stroke="#333"
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
              <Brush dataKey="close" height={30} stroke="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Pie Chart */}
      <Row className="mb-4">
        <Col>
          <h4>Stock Distribution - Pie Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tradeCodes.map((code) => ({
                  name: code,
                  value: stockData.filter((d) => d.trade_code === code).length,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {tradeCodes.map((code, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Editable Table */}
      <Row className="mb-4">
        <Col>
          <h4>Stock Data Table</h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => requestSort("date")}>
                    Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("trade_code")}>
                    Trade Code {sortConfig.key === "trade_code" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("close")}>
                    Close {sortConfig.key === "close" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("volume")}>
                    Volume {sortConfig.key === "volume" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index}>
                    <td>{formatDate(row.date)}</td>
                    <td>{row.trade_code}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={row.close}
                        onChange={(e) => {
                          const value = Math.max(0, e.target.value);
                          const updatedData = [...stockData];
                          updatedData[index] = { ...updatedData[index], close: value };
                          setStockData(updatedData);
                        }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={row.volume}
                        onChange={(e) => {
                          const value = Math.max(0, e.target.value);
                          const updatedData = [...stockData];
                          updatedData[index] = { ...updatedData[index], volume: value };
                          setStockData(updatedData);
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => handleSave(row, index)}
                        variant="primary"
                      >
                        Save
                      </Button>
                      {row.status && <div>{row.status}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Pagination */}
      <Row className="mb-4">
        <Col>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">Page {currentPage}</span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredData.length}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default StockChart;