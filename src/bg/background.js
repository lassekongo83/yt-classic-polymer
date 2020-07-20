chrome.webRequest.onBeforeRequest.addListener(
  function(){ return {cancel: true}; },
  {
    urls: [
      // grid avatars and animated thumbnails
      "*://yt3.ggpht.com/a-/*",
      "*://i.ytimg.com/an_webp/*",
      // miniplayer
      "*://www.youtube.com/s/player/*/player_ias.vflset/*/miniplayer.js"
    ],
    types: ["image", "script"]
  },
  ["blocking"]
);