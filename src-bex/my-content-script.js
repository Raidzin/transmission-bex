import { bexContent } from "quasar/wrappers";

const baseURL = "https://rutracker.org/forum";

export default bexContent((bridge) => {
  bridge.on("torrent.getUrl", async ({ data, respond }) => {
    const el = document.getElementsByClassName("dl-stub dl-link dl-topic");
    const attr = el[0].getAttribute("href", 2);
    let responseData = "ololo no async";
    await fetch(`${baseURL}/${attr}`, {
      method: "GET",
    })
      .then(async (response) => {
        const header = response.headers.get("Content-Disposition");
        const parts = header.split(";");
        return {
          name: decodeURIComponent(parts[2].split("=")[1]),
          blob: await response.blob(),
        };
      })
      .then((data) => {
        console.log("content fetched");
        console.log(data.name);
        responseData = data;
      });
    bridge.send("back.torrent.setUrl", responseData);
    respond();
  });
});
