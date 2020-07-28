chrome.webRequest.onBeforeRequest.addListener(
  function(){ return {cancel: true}; },
  //info => info.initiator === 'https://www.youtube.com' && { redirectUrl: 'data:,' },
  {
    urls: [
      // animated thumbnails
      "*://i.ytimg.com/an_webp/*",
      // promo image
      "*://www.gstatic.com/youtube/img/promos/*",
      // miniplayer script
      "*://www.youtube.com/s/player/*/player_ias.vflset/*/miniplayer.js",
      // skeleton stylesheets
      "*://www.youtube.com/yts/cssbin/www-main-desktop-home-page-skeleton*",
      "*://www.youtube.com/yts/cssbin/www-main-desktop-watch-page-skeleton*"
    ],
    types: ["image", "script", "stylesheet"]
  },
  ["blocking"]
);