// Settings page button
document.addEventListener('DOMContentLoaded', function() {
  const openOptions = document.getElementById('settings-button');
  openOptions.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  }, false);
}, false);