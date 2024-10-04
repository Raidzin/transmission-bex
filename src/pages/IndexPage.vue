<template>
  <q-page padding class="row justify-center">
    <q-spinner v-if="loading" size="3rem" class="q-mt-xl" />
    <div v-if="!loading" class="column justify-between">
      <div class="q-gutter-sm">
        <q-card flat bordered>
          <q-card-section class="column" v-if="torrentFile.name">
            <span
              class="text-bold"
              style="font-size: large; text-overflow: ellipsis"
            >
              {{ torrentFile.name }}
            </span>
          </q-card-section>
        </q-card>
        <q-select
          v-if="$settings.downloadMode.startsWith('jellyfin')"
          label="Тип контента"
          outlined
          emit-value
          map-options
          v-model="jellyfinContentType"
          :options="jellyfinContentTypes"
        >
        </q-select>
        <q-toggle
          v-if="$settings.downloadMode.endsWith('multiuser')"
          label="Скачать в персональную папку"
          v-model="isPersonalDownload"
        ></q-toggle>
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
      <q-btn label="Скачать" color="primary" @click="sendFileToTransmission" />
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

const isPersonalDownload = ref(true);
const jellyfinContentType = ref("movies");
const jellyfinContentTypes = ref([
  { label: "Сериал", value: "shows" },
  { label: "Фильм", value: "movies" },
]);
const isShowSeason = ref(false);
const showTitle = ref("");
const showSeason = ref(1);

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function createMultiuserDir(baseDir) {
  if (!isPersonalDownload.value) {
    return `${baseDir}/all`;
  } else {
    return `${baseDir}/${$settings.downloadUsername}`;
  }
}

function createJellyfinDir(baseDir) {
  if (!isShowSeason.value) {
    return `${baseDir}/${jellyfinContentType.value}`;
  } else {
    return `${baseDir}/${jellyfinContentType.value}/${showTitle.value}/season-${showSeason.value}`;
  }
}

function getDownloadDir() {
  switch ($settings.downloadMode) {
    case "single":
      return $settings.downloadDir;
    case "jellyfin":
      return createJellyfinDir($settings.downloadDir);
    case "jellyfin-multiuser":
      return createJellyfinDir(createMultiuserDir($settings.downloadDir));
  }
}

async function sendFileToTransmission() {
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
