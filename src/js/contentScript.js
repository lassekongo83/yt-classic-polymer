'use strict';

// Check if element exists
const checkElement = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise( resolve =>  requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector); 
};
// usage
//checkElement('.some-element').then((selector) => {
//  console.log(selector);
//});

// Add style
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

// Disable miniplayer
function disableMP() {
  function clickButton(selector){
    let elm = document.querySelectorAll(selector)[0];
    if (elm){ elm.click(); }
  }

  function clickIt(){
    clickButton('.ytp-miniplayer-close-button');
  }

  //setInterval(clickIt, 1000);

  // autoclick the close button on the miniplayer when the progressbar is finished
  document.addEventListener('transitionend', function(e) {
    checkElement('#progress').then((selector) => {
      if (e.target.id === 'progress') {
        clickIt();
      }
    });
  });

  // hide the miniplayer icon
  if (window.location.pathname === "/watch") {
    document.querySelector('.ytp-miniplayer-button').style.display = "none";
  }
  document.body.addEventListener("yt-navigate-finish", function(event) {
    if (document.getElementsByClassName('ytp-miniplayer-button').length) {
      document.querySelector('.ytp-miniplayer-button').style.display = "none";
    }
  });
}

// Collapse guide menu
function hideGuide() {
  if (window.location.pathname != "/watch") {
    document.getElementById('guide-button').click(function() {
      if (document.querySelectorAll('app-drawer#guide')[0].hasAttribute('opened')) {
        setTimeout(function(){
          document.getElementById('input-subs-autocomplete').focus();
        },50);
      }
    });
  }
}

// Disable live thumbnail previews
function disablePreview() {
  const noLivePreview = document.createElement('style')
  noLivePreview.innerHTML = "ytd-thumbnail #mouseover-overlay {display:none!important;}";
  document.body.appendChild(noLivePreview);
}

// 2015 logo replacer
function logotype() {
  const spritemap = chrome.runtime.getURL('../img/spritemap.png');
  document.getElementById('logo-icon').style.backgroundImage = "url(" + spritemap + ")";
  document.querySelector('#masthead #logo-icon svg').style.display = "none";
  addStyle(`#masthead #logo-icon{width:73px!important; height:30px!important; background-position:-558px -346px!important; background-size:auto!important;}
html[dark="true"] #masthead #logo-icon{filter:grayscale(1) invert(1)!important;}`);
}

// Display channel /user/x/videos as a list
function listDisplay() {
  addStyle(`[page-subtype="channels"] #items.ytd-grid-renderer{flex-direction:column!important;}
[page-subtype="channels"] ytd-grid-video-renderer #dismissable{display:flex!important;}
[page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer{min-width:fit-content!important;}
[page-subtype="channels"] #details.ytd-grid-video-renderer{min-width:100%;margin-left:10px;}
[page-subtype="channels"] ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{font-size:15px!important;}
`);
}

// Apply settings
chrome.storage.sync.get({
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true,
  settingsOldLogo: false,
  settingsListDisplay: false
}, function (settings) {
  if (true === settings.settingsDisableMP) {
    disableMP();
  }
  if (true === settings.settingsGuideMenu) {
    hideGuide();
  }
  if (true === settings.settingsDisableAnim) {
    disablePreview();
  }
  if (true === settings.settingsOldLogo) {
    logotype();
  }
  if (true === settings.settingsListDisplay) {
    listDisplay();
  }
});

// WIP: Old masthead appbar
// TODO:
// - Should only be available on a few page-subtypes. (Home, Subs, Trending, to start with)
// - Make it reappear when changing subpage from the guide menu.
// - Make the navigation buttons use yt navigation instead of reloading the document.
/*function oldAppbar() {
  // All items we'd like to add
  const navItems = [
    {href: '/', text: chrome.i18n.getMessage('c_home')},
    {href: '/feed/trending', text: chrome.i18n.getMessage('c_trending')},
  ];

  // A few variables for use later
  let navElem = document.createElement("div"),
    navList = document.createElement("ul"), 
    navItem, navLink;

  // Cycle over each nav item
  for (let i = 0; i < navItems.length; i++) {
    // Create a fresh list item, and anchor
    navItem = document.createElement("li");
    navLink = document.createElement("a");

    // Set properties on anchor
    navLink.href = navItems[i].href;
    navLink.innerHTML = navItems[i].text;

    // add class to li
    navItem.className = "ytcp-nav-item";

    // Add anchor to list item, and list item to list
    navItem.appendChild(navLink);
    navList.appendChild(navItem);
  }

  // add elements
  const grid = document.querySelector('ytd-browse[page-subtype="home"], ytd-browse[page-subtype="trending"], ytd-browse[page-subtype="subscriptions"]');
  grid.appendChild(navElem).appendChild(navList); // FIXME: Not visible on trending and subs that are dynamic and created in the page-manager when navigating
  //grid.parentNode.insertBefore(navElem, grid).appendChild(navList);
  //addEventListener('yt-page-data-updated', () => {
  //  homeGrid.parentNode.insertBefore(navElem, homeGrid).appendChild(navList);
  //});

  // Add class and id to the elements
  navElem.id = "ytcp-main-appbar";
  navList.id = "ytcp-appbar-nav";
  navList.childNodes[0].id = "ytcp-nav-home";
  navList.childNodes[1].id = "ytcp-nav-trending";

  // Add list to body (or anywhere else)
  //window.onload = function () {
  //  document.body.appendChild(navElem);
  //}

  // style the elements
  addStyle(`#ytcp-main-appbar{width:100%; text-align:center; line-height:40px; height:40px; border-bottom:1px solid #e8e8e8; background-color:#fff; position:fixed; z-index:500; font-size:13px; font-family:Roboto,arial,sans-serif;}
.ytcp-nav-item{display:inline-block; margin-left:30px;}
.ytcp-nav-item a{display:inline-block; color:#666; text-decoration: none;}
.ytcp-nav-item a:hover{box-shadow:inset 0 -3px #cc181e;}
[page-subtype="home"] #ytcp-nav-home a{box-shadow:inset 0 -3px #cc181e; color:#333;}
[page-subtype="trending"] #ytcp-nav-trending a{box-shadow:inset 0 -3px #cc181e; color:#333;}
[page-subtype="home"] ytd-two-column-browse-results-renderer, [page-subtype="trending"] ytd-two-column-browse-results-renderer, [page-subtype="subscriptions"] ytd-two-column-browse-results-renderer {margin-top:60px!important;}
#ytcp-appbar-nav{display:inline-block; vertical-align:top; overflow:hidden;}`);
  //if (document.querySelector('html[dark="true"]')) { // TODO
  //}
}
oldAppbar();*/