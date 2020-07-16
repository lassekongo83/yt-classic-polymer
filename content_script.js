//var style = document.createElement('link');
//style.rel = 'stylesheet';
//style.type = 'text/css';
//style.href = chrome.extension.getURL('youtube.css');
//(document.head||document.documentElement).appendChild(style);

// Remove elements
document.querySelectorAll('ytd-miniplayer').forEach(el => el.remove());
document.querySelectorAll('#masthead-ad').forEach(el => el.remove());
//document.querySelectorAll('ytd-mini-guide-renderer').forEach(el => el.remove());
//document.querySelectorAll('link[name="www-main-desktop-home-page-skeleton"]').forEach(el => el.remove());

// I have no idea what these do, but removing them seems to somewhat improve performance ?
//document.querySelectorAll('yt-mdx-manager').forEach(el => el.remove());
//document.querySelectorAll('yt-activity-manager').forEach(el => el.remove());
//document.querySelectorAll('yt-gfeedback-manager').forEach(el => el.remove());