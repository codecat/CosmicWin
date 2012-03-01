// ==UserScript==
// @name           CosmicWin
// @namespace      CosmicWin
// @description    Makes the new YouTube homepage better.
// @include        https://*.youtube.com/
// @include        http://*.youtube.com/
// @include        https://youtube.com/
// @include        http://youtube.com/
// ==/UserScript==

(function() {
	// Confirugation
	var config = {
		NoSideBar: false,				// Removes the left sidebar
		FullContent: true,				// Makes the homepage content width 100%
		
		NoGooglePlus: true,				// Removes Google+ from the sidebar
		NoFacebook: true,				// Removes Facebook from the sidebar
		NoChannels: true,				// Removes subscribed channels from the NoSideBar
		NoTrends: true,					// Removes trends from the sidebar
		
		NoRecommended: true,			// Removes recommended videos
		NoRecommendedChannels: true,	// Removes recommended channels from the sidebar
		
		NoAggregate: true,				// Removes the "X videos more" button from videos
		NoLoadMore: true,				// Removes the "Load More" button from the page (recommended, it's glitchy)
		
		ColumnCount: 4,					// Amount of columns
		
		SmallRows: true,				// Makes rows smaller
		SmallRowsHeight: 65,			// The height of the rows (I suggest 65)
		
		Categorize: true,				// Categorize uploaded videos on user
		
		LoadAllThumbnails: true,		// Load all the thumbnails automatically (required if you have multiple columns)
		
		NoFeatureLinks: true,			// Removes ?feature=X from any homepage link
		NoGuideBars: true,				// Removes the red/gray bars from the sidebar
		NoSecondUploader: true,			// Removes the uploaders name that shows up before the "X times viewed"
		NoAddTo: true,					// Removes the "Add To..." buttons when you hover over videos
		
		CosmicDebug: false				// Enables the debugger output
	};
	
	// a.js, 2-12-2011, edited
	function _$(s,url,data,callback) {
		var src = document;
		var ret = false;
		
		if(url != undefined && data != undefined) {
			var req;
			
			if(s != "POST" && callback == undefined)
				callback = data;
			
			if(window.XMLHttpRequest)
				req = new XMLHttpRequest();
			else
				req = new ActiveXObject("Microsoft.XMLHTTP");
			
			if(req) {
				req.onreadystatechange = function() {
					if(req.readyState == 4 && req.status == 200)
						callback(req.responseText);
				};
				
				req.open(s, url, true);
				
				if(s == "POST") {
					req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					req.setRequestHeader("Content-length", data.length);
					req.setRequestHeader("Connection", "close");
					req.send(data);
				} else {
					req.send();
				}
			}
		} else {
			switch(typeof(s)) {
				case "string":
					if(s != "") {
						var isID = s[0] == "#";
						var isClass = s[0] == ".";
						var isTag = (!isID && !isClass);
						
						if(isID || isClass)
							s = s.substr(1);
						
						var sIndex = -1;
						var sMatches = s.match(/^(.+)(\[([0-9]+)\])$/);
						if(sMatches) {
							sIndex = parseInt(sMatches[3]);
							s = sMatches[1];
						}
						
						var elms = [];
						if(isID)
							ret = src.getElementById(s);
						else if(isClass)
							elms = src.getElementsByClassName(s);
						else if(isTag)
							elms = src.getElementsByTagName(s);
						
						if(!ret) {
							if(elms.length == 1)
								ret = elms[0];
							else {
								ret = elms;
								if(sIndex != -1)
									ret = elms[sIndex];
							}
						}
					}
					break;
				case "function":
					document.addEventListener("DOMContentLoaded", s, false);
					break;
				default:
					console.log("Unknown type in a.js: '" + typeof(s) + "'");
					break;
			}
		}
		
		if(ret !== false) {
			ret._$ = _$;
			ret.append = function(c) { ret.innerHTML += c; return this; };
			ret.prepend = function(c) { ret.innerHTML = c + ret.innerHTML;  return this; };
			ret.set = function(c) { ret.innerHTML = c; return this; }
			ret.get = function() { return ret.innerHTML; }
			ret.clear = function() { ret.innerHTML = "";  return this; }
		}
		
		return ret;
	}
	
	var debugElement = null;
	function addDebugLog(str) {
		if(! config.CosmicDebug)
			return;
		
		debugElement.value = str + "\n" + debugElement.value;
	}
	
	if(config.CosmicDebug) {
		debugElement = document.createElement("textarea");
		debugElement.style.width = "430px";
		debugElement.style.height = "200px";
		debugElement.style.position = "fixed";
		debugElement.style.left = "0px";
		debugElement.style.bottom = "0px";
		debugElement.style.fontFamily = "monospace";
		_$("body").appendChild(debugElement);
	}
	
	var changedFeedWidth = false;
	
	var addCSS = document.createElement("style");
	addCSS.innerHTML = "";
	
	if(config.NoSideBar) {
		addCSS.innerHTML += ".guide-container,guide-background { display:none; }";
		addCSS.innerHTML += "#feed { margin-left:0px;width:970px; }";
		addCSS.innerHTML += "#feed-background { left:0px;width:970px; }";
		addCSS.innerHTML += ".feed-header { border-radius:4px 0px 0px 0px; }";
		
		changedFeedWidth = true;
	}else{
		if(config.NoFacebook || config.NoChannels) {
			var elms = _$(".guide-item-container");
			for(i = 0; i < elms.length; i++) {
				var elm = elms[i];
				var elmItem = elm.children[0].children[0];
				
				if(elmItem != null) {
					var elmImage = elmItem.children[0];
					
					if(elmImage != null) {
						if(config.NoGooglePlus) {
							if(elmImage.className.match(/ google-plus$/))
								elm.style.display = "none";
						}
						
						if(config.NoFacebook) {
							if(elmImage.className.match(/ facebook$/))
								elm.style.display = "none";
						}
						
						if(config.NoChannels) {
							if(elmImage.className.match(/ ux-thumb-profile-([0-9]+)$/))
								elm.style.display = "none";
						}
					}
				}
			}
		}
	}
	
	if(config.FullContent) {
		addCSS.innerHTML += "#content { width:95%; }";
		addCSS.innerHTMl += ".guide-layout-container { width:100%; }";
		addCSS.innerHTML += "#feed { width:-moz-calc(100% - 200px) !important;width:-webkit-calc(100% - 200px) !important; }";
		addCSS.innerHTML += "#feed-background { width:100% !important; }";
	}
	
	if(config.VisitedLinks) {
		addCSS.innerHTML += "a:visited { color:#00a; }";
	}
	
	if(config.NoTrends) {
		var elms = _$(".guide-section");
		for(i = 0; i < elms.length; i++) {
			var elmItem = elms[i].children[0].children[0];
			
			if(elmItem.getAttribute("data-feed-name") == "youtube")
				elms[i].style.display = "none";
		}
	}
	
	if(config.NoRecommended) {
		addCSS.innerHTML += "#video-sidebar { display:none; }";
		if(!changedFeedWidth)
			addCSS.innerHTML += "#feed,#feed-background { width:770px; }";
		
		if(config.NoRecommendedChannels) {
			var elms = _$(".guide-section");
			for(i = 0; i < elms.length; i++) {
				var elmIcon = elms[i].children[0].children[0];
				
				if(elmIcon.getAttribute("data-feed-name") == "channels")
					elms[i].style.display = "none";
			}
		}
	}
	
	if(config.NoAggregate) {
		addCSS.innerHTML += ".feed-item-show-aggregate { display:none !important; }";
	}
	
	var columns = [];
	
	addCSS.innerHTML += "." + (config.Categorize ? "cosmic-win-container" : "feed-item-main") + " { width:" + (100 / config.ColumnCount * 0.92) + "%;float:left;margin-left:10px; }";
	addCSS.innerHTML += ".feed-load-more-container { width:100%;float:left; }";
	
	var feedContainer = _$(".feed-container");
	if(feedContainer.length != undefined)
		feedContainer = feedContainer[0];
	for(i = 0; i < config.ColumnCount; i++) {
		var newColumn = document.createElement("div");
		newColumn.className = "cosmic-win-container";
		
		feedContainer.appendChild(newColumn);
		columns.push([0, newColumn]);
	}
	
	if(config.NoLoadMore) {
		_$(".feed-load-more").style.display = "none";
	}
	
	if(config.SmallRows) {
		// Thumb
		addCSS.innerHTML += ".video-thumb {" +
							"	width:" + (config.SmallRowsHeight + 16) + "px;" +
							"	height:" + config.SmallRowsHeight + "px;" +
							"}";
		
		// Thumb Image
		addCSS.innerHTML += ".feed-item-thumb img {" +
							"	width:auto;" +
							"	height:" + config.SmallRowsHeight + "px;" +
							"	top:0px;" +
							"	left:8px;" +
							"}";
		
		// Item Content
		addCSS.innerHTML += ".feed-item-content {" +
							"	margin-left:" + (config.SmallRowsHeight + 20) + "px !important;" +
							"	margin-right:0px !important;" +
							"	padding-top:0px;" +
							"}";
		
		// Item Title
		addCSS.innerHTML += ".feed-item-visual-content h4 {" +
							"	width:100% !important;" +
							"}";
	}
	
	var users = [];
	if(config.Categorize) {
		var elms = _$(".feed-item-outer");
		for(i = 0; i < elms.length; i++) {
			var elm = elms[i];
			
			if(elm.parentNode.className == "")
				continue;
			
			var elmOwnerTitle;
			var elmOwner;
			if(elm.children[0].children[2].children.length == 3) {
				elmOwner = elm.children[0].children[2].children[2].children[1].children[0];
				elmOwnerTitle = elm.children[0].children[2].children[2];
			} else {
				elmOwner = elm.children[0].children[2].children[3].children[1].children[0];
				elmOwnerTitle = elm.children[0].children[2].children[3];
			}
			var elmVisual = elm.children[0];
			
			var userName = elmOwner.innerHTML;
			addDebugLog("'" + userName + "'");
			if(users[userName] == undefined)
				users[userName] = [elm, elmOwnerTitle];
			else
				elmOwnerTitle.style.display = "none";
			
			users[userName].push([elm, elmVisual]);
			
			for(j = 0; j < elm.children.length; j++) {
				var child = elm.children[j];
				if(child.className == "feed-item-sub-items") {
					for(k = 0; k < child.children; k++)
						users[userName].push([elm, child.children[k].children[0]]);
				}
			}
		}
		
		addCSS.innerHTML += ".feed-item-author { position:inherit !important; }";
		addCSS.innerHTML += ".feed-item-outer { padding:0px; }";
		addCSS.innerHTML += ".feed-item-time { top:inherit !important; bottom:0px; }";
		addCSS.innerHTML += ".feed-item-actions-line { padding-top:10px; }";
		
		for(uID in users) {
			addDebugLog("Categorize: " + uID + " has " + users[uID].length + " videos.");
			
			var user = users[uID];
			var userElm = user[0];
			var userElmTitle = user[1];
			
			for(i = 2; i < user.length; i++) {
				var post = user[i];
				
				if(post[1] != null) {
					userElm.appendChild(post[1]);
				}
			}
			
			var addToColumn = columns[0];
			
			for(i = 0; i < columns.length; i++) {
				var columnPostCount = columns[i][0];
				
				if(columnPostCount < addToColumn[0])
					addToColumn = columns[i];
			}
			
			addToColumn[1].appendChild(userElmTitle);
			addToColumn[1].appendChild(userElm);
			addToColumn[0] += user.length;
		}
		
		_$(".feed-page").style.display = "none";
	}
	
	if(config.LoadAllThumbnails) {
		var elms = _$("img");
		for(i = 0; i < elms.length; i++) {
			var elm = elms[i];
			var newURL = elm.getAttribute("data-thumb");
			if(newURL != null) {
				if(elm.src != newURL)
					elm.src = newURL;
			}
		}
	}
	
	if(config.NoFeatureLinks) {
		var elms = _$("a");
		for(i = 0; i < elms.length; i++)
			elms[i].href = elms[i].href.replace(/^(.+)(&|\?)feature=(.+)$/, "$1");
	}
	
	if(config.NoGuideBars) {
		addCSS.innerHTML += ".guide-item.selected,.guide-item.selected:hover { border-right:0px !important; }";
		addCSS.innerHTML += ".guide-item:hover { border-right:0px !important; }";
	}
	
	if(config.NoSecondUploader) {
		addCSS.innerHTML += ".metadata .yt-user-name { display:none; }";
	}
	
	if(config.NoAddTo) {
		addCSS.innerHTML += ".addto-button { display:none; }";
	}
	
	document.head.appendChild(addCSS);
	
	addDebugLog("Script successfully started.");
})();