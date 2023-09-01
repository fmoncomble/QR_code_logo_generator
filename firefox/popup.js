document.addEventListener("DOMContentLoaded", function () {
    const openQrCodeButton = document.getElementById("openQrCodeButton");

    openQrCodeButton.addEventListener("click", function () {
        browser.runtime.sendMessage({ action: 'generateUrl' }, function (response) {
            if (browser.runtime.lastError) {
                console.error(browser.runtime.lastError);
                return;
            }

            if (response && response.url) {
                const url = response.url;
                const qrCodePageUrl = browser.runtime.getURL("qr_code.html") + "?data=" + encodeURIComponent(url);
                browser.tabs.create({ url: qrCodePageUrl });
            } else {
                console.error('Response is undefined or missing URL');
            }
        });
    });
});
