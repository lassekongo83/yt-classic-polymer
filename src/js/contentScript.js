// Remove elements
document.querySelectorAll('#masthead-ad').forEach(el => el.remove());

// Disable the miniplayer
// userscript from u/IStoleThePies
(function() {
  document.body.addEventListener("yt-navigate-finish", function(event) {
    if (document.getElementsByTagName('ytd-miniplayer').length) {
      document.querySelector('ytd-miniplayer').parentNode.removeChild(document.querySelector('ytd-miniplayer'));
    }
    if (document.getElementsByClassName('ytp-miniplayer-button').length) {
      document.querySelector('.ytp-miniplayer-button').parentNode.removeChild(document.querySelector('.ytp-miniplayer-button'))
    }
    if (window.location.pathname != "/watch") {
      let mp = document.querySelector('#movie_player video') !== null;
      if (mp) {
        document.querySelector('#movie_player video').parentNode.removeChild(document.querySelector('#movie_player video'));
      } else {} // no miniplayer found
    }
  });
})();