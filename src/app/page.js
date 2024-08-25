"use client"; // This marks the component as a Client Component

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [jsonInput, setJsonInput] = useState(""); // For the JSON input
  const [responseData, setResponseData] = useState(null); // For the API response
  const [error, setError] = useState(""); // For error handling
  const [selectedOptions, setSelectedOptions] = useState([]); // For the dropdown selection
  const [showCriteriaDropdown, setShowCriteriaDropdown] = useState(true); // To toggle the dropdown
  const [showResponse, setShowResponse] = useState(false); // To control showing of response data

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput); // Validate JSON input
      const response = await axios.post(
        "https://surya-back.praki.tech/bfhl",
        parsedData
      );
      setResponseData(response.data);
      setError(""); // Clear any previous errors
      setShowResponse(true); // Hide response data initially
    } catch (e) {
      setError("Invalid JSON input or API error");
      setResponseData(null);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  const renderResponse = () => {
    if (!responseData || selectedOptions.length === 0) return null; // Hide response if no options are selected

    const filteredResponse = {};

    if (selectedOptions.includes("numbers")) {
      filteredResponse.numbers = responseData.numbers;
    }
    if (selectedOptions.includes("alphabets")) {
      filteredResponse.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes("highest_lowercase_alphabet")) {
      filteredResponse.highest_lowercase_alphabet =
        responseData.highest_lowercase_alphabet;
    }

    return (
      <div className="mt-4">
        <h3 className="text-xl font-bold">Response:</h3>
        <div>
          {selectedOptions.includes("numbers") && (
            <div>
              <strong>Numbers:</strong> {responseData.numbers.join(", ")}
            </div>
          )}
          {selectedOptions.includes("alphabets") && (
            <div>
              <strong>Alphabets:</strong> {responseData.alphabets.join(", ")}
            </div>
          )}
          {selectedOptions.includes("highest_lowercase_alphabet") && (
            <div>
              <strong>Highest lowercase alphabet:</strong>{" "}
              {responseData.highest_lowercase_alphabet}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-7xl">Input JSON Data</h1>
      <input
        type="text"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='{"data": ["A", "C", "z"]}'
        className="mt-4 p-2 border border-gray-300 rounded w-full text-slate-950"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>

       
      <div className="mt-4 flex gap-4">
        <div className="bg-violet-500 text-black  rounded-md">
          {selectedOptions.includes("numbers") && (
            <div className="px-3 py-2 text-white">Numbers</div>
          )}
        </div>

        <div className="bg-violet-500 text-black  rounded-md">
          {selectedOptions.includes("alphabets") && (
            <div className="px-3 py-2 text-white">alphabets</div>
          )}
        </div>

        <div className="bg-violet-500 text-black  rounded-md">
          {selectedOptions.includes("highest_lowercase_alphabet") && (
            <div className="px-3 py-2 text-white">
              highest_lowercase_alphabet
            </div>
          )}
        </div>
      </div>
      {responseData && (
        <>
          {showCriteriaDropdown && (
            <div className="mt-4 p-2 border border-gray-300 rounded bg-white">
              {["numbers", "alphabets", "highest_lowercase_alphabet"].map(
                (option) => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={option}
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionChange(option)}
                      className="mr-2"
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                )
              )}
            </div>
          )}
          {showResponse && renderResponse()}
        </>
      )}
    </main>
  );
}
