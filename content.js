chrome.runtime.onMessage.addListener( // this is the message listener
	function (request, sender, sendResponse) {
		if (document.hasFocus()) {
			if (request.message === "copyTextMK") {
				if (request.doTheCopy) {
					copyToTheClipboard();
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


function isInHost(url, host) {
	console.log("url: " + url);
	console.log("host: " + host);
	var rg = new RegExp(host, 'g');
	console.log(url.match(rg));
	return (url.match(rg) != null);
}

async function copyToTheClipboard() {
	//	tmpText = getDate();
	//	
	var dateText = "";
	var reporterText = "";
	var titleText = "";

	var selection = document.getSelection();
	var urlText = selection.baseNode.ownerDocument.URL;

	var inSolPortal = false;


	console.log('CALLURL: ' + urlText);
	if (isInHost(urlText, 'https://haber.sol.org.tr')) {
		inSolPortal = true;
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
				dateText = tagVals['datetime'][0];
			if ('reporter' in tagVals)
				reporterText = tagVals['reporter'][0];
			if ('title' in tagVals)
				titleText = tagVals['title'][0];
		}

		var tagText;

		var text1 = divRenk + '<small><span style="color:#ad0909">☛ <a href="' + urlText + '">' +
			"soL'dan alıntı</span>" + ' [' + dateText + '] - ' + reporterText + "</small><a>" +
			"</div>";
		var text2 = divRenk + '  <a href="' + urlText + '">' +
			"<small>" + titleText + "</a></small></div>";

		var sonText = divRenk + '<small><span style="color:#ad0909">▲ <a href="' + urlText + '">' +
			'soL\'dan alıntı sonu</a>  -  </span>' +
			'<a href="' +
			'https://chrome.google.com/webstore/detail/sol-haberden-referans-bil/ibokoohocaniogkmgpbkbggilpcenbem?hl=en-US">{chrome eklentisi: ' +
			chrome.runtime.getManifest().version + " - eklenti için aktif link}</a></small></div>";

		var selText = selection.toString();

		var plText = "☛  soL'dan Alıntı ☚\n" + selText + "\n\n[" + dateText + "] - " + reporterText + "\n" + titleText + "\n" + urlText + "\n\n▲  soL'dan Alıntı Sonu ☚\n";



		range = selection.getRangeAt(0);
		var clonedSelection = range.cloneContents();
		var div = document.createElement('div');
		div.appendChild(clonedSelection);

		var contents = [styleText, "<div>&zwnj;</div>", text1, text2, divRenk2, div.innerHTML, "</div>" + sonText];
		writeToClipboard(contents, plText);
	}
}
