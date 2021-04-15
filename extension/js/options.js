function save_options() {
  const settingsRestoreScroll = document.getElementById('options-scrollbar').checked;
  const settingsGuideMenu = document.getElementById('options-guide-menu').checked;
  const settingsDisableMP = document.getElementById('options-disable-mp').checked;
  const settingsDisableAnim = document.getElementById('options-disable-anim').checked;
  const settingsChannelAutoplay = document.getElementById('options-channel-autoplay').checked;
  const settingsPreventAutoplay = document.getElementById('options-video-autoplay').checked;
  const settingsOldLogo = document.getElementById('options-old-logo').checked;
  const settingsListDisplay = document.getElementById('options-list-display').checked;
  const settingsOldNavBar = document.getElementById('options-navbar').checked;
  const settingsHomeScroll = document.getElementById('options-homescroll').checked;
  const settingsChannelScroll = document.getElementById('options-channelscroll').checked;
  const settingsRelScroll = document.getElementById('options-relscroll').checked;
  const settingsFullScreenScroll = document.getElementById('options-fs-scroll').checked;
  chrome.storage.sync.set({
    settingsRestoreScroll: settingsRestoreScroll,
    settingsGuideMenu: settingsGuideMenu,
    settingsDisableMP: settingsDisableMP,
    settingsDisableAnim: settingsDisableAnim,
    settingsChannelAutoplay: settingsChannelAutoplay,
    settingsPreventAutoplay: settingsPreventAutoplay,
    settingsOldLogo: settingsOldLogo,
    settingsListDisplay: settingsListDisplay,
    settingsOldNavBar: settingsOldNavBar,
    settingsHomeScroll: settingsHomeScroll,
    settingsChannelScroll: settingsChannelScroll,
    settingsRelScroll: settingsRelScroll,
    settingsFullScreenScroll: settingsFullScreenScroll
  });
}
function restore_options() {
  chrome.storage.sync.get({
    settingsRestoreScroll: true,
    settingsGuideMenu: true,
    settingsDisableMP: true,
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
  }, function(items) {
    document.getElementById('options-scrollbar').checked = items.settingsRestoreScroll;
    document.getElementById('options-guide-menu').checked = items.settingsGuideMenu;
    document.getElementById('options-disable-mp').checked = items.settingsDisableMP;
    document.getElementById('options-disable-anim').checked = items.settingsDisableAnim;
    document.getElementById('options-channel-autoplay').checked = items.settingsChannelAutoplay;
    document.getElementById('options-video-autoplay').checked = items.settingsPreventAutoplay;
    document.getElementById('options-old-logo').checked = items.settingsOldLogo;
    document.getElementById('options-list-display').checked = items.settingsListDisplay;
    document.getElementById('options-navbar').checked = items.settingsOldNavBar;
    document.getElementById('options-homescroll').checked = items.settingsHomeScroll;
    document.getElementById('options-channelscroll').checked = items.settingsChannelScroll;
    document.getElementById('options-relscroll').checked = items.settingsRelScroll;
    document.getElementById('options-fs-scroll').checked = items.settingsFullScreenScroll;
  });
}
document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById("options-scrollbar").addEventListener('click', save_options);
  document.getElementById("options-guide-menu").addEventListener('click', save_options);
  document.getElementById("options-disable-mp").addEventListener('click', save_options);
  document.getElementById("options-disable-anim").addEventListener('click', save_options);
  document.getElementById("options-channel-autoplay").addEventListener('click', save_options);
  document.getElementById("options-video-autoplay").addEventListener('click', save_options);
  document.getElementById("options-old-logo").addEventListener('click', save_options);
  document.getElementById("options-list-display").addEventListener('click', save_options);
  document.getElementById("options-navbar").addEventListener('click', save_options);
  document.getElementById("options-homescroll").addEventListener('click', save_options);
  document.getElementById('options-channelscroll').addEventListener('click', save_options);
  document.getElementById('options-relscroll').addEventListener('click', save_options);
  document.getElementById('options-fs-scroll').addEventListener('click', save_options);
});
