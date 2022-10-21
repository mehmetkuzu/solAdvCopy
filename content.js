chrome.runtime.onMessage.addListener( // this is the message listener
	function (request, sender, sendResponse) {
		if (document.hasFocus()) {
			if (request.message === "copyTextMK") {
				if (request.doTheCopy) {
					if (copyToTheClipboard()) {
						showDialog("Metin Kopyalandı", "Referans bilgileriyle seçili metin kopyalandı", "Ctrl-V ile formatlı olarak Shift-Ctrl-V ile düz metin olarak yapıştırabilirsiniz" )
					}
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
		inSolPortal = false;
	}



	var hrText = '<hr style="height:1px;border-width:0;color:gray;background-color:gray">';
	var styleText = '<style>     ' +
		'.div-1 { margin-left: 0px; }' +
		'.div-2 { margin-left: 40px; }' +
		'</style>';
	var divRenk = '<div class="div-1">';
	var divRenk2 = '<div class="div-2">';

	var text1 = "";
	var text2 = "";
	var sonText = "";
	var selText = "";
	var plText = "";

	if (selection.rangeCount > 0) {
		selText = selection.toString();
		if (inSolPortal) {
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

			text1 = divRenk + '<small><span style="color:#ad0909">☛ <a href="' + urlText + '">' +
				"soL'dan alıntı</span>" + ' [' + dateText + '] - ' + reporterText + "</small><a>" +
				"</div>";
			text2 = divRenk + '  <a href="' + urlText + '">' +
				'<small>' + titleText + '</a></small><span style="color:#ad0909"> ☚</span></div>';

			sonText = divRenk + '<small><span style="color:#ad0909">▲ <a href="' + urlText + '">' +
				'soL\'dan alıntı sonu</a>  -  </span>' +
				'<a href="' +
				'https://chrome.google.com/webstore/detail/sol-haberden-referans-bil/ibokoohocaniogkmgpbkbggilpcenbem?hl=en-US">{chrome eklentisi: ' +
				chrome.runtime.getManifest().version + ' - eklenti için aktif link}</a></small><span style="color:#ad0909">▲</span></div>';



			plText = "☛  soL'dan Alıntı " + "[" + dateText + "] - " + reporterText +"\n" +
				titleText + "\n" + urlText + "\n\n✑  " +
			 	selText + "\n\n" +
				 "▲ soL'dan Alıntı Sonu " +  "{chrome eklentisi: "+ chrome.runtime.getManifest().version +" - " + chrome.runtime.id + "} ▲\n";
		}
		else {
			titleText = document.title;
			plText = "☛  Alıntı\n" +  titleText + "\n" + urlText  + "\n\n✑ " + selText +
				"\n\n▲ Alıntı Sonu ▲\n";
			text1 = divRenk + '<small><span style="color:#ad0909">☛ <a href="' + urlText + '">' +
				"Alıntı: " + titleText + "</span>" + "</small><a>" +
				"</div>";
			text2 = divRenk + '  <a href="' + urlText + '">' +
				'<small>' + urlText + '</a></small><span style="color:#ad0909"> ☚</span></div>';

			sonText = divRenk + '<small><span style="color:#ad0909">▲ <a href="' + urlText + '">' +
				'Alıntı sonu</a>  -  </span>' +
				'<a href="' +
				'https://chrome.google.com/webstore/detail/sol-haberden-referans-bil/ibokoohocaniogkmgpbkbggilpcenbem?hl=en-US">{chrome eklentisi: ' +
				chrome.runtime.getManifest().version + ' - eklenti için aktif link}</a></small><span style="color:#ad0909">▲</span></div>';
		}

		range = selection.getRangeAt(0);
		var clonedSelection = range.cloneContents();
		var div = document.createElement('div');
		div.appendChild(clonedSelection);

		var contents = [styleText, "<div>&zwnj;</div>", text1, text2, divRenk2, div.innerHTML, "</div>" + sonText];
		writeToClipboard(contents, plText);
		return true;
	}
	return false;
}
