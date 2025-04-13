import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [filter, setFilter] = useState("grayscale");

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

  return (
    <div  style={{ 
       textAlign: "center",
       //padding: "40px", 
       fontFamily: "Arial", 
       backgroundColor:"#990000",
       width: "100vw",          
       height: "100vh",          
       margin: 0,
       display:"flex",
       flexDirection: "column",    
       minHeight: "100vh",     
       justifyContent: "space-between",  
       

       }}>

      <div style={{
          content:"centre",
          padding: "8px 10px",
          backgroundColor: "black",
          color: "#E50914",
          
          borderRadius: "2px",
        }} >
      <h1>AuraFX</h1>

      </div>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // This centers your buttons vertically
        


      }}>



<div style={{
        padding:"20px 20px",
        fontWeight:"bold",

      }}>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      </div>
      
      <br /><br />
      <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="grayscale">Grayscale</option>
        <option value="blur">Blur</option>
        <option value="invert">Invert</option>
        <option value="sepia">Sepia</option>
        <option value="special">Special</option>
    
      </select>

      </div>

      
      <br /><br />

      <div style={{
        padding:"10px 10px"
      }}>
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Apply Filter
      </button>
      </div>

      

      {filteredImage && (
        <div style={{ marginTop: "30px" ,marginBottom:"30px",}}>
          <h3>Filtered Image:</h3>
          <img
            src={filteredImage}
            alt="Filtered"
            style={{ maxWidth: "300px", borderRadius: "10px" }}
          />
          <br /><br />
          <a
            href={filteredImage}
            download={`filtered_${filter}.jpg`}
            style={{
              textDecoration: "none",
              backgroundColor: "black",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px"
            }}
          >
            Download Image
          </a>
        </div>
      )}
      </div>
      
     

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "10vh",
        content:"centre",
        padding: "20px 10px",
        backgroundColor: "black",
        color: "#E50914",
        borderRadius: "2px",
        fontFamily: "Arial", 
        margintop: "20px"
      }}>
        <div style={{
          fontWeight:"bold"

        }}>
        Made by: Niku Raj

        </div>
        
        

        <div flex style={{
        backgroundColor: "#FF0000",
        color: "white",
        padding: "10px",
        textAlign: "center",
        borderRadius: "30px",
        fontFamily: "Arial",
        width: "fit-content",
        margin: "auto",
        marginTop: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
        }}>
          <a 
          href="https://github.com/niku-raaz" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
          color: "black",
          textDecoration: "none",
          fontWeight: "bold"
    }}
  >
   Github
  </a>      
  

    </div>
        
      </div>
    </div>
  );
}

export default App;
