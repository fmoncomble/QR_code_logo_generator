document.addEventListener("DOMContentLoaded", async function() {
  // 'Get tab URL' elements
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const qrData = urlParams.get("data");
  console.log('Page URL: ', qrData);

  // Styling options elements
  const displayStylingOptionsButton = document.getElementById("displayStylingOptionsButton");
  const hideStylingOptionsButton = document.getElementById("hideStylingOptionsButton");
  const stylingOptions = document.getElementById("stylingOptions");

  // QR Code styling elements
  const dotColor = document.getElementById("dotColor");
  const dotType = document.getElementById("dotType");
  const cornersSquareColor = document.getElementById("cornersSquareColor");
  const cornersSquareType = document.getElementById("cornersSquareType");
  const cornersDotColor = document.getElementById("cornersDotColor");
  const cornersDotType = document.getElementById("cornersDotType");
  const bgColor = document.getElementById("bgColor");
  const qrCodeContainer = document.getElementById("qr-code-container");

  // Logo options elements
  const displayLogoOptionsButton = document.getElementById("displayLogoOptionsButton");
  const hideLogoOptionsButton = document.getElementById("hideLogoOptionsButton");
  const logoSubsection = document.getElementById("logoSubsection");

  // 'Add tab icon' elements
  const addFaviconContainer = document.getElementById("addFaviconContainer");
  const addFaviconButton = document.getElementById("addFaviconButton");
  const qrDataUrl = new URL(qrData);
  const domain = qrDataUrl.origin;
  console.log('Domain: ', domain);

  // Loading spinners
  const spinner = document.getElementById("spinner");
  const spinner2 = document.getElementById("spinner2");

  // 'Load logo from file' elements
  const imageUploadInput = document.getElementById("imageUpload");
  const loadLogoContainer = document.getElementById("loadLogoContainer");

  // 'Load logo from URL' elements
  const imageUrlLoader = document.getElementById("imageUrlLoader");
  const loadLogoUrlButton = document.getElementById("loadLogoUrlButton");

  // 'Clear logo' elements
  const removeButtonContainer = document.getElementById("removeButtonContainer");
  const removeLogoButton = document.getElementById("removeLogoButton");

  // Localisation elements
  let noFetch = chrome.i18n.getMessage("noFetch");
  let noLoad = chrome.i18n.getMessage("noLoad");
  let noFound = chrome.i18n.getMessage("noFound");

  // Load default QR Code
  let qrCode = new QRCodeStyling({
    data: qrData,
  });
  qrCode.append(qrCodeContainer);

  // Display or hide styling options
  displayStylingOptionsButton.addEventListener("click", function() {
    stylingOptions.style.display = "block"; // show logo options
    displayStylingOptionsButton.style.display = "none"; // hide display button
    hideStylingOptionsButton.style.display = "block"; // show hide button
  });

  hideStylingOptionsButton.addEventListener("click", function() {
    stylingOptions.style.display = "none"; // hide logo options
    displayStylingOptionsButton.style.display = "block"; // show display button
    hideStylingOptionsButton.style.display = "none"; // hide hide button
  });


  // Display or hide logo options
  displayLogoOptionsButton.addEventListener("click", function() {
    logoSubsection.style.display = "block"; // show logo options
    displayLogoOptionsButton.style.display = "none"; // hide display button
    hideLogoOptionsButton.style.display = "block"; // show hide button
  });

  hideLogoOptionsButton.addEventListener("click", function() {
    logoSubsection.style.display = "none"; // hide logo options
    displayLogoOptionsButton.style.display = "block"; // show display button
    hideLogoOptionsButton.style.display = "none"; // hide hide button
  });

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
      addFaviconButton.textContent = noFetch;
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
          addFaviconButton.textContent = noLoad;
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
        addFaviconButton.textContent = noFound;
      }
    } catch (error) {
      spinner.style.display = 'none'; // Hide loading spinner
      console.error('Error fetching favicon:', error);
      addFaviconButton.style.color = '#ffa500';
      addFaviconButton.style.borderColor = '#ffa500';
      addFaviconButton.style.backgroundColor = '#ffedcc';
      addFaviconButton.textContent = noFetch;
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
    spinner2.style.display = 'inline-block'; // Show loading spinner
    let logoUrl;
    logoUrl = imageUrlLoader.value;
    if (!isValidUrl(logoUrl)) {
    	let invalidUrlAlert = chrome.i18n.getMessage("invalidUrlAlert");
    	alert(invalidUrlAlert);
    	spinner2.style.display = 'none';
    	return
    } else if (logoUrl) {
      removeButtonContainer.style.display = 'block'; // Show remove logo button
      spinner2.style.display = 'none'; // Hide loading spinner
      updateQRCode(logoUrl); // Update QR Code with logo from URL
    }
  });
  
  function isValidUrl(url) {
  	const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/i;
  	return urlPattern.test(url);
  }

  // Clear logo
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

  // Function to apply styling
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

  // Download QR Code
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