document.addEventListener("DOMContentLoaded", function() {
  chrome.runtime.sendMessage({
    action: 'generateUrl'
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    if (response && response.url) {
      const url = response.url;
      console.log('URL:', url);

      const qrCodeContainer = document.getElementById('qr-code-container');

      const qrCode = new QRCodeStyling({
        height: 180,
        width: 180,
        data: url
      });

      qrCode.append(qrCodeContainer);

      const downloadButton = document.getElementById("downloadButton");
      downloadButton.addEventListener("click", function() {
        if (!qrCode) {
          console.error('No QR Code to download');
          return;
        } else {
          qrCode.download({
            name: 'qrcode',
            extension: 'png'
          });
        }
      });

      const customiseButton = document.getElementById("customiseButton");
      customiseButton.addEventListener("click", function() {
        if (!url) {
          console.error('URL not defined');
          return;
        } else {
          const qrCodePageUrl = chrome.runtime.getURL("qr_code.html") + "?data=" + encodeURIComponent(url);
          chrome.tabs.create({
            url: qrCodePageUrl
          });
        }
      });

    } else {
      console.error('Response is undefined or missing URL');
    };

  });
});
