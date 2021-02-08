const manifestData = chrome.runtime.getManifest();
const versionString = 'v' + manifestData.version;
document.getElementById('version').innerText = versionString;