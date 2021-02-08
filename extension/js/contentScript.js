'use strict';
const checkElement = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise( resolve => requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector);
};
function disableMP() {
  function clickButton(selector){
    let elm = document.querySelectorAll(selector)[0];
    if (elm){ elm.click(); }
  }
  function clickIt(){
    clickButton('.ytp-miniplayer-close-button');
  }
  document.addEventListener('transitionend', function(e) {
    checkElement('#progress').then((selector) => {
      if (e.target.id === 'progress') {
        clickIt();
      }
    });
  });
  if (window.location.pathname === "/watch") {
    document.querySelector('.ytp-miniplayer-button').style.display = "none";
  }
  document.body.addEventListener("yt-navigate-finish", function(event) {
    if (document.getElementsByClassName('ytp-miniplayer-button').length) {
      document.querySelector('.ytp-miniplayer-button').style.display = "none";
    }
  });
}
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
function disablePreview() {
  const noLivePreview = document.createElement('style')
  noLivePreview.innerHTML = "ytd-thumbnail #mouseover-overlay {display:none!important;}";
  document.body.appendChild(noLivePreview);
}
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
