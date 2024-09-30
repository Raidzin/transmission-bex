import { bexBackground } from "quasar/wrappers";

chrome.browserAction.onClicked.addListener((/* tab */) => {
  // Opens our extension in a new browser window.
  // Only if a popup isn't defined in the manifest.
  chrome.tabs.create(
    {
      url: chrome.extension.getURL("www/index.html"),
    },
    (/* newTab */) => {
      // Tab opened.
    },
  );
});

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on("back.torrent.getUrl", ({ data, respond }) => {
    bridge.send("torrent.getUrl");
    console.log("[bg] get back.torrent.getUrl");
    respond();
  });

  bridge.on("back.torrent.setUrl", ({ data, respond }) => {
    bridge.send("torrent.setUrl", data);
    console.log(`[bg] get back.torrent.setUrl ${data}`);
    respond();
  });
});
