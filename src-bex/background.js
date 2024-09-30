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
  bridge.on("log", ({ data, respond }) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []));
    respond();
  });

  bridge.on("back.torrent.setUrl", ({ data, respond }) => {
    bridge.send("torrent.setUrl", data);
    respond();
  });
});
