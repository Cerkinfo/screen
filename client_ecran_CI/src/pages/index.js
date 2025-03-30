import { Lacquer } from 'next/font/google'
import logo from '../../public/LogoCI.png';
import '../css/App.css';
import Image from 'next/image';
import React, { useState, useRef , useEffect} from "react";


// If loading a variable font, you don't need to specify the font weight
const lacquer = Lacquer({ 
  weight: '400',
  subsets: ['latin'] 
})
const PORT = 5000;
const API_IP_ADDRESS = process.env.NEXT_PUBLIC_LOCALIP;
const serverURL = `http://${API_IP_ADDRESS}:${PORT}`;
function App() {
  const [fileName, setFileName] = useState("");
  const [imageURL, setImageURL] = useState(""); // State to store the image URL
  const [isFileSelected, setIsFileSelected] = useState(false); // State to track file selection
  const [sliderValue, setSliderValue] = useState("10"); // State to store slider value
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      setFileName(file.name);
      setIsFileSelected(true); 
      setSelectedFile(file); // Store the selected file

      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target.result); // Set the image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL

    }
  };


  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
    if (true) { //TODO check that a file is selected
      document.getElementsByClassName("send-button")[0].disabled = false;
      document.getElementsByClassName("send-button")[0].style.backgroundColor = "black";
    }
  };

  const handleSendButtonClick = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${serverURL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("L'image a été envoyé avec succès. Elle sera stockée sur nos serveur pendant 42 ans.");
      } else {
        alert("Erreur en envoyant l'image.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Une erreur s'est produite lors de l'upload de l'image");
    }
  };

  const sendFeedback = async () => {
    const feedback = document.getElementsByClassName("input-field")[0].value;
    if (feedback === "") {
      alert("Veuillez entrer un feedback ou une anecdote marrante")
      return;
    }
    
    const response = await fetch(`${serverURL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: feedback,
    });
    if (response.ok) {
      alert('Feedback envoyé avec succès!');
    } else {
      alert('Echec de l\'envoi du feedback.');
    }
    
    };

  // Handle slider change
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  // Update the CSS variable whenever sliderValue changes
  useEffect(() => {
    // Update the CSS custom property (--logo-rotation-speed) with the slider value
    document.documentElement.style.setProperty('--logo-rotation-speed', `${sliderValue}s`);
  }, [sliderValue]); // Run whenever sliderValue changes

  return (
    <div className="App">
      <header className="App-header">
        <h1 className={lacquer.className} className="Page-title">Envoie photo sur l&apos;écran du CI zebi 🚀</h1>
        <Image src={logo} className="App-logo" alt="logo CI"  />
        <div className='one-line'>
          <input
            type="range"
            id="logo-speed-slider"
            className="slider"
            min="0.1"
            max="60"
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <p>{sliderValue}</p>
        </div>
        <input
                type="file"
                accept="image/*, .mp4"
                style={{ display: "none" }}
                id="contained-button-file"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
        <button className="upload-button" onClick={handleUploadButtonClick}>
            Upload une photo
        </button>

        <button 
          className={`send-button ${isFileSelected ? 'enabled' : ''}`}
          id="sendToServer-button" 
          disabled={!isFileSelected} 
          onClick={handleSendButtonClick}
          method="post" action={`${serverURL}/api/upload`}>
            Envoyer la photo
        </button>
        
        {fileName && (
                <div style={{ marginTop: 20, fontSize:"16px" }}>
                    <p>Selected File: <code>{fileName}</code></p>
                </div>
            )} 

        {imageURL && ( //display the image once selected
          <div> 
            <Image src={imageURL} alt="The img that was selected" style={{ maxWidth: "50%", height: "auto"}}/>
          </div>
        )}

        <div style={{marginTop:30}} className="one-line">
          <input type="text" placeholder="Dis un truc drôle" className="input-field"/>
          <button className="normal-button" onClick={sendFeedback}>Envoyer</button>
        </div>
        <a className="rickroll-link" href="https://youtu.be/dQw4w9WgXcQ?si=2xjRwrsmoOTJeL76" target="_blank" rel="noopener noreferrer">Video de Bapteme CI 2024</a>
      </header>
      <footer className='footer'>
        <p>&copy; 2025 Cercle Informatique. CI CI CI sex & choppes 🍻</p>
        made with 💜 at CI by Crevetteboiii(i)* 🦐🦐🦐
      </footer>


    </div>
  );

    
}

export default App;
