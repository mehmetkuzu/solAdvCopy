chrome.runtime.onMessage.addListener( // this is the message listener
	function (request, sender, sendResponse) {
		if (document.hasFocus()) {
			if (request.message === "copyTextMK") {
				if (request.doTheCopy) {
					copyToTheClipboard(request.textToCopy);
				}
			}
			else {
				document.execCommand("copy");
			}
		} else {
			document.execCommand("copy");
		}

		sendResponse();
	}
);

function isInViewPort(elem) {
	var rect = elem.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
	);
}

function stripContent(el) {
	if (el != null) {
		return el.textContent.trim();
	} else {
		return null;
	}
}

function getLinkImage() {
	var myImage = document.createElement('img');
	iconUrl = chrome.runtime.getURL("images/fingerlink.png");
	myImage.src = iconUrl;
	return myImage;
}

function getTagValSol(selected, tagNames) {
	var theArticle;
	var range = selected.getRangeAt(0);
	var articles = document.getElementsByTagName('article');
	var retVals = new Array();

	for (art of articles) {
		if (art.contains(range.startContainer)) {
			theArticle = art;
			break;
		}
	}
	if (theArticle == null)
		return null;

	var all_divs = art.getElementsByTagName('div');
	for (tagName of tagNames) {
		for (var i = 0; i < all_divs.length; i++) {
			var div = all_divs[i];
			var rg = new RegExp('single-\\w+-' + tagName, 'g');
			if (div.className.match(rg)) {
				retVals[tagName] = stripContent(div);
			}
		}
	}
	return retVals;
}
function isInHost(url, host) {
	console.log("url: " + url);
	console.log("host: " + host);
	var rg = new RegExp(host, 'g');
	console.log(url.match(rg));
	return (url.match(rg) != null);
}

async function copyToTheClipboard(textToCopy) {
	//	tmpText = getDate();
	//	
	var dateText = "";
	var reporterText = "";
	var titleText = "";

	var selection = document.getSelection();
	var urlText = selection.baseNode.ownerDocument.URL;


	console.log('CALLURL: ' + urlText);
	if (isInHost(urlText, 'https://haber.sol.org.tr')) {
		console.log("ok");
	} else {
		document.execCommand('copy');
		return;
	}



	var hrText = '<hr style="height:1px;border-width:0;color:gray;background-color:gray">';
	var styleText = '<style>     ' +
		'.div-1 { margin-left: 0px; }' +
		'.div-2 { margin-left: 40px; }' +
		'</style>';
	var divRenk = '<div class="div-1">';
	var divRenk2 = '<div class="div-2">';

	if (selection.rangeCount > 0) {
		var tagVals = getTagValSol(selection, ['datetime', 'reporter', 'title']);
		if (tagVals != null) {
			if ('datetime' in tagVals)
				dateText = tagVals['datetime'];
			if ('reporter' in tagVals)
				reporterText = tagVals['reporter'];
			if ('title' in tagVals)
				titleText = tagVals['title'];
		}

		var tagText;

		var text1 = divRenk + '<small><span style="color:#ad0909">☛ <a href="' + urlText + '">' +
			"soL'dan alıntı</span>" + ' [' + dateText + '] - ' + reporterText + "</small><a>" +
			"</div>";
		var text2 = divRenk + '  <a href="' + urlText + '">' +
			"<small>" + titleText + "</a></small></div>";

		var sonText = divRenk + '<small><span style="color:#ad0909">▲ <a href="' + urlText + '">' +
			'soL\'dan alıntı sonu</a></span> {chrome eklentisi:' + chrome.runtime.getManifest().version + "}</small></div>";

		var selText = selection.toString();

		var plText = "☛  soL'dan Alıntı ☚\n" + selText + "\n\n[" + dateText + "] - " + reporterText + "\n" + titleText + "\n" + urlText + "\n\n▲  soL'dan Alıntı Sonu ☚\n";



		range = selection.getRangeAt(0);
		var clonedSelection = range.cloneContents();
		var div = document.createElement('div');
		div.appendChild(clonedSelection);

		var contents = [styleText, "<div>&zwnj;</div>", text1, text2, divRenk2, div.innerHTML, "</div>" + sonText];

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
}
