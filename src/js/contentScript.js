'use strict';

// -- GLOBAL FUNCTIONS -- //

// Wait for element helper
// https://stackoverflow.com/a/61511955
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

// Check if element was removed from DOM
// https://stackoverflow.com/a/50397148
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
// Usage onRemove(element, () => doSomething);

// Add style
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

// Click something
function clickButton(selector){
  let elm = document.querySelectorAll(selector)[0];
  if (elm){ elm.click(); }
}

// Remove the dark attribute from the masthead on the light theme when in theater mode
function lightHeader() {
  const lightMasthead = document.querySelector('html:not([dark]) ytd-masthead');
  if (lightMasthead !== null && lightMasthead.hasAttribute('dark')) {
    lightMasthead.removeAttribute('dark');
  }
  // Remove it when first enabled
  if (lightMasthead !== null) {
    document.querySelector('html:not([dark]) ytd-app').addEventListener('yt-set-theater-mode-enabled', () => {
      lightMasthead.removeAttribute('dark');
    });
  }
}
lightHeader();
document.querySelector('html:not([dark]) ytd-app').addEventListener('yt-visibility-refresh', lightHeader);

// -- OPTIONS -- //

// Disable miniplayer
function disableMP() {
  // autoclick the close button on the miniplayer when the progressbar is finished
  // yt-navigate-finish would be better, but it seems to be too fast
  document.addEventListener('transitionend', function(e) {
    if (document.getElementById('progress') !== null) {
      if (e.target.id === 'progress') {
        clickButton('.ytp-miniplayer-close-button');
      }
    }
  });
  // hide the miniplayer icon
  addStyle(`.ytp-miniplayer-button {display:none!important;}`);
}

// Collapse guide menu
function hideGuide() {
  const appDrawer = document.querySelector('tp-yt-app-drawer#guide');
  if (window.location.pathname != "/watch" && appDrawer.hasAttribute('opened') && appDrawer !== null) {
    appDrawer.removeAttribute('opened');
  }
}

// Disable live thumbnail previews
function disablePreview() {
  const noLivePreview = document.createElement('style')
  noLivePreview.innerHTML = "ytd-thumbnail #mouseover-overlay {display:none!important;}";
  document.body.appendChild(noLivePreview);
}

// 2015 logo replacer
function logotype() {
  const spritemap = chrome.runtime.getURL('../img/spritemap.png');
  waitForElm('yt-icon.ytd-topbar-logo-renderer').then(function(elm) {
    elm.style.backgroundImage = "url(" + spritemap + ")";
    document.querySelector('#contentContainer.tp-yt-app-drawer yt-icon.ytd-topbar-logo-renderer').style.backgroundImage = "url(" + spritemap + ")";
  });
  addStyle(`yt-icon.ytd-topbar-logo-renderer{width:73px!important; height:30px!important; background-position:-558px -346px!important; background-size:auto!important;}
html[dark="true"] yt-icon.ytd-topbar-logo-renderer{filter:grayscale(1) invert(1)!important;} yt-icon.ytd-topbar-logo-renderer svg{display:none!important;}`);
}

// Display channel /user/x/videos as a list
function listDisplay() {
  addStyle(`[page-subtype="channels"] #items.ytd-grid-renderer{flex-direction:column!important;}
[page-subtype="channels"] ytd-grid-video-renderer #dismissable{display:flex!important;}
[page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-video-renderer.ytd-grid-renderer{min-width:fit-content!important;}
[page-subtype="channels"] #details.ytd-grid-video-renderer{min-width:100%;margin-left:10px;}
[page-subtype="channels"] ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{font-size:15px!important;}
`);
}

// Old horizontal navigation bar
// TODO: Make the navigation buttons use yt navigation instead of reloading the document
function navBar() {
  // All items we'd like to add
  const navItems = [
    {href: '/', text: chrome.i18n.getMessage('c_home')},
    {href: '/feed/trending', text: chrome.i18n.getMessage('c_trending')},
    {href: '/feed/subscriptions', text: chrome.i18n.getMessage('c_subs')},
  ];

  // A few variables for use later
  let navElem = document.createElement("div"),
    navList = document.createElement("ul"), 
    navItem, navLink;

  // Cycle over each nav item
  for (let i = 0; i < navItems.length; i++) {
    // Create a fresh list item, and anchor
    navItem = document.createElement("li");
    navLink = document.createElement("a");

    // Set properties on anchor
    navLink.href = navItems[i].href;
    navLink.innerHTML = navItems[i].text;

    // Add anchor to list item, and list item to list
    navItem.appendChild(navLink);
    navList.appendChild(navItem);
  }

  // Insert the elments
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

  // Add classes to the elements
  navElem.className = "ytcp-main-appbar";
  navList.className = "ytcp-appbar-nav";
  navList.childNodes[0].className = "ytcp-nav-home ytcp-nav-item";
  navList.childNodes[1].className = "ytcp-nav-trending ytcp-nav-item";
  navList.childNodes[2].className = "ytcp-nav-subs ytcp-nav-item";
}
// Insert the old nav menu again when navigating
function navBarNavigation() {
  document.body.addEventListener('yt-navigate-finish', () => {
    navBar();

    // Remove the old ones, or they'll keep being added to the DOM forever
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
// make room for the nav menu
function makeRoom() {
  addStyle(`[page-subtype="home"] ytd-two-column-browse-results-renderer,[page-subtype="trending"] ytd-two-column-browse-results-renderer,[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer{margin-top:60px!important;} [page-subtype="trending"] tp-yt-app-header{top:60px!important;}`);
}

// Options to replace infinite scrolling with a "Load more" button on selected elements
function homeScroll() {
  const homeBtn = document.createElement('button');
  homeBtn.classList.add("ytcp-load-more-button");
  homeBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="home"] ytd-rich-grid-renderer').then(function(elm) {
    if (elm !== null) {
      elm.appendChild(homeBtn);
      // Remove newly inserted buttons on yt-navigation-finish, otherwise there will be a lot of buttons. There's probably a better way to do this.
      for(const next of document.body.querySelectorAll('.ytcp-load-more-button')) {
        if(next.nextElementSibling) {
          next.nextElementSibling.remove();
        }
      }
    }

    const homeButton = document.querySelector('[page-subtype="home"] .ytcp-load-more-button');
    homeButton.onclick = function() {
      // Workaround: quickly removing and inserting the element again to make it load new items without the user having to hover a thumbnail for it to start
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
        // Stop the infinite loading when the user scrolls down
        window.addEventListener('scroll', function() {
          document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer').style.visibility = 'hidden';
        });
      }
      // Remove the button when no more results are available
      function removeHomeScrollButton() {
        if (document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer') === null) {
          homeButton.remove();
        }
      }
      onRemove(document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer'), () => removeHomeScrollButton());
    };
  });
}
function stopHomeScroll() { // CSS to always block the infinite scrolling and getting rid of the "ghost-cards"
  addStyle(`[page-subtype="home"] #contents.ytd-rich-grid-renderer ytd-continuation-item-renderer{height:1px; visibility:hidden;} [page-subtype="home"] ytd-continuation-item-renderer #ghost-cards{display:none;}`);
}

