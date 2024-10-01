import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref, watch } from "vue";

const authKey = "authData";
const apiUrlKey = "ApiUrl";
const downloadDirKey = "downloadDir";

export const useSettingsStore = defineStore("settings", () => {
  const localStorageAuth = LocalStorage.getItem(authKey);
  const localStorageApiUrl = LocalStorage.getItem(apiUrlKey);
  const localStorageDowndloadDir = LocalStorage.getItem(downloadDirKey);

  if (
    localStorageAuth &&
    localStorageAuth.username &&
    localStorageAuth.password
  ) {
    api.defaults.auth = localStorageAuth;
  }

  const auth = ref(
    localStorageAuth ? localStorageAuth : { username: null, password: null },
  );
  const apiUrl = ref(localStorageApiUrl);
  const downloadDir = ref(localStorageDowndloadDir);

  const isAuth = computed(() => {
    return auth.value.username && auth.value.password;
  });

  function save() {
    LocalStorage.setItem(authKey, auth.value);
    LocalStorage.setItem(apiUrlKey, apiUrl.value);
    LocalStorage.setItem(downloadDirKey, downloadDir.value);
    api.defaults.auth = auth.value;
  }
  return { auth, apiUrl, downloadDir, isAuth, save };
});
