# AuraFX - Premium Image Filter Studio

AuraFX is a modern web application for real-time image editing and quick filter application. Built with React (frontend) and Go (backend), it allows you to upload images, apply a variety of effects, and download the results—all in a beautiful, dark-themed interface.

---

## Features

- **Quick Filters:** Instantly apply grayscale, blur, invert, sepia, and special effects to your images.
- **Real-Time Editor:**  
  - Adjust brightness, contrast, saturation, blur, hue, sepia, invert, and grayscale with live preview.
  - Download your enhanced image with a single click.
- **Modern UI:**  
  - Responsive, dark/grey theme for a professional look.
  - Easy navigation between Quick Filters and Real-Time Editor.
- **Backend:**  
  - Fast image processing using Go and the `imaging` library.

---

## Getting Started

### Prerequisites

- **Node.js** (v14+ recommended)
- **Go** (v1.18+ recommended)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install frontend dependencies:**
   ```sh
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```sh
   cd ../backend
   go mod tidy
   ```

---

## Running the App

### 1. Start the Backend

```sh
cd backend
go run main.go
```
- The backend will start on [http://localhost:8080](http://localhost:8080)

### 2. Start the Frontend

```sh
cd frontend
npm start
```
- The frontend will start on [http://localhost:3000](http://localhost:3000)

---

## Usage

- **Quick Filters:**  
  - Upload an image, select a filter, and click "Apply Filter."
- **Real-Time Editor:**  
  - Switch to the Real-Time Editor using the navigation button.
  - Upload an image and use the sliders to adjust effects in real time.
  - Download your edited image or return to the Quick Filters page.