// Channel videos
function channelScroll() {
  const channelGrid = document.querySelector('[role="main"][page-subtype="channels"] #contents.ytd-section-list-renderer');
  const channelBtn = document.createElement('button');
  channelBtn.classList.add("ytcp-load-more-button");
  channelBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer').then(function(elm) {
    if (channelGrid !== null) {
      // FIXME: Button not available if user clicks twice on "videos" tab
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

// Option to replace infinite scroll on the related videos section
function relScroll() {
  waitForElm('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer').then(function(elm) {
    const related = document.querySelector('#items.ytd-watch-next-secondary-results-renderer');
    const relbtn = document.createElement('button');
    relbtn.className = "ytcp-load-more-button ytcp-related";
    relbtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
    if (related !== null) {
      related.appendChild(relbtn);
      document.querySelector('ytd-watch-next-secondary-results-renderer').addEventListener('can-show-more-changed', () => {
        related.appendChild(relbtn);
      });
      // FIXME: Not sure this is the best event listener to use. Also need to figure out how to create it again when navigating backwards.
      // The button may also sometimes require 2 clicks
      document.addEventListener('yt-visibility-refresh', function(e) {
        if (relbtn !== null) {
          related.appendChild(relbtn);
        }
      });
    }
    const relButton = document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer .ytcp-load-more-button');
    if (relButton !== null) {
      relButton.onclick = function() {
        const relCont = document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer');
        const relItems = document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer');
        if (relCont !== null) {
          relCont.remove();
        }
        if (relItems !== null) {
          relItems.append(relCont);
        }
        if (relCont !== null) {
          relCont.style.visibility = 'visible';
        }
        window.addEventListener('scroll', function() {
          if (document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer') !== null) {
            document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer').style.visibility = 'hidden';
          }
        });
      };
    }
    function removeRelatedScrollButton() {
      if (document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer') === null) {
        relButton.remove();
      }
    }
    onRemove(document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer'), () => removeRelatedScrollButton());
  });
}
function stopRelScroll() {
  addStyle(`[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer{visibility:hidden;}`);
}

// Disable scrolling on fullscreen videos
function fullScreenScroll() {
  document.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('no-scroll')) {
      e.preventDefault();
    }
  }, { passive: false });

  addStyle(`.ytp-fullerscreen-edu-button {display:none!important;}`);
}

// Option to restore browser default scrollbar
function restoreScrollbar() {
  document.body.removeAttribute('standardized-themed-scrollbar');
  // For Firefox
  document.querySelector('html').removeAttribute('standardized-themed-scrollbar');
  Element.prototype.removeAttributes = function(...attrs) {
    attrs.forEach(attr => this.removeAttribute(attr));
  }
  document.querySelector('ytd-app').removeAttributes('scrollbar-rework', 'standardized-themed-scrollbar');
}

// Option to autopause the channel trailer
function channelAutoplay() {
  waitForElm('[role="main"][page-subtype="channels"] ytd-channel-video-player-renderer video').then(function(elm) {
    if (elm !== null) {
      elm.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
    }
  });
}

// Option to autopause videos to prevent autoplay
function preventAutoplay() {
  if (window.location.href.indexOf("/watch?") > -1) {
    waitForElm('ytd-watch-flexy[role="main"] .html5-main-video').then(function(elm) {
      document.querySelectorAll('.html5-main-video').forEach(vid => vid.pause());
    });
  }
}

// Apply settings
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
  settingsRelScroll: false,
  settingsFullScreenScroll: false
}, function (settings) {
  if (true === settings.settingsRestoreScroll) {
    restoreScrollbar();
    // For some reason this is required on /watch pages in new tabs
    document.querySelector('ytd-app').addEventListener('yt-visibility-refresh', restoreScrollbar);
  }
  if (true === settings.settingsDisableMP) {
    disableMP();
  }
  if (true === settings.settingsGuideMenu) {
    hideGuide();
    window.addEventListener('yt-navigate-finish', hideGuide);
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
  if (true === settings.settingsRelScroll) {
    relScroll();
    stopRelScroll();
  }
  if (true === settings.settingsFullScreenScroll) {
    fullScreenScroll();
  }
});
