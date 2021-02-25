// Saves options to extensionApi.storage
function save_options() {
  const settingsGuideMenu = document.getElementById('options-guide-menu').checked;
  const settingsDisableMP = document.getElementById('options-disable-mp').checked;
  const settingsDisableAnim = document.getElementById('options-disable-anim').checked;
  const settingsOldLogo = document.getElementById('options-old-logo').checked;
  const settingsListDisplay = document.getElementById('options-list-display').checked;
  chrome.storage.sync.set({
    settingsGuideMenu: settingsGuideMenu,
    settingsDisableMP: settingsDisableMP,
    settingsDisableAnim: settingsDisableAnim,
    settingsOldLogo: settingsOldLogo,
    settingsListDisplay: settingsListDisplay
  });
}

// Restores select box and checkbox state using the preferences
function restore_options() {
  chrome.storage.sync.get({
    settingsGuideMenu: true,
    settingsDisableMP: true,
    settingsDisableAnim: true,
    settingsOldLogo: false,
    settingsListDisplay: false
  }, function(items) {
    document.getElementById('options-guide-menu').checked = items.settingsGuideMenu;
    document.getElementById('options-disable-mp').checked = items.settingsDisableMP;
    document.getElementById('options-disable-anim').checked = items.settingsDisableAnim;
    document.getElementById('options-old-logo').checked = items.settingsOldLogo;
    document.getElementById('options-list-display').checked = items.settingsListDisplay;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById("options-guide-menu").addEventListener('click', save_options);
  document.getElementById("options-disable-mp").addEventListener('click', save_options);
  document.getElementById("options-disable-anim").addEventListener('click', save_options);
  document.getElementById("options-old-logo").addEventListener('click', save_options);
  document.getElementById("options-list-display").addEventListener('click', save_options);
});