// ==UserScript==
// @name           CosmicWin
// @version        1.01
// @namespace      CosmicWin
// @description    Makes the new YouTube homepage better.
// @include        https://*.youtube.com/
// @include        http://*.youtube.com/
// @include        https://youtube.com/
// @include        http://youtube.com/
// @require        https://github.com/AngeloG/CosmicWin/raw/master/a.js
// @downloadURL    https://github.com/AngeloG/CosmicWin/raw/master/cosmicwin.user.js
// @updateURL      https://github.com/AngeloG/CosmicWin/raw/master/cosmicwin.meta.js
// ==/UserScript==

(function() {
	// Configuration
	var config = {
		NoSideBar: false,				// Removes the left sidebar
		FullContent: true,				// Makes the homepage content width 100%
		VisitedLinks: true,				// Makes visited links blue
		
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
	},

	// Debug object
	CosmicDebug = {
		enabled: false,
		
		debugElement: null,
		elementProperties: {
			width: "430px",
			height: "200px",
			position: "fixed",
			left: "0px",
			bottom: "0px",
			fontFamily: "monospace"
		},
		
		init: function() {
			this.enabled = true;
			
			this.debugElement = document.createElement("textarea");
			
			for(var key in this.elementProperties) {
				this.debugElement.style[key] = this.elementProperties[key];
			}

			_$("body").appendChild(this.debugElement);
		},
		log: function(str) {
			if(this.enabled) {
				this.debugElement.value = str + "\n" + this.debugElement.value;
				return true;
			}
			else {
				return false;
			}
		}
	},

	// This will contain the CSS to add to the DOM.
	addCSS = '';
	
	if(config.CosmicDebug) {
		CosmicDebug.init();
	}
	
	var changedFeedWidth = false;
	
	if(config.NoSideBar) {
		addCSS += ".guide-container,guide-background { display:none; }";
		addCSS += "#feed { margin-left:0px;width:970px; }";
		addCSS += "#feed-background { left:0px;width:970px; }";
		addCSS += ".feed-header { border-radius:4px 0px 0px 0px; }";
		
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
		addCSS += "#content { width:95%; }";
		addCSS += ".guide-layout-container { width:100%; }";
		addCSS += "#feed { width:-moz-calc(100% - 200px) !important;width:-webkit-calc(100% - 200px) !important; }";
		addCSS += "#feed-background { width:100% !important; }";
	}
	
	if(config.VisitedLinks) {
		addCSS += "a:visited { color:#00a; }";
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
		addCSS += "#video-sidebar { display:none; }";
		if(!changedFeedWidth)
			addCSS += "#feed,#feed-background { width:770px; }";
		
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
		addCSS += ".feed-item-show-aggregate { display:none !important; }";
	}
	
	var columns = [];
	
	addCSS += "." + (config.Categorize ? "cosmic-win-container" : "feed-item-main") + " { width:" + (100 / config.ColumnCount * 0.92) + "%;float:left;margin-left:10px; }";
	addCSS += ".feed-load-more-container { width:100%;float:left; }";
	
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
		// Padding for each video in pixels
		var feedItemPadding = 8;

		// Thumb
		addCSS += ".video-thumb {" +
							"	width:" + (config.SmallRowsHeight + 16) + "px;" +
							"	height:" + config.SmallRowsHeight + "px;" +
							"}";
		
		// Thumb Image
		addCSS += ".feed-item-thumb img {" +
							"	width:auto;" +
							"	height:" + config.SmallRowsHeight + "px;" +
							"	top:0px;" +
							"	left:8px;" +
							"}";
		
		// Main (feed) item
		addCSS += ".feed-item-main {" +
							"	padding: " + feedItemPadding + "px;" +
							"}";

		// Item Content
		addCSS += ".feed-item-content {" +
							"	margin-left:" + (config.SmallRowsHeight + 20) + "px !important;" +
							"	margin-right:0px !important;" +
							"	padding-top:0px;" +
							"}";
		
		// Item Title
		addCSS += ".feed-item-visual-content h4 {" +
							"	width:100% !important;" +
							"}";

		// Item time
		addCSS += ".feed-item-time {" +
							"	bottom:" + feedItemPadding + "px;" +
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
			CosmicDebug.log("'" + userName + "'");
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
		
		addCSS += ".feed-item-author { position:inherit !important; }";
		addCSS += ".feed-item-outer { padding:0px; }";
		addCSS += ".feed-item-time { top:inherit !important; bottom:0px; }";
		addCSS += ".feed-item-actions-line { padding-top:10px; }";
		
		for(uID in users) {
			CosmicDebug.log("Categorize: " + uID + " has " + users[uID].length + " videos.");
			
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
		addCSS += ".guide-item.selected,.guide-item.selected:hover { border-right:0px !important; }";
		addCSS += ".guide-item:hover { border-right:0px !important; }";
	}
	
	if(config.NoSecondUploader) {
		addCSS += ".metadata .yt-user-name { display:none; }";
	}
	
	if(config.NoAddTo) {
		addCSS += ".addto-button { display:none; }";
	}
	
	// Add our custom CSS to the DOM
	GM_addStyle(addCSS);
	
	CosmicDebug.log("Script successfully started.");
})();