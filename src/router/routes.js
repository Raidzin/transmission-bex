const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "popup",
        name: "popup",
        component: () => import("pages/PopupPage.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("pages/SettingsPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    name: "404",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
