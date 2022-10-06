chrome.runtime.onMessage.addListener( // this is the message listener
	function(request, sender, sendResponse) {
		if (request.message === "copyTextMK") {
			copyToTheClipboard(request.textToCopy);
			sendResponse();
		}
	}
);
async function copyToTheClipboard(textToCopy){
	tmpText = ".";
	dokumanTarObj = document.getElementsByClassName("single-article-datetime");
	if (dokumanTarObj.length == 0) 
		dokumanTarObj = document.getElementsByClassName("single-column-datetime");
	if (dokumanTarObj.length == 0) 
		dokumanTarObj = document.getElementsByClassName("single-gelenek-datetime");
	if (dokumanTarObj.length == 0) {
		tmpText = "";
	} else {
		tmpText = dokumanTarObj[0].innerHTML;
	}
	tmpText = tmpText.replace(/(<time[^>]+?>|<p>|<\/p>)/img, "");
	tmpText = tmpText.replace("</time>", "");
	tmpText = tmpText.replace(/\s/g, '');

	dokumanTarObj = document.getElementsByClassName("single-article-reporter");
	if (dokumanTarObj.length == 0) 
		dokumanTarObj = document.getElementsByClassName("single-column-reporter");
	if (dokumanTarObj.length == 0) 
		dokumanTarObj = document.getElementsByClassName("single-gelenek-reporter");
	if (dokumanTarObj.length == 0)
	{
		tmpText2 = "";
	} else {
		tmpText2 = dokumanTarObj[0].innerHTML;
	}
	tmpText2 = tmpText2.replace(/(<time[^>]+?>|<p>|<\/p>)/img, "");
	tmpText2 = tmpText2.replace(/(?:\r\n|\r|\n)/g, '');
	tmpText2 = tmpText2.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
	tmpText2 = tmpText2.replace(/<a(\s[^>]*)?>.*?/img,"").replace(/<\/a>/img,"").replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");


	tmpText = "[" + tmpText+ "] - " + tmpText2 ;

	//	tmpText = tmpText.replace("\n","");
	tagText  = tmpText + "\n" + textToCopy;
	selText  = document.getSelection().toString();

	sonText = selText + " \n" + tagText + "\n";
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
