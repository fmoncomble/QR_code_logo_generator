document.addEventListener("DOMContentLoaded", async function() {
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
  console.log('Page URL: ', qrData);
  const removeButtonContainer = document.getElementById("removeButtonContainer");
  const removeLogoButton = document.getElementById("removeLogoButton");
  const loadLogoContainer = document.getElementById("loadLogoContainer");
  const addFaviconContainer = document.getElementById("addFaviconContainer");
  const removeFaviconContainer = document.getElementById("removeFaviconContainer");
  const addFaviconButton = document.getElementById("addFaviconButton");
  const removeFaviconButton = document.getElementById("removeFaviconButton");
  const qrDataUrl = new URL(qrData);
  const domain = qrDataUrl.origin;
  console.log('Domain: ', domain);

  let qrCode = new QRCodeStyling({
    data: qrData,
  });

  qrCode.append(qrCodeContainer);

  imageUploadInput.addEventListener("change", function() {
    const selectedFile = imageUploadInput.files[0];
    const selectedFileNameElement = document.getElementById("fileName");

    // Update the selectedFileNameElement with the file name
    if (selectedFile) {
      selectedFileNameElement.textContent = `${selectedFile.name}`; // Set the file name
      updateQRCode();
      removeButtonContainer.style.display = 'block'; // Show the remove logo button
      loadLogoContainer.style.display = 'none'; // Hide the add logo button
      addFaviconContainer.style.display = 'block'; // Show add favicon button
      removeFaviconContainer.style.display = 'none';
    } else {
      selectedFileNameElement.textContent = ''; // Clear the file name if no file is selected
    }
  });

  removeLogoButton.addEventListener("click", function() {
    imageUploadInput.value = ""; // Clear the selected file in the input
    document.getElementById("fileName").textContent = ""; // Clear the displayed file name
    removeButtonContainer.style.display = 'none'; // Hide the remove logo button
    loadLogoContainer.style.display = 'block'; // Show the add logo button
    updateQRCode(); // Update the QR Code without the image
  });



  async function getFaviconUrl() {
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

  addFaviconButton.addEventListener("click", async function() {
    try {
      const faviconUrl = await getFaviconUrl();
      console.log('Favicon ID: ', faviconUrl);
      let newFaviconUrl;
      if (faviconUrl) {
        console.log('Favicon URL: ', faviconUrl.href);
        if (faviconUrl.href.startsWith('http')) {
          newFaviconUrl = faviconUrl.href;
          console.log('newFaviconUrl=', newFaviconUrl);
        } else {
          const intFaviconUrl = faviconUrl.href;
          const intFaviconUrl2 = intFaviconUrl.split('/');
          const intFaviconUrl3 = intFaviconUrl2.slice(3).join('/');
          newFaviconUrl = domain + '/' + intFaviconUrl3;
          console.log('newFaviconUrl=', newFaviconUrl);
        }
        addFaviconContainer.style.display = 'none';
        removeFaviconContainer.style.display = 'block';
        imageUploadInput.value = ""; // Clear the selected file in the input
        document.getElementById("fileName").textContent = ""; // Clear the displayed file name
        removeButtonContainer.style.display = 'none'; // Hide the remove logo button
        loadLogoContainer.style.display = 'block'; // Show the add logo button			
      } else {
        console.error('Favicon not found');
        faviconError = document.createElement('div');
        faviconError.style.color = '#ffa500';
        faviconError.textContent = '⚠️ Tab icon not found';
        addFaviconButton.after(faviconError);
      }
      console.log('Final FaviconUrl=', newFaviconUrl);
      updateQRCode(newFaviconUrl);
    } catch (error) {
      console.error('Error fetching favicon:', error);
    }
  });

  removeFaviconButton.addEventListener('click', function() {
    addFaviconContainer.style.display = 'block'; // Show add favicon button
    removeFaviconContainer.style.display = 'none'; // Hide remove favicon button
    updateQRCode(); // Update the QR Code without the favicon
  });



  // Function to update the QR Code with the selected image and styling
  function updateQRCode(newFaviconUrl) {
    const selectedFile = imageUploadInput.files[0];
    const selectedFileNameElement = document.getElementById("fileName");

    qrCodeContainer.innerHTML = ''

    if (newFaviconUrl) {
      console.log('Loading Favicon: ', newFaviconUrl);
      qrCode = new QRCodeStyling({
        data: qrData,
        image: newFaviconUrl,
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

    } else if (selectedFile) {

      const reader = new FileReader();
      reader.onload = function(e) {
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
