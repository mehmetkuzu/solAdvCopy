// soL eklenti geliştirmelerine kütüphanesel bakış
// link edilebiliyor mu?
//aceba
function stripTextContentFromElement(el) {
	if (el != null) {
		return el.textContent.trim();
	} else {
		return null;
	}
}

function isInViewPort(elem) {
	var rect = elem.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
	);
}

function getUrl() {
	return document.location.href.replace("edtx.sol.org.tr", "haber.sol.org.tr");
}

async function writeToClipboard(contents, plText) {
	var blob2 = new Blob(contents, { type: "text/html" });

	var richTextInput = new ClipboardItem(
		{
			'text/plain': new Blob([plText], {
				type: 'text/plain',
			}),
			"text/html": blob2
		});
	await navigator.clipboard.write([richTextInput]);
}

function getMeta(metaName) {
	const metas = document.getElementsByTagName('meta');

	for (let i = 0; i < metas.length; i++) {
		if ((metas[i].getAttribute('property') === metaName) || (metas[i].getAttribute('name') === metaName)) {
			return metas[i].getAttribute('content');
		}
	}

	return '';
}
