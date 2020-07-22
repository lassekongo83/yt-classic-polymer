// Remove elements
document.querySelectorAll('#masthead-ad').forEach(el => el.remove());

// actually disable the miniplayer
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
      document.querySelector('#movie_player video').parentNode.removeChild(document.querySelector('#movie_player video'));
    }
  });
})();

//insert elements
// Disabled for now because it needs localization
/*
var items = [{
  text: "Home",
  url: "/"
}, {
  text: "Popular",
  url: "/feed/trending"
}, {
  text: "Subscriptions",
  url: "/feed/subscriptions"
}]

function buildList(){
    var newList = document.createElement("ul");
    document.getElementById("masthead").appendChild(newList);

    items.forEach(function (item) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.innerText = item.text;
        link.href = item.url;
        li.appendChild(link);
        newList.appendChild(li)
    });
}

buildList();
*/