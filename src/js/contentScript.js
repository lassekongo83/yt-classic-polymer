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
  const logo = document.querySelector('#logo-icon');
  const spritemap = chrome.runtime.getURL('../img/spritemap.png');
  const newLogo = document.createElement('div');
  checkElement('#logo-icon').then((selector) => {
    logo.replaceWith(newLogo);
    newLogo.style.width = "73px";
    newLogo.style.height = "30px";
    newLogo.style.backgroundImage = "url(" + spritemap + ")";
    newLogo.style.backgroundPosition = "-558px -346px";
    newLogo.style.backgroundSize = "auto";
  });
  if (document.querySelector('html[dark="true"]')) {
    newLogo.style.filter = "grayscale(1) invert(1)";
  }
}

// Apply settings
chrome.storage.sync.get({
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true,
  settingsOldLogo: false
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
});

// WIP: Old masthead appbar
// TODO:
// - Should only be available on a few page-subtypes. (Home, Subs, Trending, to start with)
// - Make it reappear when changing subpage from the guide menu.
// - Make the navigation buttons use yt navigation instead of reloading the document.
/*function oldAppbar() {
  //const homeText = chrome.i18n.getMessage('c_home');
  //const trendingText = chrome.i18n.getMessage('c_trending');
  const grid = document.querySelector('ytd-two-column-browse-results-renderer');
  // All items we'd like to add
  const navItems = [
    {href: '/', text: chrome.i18n.getMessage('c_home')},
    {href: '/feed/trending', text: chrome.i18n.getMessage('c_trending')},
  ];

  // A few variables for use later
  let navElem = document.createElement("div"),
    navList = document.createElement("ul"), 
    navItem, navLink;

  // add elements
  grid.parentNode.insertBefore(navElem, grid).appendChild(navList);
  //if (!navElem.length) {
  //  document.body.addEventListener("yt-navigate-finish", function(event) {
  //    grid.parentNode.insertBefore(navElem, grid).appendChild(navList);
  //  });
  //}

  // Cycle over each nav item
  for (let i = 0; i < navItems.length; i++) {
    // Create a fresh list item, and anchor
    navItem = document.createElement("li");
    navLink = document.createElement("a");

    // Set properties on anchor
    navLink.href = navItems[i].href;
    navLink.innerHTML = navItems[i].text;

    // Add anchor to list item, and list item to list
    navItem.appendChild(navLink);
    navList.appendChild(navItem);
  }

  // Add class and id to the elements
  navElem.id = "ytcp-main-appbar";
  navList.id = "ytcp-appbar-nav";
  navList.childNodes[0].className = "ytcp-nav-item";
  navList.childNodes[1].className = "ytcp-nav-item";
  navList.childNodes[0].id = "ytcp-nav-home";
  navList.childNodes[1].id = "ytcp-nav-trending";

  // Add list to body (or anywhere else)
  //window.onload = function () {
  //  document.body.appendChild(navElem);
  //}

  // style the elements
  function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }
  addStyle(`
    #ytcp-main-appbar{width:100%; text-align:center; line-height:40px; height:40px; border-bottom:1px solid #e8e8e8; background-color:#fff; position:fixed; z-index:500; font-size:13px; font-family:Roboto,arial,sans-serif;}
    .ytcp-nav-item{display:inline-block; margin-left:30px;}
    .ytcp-nav-item a{display:inline-block; color:#666; text-decoration: none;}
    .ytcp-nav-item a:hover{box-shadow:inset 0 -3px #cc181e;}
    [page-subtype="home"] #ytcp-nav-home a{box-shadow:inset 0 -3px #cc181e; color:#333;}
    [page-subtype="trending"] #ytcp-nav-trending a{box-shadow:inset 0 -3px #cc181e; color:#333;}
    [page-subtype="home"] ytd-two-column-browse-results-renderer, [page-subtype="trending"] ytd-two-column-browse-results-renderer, [page-subtype="subscriptions"] ytd-two-column-browse-results-renderer {margin-top:60px!important;}
    #ytcp-appbar-nav{display:inline-block; vertical-align:top; overflow:hidden;}
  `);
  //if (document.querySelector('html[dark="true"]')) { // TODO
  //}
}
oldAppbar();*/