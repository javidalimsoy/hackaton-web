import React, { useState } from 'react';

export default function CSVUploader() {
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      // Check if backend responded OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend rejected the upload:", errorText);
        return;
      }

      // Try to parse the response
      const result = await response.json();
      console.log("✅ Received from backend:", result);

      // Validate format
      if (Array.isArray(result.orders)) {
        setCsvData(result.orders);
      } else {
        console.error("❌ Unexpected response format from backend:", result);
      }

    } catch (error) {
      // Full error object for deep debugging
      console.error("❌ Upload failed (frontend crash):", error);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      {fileName && <p className="text-sm text-gray-500">Uploaded: {fileName}</p>}

      {Array.isArray(csvData) && csvData.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="table-auto w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
