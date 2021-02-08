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
  /*document.body.addEventListener("yt-navigate-finish", function(event) {
    if (document.getElementsByTagName('ytd-miniplayer').length) {
      document.querySelector('ytd-miniplayer').parentNode.removeChild(document.querySelector('ytd-miniplayer'));
    }
    if (document.getElementsByClassName('ytp-miniplayer-button').length) {
      document.querySelector('.ytp-miniplayer-button').style.display = "none";
    }
    if (window.location.pathname != "/watch") {
      if (document.querySelector('#movie_player video') !== null) {
        document.querySelector('#movie_player video').parentNode.removeChild(document.querySelector('#movie_player video'));
      }
    }
  });*/

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

// Apply settings
chrome.storage.sync.get({
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true
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
});
