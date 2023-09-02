document.addEventListener("DOMContentLoaded", async function () {
    const qrCodeContainer = document.getElementById("qr-code-container");
    const dotColor = document.getElementById("dotColor");
    const dotType = document.getElementById("dotType");
    const cornersSquareColor = document.getElementById("cornersSquareColor");
    const cornersSquareType = document.getElementById("cornersSquareType");
    const cornersDotColor = document.getElementById("cornersDotColor");
    const cornersDotType = document.getElementById("cornersDotType");
    const bgColor = document.getElementById("bgColor");
    const imageUploadInput = document.getElementById("imageUpload");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qrData = urlParams.get("data");
    const removeButtonContainer = document.getElementById("removeButtonContainer");
    const loadLogoContainer = document.getElementById("loadLogoContainer");
    const loadFavIconContainer = document.getElementById("loadFavIconContainer");
    const removeFavIconContainer = document.getElementById("removeFavIconContainer");

    let qrCode = new QRCodeStyling({
        data: qrData,
    });

    qrCode.append(qrCodeContainer);
    
	imageUploadInput.addEventListener("change", function () {
    	const selectedFile = imageUploadInput.files[0];
    	const selectedFileNameElement = document.getElementById("fileName");

    	// Update the selectedFileNameElement with the file name
    	if (selectedFile) {
        	selectedFileNameElement.textContent = `File: ${selectedFile.name}`; // Set the file name
        	updateQRCode();
        	removeButtonContainer.style.display = 'block'; // Show the remove logo button
        	loadLogoContainer.style.display = 'none'; // Hide the add logo button
    	} else {
        	selectedFileNameElement.textContent = ''; // Clear the file name if no file is selected
    	}
	});
	
	removeLogoButton.addEventListener("click", function () {
		imageUploadInput.value = ""; // Clear the selected file in the input
		document.getElementById("fileName").textContent = ""; // Clear the displayed file name
		removeButtonContainer.style.display = 'none'; // Hide the remove logo button
		loadLogoContainer.style.display = 'block'; // Show the add logo button
		updateQRCode(); // Update the QR Code without the image
	});


    // Function to update the QR Code with the selected image and styling
    function updateQRCode() {
        const selectedFile = imageUploadInput.files[0];
        const selectedFileNameElement = document.getElementById("fileName");
        
        qrCodeContainer.innerHTML = ''

        if (selectedFile) {

            const reader = new FileReader();
            reader.onload = function (e) {
                const imageDataUrl = e.target.result;
                if (imageDataUrl) {
                    qrCode = new QRCodeStyling({
                        data: qrData,
                        image: imageDataUrl, // Set the selected image as the logo
                        imageOptions: {
                            crossOrigin: "anonymous",
                            margin: 5 // Enable cross-origin for the image if necessary
                        },
                        dotsOptions: {
                        	color: dotColor.value,
                        	type: dotType.value
                        },
                        cornersSquareOptions: {
                        	color: cornersSquareColor.value,
                        	type: cornersSquareType.value
                        },
                        cornersDotOptions: {
                        	color: cornersDotColor.value,
                        	type: cornersDotType.value
                        },
                        backgroundOptions: {
                            color: bgColor.value,
                        },
                    });

                    qrCode.append(qrCodeContainer); // Update the QR Code in the container
                } else {
                    console.error("Could not generate logo URL");
                }
            };

            reader.readAsDataURL(selectedFile);
        } else {
             
            qrCode = new QRCodeStyling({
			data: qrData,
			dotsOptions: {
				color: dotColor.value,
				type: dotType.value
			},
			cornersSquareOptions: {
				color: cornersSquareColor.value,
				type: cornersSquareType.value
			},
			cornersDotOptions: {
				color: cornersDotColor.value,
				type: cornersDotType.value
			},
			backgroundOptions: {
				color: bgColor.value,
			},
		});

		qrCode.append(qrCodeContainer); // Update the QR Code in the container
		
        }
    }
    
    dotColor.addEventListener("change", updateQRCode);
    bgColor.addEventListener("change", updateQRCode);
    dotType.addEventListener("change", updateQRCode);
    cornersSquareColor.addEventListener("change", updateQRCode);
    cornersSquareType.addEventListener("change", updateQRCode);
    cornersDotColor.addEventListener("change", updateQRCode);
    cornersDotType.addEventListener("change", updateQRCode);

    const downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", function () {
        if (!qrCode) {
            console.error("No QR Code to download");
            return;
        } else {
            const chooseFormat = document.getElementById('chooseFormat');
            const format = chooseFormat.value;
            qrCode.download({ name: "qrcode", extension: format });
        }
    });
});

    
    
//     generateButton.addEventListener("click", function () {
//         console.log('Generating...');
//         const selectedDotColor = dotColor.value;
//         const selectedBgColor = bgColor.value;
//         const selectedFile = imageUploadInput.files[0];
//         
//         console.log('URL:', qrData);
//         console.log('Foreground color:', selectedDotColor);
//         console.log('Background color:', selectedBgColor);
//         console.log('Logo:', selectedFile);
//         
//         qrCodeContainer.innerHTML = '';
//         
//         if (selectedFile) {
// 			const reader = new FileReader();
// 
// 			reader.onload = function (e) {
// 				const imageDataUrl = e.target.result;
// 				if (imageDataUrl) {
// 					console.log('Logo URL:', imageDataUrl);
// 				} else {
// 					console.error('Could not generate logo URL');
// 				};
// 				
//         
// 				const qrCode = new QRCodeStyling({
// 					width: 300,
// 					height: 300,
// 					type: "canvas",
// 					data: qrData,
// 					image: imageDataUrl,
// 					dotsOptions: {
// 						color: selectedDotColor
// 					},
// 					backgroundOptions: {
// 						color: selectedBgColor
// 					},
// 					imageOptions: {
// 						margin: 2
// 					}
// 				});
// 				
// 				qrCode.append(qrCodeContainer);
// 				qrCode.download({ name: 'qr', extension: 'png'});
// 			};
// 			
// 			reader.readAsDataURL(selectedFile);
// 		
// 		} else {
// 		
// 				const qrCode = new QRCodeStyling({
// 					width: 300,
// 					height: 300,
// 					type: "canvas",
// 					data: qrData,
// 					dotsOptions: {
// 						color: selectedDotColor
// 					},
// 					backgroundOptions: {
// 						color: selectedBgColor
// 					},
// 					imageOptions: {
// 						margin: 20
// 					}
// 				});
// 				
// 				qrCode.append(qrCodeContainer);
// 				qrCode.download({ name: 'qr', extension: 'png'});		
// 		console.error ('No selected file')
// 		};
//         
// 
//     });
// });