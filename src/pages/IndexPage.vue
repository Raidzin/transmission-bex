<template>
  <q-page class="row justify-center">
    <q-spinner v-if="loading" size="3rem" class="q-mt-xl" />
    <div v-if="!loading" class="column q-gutter-sm q-pa-md justify-between">
      <div class="q-gutter-sm">
        <q-card flat bordered>
          <q-card-section class="column" v-if="torrentFile.name">
            <span class="text-bold" style="font-size: large">
              {{ torrentFile.name }}
            </span>
          </q-card-section>
        </q-card>
        <q-select
          v-if="$settings.downloadMode == 'jellyfin'"
          label="Тип контента"
          outlined
          emit-value
          map-options
          v-model="jellyfinContentType"
          :options="jellyfinContentTypes"
        >
        </q-select>
        <q-toggle
          v-if="jellyfinContentType == 'shows'"
          label="Конкретный сезон"
          v-model="isShowSeason"
        ></q-toggle>
        <div
          class="row no-wrap"
          v-if="jellyfinContentType == 'shows' && isShowSeason"
        >
          <q-input
            label="Название Сериала"
            outlined
            v-model="showTitle"
            class="q-mr-sm"
          ></q-input>
          <q-input
            label="Сезон"
            outlined
            v-model.number="showSeason"
            type="number"
          ></q-input>
        </div>
      </div>
      <q-btn label="Скачать" color="primary" @click="sendFiletoTransmission" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useSettingsStore } from "src/stores/settings-store";

const $q = useQuasar();
const $settings = useSettingsStore();

const loading = ref(true);
const torrentFile = reactive({});

const jellyfinContentType = ref("movies");
const jellyfinContentTypes = ref([
  { label: "Сериал", value: "shows" },
  { label: "Фильм", value: "movies" },
]);
const isShowSeason = ref(false);
const showTitle = ref("");
const showSeason = ref(1);

async function getTransmissionID() {
  let id = null;
  await api.get($settings.apiUrl).catch((err) => {
    id = err.response.headers["x-transmission-session-id"];
  });
  return id;
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function createJellyfinDir() {
  if (!isShowSeason.value) {
    return `${$settings.downloadDir}/${jellyfinContentType.value}`;
  } else {
    return `${$settings.downloadDir}/${jellyfinContentType.value}/${showTitle.value}/season-${showSeason.value}`;
  }
}

function getDownloadDir() {
  switch ($settings.downloadMode) {
    case "single":
      return $settings.downloadDir;
    case "jellyfin":
      return createJellyfinDir();
  }
}

async function sendFiletoTransmission() {
  let downloadDir = getDownloadDir();
  const blobData = await blobToBase64(torrentFile.blob);
  const rawBlobData = blobData.split(",")[1].trim();
  const sendRequest = {
    method: "torrent-add",
    arguments: {
      "download-dir": downloadDir,
      metainfo: rawBlobData,
    },
  };
  await api.post($settings.apiUrl, sendRequest).then((response) => {
    console.log(response);
    if (response.data.result != "success") {
      $q.notify({
        message: `[Ошибка] ${response.data.result}`,
        type: "negative",
      });
      return;
    }
    $q.notify({ message: "Загрузка начата", type: "positive" });
  });
}

async function findOnPage() {
  $q.bex.send("back.torrent.getUrl");
}

$q.bex.on("torrent.setUrl", ({ data, respond }) => {
  Object.assign(torrentFile, data);
  loading.value = false;
  respond();
});

onMounted(() => {
  loading.value = true;
  $q.bex.send("back.torrent.getUrl");
  setTimeout(() => {
    if (loading.value) {
      $q.notify({ message: "Не удались найти ссылку", type: "negative" });
      loading.value = false;
    }
  }, 5000);
});
</script>
