// ==UserScript==
// @name         Autojoin Scrap.tf
// @namespace
// @version      1.3
// @description  Autojoin for Scrap.tf raffles
// @author       PredatorIWD
// @match        https://scrap.tf/*
// @match        *://steamcommunity.com/*
// @grant        none
// ==/UserScript==

//Requirements alerts
if( document.documentElement.innerHTML.indexOf("sits-login") != -1 ){

	alert("You must be logged in and enable pop-ups on this site for the Autojoin Scrap.tf extension to work.");

} else {

	if( localStorage.getItem("mode") === "false" ){

		console.log("[IWD] Initializing Safe Autojoin Scrap.tf...");
		chrome.runtime.sendMessage({mode: "Safe"});

	} else if( localStorage.getItem("mode") === "true" ){

		console.log("[IWD] Initializing Autojoin Scrap.tf...");
		chrome.runtime.sendMessage({mode: "Normal"});

	} else {

		//In case of a site error
		chrome.runtime.sendMessage({debug: "true"});
		localStorage.setItem("mode", false);
		window.location.reload();

	}

	if( localStorage.getItem("autoWithdraw") === null ){
		localStorage.setItem("autoWithdraw", false);
	}
	if( localStorage.getItem("isBot") === null ){
		localStorage.setItem("isBot", true);
	}

}

//Reload page
if( window.location.pathname == "/raffles" ){
	setInterval( function(){ window.location.reload(); }, rand(240000,600000));
}

//Random number generator
function rand(min, max){
	return Math.floor( Math.random() * (max - min + 1) ) + min;
}

//Injects functions directly into the dom
function exec(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script); //run the script
	document.body.removeChild(script); //clean up
}

//Blacklists
var blLabels = ["Owner", "Dev", "Developer", "Admin", "Administrator", "Mod", "Moderator", "Server Moderator", "S-Mod", "Server-M"];
var blWords = ["bait", "catch", "automatically", "regret", "bot", "bots", "botting", "botters", "botter", "script", "scripts", "scripting", "scripters", "scripter", "dont", "do not", "trap", "banned", "ban", "suspicion", "suspicious", "forever", "permanent", "permanently"];

//Filter staff button
if( window.location.pathname == "/raffles" ){

	var btnFilter = document.createElement("button");
	var tFilter = document.createTextNode("Filter Staff");
	btnFilter.appendChild(tFilter);
	$(".new-raffle")[0].prepend(btnFilter);
	btnFilter.style.display = "none";
	btnFilter.className = "btn btn-inverse btn-embossed";
	$($(".btn.btn-inverse.btn-embossed")[0]).fadeIn();

	btnFilter.onclick = function(){
		exec(function(){
			var blLabels = ["Owner", "Dev", "Developer", "Admin", "Administrator", "Mod", "Moderator", "Server Moderator", "S-Mod", "Server-M"];
			$(".panel-raffle").find("b").each( function(){
				var that = this;
				var scrollInterval = setInterval( function(){
					if( !ScrapTF.Raffles.Pagination.isDone ){
						ScrapTF.Raffles.Pagination.LoadNext();
					} else {
						if( blLabels.indexOf(that.textContent) == -1 ){
							that.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
						}
						clearInterval( scrollInterval );
					}
				}, 2000);
			});
		});
	};

}

//Auto Withdraw button
if( window.location.pathname == "/raffles" ){

	var btnWithdraw = document.createElement("button");
	if( localStorage.getItem("autoWithdraw") === "true" ){
		var tWithdraw = document.createTextNode("Auto Withdraw: On");
	} else {
		var tWithdraw = document.createTextNode("Auto Withdraw: Off");
		btnWithdraw.style.backgroundColor = "#d8413c";
	}
	btnWithdraw.appendChild(tWithdraw);
	$(".new-raffle")[0].prepend(btnWithdraw);
	btnWithdraw.style.marginRight = "4px";
	btnWithdraw.style.display = "none";
	btnWithdraw.className = "btn btn-inverse btn-embossed";
	$($(".btn.btn-inverse.btn-embossed")[0]).fadeIn();

	btnWithdraw.onclick = function(){
		localStorage.setItem("autoWithdraw",  window.confirm("Use auto withdraw feature? (Must have ASF running)"));
		window.location.reload();
	};

}

