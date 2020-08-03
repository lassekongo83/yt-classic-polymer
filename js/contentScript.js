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
// Disabled for now because it needs localization and dark theme crap
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
  newList.className = 'old_menu';
  document.getElementById("masthead").appendChild(newList);
  items.forEach(function (item) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    li.className = 'old_menuitem';
    link.innerText = item.text;
    link.href = item.url;
    li.appendChild(link);
    newList.appendChild(li)
  });
}
const addCSS = s =>(d=>{d.head.appendChild(d.createElement("style")).innerHTML=s})(document);
addCSS(".old_menu{ height:40px; border-bottom:1px solid #e8e8e8; display:flex; justify-content:center; align-items:center;}")
addCSS(".old_menuitem a{ box-sizing:border-box; color:#666; font-size:13px; text-decoration:none; line-height:40px; font-weight:500; font-family:'YouTube Noto',Roboto,arial,sans-serif;}")
addCSS(".old_menuitem a:hover{ box-shadow:inset 0 -3px #f00; color:#333;}")
addCSS(".old_menuitem{ display:inline-flex; flex-direction:column; margin-left:30px; height:40px; justify-content:center; align-items:center;}")
buildList();
*/