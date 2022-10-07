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


function getTagValSol(tagName) {		

	var all_divs = document.getElementsByTagName('div');
	var divs = [];
	var lastDiv;

	for (var i = 0; i < all_divs.length; i++) {
		var div = all_divs[i];
		var rg = new RegExp('single-\\w+-' +tagName,'g'); 
		if (div.className.match(rg)) {
			if (isInViewPort(div)){
				return stripContent(div);
			}
			else {
				lastDiv = div;
			}
		}
	}
	if (lastDiv != null) {
		return stripContent(lastDiv);
	}
	else
		return "...";

}

async function copyToTheClipboard(textToCopy){
//	tmpText = getDate();
	//	
	var sel = document.getSelection();

	var dateText = getTagValSol("datetime");
	var reporterText2 = getTagValSol("reporter");
	//var urlText = document.URL;
	var urlText = sel.baseNode.ownerDocument.URL;
	var titleText = sel.baseNode.ownerDocument.title;
	//var titleText = getTagValSol("title");

	var tagText = "[" + dateText+ "] - " + reporterText2; // + " - " + titleText;

	//var tagText = "[" + dateText+ "] - " + reporterText2 + " - " + titleText;

	selText  = document.getSelection().toString();

	sonText = selText + " \n" + tagText + "\n" + urlText + "\n";
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
