<template>
  <q-page padding class="q-gutter-sm">
    <q-input
      label="Логин"
      v-model="$settings.auth.username"
      @update:model-value="$settings.save()"
    ></q-input>
    <q-input
      label="Пароль"
      v-model="$settings.auth.password"
      type="password"
      @update:model-value="$settings.save()"
    ></q-input>
    <q-input
      label="Transmission API URL"
      v-model="$settings.apiUrl"
      @update:model-value="$settings.save()"
    ></q-input>
    <q-input
      label="Transmission Download DIR"
      v-model="$settings.downloadDir"
      @update:model-value="$settings.save()"
    ></q-input>
    <q-page-sticky position="bottom-right" :offset="[10, 10]">
      <q-btn label="Тест" @click="testTransmission" color="accent"></q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useSettingsStore } from "src/stores/settings-store";

const $settings = useSettingsStore();
const $q = useQuasar();

async function testTransmission() {
  await api
    .post($settings.apiUrl, {
      method: "torrent-get",
      arguments: { fields: ["id", "name", "percentDone"] },
    })
    .then((response) => {
      $q.notify({ message: "Подключение успешно!", type: "positive" });
    });
}
</script>
