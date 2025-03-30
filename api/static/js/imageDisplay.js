 // Constant image path without specifying the extension
 const folderPath = 'static/current_displayed_img/'; // Path to the folder containing the image

 // List of common image file extensions
 const extensions = ['png', 'jpg', 'jpeg', 'gif'];

 // Function to try loading the image
 function tryLoadImage() {
    //  if (index >= extensions.length) {
    //      document.getElementById('uniqueImage').alt = 'Image not found';
    //      return;
    //  }

    let srcString

     fetch('http://127.0.0.1:5000/random_img')
    .then(response => response.json())
    .then(data => {
        srcString = `../${String(data["imageName"])}`
        const imgElement = document.getElementById('uniqueImage');

        // Attempt to load the image
        imgElement.src = srcString;
    })
    .catch(error => {
        console.error('Error:', error)
    });

    
 }

 // Start the process
 tryLoadImage();

 setTimeout(function(){
 location.reload();
 }, 10000);
