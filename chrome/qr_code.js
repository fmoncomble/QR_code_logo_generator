document.addEventListener("DOMContentLoaded", async function() {
    // 'Get tab URL' elements
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qrData = urlParams.get("data");
    console.log('Page URL: ', qrData);
    
    // QR Code styling elements
    const dotColor = document.getElementById("dotColor");
    const dotType = document.getElementById("dotType");
    const cornersSquareColor = document.getElementById("cornersSquareColor");
    const cornersSquareType = document.getElementById("cornersSquareType");
    const cornersDotColor = document.getElementById("cornersDotColor");
    const cornersDotType = document.getElementById("cornersDotType");
    const bgColor = document.getElementById("bgColor");
    const qrCodeContainer = document.getElementById("qr-code-container");

    // 'Add tab icon' elements
    const addFaviconContainer = document.getElementById("addFaviconContainer");
    const addFaviconButton = document.getElementById("addFaviconButton");
    const qrDataUrl = new URL(qrData);
    const domain = qrDataUrl.origin;
    console.log('Domain: ', domain);
    
	// Loading spinner
	const spinner = document.getElementById("spinner");
    
    // 'Load logo from file' elements
    const imageUploadInput = document.getElementById("imageUpload");
    const loadLogoContainer = document.getElementById("loadLogoContainer");
    
    // 'Load logo from URL' elements
    const imageUrlLoader = document.getElementById("imageUrlLoader");
    const loadLogoUrlButton = document.getElementById("loadLogoUrlButton");
    
    // 'Clear logo' elements
    const removeButtonContainer = document.getElementById("removeButtonContainer");
    const removeLogoButton = document.getElementById("removeLogoButton");

    // Load default Qr Code
    let qrCode = new QRCodeStyling({
        data: qrData,
    });
	qrCode.append(qrCodeContainer);

    // Option to add tab icon
    addFaviconButton.addEventListener("click", async function() {
        try {
            const logoUrl = await buildLogoUrl();
            if (logoUrl) {
                spinner.style.display = 'none'; // Hide loading spinner
                removeButtonContainer.style.display = "block"; // Show 'clear logo' button
                imageUploadInput.value = ""; // Clear 'Add logo from file' input
                imageUrlLoader.value = ""; // Clear 'Load logo from URL' input
                console.log("Final FaviconUrl=", logoUrl);
                updateQRCode(logoUrl); // Update QR Code with logo
            }
        } catch (error) {
            spinner.style.display = 'none'; // Hide loading spinner
            console.error("Error fetching favicon:", error);
            addFaviconButton.style.color = '#ffa500';
            addFaviconButton.style.borderColor = '#ffa500';
			addFaviconButton.style.backgroundColor = '#ffedcc';
			addFaviconButton.textContent = '⚠️ Cannot fetch tab icon';
        }
    });

    async function getFaviconUrl() {
        spinner.style.display = 'inline-block'; // Show loading spinner	
        const parser = new DOMParser();
        const response = await fetch(qrData);
        if (!response.ok) {
            throw new Error("Failed to fetch page");
        }
        const html = await response.text();
        const page = parser.parseFromString(html, 'text/html');
        const head = page.querySelector('head');
        const links = head.querySelectorAll('link[rel~="icon"]');
        return [...links].find(d => d.href.includes('favicon'));
    }

    async function buildLogoUrl() {
        try {
            const faviconUrl = await getFaviconUrl();
            console.log('Favicon ID: ', faviconUrl);
            let logoUrl;
            if (faviconUrl) {
                console.log('Favicon URL: ', faviconUrl.href);
                if (faviconUrl.href.startsWith('http')) {
                    logoUrl = faviconUrl.href;
                    console.log('logoUrl=', logoUrl);
                } else {
                    const intFaviconUrl = faviconUrl.href;
                    const intFaviconUrl2 = intFaviconUrl.split('/');
                    const intFaviconUrl3 = intFaviconUrl2.slice(3).join('/');
                    logoUrl = domain + '/' + intFaviconUrl3;
                    console.log('logoUrl=', logoUrl);
                }
                const imgResponse = await fetch(logoUrl);
                if (!imgResponse.ok) {
                	spinner.style.display = 'none'; // Hide loading spinner
                    console.error('Could not load favicon');
                    addFaviconButton.style.color = '#ffa500';
                    addFaviconButton.style.borderColor = '#ffa500';
                    addFaviconButton.style.backgroundColor = '#ffedcc';
                    addFaviconButton.textContent = '⚠️ Cannot load tab icon';
                } else {
                    spinner.style.display = 'none'; // Hide loading spinner
                    imageUploadInput.value = ""; // Clear 'Add logo from file' input
                    imageUrlLoader.value = ""; // Clear 'Add logo from URL' input
                    removeButtonContainer.style.display = 'block'; // Show 'clear logo' button
                    console.log('Final FaviconUrl=', logoUrl);
                    updateQRCode(logoUrl);
                }
            } else {
                spinner.style.display = 'none'; // Hide loading spinner
                console.error('Favicon not found');
                addFaviconButton.style.color = '#ffa500';
                addFaviconButton.style.borderColor = '#ffa500';
                addFaviconButton.style.backgroundColor = '#ffedcc';
                addFaviconButton.textContent = '⚠️ Tab icon not found';
            }
        } catch (error) {
            spinner.style.display = 'none'; // Hide loading spinner
            console.error('Error fetching favicon:', error);
			addFaviconButton.style.color = '#ffa500';
			addFaviconButton.style.borderColor = '#ffa500';
			addFaviconButton.style.backgroundColor = '#ffedcc';
			addFaviconButton.textContent = '⚠️ Cannot fetch tab icon';
        }
    };

	// Option to load logo from file
    imageUploadInput.addEventListener("change", function loadLogoFile() {

        const selectedFile = imageUploadInput.files[0];

        // Update display
        if (selectedFile) {
            updateQRCode();
            removeButtonContainer.style.display = 'block'; // Show the remove logo button
        	imageUrlLoader.value = ""; // Clear 'Add logo from URL' input
            let logoUrl;
            const reader = new FileReader();
            reader.onload = function(e) {
                logoUrl = e.target.result;
                if (logoUrl) {
                    updateQRCode(logoUrl);
                } else {
                    console.error("Could not generate logo URL");
                }
            };

            reader.readAsDataURL(selectedFile);

        }
    });
    
    // Option to load logo from URL
    loadLogoUrlButton.addEventListener("click", function() {
    	let logoUrl;
    	logoUrl = imageUrlLoader.value;
    	if (logoUrl) {
			removeButtonContainer.style.display = 'block'; // Show remove logo button
			updateQRCode(logoUrl); // Update QR Code with logo from URL
		}
    });

    removeLogoButton.addEventListener("click", function() {
        imageUploadInput.value = ""; // Clear 'Add logo from file' input
        imageUrlLoader.value = ""; // Clear 'Add logo from URL' input
        removeButtonContainer.style.display = 'none'; // Hide the remove logo button
        updateQRCode(); // Update the QR Code without the logo
    });

    // Function to update the QR Code with the selected image and styling
    function updateQRCode(logoUrl) {

        qrCodeContainer.innerHTML = ''

        if (logoUrl) {
            console.log('Loading logo: ', logoUrl);
            qrCode = new QRCodeStyling({
                data: qrData,
                image: logoUrl,
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 5
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

    function configureQRCode() {
        qrCode.update({
            data: qrData,
            dotsOptions: {
                color: dotColor.value,
                type: dotType.value,
            },
            cornersSquareOptions: {
                color: cornersSquareColor.value,
                type: cornersSquareType.value,
            },
            cornersDotOptions: {
                color: cornersDotColor.value,
                type: cornersDotType.value,
            },
            backgroundOptions: {
                color: bgColor.value,
            },
        });
    }


    dotColor.addEventListener("change", configureQRCode);
    bgColor.addEventListener("change", configureQRCode);
    dotType.addEventListener("change", configureQRCode);
    cornersSquareColor.addEventListener("change", configureQRCode);
    cornersSquareType.addEventListener("change", configureQRCode);
    cornersDotColor.addEventListener("change", configureQRCode);
    cornersDotType.addEventListener("change", configureQRCode);

    const downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", function() {
        if (!qrCode) {
            console.error("No QR Code to download");
            return;
        } else {
            const chooseFormat = document.getElementById('chooseFormat');
            const format = chooseFormat.value;
            qrCode.download({
                name: "qrcode",
                extension: format
            });
        }
    });
});