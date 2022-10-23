chrome.runtime.onMessage.addListener( // this is the message listener
	function (request, sender, sendResponse) {
		if (document.hasFocus()) {
			if (request.message === "copyTextMK") {
				if (request.doTheCopy) {
					if (copyToTheClipboard()) {
						showDialog("Metin Kopyalandı", "Referans bilgileriyle seçili metin kopyalandı", "Ctrl-V ile formatlı olarak Shift-Ctrl-V ile düz metin olarak yapıştırabilirsiniz")
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
	var rg = new RegExp(host, 'g');
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

			plText = "☛  soL'dan Alıntı " + "[" + dateText + "] - " + reporterText + "\n" +
				titleText + "\n" + urlText + "\n\n✑  " +
				selText + "\n\n" +
				"▲ soL'dan Alıntı Sonu " + "{chrome eklentisi: " + chrome.runtime.getManifest().version + " - " + chrome.runtime.id + "} ▲\n\n";

			range = selection.getRangeAt(0);
			var clonedSelection = range.cloneContents();
			var div = document.createElement('div');
			div.appendChild(clonedSelection);

			tagVals["selectedText"] = [div.innerHTML, "selected-text"];
			tagVals["urlText"] = [selection.baseNode.ownerDocument.URL, "soLURL"];

			var sonuc = await getCurrentFormat(true);
			
			var lastSonuc = getResult(sonuc, tagVals);

			var contents = ["<div>", lastSonuc, "</div>"];
		}
		else {
			tagVals = getValsAll(selection);
			titleText = tagVals["title"][0];
			urlText = tagVals["urlText"][0];
			plText = "☛  Alıntı\n" + titleText + "\n" + urlText + "\n\n✑ " + selText +
				"\n\n▲ Alıntı Sonu ▲\n";

			range = selection.getRangeAt(0);
			var clonedSelection = range.cloneContents();
			var div = document.createElement('div');
			div.appendChild(clonedSelection);

			tagVals["selectedText"] = [div.innerHTML, "selected-text"];

			var sonuc = await getCurrentFormat(false);
			
			var lastSonuc = getResult(sonuc, tagVals);
			logIfDebug(lastSonuc);
			
			var contents = ["<div>", lastSonuc, "</div>"];
		}

		writeToClipboard(contents, plText);
		return true;
	}
	return false;
}
