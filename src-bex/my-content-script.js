// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

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
          name: decodeURIComponent(parts[2].split("=")[1]).slice(7),
          blob: await response.blob(),
        };
      })
      .then((data) => {
        responseData = data;
      });
    bridge.send("back.torrent.setUrl", responseData);
    respond();
  });
});
