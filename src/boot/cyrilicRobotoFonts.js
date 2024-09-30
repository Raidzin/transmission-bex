import { boot } from "quasar/wrappers";

export default boot(async (/* { app, router, ... } */) => {
  require("@openfonts/roboto_cyrillic-ext");
});
