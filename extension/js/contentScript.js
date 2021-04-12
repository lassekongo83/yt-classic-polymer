'use strict';
function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
function onRemove(element, callback) {
  const parent = element.parentNode;
  if (!parent) throw new Error("The node must already be attached");
  const obs = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const el of mutation.removedNodes) {
        if (el === element) {
          obs.disconnect();
          callback();
        }
      }
    }
  });
  obs.observe(parent, {
    childList: true,
  });
}
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}
function clickButton(selector){
  let elm = document.querySelectorAll(selector)[0];
  if (elm){ elm.click(); }
}
function disableMP() {
  document.addEventListener('transitionend', function(e) {
    if (document.getElementById('progress') !== null) {
      if (e.target.id === 'progress') {
        clickButton('.ytp-miniplayer-close-button');
      }
    }
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
      if (document.querySelectorAll('tp-yt-app-drawer#guide')[0].hasAttribute('opened')) {
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
function logotype() {
  const spritemap = chrome.runtime.getURL('../img/spritemap.png');
  document.getElementById('logo-icon').style.backgroundImage = "url(" + spritemap + ")";
  document.querySelector('#masthead #logo-icon svg').style.display = "none";
  addStyle(`#masthead #logo-icon{width:73px!important; height:30px!important; background-position:-558px -346px!important; background-size:auto!important;}
html[dark="true"] #masthead #logo-icon{filter:grayscale(1) invert(1)!important;}`);
}
function listDisplay() {
  addStyle(`[page-subtype="channels"] #items.ytd-grid-renderer{flex-direction:column!important;}
[page-subtype="channels"] ytd-grid-video-renderer #dismissable{display:flex!important;}
[page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer{min-width:fit-content!important;}
[page-subtype="channels"] #details.ytd-grid-video-renderer{min-width:100%;margin-left:10px;}
[page-subtype="channels"] ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{font-size:15px!important;}
`);
}
function navBar() {
  const navItems = [
    {href: '/', text: chrome.i18n.getMessage('c_home')},
    {href: '/feed/trending', text: chrome.i18n.getMessage('c_trending')},
    {href: '/feed/subscriptions', text: chrome.i18n.getMessage('c_subs')},
  ];
  let navElem = document.createElement("div"),
    navList = document.createElement("ul"),
    navItem, navLink;
  for (let i = 0; i < navItems.length; i++) {
    navItem = document.createElement("li");
    navLink = document.createElement("a");
    navLink.href = navItems[i].href;
    navLink.innerHTML = navItems[i].text;
    navItem.appendChild(navLink);
    navList.appendChild(navItem);
  }
  const homeGrid = document.querySelector('ytd-browse[role="main"][page-subtype="home"]');
  const trendGrid = document.querySelector('ytd-browse[role="main"][page-subtype="trending"]');
  const subGrid = document.querySelector('ytd-browse[role="main"][page-subtype="subscriptions"]');
  if (homeGrid !== null) {
    homeGrid.appendChild(navElem).appendChild(navList);
  }
  if (trendGrid !== null) {
    trendGrid.appendChild(navElem).appendChild(navList);
  }
  if (subGrid !== null) {
    subGrid.appendChild(navElem).appendChild(navList);
  }
  navElem.className = "ytcp-main-appbar";
  navList.className = "ytcp-appbar-nav";
  navList.childNodes[0].className = "ytcp-nav-home ytcp-nav-item";
  navList.childNodes[1].className = "ytcp-nav-trending ytcp-nav-item";
  navList.childNodes[2].className = "ytcp-nav-subs ytcp-nav-item";
}
function navBarNavigation() {
  document.body.addEventListener('yt-navigate-finish', () => {
    navBar();
    for(const next of document.body.querySelectorAll('.ytcp-main-appbar')) {
      if(next.nextElementSibling) {
        next.nextElementSibling.remove();
      }
    }
    const nav = document.querySelector('[hidden] .ytcp-main-appbar');
    if (nav !== null) {
      nav.remove();
    }
  });
}
function makeRoom() {
  addStyle(`[page-subtype="home"] ytd-two-column-browse-results-renderer,[page-subtype="trending"] ytd-two-column-browse-results-renderer,[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer{margin-top:60px!important;} [page-subtype="trending"] tp-yt-app-header{top:60px!important;}`);
}
function homeScroll() {
  const homeBtn = document.createElement('button');
  homeBtn.classList.add("ytcp-load-more-button");
  homeBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="home"] ytd-rich-grid-renderer').then(function(elm) {
    if (elm !== null) {
      elm.appendChild(homeBtn);
      for(const next of document.body.querySelectorAll('.ytcp-load-more-button')) {
        if(next.nextElementSibling) {
          next.nextElementSibling.remove();
        }
      }
    }
    const homeButton = document.querySelector('[page-subtype="home"] .ytcp-load-more-button');
    homeButton.onclick = function() {
      const homeCont = document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer > ytd-continuation-item-renderer');
      const richGrid = document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer');
      if (homeCont !== null) {
        homeCont.remove();
      }
      if (richGrid !== null) {
        richGrid.append(homeCont);
      }
      if (homeCont !== null) {
        document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer').style.visibility = 'visible';
        window.addEventListener('scroll', function() {
          document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer').style.visibility = 'hidden';
        });
      }
      function removeHomeScrollButton() {
        if (document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer') === null) {
          homeButton.remove();
        }
      }
      onRemove(document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer'), () => removeHomeScrollButton());
    };
  });
}
function stopHomeScroll() {
  addStyle(`[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer{height:1px; visibility:hidden;} [page-subtype="home"] ytd-continuation-item-renderer #ghost-cards{display:none;}`);
}
function channelScroll() {
  const channelGrid = document.querySelector('[role="main"][page-subtype="channels"] #contents.ytd-section-list-renderer');
  const channelBtn = document.createElement('button');
  channelBtn.classList.add("ytcp-load-more-button");
  channelBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer').then(function(elm) {
    if (channelGrid !== null) {
      channelGrid.appendChild(channelBtn);
      for(const next of document.body.querySelectorAll('.ytcp-load-more-button')) {
        if(next.nextElementSibling) {
          next.nextElementSibling.remove();
        }
      }
    }
    const channelButton = document.querySelector('[page-subtype="channels"] .ytcp-load-more-button');
    channelButton.onclick = function() {
      const channelCont = document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer > ytd-continuation-item-renderer');
      const channelRichGrid = document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer');
      if (channelCont !== null) {
        channelCont.remove();
      }
      if (channelRichGrid !== null) {
        channelRichGrid.append(channelCont);
      }
      if (document.querySelector('[role="main"][page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer') !== null) {
        channelCont.style.visibility = 'visible';
        window.addEventListener('scroll', function() {
          document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer').style.visibility = 'hidden';
        });
      }
      function removeChannelScrollButton() {
        if (document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer') === null) {
          channelButton.remove();
        }
      }
      onRemove(document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer'), () => removeChannelScrollButton());
    };
  });
}
function stopChannelScroll() {
  addStyle(`[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer{height:1px; visibility:hidden;} [page-subtype="channels"] ytd-continuation-item-renderer #ghost-cards{display:none;}`);
}
function fullScreenScroll() {
  document.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('no-scroll')) {
      e.preventDefault();
    }
  }, { passive: false });
  addStyle(`.ytp-fullerscreen-edu-button {display:none!important;}`);
}
function restoreScrollbar() {
  document.body.removeAttribute('standardized-themed-scrollbar');
  document.querySelector('html').removeAttribute('standardized-themed-scrollbar');
  Element.prototype.removeAttributes = function(...attrs) {
    attrs.forEach(attr => this.removeAttribute(attr));
  }
  document.querySelector('ytd-app').removeAttributes('scrollbar-rework', 'standardized-themed-scrollbar');
}
function channelAutoplay() {
  waitForElm('[role="main"][page-subtype="channels"] ytd-channel-video-player-renderer video').then(function(elm) {
    if (elm !== null) {
      elm.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
    }
  });
}
function preventAutoplay() {
  if (window.location.href.indexOf("/watch?") > -1) {
    waitForElm('ytd-watch-flexy[role="main"] .html5-main-video').then(function(elm) {
      document.querySelectorAll('.html5-main-video').forEach(vid => vid.pause());
    });
  }
}
chrome.storage.sync.get({
  settingsRestoreScroll: true,
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true,
  settingsChannelAutoplay: true,
  settingsPreventAutoplay: false,
  settingsOldLogo: false,
  settingsListDisplay: false,
  settingsOldNavBar: false,
  settingsHomeScroll: false,
  settingsChannelScroll: false,
  settingsFullScreenScroll: false
}, function (settings) {
  if (true === settings.settingsRestoreScroll) {
    restoreScrollbar();
    document.querySelector('ytd-app').addEventListener('yt-visibility-refresh', restoreScrollbar);
  }
  if (true === settings.settingsDisableMP) {
    disableMP();
  }
  if (true === settings.settingsGuideMenu) {
    hideGuide();
  }
  if (true === settings.settingsDisableAnim) {
    disablePreview();
  }
  if (true === settings.settingsPreventAutoplay) {
    preventAutoplay();
    document.querySelector('ytd-app').addEventListener('yt-visibility-refresh', preventAutoplay);
  }
  if (true === settings.settingsChannelAutoplay) {
    channelAutoplay();
  }
  if (true === settings.settingsOldLogo) {
    logotype();
  }
  if (true === settings.settingsListDisplay) {
    listDisplay();
  }
  if (true === settings.settingsOldNavBar) {
    navBar();
    navBarNavigation();
    makeRoom();
  }
  if (true === settings.settingsHomeScroll) {
    stopHomeScroll();
    homeScroll();
    window.addEventListener('yt-navigate-finish', homeScroll, { passive: true });
  }
  if (true === settings.settingsChannelScroll) {
    stopChannelScroll();
    channelScroll();
    window.addEventListener('yt-navigate-finish', channelScroll, { passive: true });
  }
  if (true === settings.settingsFullScreenScroll) {
    fullScreenScroll();
  }
});
