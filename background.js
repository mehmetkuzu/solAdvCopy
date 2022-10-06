chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		title: "soL'dan kopyala",
		contexts: ["selection"],
		id: "AdvCopyMK",

	})
});

chrome.contextMenus.onClicked.addListener( (clickData) => {
	if(clickData.menuItemId == "AdvCopyMK"){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			let teto = "**" + tabs[0].title + "**\n" + tabs[0].url + "\n";

			chrome.tabs.sendMessage(tabs[0].id,
				{
					'message': "copyTextMK",
					'textToCopy': teto
									//window.getSelection().toString()
					//"some text" 
				}, 
				function(response) {})
		}
		);
	}
});

