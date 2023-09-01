chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "generateUrl") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            const url = tab ? tab.url : '';
            console.log('Current URL:', url);

            if (url) {
                sendResponse({ url: url });
            } else {
                console.error('No URL found in the active tab.');
                sendResponse({ url: '' }); // Sending an empty URL as a fallback
            }
        });
        return true; // Indicates that the response will be sent asynchronously
    }
});






// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     if (message.action === "generateQRCode") {
//         const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//         const currentTab = tabs[0];
//         const tabUrl = currentTab.url;
//         console.log("URL of Current Tab:", tabUrl);
// 
//         const fgColor = message.fgColor;
//         const bgColor = message.bgColor;
//         console.log("Foreground colour:", fgColor);
//         console.log("Background colour:", bgColor);
//         
//         const qrcode = new QRCode(message.qrcode, {
//             text: tabUrl, // Fixed the variable name here
//             width: 128,
//             height: 128,
//             colorDark: fgColor,
//             colorLight: bgColor,
//             correctLevel: QRCode.CorrectLevel.H
//         });
//     } else {
//         return; // Removed unnecessary semicolon
//     }
// });
