//Reloads the extension when extensions icon is clicked in the toolbar
chrome.browserAction.onClicked.addListener(function(activeTab) {
	chrome.runtime.reload()
});

//Opens scrap.tf/raffles when extensions notification is clicked
chrome.notifications.onClicked.addListener(function() {
	chrome.tabs.create({
		"url": "https://scrap.tf/raffles"
	});
});

//Blacklists
var blRaffles = [];
var blItem = "";
var blMode = "";

//Displays a notification when captcha is found, and where //Didn't implement it fully, doesnt work
function notifyCaptcha(url) {

	var notificationCaptcha = new Notification("Scrap.TF Extension", {
		body: "Captcha found! \n" + url,
		icon: "img/icon.png"
	});
	notificationCaptcha.onclick = function() {
		window.open(url);
		notificationCaptcha.close();
	};

}

//Displays a notification when unsafe raffle is found, and where
function notifyUnsafe(url) {

	var notificationUnsafe = new Notification("Scrap.TF Extension", {
		body: "Unsafe raffle found! \n" + url,
		icon: "img/icon.png"
	});
	notificationUnsafe.onclick = function() {
		window.open(url);
		notificationUnsafe.close();
	};

}

//External Info receiver
chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {

	//Displays a notification and logs won items
	if (message.wonItems !== undefined) {
		if (blItem.toString() != message.wonItems) {
			blItem = message.wonItems;
			console.log("[IWD] You have won" + message.wonItems + ".");
			chrome.notifications.create("won_notification", {
				type: "basic",
				title: "Scrap.TF Extension",
				message: "You have won" + message.wonItems + ".",
				contextMessage: "Autojoin Scrap.tf",
				iconUrl: "img/icon.png"
			});
		}
	}

});

//Info receiver
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	//Logs Entry Mode bugs raffles
	if (message.debug !== undefined) {
		console.log("[IWD][B][!] Problem with Entry Mode: not defined!");
		//temp, this whole fn is temp
		blMode = "";
	}

	//Logs "recaptcha" mentions when there are more than 3 (usual number of mentions)
	if (message.debugCaptchaFoundUrl !== undefined) {
		console.log('[IWD][B][!] There were more than 3 mentions of "recaptcha" at ' + message.debugCaptchaFoundUrl);
	}

	//Closes tabs on request
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		if (message.closeThis) {
			chrome.tabs.remove(sender.tab.id);
		}
	});

	//Logs script Entry Mode
	if (message.mode !== undefined) {
		if (message.mode != blMode) {
			blMode = message.mode;
			console.log("[IWD][B] Autojoin Scrap.tf Initialized with Entry Mode: " + message.mode);
		}
	}

	//Logs entered raffles
	if (message.enteredRaffle !== undefined) {
		console.log("[IWD][B] Entered raffle: " + message.enteredRaffle);
	}

	//Logs found captcha
	if (message.captchaFound !== undefined) {
		console.log("[IWD][B] Captcha found: " + message.captchaFound);
		notifyCaptcha(message.captchaFound);
	}

	//Adds raffles to the blacklist (for the current session)
	if (message.blRaffleUrl !== undefined) {
		if (blRaffles.indexOf(message.blRaffleUrl) == -1) {
			blRaffles.push(message.blRaffleUrl);
			console.log("[IWD][B][!] Unsafe: " + message.blRaffleUrl);
			notifyUnsafe(message.blRaffleUrl);
		}
	}

});