<template>
  <q-layout view="hHh lpR fFf" style="width: 300px; height: 500px">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> Transmission UI </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab :to="{ name: 'popup' }" label="Main" />
        <q-route-tab :to="{ name: 'settings' }" label="Settings" />
        <!-- <q-route-tab to="/page3" label="Page Three" /> -->
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="row">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>by Raidzin</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted } from "vue";
import { api } from "src/boot/axios";
import { useSettingsStore } from "src/stores/settings-store";

const $settings = useSettingsStore();

async function getTransmissionID() {
  let id = null;
  await api.get($settings.apiUrl).catch((err) => {
    if (err.response.status == 409) {
      id = err.response.headers["x-transmission-session-id"];
    }
  });
  return id;
}

onMounted(async () => {
  const id = await getTransmissionID();
  api.defaults.headers.common["x-transmission-session-id"] = id;
});
</script>