//Select Mode button
if( window.location.pathname == "/raffles" ){

	var btnMode = document.createElement("button");
	if( localStorage.getItem("mode") === "false" ){
		var tMode = document.createTextNode("Entry Mode: Safe");
		btnMode.style.backgroundColor = "#d8413c";
	} else {
		var tMode = document.createTextNode("Entry Mode: Normal");
	}
	btnMode.appendChild(tMode);
	$(".new-raffle")[0].prepend(btnMode);
	btnMode.style.marginRight = "4px";
	btnMode.style.display = "none";
	btnMode.className = "btn btn-inverse btn-embossed";
	$($(".btn.btn-inverse.btn-embossed")[0]).fadeIn();

	btnMode.onclick = function(){
		localStorage.setItem("mode", confirm("Click OK to select Normal Mode - Recommended\n Enter all raffles normally using filters.\n\nClick Cancel to select Safe Mode\n Enter only raffles that are NOT created by the Scrap.tf team."));
		window.location.reload();
	};

}

//Account type button
if( window.location.pathname == "/raffles" ){

	var btnBot = document.createElement("button");
	if( localStorage.getItem("isBot") === "true" ){
		var tBot = document.createTextNode("Account Type: Bot");
	} else {
		var tBot = document.createTextNode("Account Type: User");
		btnBot.style.backgroundColor = "#3498db";
	}
	btnBot.appendChild(tBot);
	$(".new-raffle")[0].prepend(btnBot);
	btnBot.style.marginRight = "4px";
	btnBot.style.display = "none";
	btnBot.className = "btn btn-inverse btn-embossed";
	$($(".btn.btn-inverse.btn-embossed")[0]).fadeIn();

	btnBot.onclick = function(){
		localStorage.setItem("isBot", confirm("Click OK to select Account Type: Bot\n This increases the time between opening raffles, and adds other features like auto-hide notifications from admins.\n\nClick Cancel to select Account Type: User\n This is the usual experience and behavior of the extension. Select this when you will like to monitor the script and use it with you main account."));
		window.location.reload();
	};

}

//Temp Reset captcha button
if( window.location.pathname == "/raffles" ){

	var btnCaptcha = document.createElement("button");
	var tCaptcha = document.createTextNode("Reset Captcha");
	btnCaptcha.style.backgroundColor = "#3498db";
	btnCaptcha.appendChild(tCaptcha);
	$(".new-raffle")[0].prepend(btnCaptcha);
	btnCaptcha.style.marginRight = "4px";
	btnCaptcha.style.display = "none";
	btnCaptcha.className = "btn btn-inverse btn-embossed";
	$($(".btn.btn-inverse.btn-embossed")[0]).fadeIn();

	btnCaptcha.onclick = function(){
		localStorage.setItem("captchaFound", false);
		window.location.reload();
	};

}

//Enter raffle
function enterRaffle(){
	setInterval( function(){ $("#raffle-enter").click(); chrome.runtime.sendMessage({enteredRaffle: window.location.href}); }, rand(3000,7500) );
}

