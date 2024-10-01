<template>
  <q-page class="row justify-center">
    <q-spinner v-if="loading" size="3rem" class="q-mt-xl" />
    <div v-if="!loading" class="column q-gutter-sm q-pa-md">
      <q-card>
        <q-card-section class="column" v-if="torrentFile.name">
          <span>Найден файл</span>
          <span class="text-bold"> {{ torrentFile.name }} </span>
        </q-card-section>
      </q-card>
      <q-btn label="Скачать" color="primary" @click="sendFiletoTransmission" />
      <span>{{ data }}</span>
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
const data = ref(null);
const torrentFile = reactive({});

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

async function sendFiletoTransmission() {
  const id = await getTransmissionID();
  const blobData = await blobToBase64(torrentFile.blob);
  const rawBlobData = blobData.split(",")[1].trim();
  const sendRequest = {
    method: "torrent-add",
    arguments: {
      "download-dir": $settings.downloadDir,
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
  }, 3000);
});
</script>
