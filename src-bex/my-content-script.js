import { bexContent } from "quasar/wrappers";

export default bexContent((bridge) => {
  bridge.on("torrent.getUrl", ({ data, respond }) => {
    const el = document.getElementsByClassName("dl-stub dl-link dl-topic");
    const attr = el[0].getAttribute("href");
    console.log("content found", attr);
    bridge.send("back.torrent.setUrl", attr);
    respond();
  });
});
