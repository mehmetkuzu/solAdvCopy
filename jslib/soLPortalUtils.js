const articleTagName = "article";

function getRegExForTag(tagName) {
    var rg = new RegExp('single-\\w+-' + tagName, 'g');
    return rg;
}

function getTypeName(longName, tagName) {
    return longName.replace("single-","").replace("-"+tagName, "");
}

function getTagValSolTwit(tagNames) {

	var articles = document.getElementsByTagName(articleTagName);
	var retVals = new Array();

	if (articles.length != 0) {
		var art = articles[0];
		var nid = articles[0].getAttribute('nid');
		retVals['nid'] = [nid, 'article.nid'];
		var all_divs = art.getElementsByTagName('div');
		for (tagName of tagNames) {
			for (var i = 0; i < all_divs.length; i++) {
				var div = all_divs[i];
				var rg = new RegExp('single-\\w+-' + tagName + '$', 'g');
				if (div.className.match(rg)) {
					var typeName = div.className.replace("single-","").replace("-"+tagName, "");
					retVals[tagName] = [stripContent(div),typeName];
				}
			}
		}
	}
	return retVals;
}

function getTagValSol(selected, tagNames) {

	var theArticle;
	var range = selected.getRangeAt(0);
	var articles = document.getElementsByTagName(articleTagName);
	var retVals = new Array();

	for (art of articles) {
		if (art.contains(range.startContainer)) {
			theArticle = art;
			break;
		}
	}
	if (theArticle == null)
		return null;
	
	var nid = theArticle.getAttribute('nid');
	var all_divs = art.getElementsByTagName('div');
	for (tagName of tagNames) {
		for (var i = 0; i < all_divs.length; i++) {
			var div = all_divs[i];
			var rg = getRegExForTag(tagName);
			if (div.className.match(rg)) {
                var typeName = getTypeName(div.className);
                retVals[tagName] = [stripTextContentFromElement(div),typeName];
			}
		}
	}
	return retVals;
}

async function showDialog(textToShow,ptextDetails1, ptextDetails2) {
	var textDetails1 = ptextDetails1.replace("\v\v","---");
	var textDetails2 = ptextDetails2.replace("\v\v","---");
	
	var dialog = document.createElement("dialog");
	dialog.style.backgroundColor = "lightyellow";
	dialog.style.fontSize = "normal";
	dialog.style.fontFamily="sans-serif";
	dialog.style.borderColor = "orange";
	dialog.style.borderWidth = "1px";
	dialog.style.borderRadius = "6px";
	dialog.style.alignItems = "center";
	dialog.style.alignContent = "center";
	dialog.style.textAlign = "center";
	dialog.style.width = "400px";
	dialog.style.overflow = "auto";

	var ttt;

	ttt = document.createElement("label");
	///ttt.style.whiteSpace = "pre";
	ttt.textContent = textToShow;
	ttt.textContent.fontSize = "large";
	dialog.appendChild(ttt);	

	ttt = document.createElement("br");
	dialog.appendChild(ttt);	
	ttt = document.createElement("br");
	dialog.appendChild(ttt);	

	ttt = document.createElement("label");
	ttt.textContent.fontSize = "small";
	ttt.style.overflow = "auto";
	ttt.textContent = textDetails1;
	dialog.appendChild(ttt);

	ttt = document.createElement("br");
	dialog.appendChild(ttt);	
	ttt = document.createElement("br");
	dialog.appendChild(ttt);	

	ttt = document.createElement("label");
	ttt.textContent.fontSize = "small";
	ttt.style.overflow = "auto";
	ttt.textContent = textDetails2;
	dialog.appendChild(ttt);

	
	//dialog.textContent.fontSize = "small";
	//dialog.textContent = textDetails;
	document.body.appendChild(dialog);
	dialog.showModal();
	await new Promise(r => setTimeout(r, 1400));
	dialog.close();
	document.body.removeChild(dialog);
}