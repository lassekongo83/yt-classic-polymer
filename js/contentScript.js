// Remove elements
document.querySelectorAll('ytd-miniplayer').forEach(el => el.remove());
document.querySelectorAll('#masthead-ad').forEach(el => el.remove());

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