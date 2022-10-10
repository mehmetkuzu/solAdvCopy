chrome.runtime.onMessage.addListener( // this is the message listener
	function(request, sender, sendResponse) {
		if (request.message === "copyTextMK") {
			copyToTheClipboard(request.textToCopy);
			sendResponse();
		}
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
	if (el != null){
		return el.textContent.trim();
	} else {
		return null;
	}
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
			var rg = new RegExp('single-\\w+-' +tagName,'g'); 
			if (div.className.match(rg)) {
				retVals[tagName] = stripContent(div);
			}
		}
	}
	return retVals;
}

async function copyToTheClipboard(textToCopy){
	//	tmpText = getDate();
	//	
	var dateText = "";
	var reporterText = "";
	var titleText = "";

	var selection = document.getSelection();
	var hrText = '<hr style="height:1px;border-width:0;color:gray;background-color:gray">';
	var styleText = "<style>     .div-1 { background-color: #fffbd1; margin-left: 40px; } </style>";
	var divRenk = '<div class="div-1">';
        var divRenk2 = '<div class="div-1">';

	if (selection.rangeCount > 0) {
		var tagVals = getTagValSol(selection, ['datetime', 'reporter', 'title']);
		if (tagVals != null){
			if ('datetime' in tagVals)
				dateText = tagVals['datetime'];
			if ('reporter' in tagVals)
				reporterText = tagVals['reporter'];
			if ('title' in tagVals)
				titleText = tagVals['title'];
		}

		var urlText = selection.baseNode.ownerDocument.URL;

		var tagText;
		var ilkText = "&gt;&gt; soL'dan alıntı &gt;&gt; " ;

		tagText = divRenk + '<p><a href="' + urlText + '">'+ ilkText + ' [' + dateText+ '] - ' + reporterText + '<br>' + titleText + ' </a></p>' + '</div>';

		selText  = selection.toString();

		sonTextAll = selText + "\n  [" + dateText + "] - " + reporterText + "\n  " + titleText + "\n  " + urlText + "\n\n";
		sonText = divRenk + "&gt;&gt; soL'dan alıntı sonu {chrome eklentisi:" + chrome.runtime.getManifest().version + "}</div>";

		range = selection.getRangeAt(0);
		var clonedSelection = range.cloneContents();
		var div = document.createElement('div');
		div.appendChild(clonedSelection);
		var contents =  [styleText, "<div>&zwnj;</div>", tagText, div.innerHTML,sonText];
		var blob2  = new Blob(contents, { type: "text/html" });
		
		var richTextInput = new ClipboardItem(
			{
				'text/plain': new Blob([sonTextAll], {
					type: 'text/plain',
				}),
				"text/html": blob2 });
		await navigator.clipboard.write([richTextInput]);
	}
}
