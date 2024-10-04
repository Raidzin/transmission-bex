import { bexBackground } from "quasar/wrappers";

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on("back.torrent.getUrl", ({ data, respond }) => {
    bridge.send("torrent.getUrl", data);
    respond();
  });

  bridge.on("back.torrent.setUrl", ({ data, respond }) => {
    bridge.send("torrent.setUrl", data);
    respond();
  });
});
