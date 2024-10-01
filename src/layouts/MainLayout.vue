<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      <q-tabs align="left">
        <q-route-tab :to="{ name: 'popup' }" icon="home" />
        <q-route-tab :to="{ name: 'settings' }" icon="settings" />
        <!-- <q-route-tab to="/page3" label="Page Three" /> -->
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar class="row justify-end">
        <q-btn
          href="https://github.com/raidzin"
          target="_blank"
          label="by Raidzin"
          no-caps
          flat
          color="light"
        ></q-btn>
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
