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
  </q-page>
</template>

<script setup>
import { useSettingsStore } from "src/stores/settings-store";

const $settings = useSettingsStore();
</script>
