import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref, watch } from "vue";

const authKey = "authData";
const apiUrlKey = "ApiUrl";
const downloadDirKey = "downloadDir";
const downloadModeKey = "downloadMode";

export const useSettingsStore = defineStore("settings", () => {
  const localStorageAuth = LocalStorage.getItem(authKey);
  const localStorageApiUrl = LocalStorage.getItem(apiUrlKey);
  const localStorageDownloadDir = LocalStorage.getItem(downloadDirKey);
  const localStorageDownloadMode = LocalStorage.getItem(downloadModeKey);

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
  const apiUrl = ref(localStorageApiUrl ? localStorageApiUrl : "");
  const downloadDir = ref(
    localStorageDownloadDir ? localStorageDownloadDir : "",
  );
  const downloadMode = ref(
    localStorageDownloadMode ? localStorageDownloadMode : "single",
  );

  const isAuth = computed(() => {
    return auth.value.username && auth.value.password;
  });

  function save() {
    LocalStorage.setItem(authKey, auth.value);
    LocalStorage.setItem(apiUrlKey, apiUrl.value);
    LocalStorage.setItem(downloadDirKey, downloadDir.value);
    LocalStorage.setItem(downloadModeKey, downloadMode.value);
    api.defaults.auth = auth.value;
  }
  return { auth, apiUrl, downloadDir, downloadMode, isAuth, save };
});
