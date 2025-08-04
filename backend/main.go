package main

import (
	"fmt"
	"image"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/disintegration/imaging"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to read image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		http.Error(w, "Failed to decode image", http.StatusBadRequest)
		return
	}

	filter := r.FormValue("filter")
	var filtered image.Image

	switch strings.ToLower(filter) {
	case "grayscale":
		filtered = imaging.Grayscale(img)
	case "blur":
		filtered = imaging.Blur(img, 2)
	case "invert":
		filtered = imaging.Invert(img)
	case "sepia":
		filtered = imaging.AdjustContrast(img, 20)
		filtered = imaging.AdjustBrightness(filtered, 20)
	case "special":
		filtered = imaging.Convolve3x3(
			img,
			[9]float64{
				-1, -1, 0,
				-1, 1, 1,
				0, 1, 1,
			},
			nil,
		)

	default:
		filtered = img
	}

	w.Header().Set("Content-Type", "image/jpeg")
	err = imaging.Encode(w, filtered, imaging.JPEG)
	if err != nil {
		http.Error(w, "Failed to encode image", http.StatusInternalServerError)
		return
	}

	fmt.Println("Image filtered and returned successfully")
}

func realtimeEditHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to read image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		http.Error(w, "Failed to decode image", http.StatusBadRequest)
		return
	}

	// Parse effect parameters
	brightness, _ := strconv.Atoi(r.FormValue("brightness"))
	contrast, _ := strconv.Atoi(r.FormValue("contrast"))
	saturation, _ := strconv.Atoi(r.FormValue("saturation"))
	blur, _ := strconv.Atoi(r.FormValue("blur"))
	hue, _ := strconv.Atoi(r.FormValue("hue"))
	sepia, _ := strconv.Atoi(r.FormValue("sepia"))
	invert, _ := strconv.Atoi(r.FormValue("invert"))
	grayscale, _ := strconv.Atoi(r.FormValue("grayscale"))

	filtered := img

	// Apply effects in sequence
	// Brightness adjustment
	if brightness != 100 {
		brightnessAdjustment := float64(brightness-100) / 100.0
		filtered = imaging.AdjustBrightness(filtered, brightnessAdjustment*50)
	}

	// Contrast adjustment
	if contrast != 100 {
		contrastAdjustment := float64(contrast-100) / 100.0
		filtered = imaging.AdjustContrast(filtered, contrastAdjustment*50)
	}

	// Saturation adjustment (using contrast as approximation)
	if saturation != 100 {
		if saturation < 100 {
			// Reduce saturation by applying contrast adjustment
			saturationAdjustment := float64(saturation-100) / 100.0
			filtered = imaging.AdjustContrast(filtered, saturationAdjustment*30)
		}
	}

	// Blur effect
	if blur > 0 {
		filtered = imaging.Blur(filtered, float64(blur))
	}

	// Hue rotation (approximated using color matrix)
	if hue != 0 {
		// Simple hue rotation using color adjustments
		hueRad := float64(hue) * 3.14159 / 180.0
		// Apply color matrix for hue rotation
		matrix := [9]float64{
			float64(0.213 + 0.787*math.Cos(hueRad) + 0.213*math.Sin(hueRad)),
			float64(0.213 - 0.213*math.Cos(hueRad) + 0.143*math.Sin(hueRad)),
			float64(0.213 - 0.213*math.Cos(hueRad) - 0.787*math.Sin(hueRad)),
			float64(0.715 - 0.715*math.Cos(hueRad) - 0.715*math.Sin(hueRad)),
			float64(0.715 + 0.285*math.Cos(hueRad) + 0.140*math.Sin(hueRad)),
			float64(0.715 - 0.715*math.Cos(hueRad) + 0.715*math.Sin(hueRad)),
			float64(0.072 - 0.072*math.Cos(hueRad) + 0.928*math.Sin(hueRad)),
			float64(0.072 - 0.072*math.Cos(hueRad) - 0.283*math.Sin(hueRad)),
			float64(0.072 + 0.928*math.Cos(hueRad) + 0.072*math.Sin(hueRad)),
		}
		filtered = imaging.Convolve3x3(filtered, matrix, nil)
	}

	// Sepia effect
	if sepia > 0 {
		sepiaMatrix := [9]float64{
			0.393, 0.769, 0.189,
			0.349, 0.686, 0.168,
			0.272, 0.534, 0.131,
		}
		filtered = imaging.Convolve3x3(filtered, sepiaMatrix, nil)
		// Apply sepia intensity by adjusting brightness
		sepiaIntensity := float64(sepia) / 100.0
		if sepiaIntensity < 1.0 {
			// Reduce the effect by adjusting brightness
			filtered = imaging.AdjustBrightness(filtered, -10*sepiaIntensity)
		}
	}

	// Invert effect
	if invert > 0 {
		if invert >= 100 {
			filtered = imaging.Invert(filtered)
		} else {
			// For partial invert, we'll use a different approach
			// Apply a subtle brightness adjustment
			invertIntensity := float64(invert) / 100.0
			filtered = imaging.AdjustBrightness(filtered, -20*invertIntensity)
		}
	}

	// Grayscale effect
	if grayscale > 0 {
		if grayscale >= 100 {
			filtered = imaging.Grayscale(filtered)
		} else {
			// For partial grayscale, apply a subtle effect
			grayIntensity := float64(grayscale) / 100.0
			filtered = imaging.AdjustContrast(filtered, -10*grayIntensity)
		}
	}

	w.Header().Set("Content-Type", "image/jpeg")
	err = imaging.Encode(w, filtered, imaging.JPEG)
	if err != nil {
		http.Error(w, "Failed to encode image", http.StatusInternalServerError)
		return
	}

	fmt.Println("Real-time effects applied successfully")
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/realtime-edit", realtimeEditHandler)
	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
