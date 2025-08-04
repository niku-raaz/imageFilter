import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./RealTimeEditor.css";

function RealTimeEditor({ onGoHome }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);

  // Effect parameters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);
  const [grayscale, setGrayscale] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setEditedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyEffects = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("brightness", brightness);
      formData.append("contrast", contrast);
      formData.append("saturation", saturation);
      formData.append("blur", blur);
      formData.append("hue", hue);
      formData.append("sepia", sepia);
      formData.append("invert", invert);
      formData.append("grayscale", grayscale);
      const result = await axios.post("http://localhost:8080/realtime-edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(result.data);
      setEditedImage(imageUrl);
    } catch (error) {
      console.error("Error applying effects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const timeoutId = setTimeout(() => {
        applyEffects();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [brightness, contrast, saturation, blur, hue, sepia, invert, grayscale]);

  const resetEffects = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setSepia(0);
    setInvert(0);
    setGrayscale(0);
  };

  const downloadImage = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = 'auraFX_realtime_edited.jpg';
      link.click();
    }
  };

  return (
    <div className="realtime-editor">
      {/* Header */}
      <header className="editor-header">
        <div className="header-content">
          <h1 className="app-title">AuraFX</h1>
          <div className="header-subtitle">Real-Time Image Editor</div>
        </div>
      </header>

      <div className="editor-container">
        {/* Left Side - Image Display */}
        <div className="image-section">
          <div
            className="image-container"
            onClick={() => !selectedImage && document.getElementById('file-input-main').click()}
            tabIndex={0}
            role="button"
            aria-label="Upload image area"
            style={{ position: 'relative' }}
          >
            {selectedImage ? (
              <img
                ref={imageRef}
                src={editedImage || selectedImage}
                alt="Edited"
                className="edited-image"
                style={{ filter: isLoading ? 'opacity(0.7)' : 'opacity(1)' }}
              />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <p>Upload an image to start editing</p>
                <input
                  id="file-input-main"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            )}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Processing...</p>
              </div>
            )}
          </div>
          {selectedImage && (
            <div className="image-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                id="file-input-rt"
              />
              <label htmlFor="file-input-rt" className="change-image-btn">
                Change Image
              </label>
              <button onClick={downloadImage} className="download-btn">
                Download
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Controls */}
        <div className="controls-section">
          <div className="controls-header">
            <h2>Real-Time Effects</h2>
            <button onClick={resetEffects} className="reset-btn">
              Reset All
            </button>
            <button onClick={onGoHome} className="reset-btn" style={{marginLeft: '1rem'}}>
              Go to Initial Page
            </button>
          </div>

          <div className="sliders-container">
            {/* Brightness */}
            <div className="slider-group">
              <label className="slider-label">
                Brightness: {brightness}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Contrast */}
            <div className="slider-group">
              <label className="slider-label">
                Contrast: {contrast}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Saturation */}
            <div className="slider-group">
              <label className="slider-label">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Blur */}
            <div className="slider-group">
              <label className="slider-label">
                Blur: {blur}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Hue */}
            <div className="slider-group">
              <label className="slider-label">
                Hue: {hue}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Sepia */}
            <div className="slider-group">
              <label className="slider-label">
                Sepia: {sepia}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Invert */}
            <div className="slider-group">
              <label className="slider-label">
                Invert: {invert}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={invert}
                onChange={(e) => setInvert(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            {/* Grayscale */}
            <div className="slider-group">
              <label className="slider-label">
                Grayscale: {grayscale}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) => setGrayscale(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>
      </div>

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

export default RealTimeEditor; 