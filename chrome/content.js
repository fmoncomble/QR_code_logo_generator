window.addEventListener("error", function(event) {
if (event.error && event.error.message && event.error.message.includes('CORS policy')) {
	alert('Error: inaccessible resource');
	imageUrlLoader.value = "";
	updateQRCode();
}
});