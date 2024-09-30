<template>
  <q-page>
    <q-card>
      <q-card-section class="column q-gutter-sm">
        <q-btn label="Найти" color="primary" @click="findOnPage" />
        <q-btn label="Тест" color="primary" @click="testTransmission" />
        <span>{{ data }}</span>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

const $q = useQuasar();

const data = ref(null);

const url = "http://192.168.77.100:30096/transmission/rpc";
const auth = { username: "admin", password: "if6Urp1B090" };

async function getTransmissionID() {
  let id = null;
  await api.get(url, { auth: auth }).catch((err) => {
    id = err.response.headers["x-transmission-session-id"];
  });
  return id;
}

async function testTransmission() {
  const id = await getTransmissionID();
  await api
    .post(
      url,
      {
        method: "torrent-get",
        arguments: { fields: ["id", "name", "percentDone"] },
      },
      { auth: auth, headers: { "x-transmission-session-id": id } },
    )
    .then((response) => {
      $q.notify({ message: response.status, type: "positive" });
      data.value = response.data.arguments;
      console.log(response);
    });
}

async function findOnPage() {
  $q.bex.send("back.torrent.getUrl");
}

$q.bex.on("torrent.setUrl", ({ data, respond }) => {
  $q.notify({ message: `url = ${data}` });
  console.log(`[pop] get href ${data}`);
  respond();
});
</script>
