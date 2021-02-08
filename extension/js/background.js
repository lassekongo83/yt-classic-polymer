chrome.webRequest.onBeforeRequest.addListener(
  function(){ return {cancel: true}; },
  {
    urls: [
      "*://www.gstatic.com/youtube/img/promos/*",
      "*://www.youtube.com/s/player/*/player_ias.vflset/*/miniplayer.js",
      "*://www.youtube.com/*/cssbin/www-main-desktop-home-page-skeleton*",
      "*://www.youtube.com/*/cssbin/www-main-desktop-watch-page-skeleton*"
    ],
    types: ["image", "script", "stylesheet"]
  },
  ["blocking"]
);
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('https://www.youtube.com') == 0) {
    chrome.pageAction.show(tabId);
  }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
