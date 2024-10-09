<template>
  <q-card flat bordered>
    <q-card-section class="text-bold">
      {{ torrentFile.name }}
    </q-card-section>
  </q-card>
</template>

<script setup>
const { torrentFile } = defineProps(["torrentFile"]);
</script>
