'use strict';

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
}

// Apply settings
chrome.storage.sync.get({
  settingsRestoreScroll: true,
  settingsDisableMP: true,
  settingsGuideMenu: true,
  settingsDisableAnim: true,
  settingsOldLogo: false,
  settingsListDisplay: false,
  settingsOldNavBar: false
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
});

// TODO
// Observer to see which page the user is on
// Should be helpful to add the "Load more" buttons to the DOM when yt-navigate-finish completes.
/*async function pageHome() {
  const ytdBrowse = document.querySelector('ytd-browse[role="main"]');
  const gridObserver = new MutationObserver(mutations => {
    mutations.every(_ => {
      if (ytdBrowse.getAttribute('page-subtype') == 'home') {
        console.log('page-subtype is home');
        gridObserver.disconnect();
      }
      if (ytdBrowse.getAttribute('page-subtype') == 'subscriptions') {
        console.log('page-subtype is subscriptions');
        gridObserver.disconnect();
      }
      if (ytdBrowse.getAttribute('page-subtype') == 'trending') {
        console.log('page-subtype is trending');
        gridObserver.disconnect();
      }
    });
  });

  // FIXME: May have to observe pathname instead
  if(window.location.pathname.indexOf('/watch') !== null) {
    gridObserver.observe(ytdBrowse, {
      attributes: true,
      subtree: true
    });
  }
}
window.addEventListener('yt-navigate-finish', pageHome, { passive: true });*/

// Options to replace infinite scrolling with a "Load more" button on selected elements
/*function startScroll() {
  document.querySelector('ytd-continuation-item-renderer').style.visibility = 'visible';
}
// Called after clicking the load more button to stop the infinite scroll once again
function stopScroll() {
  if (document.querySelector('ytd-continuation-item-renderer') !== null) {
    document.querySelector('ytd-continuation-item-renderer').style.visibility = 'hidden';
  }
}
function homeScroll() { // Option to replace it on the home grid
  // stop scroll by making ytd-continuation-item-renderer invisible
  // removing it would be preferable, but it keeps reinserting itself
  const gridstopper = document.createElement('style');
  gridstopper.innerHTML = '[page-subtype="home"] ytd-continuation-item-renderer {visibility:hidden; height:1px;}';
  document.body.appendChild(gridstopper);

  const grid = document.querySelector('[page-subtype="home"] ytd-rich-grid-renderer');
  const btn = document.createElement('button');
  btn.classList.add("ytcp-load-more-button");
  btn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  // FIXME: Will only work if user started the navigation on the home grid, as the grid is created as the user navigates there
  if (grid !== null) {
    grid.appendChild(btn);
    // insert the button again when navigating to the home grid
    window.addEventListener('yt-navigate-finish', () => {
      grid.appendChild(btn);
    });
  }

  const button = document.querySelector('.ytcp-load-more-button');
  if (button !== null) {
    button.onclick = function() {
      // Workaround: quickly removing and inserting the element again to make it load new items without the user having to hover a thumbnail for it to start
      const cont = document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer > ytd-continuation-item-renderer');
      const richGrid = document.querySelector('[page-subtype="home"] #contents.ytd-rich-grid-renderer');
      if (cont !== null) {
        cont.remove();
      }
      if (richGrid !== null) {
        richGrid.append(cont);
      }
      startScroll();
      // Stop the infinite loading when the user scrolls down
      window.addEventListener('scroll', stopScroll, { passive: true });
    };
  }
}
homeScroll();*/

// Channel videos
/*function channelScroll() {
  const channelstopper = document.createElement('style');
  channelstopper.innerHTML = '[page-subtype="channels"] ytd-continuation-item-renderer {visibility:hidden; height:1px;}';
  document.body.appendChild(channelstopper);

  const channelGrid = document.querySelector('[page-subtype="channels"] ytd-grid-renderer');
  const channelBtn = document.createElement('button');
  channelBtn.classList.add("ytcp-load-more-button");
  channelBtn.innerHTML = chrome.i18n.getMessage('c_loadmore');
  if (channelGrid !== null) {
    channelGrid.appendChild(channelBtn);
    document.querySelector('ytd-page-manager').addEventListener('yt-page-manager-navigate-start', () => {
      channelGrid.appendChild(channelBtn);
    });
  }

  const chanButton = document.querySelector('.ytcp-load-more-button');
  const chanCont = document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer > ytd-continuation-item-renderer');
  const chanGrid = document.querySelector('[page-subtype="channels"] #items.ytd-grid-renderer');
  if (chanButton !== null || chanCont !== null) {
    chanButton.onclick = function() {
      if (chanCont !== null) {
        chanCont.remove();
      }
      if (chanGrid !== null) {
        chanGrid.append(chanCont);
      }
      startScroll();
      window.addEventListener('scroll', stopScroll, { passive: true });
    };
  }
}
channelScroll();*/

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