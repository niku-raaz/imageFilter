package main

import (
    "fmt"
    "image"
    "log"
    "net/http"
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
        filtered = imaging.AdjustContrast(img,20)
        filtered=  imaging.AdjustBrightness(filtered,20)
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

func main() {
    http.HandleFunc("/upload", uploadHandler)
    fmt.Println("Server running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
