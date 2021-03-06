'use strict';

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

// Add style
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

// Disable miniplayer
function disableMP() {
  function clickButton(selector){
    let elm = document.querySelectorAll(selector)[0];
    if (elm){ elm.click(); }
  }

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
      if (document.querySelectorAll('tp-yt-app-drawer#guide')[0].hasAttribute('opened')) {
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

// 2015 logo replacer
function logotype() {
  const spritemap = chrome.runtime.getURL('../img/spritemap.png');
  document.getElementById('logo-icon').style.backgroundImage = "url(" + spritemap + ")";
  document.querySelector('#masthead #logo-icon svg').style.display = "none";
  addStyle(`#masthead #logo-icon{width:73px!important; height:30px!important; background-position:-558px -346px!important; background-size:auto!important;}
html[dark="true"] #masthead #logo-icon{filter:grayscale(1) invert(1)!important;}`);
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
  addStyle(`[page-subtype="home"] ytd-two-column-browse-results-renderer,[page-subtype="trending"] ytd-two-column-browse-results-renderer,[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer{margin-top:60px!important;}`);
}

// Option to restore browser default scrollbar
function restoreScrollbar() {
  document.body.removeAttribute('themed-scrollbar');
  // For Firefox
  document.querySelector('html').removeAttribute('themed-scrollbar');
  Element.prototype.removeAttributes = function(...attrs) {
    attrs.forEach(attr => this.removeAttribute(attr));
  }
  document.querySelector('ytd-app').removeAttributes('scrollbar-rework', 'scrollbar-color');
}

// Options to replace infinite scrolling with a "Load more" button on selected elements
function homeScroll() {
  // stop infinite scrolling by hiding the element
  waitForElm('[role="main"][page-subtype="home"] ytd-continuation-item-renderer').then(
    elm => elm.style.visibility = 'hidden'
  );

  const homeGrid = document.querySelector('[role="main"][page-subtype="home"] ytd-rich-grid-renderer');
  const homeBtn = document.createElement('button');
  homeBtn.classList.add("ytcp-load-more-button");
  homeBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="home"] ytd-rich-grid-renderer').then(function(elm) {
    if (homeGrid !== null) {
      homeGrid.appendChild(homeBtn);
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
    };
  });
}

// Channel videos
/*function channelScroll() {
  waitForElm('[role="main"][page-subtype="channels"] ytd-continuation-item-renderer').then(
    elm => elm.style.visibility = 'hidden'
  );

  const channelGrid = document.querySelector('[role="main"][page-subtype="channels"] #contents.ytd-section-list-renderer');
  const channelBtn = document.createElement('button');
  channelBtn.classList.add("ytcp-load-more-button");
  channelBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  waitForElm('[role="main"][page-subtype="channels"] #items.ytd-grid-renderer').then(function(elm) {
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
      // FIXME: Element is still null on some pages
      if (document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer') !== null) {
        document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer').style.visibility = 'visible';
        window.addEventListener('scroll', function() {
          document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer ytd-continuation-item-renderer').style.visibility = 'hidden';
        });
      }
    };
  });
}
channelScroll();
window.addEventListener('yt-navigate-finish', channelScroll, { passive: true });*/

// Option to replace it on the related videos section
/*function relatedScroll() {
  const related = document.querySelector('ytd-watch-next-secondary-results-renderer .ytd-item-section-renderer:not(ytd-continuation-item-renderer)');
  const relCont = document.querySelector('#items.ytd-watch-next-secondary-results-renderer ytd-continuation-item-renderer');
  const relatedElement = document.querySelector('#items.ytd-watch-next-secondary-results-renderer');


  const relstopper = document.createElement('style');
  relstopper.innerHTML = 'ytd-watch-next-secondary-results-renderer ytd-continuation-item-renderer {visibility:hidden;}';
  document.body.appendChild(relstopper);

  const related = document.querySelector('#items.ytd-watch-next-secondary-results-renderer');
  const relbtn = document.createElement('button');
  relbtn.className = "ytcp-load-more-button ytcp-related";
  relbtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  if (related !== null) {
    related.appendChild(relbtn);
    window.addEventListener('yt-navigate-finish', () => {
      related.appendChild(relbtn);
    });
    document.querySelector('ytd-watch-next-secondary-results-renderer').addEventListener('can-show-more-changed', () => {
      related.appendChild(relbtn);
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
      //startScroll();
      if (relCont !== null) {
        relCont.style.visibility = 'visible';
      }
      //window.addEventListener('scroll', stopScroll, { passive: true });
      window.addEventListener('scroll', function() {
        document.querySelector('[is-watch-page] #items.ytd-watch-next-secondary-results-renderer > ytd-continuation-item-renderer').style.visibility = 'hidden';
      });
    };
  }
}
//relatedScroll();*/

// Apply settings
chrome.storage.sync.get({
  settingsRestoreScroll: true,
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true,
  settingsOldLogo: false,
  settingsListDisplay: false,
  settingsOldNavBar: false,
  settingsHomeScroll: false
}, function (settings) {
  if (true === settings.settingsRestoreScroll) {
    restoreScrollbar();
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
    homeScroll();
    window.addEventListener('yt-navigate-finish', homeScroll, { passive: true });
  }
});