//Open raffles
function openRaffles(){
	exec( function(){

		function openCurrentRaffle(raffle, i){

			//get account type
			if( localStorage.getItem("isBot") === "true" ){
				var openingTime = 17000;
			} else if( localStorage.getItem("isBot") === "false" ){
				var openingTime = 8000;
			}

			opened++;
			//Opens the raffle
			setTimeout( function(){

				console.log("[IWD] Opening raffles...");

				var a = document.createElement("a");
				a.href = "https://www.scrap.tf/raffles/" + raffle.id.split("-")[2];
				var evt = document.createEvent("MouseEvents");
				//tenth parameter sets ctrl key
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
				a.dispatchEvent(evt);

				$(raffle).fadeTo(500, 0.6);
				$("var")[0].textContent = (+$("var")[0].textContent.split("/")[0] + 1).toString() + "/" + $("var")[0].textContent.split("/")[1];

			}.bind(this), i * openingTime );

		}

		//number of opened raffles
		var opened = 0;
		//site staff labels
		var blLabels = ["Owner", "Dev", "Developer", "Admin", "Administrator", "Mod", "Moderator", "Server Moderator", "S-Mod", "Server-M"];

		//Filters out already entered raffles
		$("#raffles-list .panel-raffle").filter( function(){

			return $(this).css("opacity") != 0.6;

		}).each(function(i){

			//Checks if the Entry Mode is set to Safe
			if( localStorage.getItem("mode") === "false" ){

				//If Entry Mode is set to Safe then check who created the raffle and dont open if it was made by site staff
				if( blLabels.indexOf( this.getElementsByClassName("label usr-label")[0].textContent ) == -1 ){

					openCurrentRaffle(this, i);

				}

			}  else {

				openCurrentRaffle(this, i);

			}

		});

		//log if no raffles were opened
		if( !opened ){
			console.log("[IWD] Already entered all raffles.");
		}

	});
}

//Scroll page then enter raffles
function scrollPage(){
	exec(function(){

		function openCurrentRaffle(raffle, i){

			//get account type
			if( localStorage.getItem("isBot") === "true" ){
				var openingTime = 17000;
			} else if( localStorage.getItem("isBot") === "false" ){
				var openingTime = 8000;
			}

			opened += 1;
			//Opens the raffle
			setTimeout( function(){

				console.log("[IWD] Opening raffles...");

				var a = document.createElement("a");
				a.href = "https://www.scrap.tf/raffles/" + raffle.id.split("-")[2];
				var evt = document.createEvent("MouseEvents");
				//tenth parameter sets ctrl key
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
				a.dispatchEvent(evt);

				$(raffle).fadeTo(500, 0.6);
				$("var")[0].textContent = (+$("var")[0].textContent.split("/")[0] + 1).toString() + "/" + $("var")[0].textContent.split("/")[1];

			}.bind(this), i * openingTime );

		}

		//number of opened raffles
		var opened = 0;
		//site staff labels
		var blLabels = ["Owner", "Dev", "Developer", "Admin", "Administrator", "Mod", "Moderator", "Server Moderator", "S-Mod", "Server-M"];

		var scrollInterval = setInterval( function(){

			if( !ScrapTF.Raffles.Pagination.isDone ){

				console.log("[IWD] Scrolling...");
				ScrapTF.Raffles.Pagination.LoadNext();

			} else {

				//Filters out already entered raffles
				$("#raffles-list .panel-raffle").filter( function(){

					return $(this).css("opacity") != 0.6;

				}).each(function(i){

					//Checks if the Entry Mode is set to Safe
					if( localStorage.getItem("mode") === "false" ){

						//If Entry Mode is set to Safe then check who created the raffle and dont open if it was made by site staff
						if( blLabels.indexOf( this.getElementsByClassName("label usr-label")[0].textContent ) == -1 ){

							openCurrentRaffle(this, i);

						}

					}  else {

						openCurrentRaffle(this, i);

					}

				});

				clearInterval( scrollInterval );

				//log if no raffles were opened
				if( !opened ){
					console.log("[IWD] Already entered all raffles.");
				}

			}

		}, 2000);

	});
}

