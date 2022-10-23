// soL eklenti geliştirmelerine kütüphanesel bakış
// link edilebiliyor mu?
//aceba
const debugging = false;
function logIfDebug(logText) {
	if (debugging) {
		console.log(logText);
	}

}
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
function getDefaultStyle() {
	var defStyle = '<style>     ' +
		'.div-1 { margin-left: 0px; }' +
		'.div-2 { margin-left: 40px; }' +
		'</style>';
	return defStyle;
}
async function getAllStorageSyncData(itemKeys) {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(itemKeys, (items) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
        }
        // Pass the data retrieved from storage down the promise chain.
        resolve(items);
    });
    });
}

async function getCurrentFormat(solFormat) {
	var currentFormat = "";
	var items = await getAllStorageSyncData();
		if (solFormat) {
			if (items.clipTemplateSol == null) {
				currentFormat = "";
			} else if (items.clipTemplateSol != "") {
				currentFormat = items.clipTemplateSol;
			} 
			if (currentFormat =="") {
				currentFormat = getDefaultFormatSol();
			}
		} else {
			if (items.clipTemplate == null) {
				currentFormat = "";
			} else if (items.clipTemplate != "") {
				currentFormat = items.clipTemplate;
			} 
			if (currentFormat =="") {
				currentFormat = getDefaultFormat();
			}
		}
		return currentFormat;
}


function getDefaultFormat() {
	var strDefFormat = getDefaultStyle();
	text1 = '<span id="defaultSol></span><div class="div-1"><small><span style="color:#ad0909">☛ <a href="' + '${urlText}">' +
		'Alıntı: ${title}</span></small><a>' +
		"</div>" +
		'<div class="div-1"><a href="${urlText}">' +
		'<small>${urlText}</a></small><span style="color:#ad0909"> ☚</span></div>';
	textSel = '<div class="div-2">${selectedText}</div>';
	text2 = '<div class="div-1"><small><span style="color:#ad0909">▲ <a href="' + '${urlText}">' +
		'Alıntı sonu</a>  -  </span>' +
		'<a href="' +
		'https://chrome.google.com/webstore/detail/sol-haberden-referans-bil/ibokoohocaniogkmgpbkbggilpcenbem?hl=en-US">{chrome eklentisi: ' +
		chrome.runtime.getManifest().version + ' - eklenti için aktif link}</a></small><span style="color:#ad0909">▲</span></div>';
	strDefFormat = strDefFormat + text1 + textSel + text2;
	return strDefFormat;
}

function getDefaultFormatSol() {
	var strDefFormat = getDefaultStyle();
	text1 = '<span id="defaultSol></span><div class="div-1"><small><span style="color:#ad0909">☛ <a href="' + '${urlText}">' +
		"soL'dan alıntı</span></small>" + '<small> [${datetime}] - ${reporter}</small><a>' +
		"</div>" +
		'<div class="div-1"><a href="${urlText}">' +
		'<small>${title}</a></small><span style="color:#ad0909"> ☚</span></div>';
	textSel = '<div class="div-2">${selectedText}</div>';
	text2 = '<div class="div-1"><small><span style="color:#ad0909">▲ <a href="' + '${urlText}">' +
		'soL\'dan alıntı sonu</a>  -  </span>' +
		'<a href="' +
		'https://chrome.google.com/webstore/detail/sol-haberden-referans-bil/ibokoohocaniogkmgpbkbggilpcenbem?hl=en-US">{chrome eklentisi: ' +
		chrome.runtime.getManifest().version + ' - eklenti için aktif link}</a></small><span style="color:#ad0909">▲</span></div>';
	strDefFormat = strDefFormat + text1 + textSel + text2;
	return strDefFormat;
}


function getResult(sourceText, changingVals) {
	var resultText = sourceText;
	for (myKey in changingVals) {
		string = myFind = "\\\${" + myKey + "}";
		var rg = new RegExp(myFind, "g");
		resultText = resultText.replace(rg, changingVals[myKey][0]);
	}
	return resultText;
}

function getValsAll(selected) {
	var theTitle = selected.baseNode.ownerDocument.title;
	var theURL = selected.baseNode.ownerDocument.URL;
	var retVals = new Array();
	retVals["title"] = [theTitle, "FDoc"];
	retVals["urlText"] = [theURL, "FDoc"];
	return retVals;
}
