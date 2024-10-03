<template>
<<<<<<< HEAD
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
=======
  <q-layout view="hHh lpR fFf" style="width: 400px; height: 666px">
    <q-header elevated class="bg-primary text-white" height-hint="98">
>>>>>>> ec8cc50 (jellyfin download mode)
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
        <q-route-tab :to="{ name: 'index' }" icon="home" />
        <q-route-tab :to="{ name: 'settings' }" icon="settings" />
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
import { useQuasar } from "quasar";
import { useSettingsStore } from "src/stores/settings-store";

const $settings = useSettingsStore();
const $q = useQuasar();

onMounted(async () => {
  if ($settings.isAuth) {
    await api.updateTransmissionID().catch((err) => {
      console.error(err);
      $q.notify({ message: "Проверьте настройки сервера!", type: "warning" });
    });
  }
});
</script>