//Executes when page is loaded
$(document).ready( function(){

	//In case of redirect when chrome is starting
	if( window.location.href === "https://scrap.tf/" ){
		window.location.href = "https://scrap.tf/raffles";
	}

	//Adds the username to the tab title
	document.title = "Scrap.TF - " + $("span[class='username'")[0].textContent;

	//Remove ads on the page
	if( typeof document.getElementsByClassName("raffle-ads-horizontal")[0] !== 'undefined' ){
		document.getElementsByClassName("raffle-ads-horizontal")[0].remove();
	}
	if( typeof document.getElementsByClassName("raffle-ads-vertical")[0] !== 'undefined' ){
		document.getElementsByClassName("raffle-ads-vertical")[0].remove();
	}
	if( typeof document.getElementsByClassName("raffle-ads-mpu")[0] !== 'undefined' ){
		document.getElementsByClassName("raffle-ads-mpu")[0].remove();
	}

	//RAFFLES PAGE
	if( window.location.pathname == "/raffles" ){

		//Search for "recaptcha" in HTML
		var reCount = (document.documentElement.outerHTML.toLowerCase().match(/recaptcha/g) || []).length;
		console.log('[IWD] ' + reCount + ' mentions of word "recaptcha".');
		if( reCount > 3 ){
			chrome.runtime.sendMessage({debugCaptchaFoundUrl: window.location.href});
		}

		//Captcha check
		if( typeof grecaptcha !== 'undefined' ){
			chrome.runtime.sendMessage({captchaFound: window.location.href});
			localStorage.setItem("captchaFound", true);
		}

		//Check if captcha was found previously
		if ( localStorage.getItem("captchaFound") === "true"){
			console.log("[IWD] Captcha was previously needed. Stopping Autojoin Scrap.tf...");
			return;
		} else {
			console.log("[IWD] Document loaded.");
		}

		//Auto Withdraw items
		if( localStorage.getItem("autoWithdraw") === "true" ){

			//site needs time to load queue
			setTimeout( function(){
				exec(function(){

					//checks if there are any won raffles
					if( $($(".panel.panel-info")[0]).children(".panel-bg").children(".panel-raffle").length ){
						//checks if already in queue
						if( ScrapTF.Queue.IsOpen === false ){

							var wonRaffle = $($(".panel.panel-info")[0]).children(".panel-bg").children(".panel-raffle")[0].id.split("-")[2];
							ScrapTF.Ajax("raffles/WithdrawRaffle",{
								raffle: wonRaffle
							});

							//opens steam trade offers page
							setTimeout(function(){

								var a = document.createElement("a");
								a.href = "https://steamcommunity.com/my/tradeoffers";
								var evt = document.createEvent("MouseEvents");
								//tenth parameter sets ctrl key
								evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
								a.dispatchEvent(evt);

							}, 12000);

						}
					}

				});
			}, 4000);

			//checks if there are any won raffles
			if( $($(".panel.panel-info")[0]).children(".panel-bg").children(".panel-raffle").length ){
				exec( function(){

					//logs the name of the items you have won
					var itemNames = [];
					var oneName = "";
					$(".panel-raffle-items").eq(0).children().each( function(){
						$(this).mouseover();
						$(this).mouseout();
						oneName = " " + $(".hover-over-title")[0].textContent;
						itemNames.push(oneName);
					});
					console.log("[IWD] You have won" + itemNames.toString() + ".");
					chrome.runtime.sendMessage("kmemlloioacifiedgpddmoplfombmkoh", {wonItems: itemNames.toString()});

				});
			}

		}

		//Enter raffles
		//difference between entered and total raffles
		var diff = +document.getElementsByTagName("var")[0].textContent.split("/")[1] - +document.getElementsByTagName("var")[0].textContent.split("/")[0];
		//checks if there is more than 40 non-entered raffles (thats how much can fit in one page)
		if( diff > 40 ){
			scrollPage();
		} else {
			scrollPage(); //openRaffles();
		}

	}

	//OPENED RAFFLE PAGE
	if( window.location.href.indexOf("/raffles/") != -1 ){

		//Search for "recaptcha" in HTML
		var reCount = (document.documentElement.outerHTML.toLowerCase().match(/recaptcha/g) || []).length;
		console.log('[IWD] ' + reCount + ' mentions of word "recaptcha".');
		if( reCount > 3 ){
			chrome.runtime.sendMessage({debugCaptchaFoundUrl: window.location.href});
		}

		//Closes the page in case of an unknown error after 12 seconds
		setTimeout( function(){ window.close(); }, 12000);

		//Exits if already won raffle
		if ( document.getElementsByClassName("col-xs-7")[0].textContent.indexOf("Withdraw") != -1 ){
			window.close();
		}

		//Checks if button is removed, not displayed, hidden or invisible
		if( document.documentElement.innerHTML.indexOf('("enter-btn").remove()') != -1 ){
			chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
			window.close();
			console.log('[IWD] The malicious code found is: ("enter-btn").remove()');
		}
		if( document.documentElement.innerHTML.indexOf("#raffle-enter{display:none;") != -1 ){
			chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
			window.close();
			console.log('[IWD] The malicious code found is: #raffle-enter{display:none;');
		}
		if( document.documentElement.innerHTML.indexOf("#raffle-enter{visibility:hidden;") != -1 ){
			chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
			window.close();
			console.log('[IWD] The malicious code found is: #raffle-enter{visibility:hidden;');
		}
		if( document.documentElement.innerHTML.indexOf("#raffle-enter{opacity:0;") != -1 ){
			chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
			window.close();
			console.log('[IWD] The malicious code found is: #raffle-enter{opacity:0;');
		}
		if( typeof $("#raffle-enter")[0] !== 'undefined' ){
			if( $("#raffle-enter")[0].style.display === "none" ){
				chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
				window.close();
				console.log('[IWD] The malicious code found is: $("#raffle-enter")[0].style.display === "none" resulted to true.');
			}
		}
		//Additional safety measure, in case the button was tampered with in any way
		if( document.documentElement.innerHTML.indexOf("#raffle-enter{") != -1 ){
			chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
			window.close();
			console.log('[IWD] Additional safety: The malicious code found is: #raffle-enter{');
		}

		//Captcha check
		if( typeof grecaptcha !== 'undefined' ){
			chrome.runtime.sendMessage({captchaFound: window.location.href});
			localStorage.setItem("captchaFound", true);
		}

		//Check if captcha was found previously
		if ( localStorage.getItem("captchaFound") === "true"){
			console.log("[IWD] Captcha was previously needed. Stopping Autojoin Scrap.tf...");
			return;
		} else {
			console.log("[IWD] Document loaded.");
		}

		//Enters raffle
		if( $("#raffle-enter *").eq(1).text() == "Enter Raffle"){

			//gets the label of the raffle creator
			var userLabel = document.getElementsByClassName("label usr-label")[0].textContent;
			//gets all words from raffle title and description
			var allWords = ( document.getElementsByClassName("subtitle")[0].textContent.replace(/[^a-zA-Z ]/g, "") + " " + document.getElementsByClassName("raffle-message")[0].textContent.replace(/[^a-zA-Z ]/g, "") ).toLowerCase().split(" ");

			//checks who made the raffle
			if( blLabels.indexOf(userLabel) != -1 ){

				//Checks if Entry Mode is set to Safe
				if( localStorage.getItem("mode") === "false" ){
					window.close();
				} else {

					//checks the number of entries
					if( +document.getElementById("raffle-num-entries").getAttribute("data-total") > 450 ){

						//checks for blacklisted words in raffle title and description
						var enterSafety = 0;
						for( var i=0; i < allWords.length; i++ ){

							if( blWords.indexOf(allWords[i]) != -1 ){
								console.log("[IWD] The unsafe word found is " + allWords[i]);
								enterSafety += 1;
								window.close();
								chrome.runtime.sendMessage({blRaffleUrl: window.location.href});
							} else {
								if( i+1 == allWords.length && enterSafety === 0 ){
									console.log("[IWD] Raffle seems safe.");
									enterRaffle();
								}
							}

						}

					} else
						window.close();

				}
			} else
				enterRaffle();
		} else
			window.close();
	}

});

