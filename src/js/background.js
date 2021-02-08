chrome.webRequest.onBeforeRequest.addListener(
  function(){ return {cancel: true}; },
  {
    urls: [
      // animated thumbnails
      //"*://i.ytimg.com/an_webp/*",
      // promo image
      "*://www.gstatic.com/youtube/img/promos/*",
      // miniplayer script
      "*://www.youtube.com/s/player/*/player_ias.vflset/*/miniplayer.js",
      // skeleton stylesheets
      "*://www.youtube.com/*/cssbin/www-main-desktop-home-page-skeleton*",
      "*://www.youtube.com/*/cssbin/www-main-desktop-watch-page-skeleton*"
    ],
    types: ["image", "script", "stylesheet"]
  },
  ["blocking"]
);

// Page action to only display the popup menu on youtube
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('https://www.youtube.com') == 0) {
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
