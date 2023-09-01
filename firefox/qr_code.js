document.addEventListener("DOMContentLoaded", async function () {
    const qrCodeContainer = document.getElementById("qr-code-container");
    const fgColorDropdown = document.getElementById("fgColor");
    const bgColorDropdown = document.getElementById("bgColor");
    const generateButton = document.getElementById("generateButton");
    const imageUploadInput = document.getElementById("imageUpload");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qrData = urlParams.get("data");
        
    // Add the change event listener to the file input
	imageUploadInput.addEventListener("change", function () {
    	const selectedFile = imageUploadInput.files[0];
    	const selectedFileNameElement = document.getElementById("fileName");

    	// Update the selectedFileNameElement with the file name
    	if (selectedFile) {
        	selectedFileNameElement.textContent = `File: ${selectedFile.name}`; // Set the file name
    	} else {
        	selectedFileNameElement.textContent = ''; // Clear the file name if no file is selected
    	}
	});

    
    generateButton.addEventListener("click", function () {
        console.log('Generating...');
        const selectedFgColor = fgColorDropdown.value;
        const selectedBgColor = bgColorDropdown.value;
        const selectedFile = imageUploadInput.files[0];
        
        console.log('URL:', qrData);
        console.log('Foreground color:', selectedFgColor);
        console.log('Background color:', selectedBgColor);
        console.log('Logo:', selectedFile);
        
        qrCodeContainer.innerHTML = '';
        
        if (selectedFile) {
			const reader = new FileReader();

			reader.onload = function (e) {
				const imageDataUrl = e.target.result;
				if (imageDataUrl) {
					console.log('Logo URL:', imageDataUrl);
				} else {
					console.error('Could not generate logo URL');
				};
				
        
				const qrCode = new QRCodeStyling({
					width: 300,
					height: 300,
					type: "canvas",
					data: qrData,
					image: imageDataUrl,
					dotsOptions: {
						color: selectedFgColor
					},
					backgroundOptions: {
						color: selectedBgColor
					},
					imageOptions: {
						margin: 2
					}
				});
				
				qrCode.append(qrCodeContainer);
				qrCode.download({ name: 'qr', extension: 'png'});
			};
			
			reader.readAsDataURL(selectedFile);
		
		} else {
		
				const qrCode = new QRCodeStyling({
					width: 300,
					height: 300,
					type: "canvas",
					data: qrData,
					dotsOptions: {
						color: selectedFgColor
					},
					backgroundOptions: {
						color: selectedBgColor
					},
					imageOptions: {
						margin: 20
					}
				});
				
				qrCode.append(qrCodeContainer);
				qrCode.download({ name: 'qr', extension: 'png'});		
		console.error ('No selected file')
		};
        

    });
});

