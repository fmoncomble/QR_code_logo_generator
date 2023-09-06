chrome.runtime.onInstalled.addListener(tab => {
	let popupHtml = chrome.i18n.getMessage("popupHtml");
	
	chrome.action.setPopup({popup: popupHtml});
});

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