# 🖼️ Image Filter App

A full-stack web application built using **React** and **Go** that allows users to upload an image, apply various filters (like Grayscale, Invert, Brightness, etc.), and download the processed image.

## ✨ Features

- Upload images from local device
- Apply filters like:
  - Grayscale
  - Invert
  - Brightness/Contrast adjustments
  - Blur & Sharpen (extendable)
- Download the filtered image
- Clean and responsive frontend

## ⚙️ Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Frontend    | React.js           |
| Backend     | Golang (`imaging`) |
| Styling     | CSS (custom)       |

---
 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/image-filter-app.git
cd image-filter-app
cd backend
go mod init backend
go get github.com/disintegration/imaging
go run main.go
cd frontend
npm install
npm start