//Waits for notifications to reload the trade offers page
function waitForTradeOffers(){

	console.log("[IWD] There are no new trade offers.");

	//gets the number of notifications
	var notificationNum = document.getElementsByClassName("notification_count")[0].textContent;

	//Reload the page to check for new offers after getting a new notification
	setInterval( function(){
		if( document.getElementsByClassName("notification_count")[0].textContent > notificationNum ){
			window.location.reload();
		}
	}, 1000);

	//Closes the page in case of an unknown error after 20 minutes
	setTimeout( function(){ window.close(); }, 1200000);

}

//Scans for trade offers in which no items are lost and opens them
function openTradeOffers(){
	exec(function(){

		//Checks if you are losing any items in the first trade or is the trade sent by the owner/main acc //you can change the main acc link ofc
		if( document.getElementsByClassName("tradeoffer_item_list")[1].getElementsByClassName("trade_item").length === 0 || document.getElementsByClassName("tradeoffer_header")[0].textContent.indexOf("PrEdAtOr_IWD") > -1 ){

			//Goes through all links with class of whiteLink
			for( var i = 0; i < document.getElementsByClassName("whiteLink").length; i++){

				//Check if thats the open trade window link
				if( document.getElementsByClassName("whiteLink")[i].textContent == "Respond to Offer" ){

					//window.open( "https://steamcommunity.com/tradeoffer/" + document.getElementsByClassName("whiteLink")[i].href.split("\'")[1] );
					//temp
					var a = document.createElement("a");
					a.href = "https://steamcommunity.com/tradeoffer/" + document.getElementsByClassName("whiteLink")[i].href.split("\'")[1];
					var evt = document.createEvent("MouseEvents");
					//tenth parameter sets ctrl key
					evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
					a.dispatchEvent(evt);

				}

			}

			window.close(); //this sometimes executes before the for fn above finishes? or it doesnt recognize something in for above idk so maybe just add a timeout below
			//try wrapping it all in onload, add it after the exec fn above, since steam is autistic with jquery and doesnt recognize it sometimes
			//Closes the page in case of an unknown error after 1 minute
			//setTimeout( function(){ window.close(); }, 60000);

		} else {

			console.log("[IWD] There are no trade offers in which no items are lost.");
			window.close();

		}

	});
}

