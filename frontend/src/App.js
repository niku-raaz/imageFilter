import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import RealTimeEditor from "./RealTimeEditor";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [filter, setFilter] = useState("grayscale");
  const [currentPage, setCurrentPage] = useState("filters"); // "filters" or "realtime"

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setFilteredImage(null); // clear previous image
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("filter", filter);

    try {
      const response = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      console.log("Filtered image URL:", imageUrl);
      setFilteredImage(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong while applying the filter.");
    }
  };

  // Render real-time editor if on that page
  if (currentPage === "realtime") {
    return <RealTimeEditor onGoHome={() => setCurrentPage("filters")} />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">AuraFX</h1>
          <div className="header-subtitle">Premium Image Filter Studio</div>
          <div className="navigation">
            <button 
              className={`nav-btn ${currentPage === "filters" ? "active" : ""}`}
              onClick={() => setCurrentPage("filters")}
            >
              Quick Filters
            </button>
            <button 
              className={`nav-btn ${currentPage === "realtime" ? "active" : ""}`}
              onClick={() => setCurrentPage("realtime")}
            >
              Real-Time Editor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* File Upload Section */}
          <div className="upload-section">
            <div className="file-input-container">
              <label htmlFor="file-input" className="file-input-label">
                <div className="upload-icon">UPLOAD</div>
                <span>Choose Image</span>
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {selectedImage && (
                <div className="file-name">{selectedImage.name}</div>
              )}
            </div>
          </div>

          {/* Filter Selection */}
          <div className="filter-section">
            <label className="filter-label">Select Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="grayscale">Grayscale</option>
              <option value="blur">Blur</option>
              <option value="invert">Invert</option>
              <option value="sepia">Sepia</option>
              <option value="special">Special</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="button-section">
            <button onClick={handleSubmit} className="apply-button">
              <span className="button-icon"></span>
              Apply Filter
            </button>
          </div>

          {/* Filtered Image Display */}
          {filteredImage && (
            <div className="result-section">
              <h3 className="result-title">Your Enhanced Image</h3>
              <div className="image-container">
                <img
                  src={filteredImage}
                  alt="Filtered"
                  className="filtered-image"
                />
              </div>
              <a
                href={filteredImage}
                download={`auraFX_${filter}.jpg`}
                className="download-button"
              >
                <span className="download-icon"></span>
                Download Image
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="credits">
            <span className="credit-text">Crafted with passion by</span>
            <span className="author-name">Niku Raj</span>
          </div>
          <a
            href="https://github.com/niku-raaz"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <span className="github-icon"></span>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
