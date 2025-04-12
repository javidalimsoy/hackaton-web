import React, { useState } from "react";

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Unexpected response: " + text);
      }

      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }

      const raw = json.original || [];
      const pred = json.predicted || [];

      const allCols = new Set();
      [...raw, ...pred].forEach((row) =>
        Object.keys(row).forEach((key) => allCols.add(key))
      );

      setColumns(Array.from(allCols));
      setOriginalData(raw);
      setPredictedData(pred);
      setError("");

    } catch (err) {
      setError("Upload failed: " + err.message);
    }
  };

  const renderTable = (title, data, color) => (
    <div className="table-wrapper" style={{ borderTop: `4px solid ${color}` }}>
      <h2 style={{ color }}>{title}</h2>
      {title.includes("AI-Optimized") && (
        <p style={{ fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "1rem", color: "#374151" }}>
          ⚙️ Each row below is reordered by AI and includes a reason based on deadline, complexity, and production time.
        </p>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <h1>🧠 AI Order Optimizer</h1>
      <input type="file" accept=".csv" onChange={handleUpload} />
      {error && <p className="error">{error}</p>}

      {originalData.length > 0 && predictedData.length > 0 && (
        <div className="tables-grid">
          {renderTable("📋 Original Order", originalData, "#3b82f6")}
          {renderTable("🤖 AI-Optimized Order", predictedData, "#10b981")}
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(270deg, #e0f7fa, #fce4ec, #f3e5f5, #e1f5fe);
          background-size: 800% 800%;
          animation: gradientFlow 20s ease infinite;
          min-height: 100vh;
          color: #111827;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .container {
          max-width: 100vw;
          padding: 2rem;
          overflow-x: hidden;
        }

        h1 {
          font-size: 2rem;
          color: #111827;
          margin-bottom: 1rem;
          text-align: center;
        }

        input[type="file"] {
          display: block;
          margin: 0 auto 2rem auto;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 1rem;
        }

        .tables-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        @media (min-width: 900px) {
          .tables-grid {
            flex-direction: row;
          }
        }

.table-wrapper {
  flex: 1;
  width: 100%;
  border-radius: 10px;
  padding: 1rem;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  table-layout: auto;
  width: max-content;
  min-width: 100%;
}

th, td {
  padding: 10px 14px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.3);
  min-width: 120px;
}

th {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.5);
}

tr:nth-child(even) td {
  background-color: rgba(255, 255, 255, 0.2);
}

      `}</style>
    </div>
  );
}

export default App;