//TRADE OFFERS PAGE
if( window.location.pathname.indexOf("/tradeoffers") != -1 ){

	//gets the nickname of the acc
	var accNick = window.location.pathname.split("/")[2];

	//The pathname needs to be exactly as written here
	if( window.location.pathname == "/id/" + accNick + "/tradeoffers" || window.location.pathname == "/id/" + accNick + "/tradeoffers/" ){

		//Check if there are new trade offers
		if( typeof document.getElementsByClassName("tradeoffer")[0] !== 'undefined' ){

			//Check if there are trades with banners on them
			if( typeof document.getElementsByClassName("tradeoffer_items_banner")[0] !== 'undefined' ){

				//Check if the only trade offers left are canceled or accepted already
				if( document.getElementsByClassName("tradeoffer").length == document.getElementsByClassName("tradeoffer_items_banner").length ){

					waitForTradeOffers();

				} else {
					openTradeOffers();
				}
			} else {
				openTradeOffers();
			}
		} else {
			waitForTradeOffers();
		}

	}

}

//TRADE OFFER WINDOW, code doesnt work inside .ready or DOMCOntentLoaded because steam site is autistic
if( window.location.pathname.indexOf("/tradeoffer/") != -1 ){

	//Checks if you opened a new trade offer, theres nothing to do when you yourself want to send something
	if( window.location.pathname.indexOf("/tradeoffer/new") == -1 ){
		exec(function(){

			setTimeout( function(){

				//Check if any items are asked from you or is the trade sent by the owner/main acc //you can change the main acc link ofc
				if ( $("your_slot_0").className.indexOf("has_item") == -1 || document.getElementsByClassName("trade_partner_headline_sub")[0].innerHTML.indexOf("https://steamcommunity.com/id/PrEdAtOr_IWD") != -1 ){

					//Accept the trade offer
					ToggleReady(true);
					ConfirmTradeOffer();
					setTimeout(function(){
						document.getElementsByClassName("btn_medium")[4].click();
						ConfirmTradeOffer();
						document.getElementsByClassName("btn_grey_white_innerfade btn_medium")[1].click();
						ConfirmTradeOffer();
					}, 2500);

					//If accepting the trade fails
					setTimeout(function(){
						//if( document.documentElement.innerHTML.indexOf("Accept Trade Failed") != -1 ){
							window.close();
						//}
					}, 10000);

				}

			}, 4000);

		});
	}

}

//Close the window when the trade is completed
if( window.location.pathname.indexOf("/receipt") != -1 ){
	chrome.runtime.sendMessage({closeThis: true});
}