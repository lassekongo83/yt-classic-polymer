chrome.webRequest.onBeforeRequest.addListener(
  function(){ return {cancel: true}; },
  {
    urls: [
      "*://i.ytimg.com/an_webp/*",
      "*://www.gstatic.com/youtube/img/promos/*",
      "*://www.youtube.com/s/player/*/player_ias.vflset/*/miniplayer.js",
      "*://www.youtube.com/yts/cssbin/www-main-desktop-home-page-skeleton*",
      "*://www.youtube.com/yts/cssbin/www-main-desktop-watch-page-skeleton*"
    ],
    types: ["image", "script", "stylesheet"]
  },
  ["blocking"]
);
