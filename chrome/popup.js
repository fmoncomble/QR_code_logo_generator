document.addEventListener("DOMContentLoaded", function () {
    const openQrCodeButton = document.getElementById("openQrCodeButton");

    openQrCodeButton.addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: 'generateUrl' }, function (response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            if (response && response.url) {
                const url = response.url;
                const qrCodePageUrl = chrome.runtime.getURL("qr_code.html") + "?data=" + encodeURIComponent(url);
                chrome.tabs.create({ url: qrCodePageUrl });
            } else {
                console.error('Response is undefined or missing URL');
            }
        });
    });
});
