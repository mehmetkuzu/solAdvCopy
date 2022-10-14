chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		title: "soL'dan kopyala",
		contexts: ["selection"],
		documentUrlPatterns: ["https://haber.sol.org.tr/*"],
		id: "AdvCopyMK",

	});
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "advancedCopy") {
		chrome.storage.sync.get({
			replaceCopy: false
		}, function(items) {
			var doTheCopy = items.replaceCopy;
			if (doTheCopy)
				doCopyAdvanced(doTheCopy);
		});
	}
});



function doCopyAdvanced(doTheCopy) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var theTab = tabs[0];
		if (theTab == null) {
			return;
		}
		var doMyCopy = doTheCopy;
		chrome.tabs.sendMessage(theTab.id,
			{
				'message': "copyTextMK",
				'doTheCopy': doMyCopy
			}, 
			function(response) {});
	}
	);

}

chrome.contextMenus.onClicked.addListener( (clickData) => {
	if(clickData.menuItemId == "AdvCopyMK"){
		doCopyAdvanced(true);
	}
});

