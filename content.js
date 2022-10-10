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

	var sel = document.getSelection();
	var tagVals = getTagValSol(sel, ['datetime', 'reporter', 'title']);
	if (tagVals != null){
		if ('datetime' in tagVals)
			dateText = tagVals['datetime'];
		if ('reporter' in tagVals)
			reporterText = tagVals['reporter'];
		if ('title' in tagVals)
			titleText = tagVals['title'];
	}

	var urlText = sel.baseNode.ownerDocument.URL;

	var tagText = "  [" + dateText+ "] - " + reporterText + "\n  " + titleText;

	selText  = document.getSelection().toString();

	sonText = selText + " \n" + tagText + "\n " + urlText + "\n";
	//	sonText = "\"" + selText + "\"" + tagText + "\n";

	const el = document.createElement('textarea');
	el.value = sonText; 
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
