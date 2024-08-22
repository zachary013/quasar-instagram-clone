<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn to="/camera" class="large-screen-only q-mr-sm" size="18px" flat round dense icon="eva-camera-outline" />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold" @click="$router.replace('/')">
          Instagram
        </q-toolbar-title>
        <q-btn to="/" flat round dense icon="eva-home-outline" size="18px" class="large-screen-only" />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white small-screen-only" bordered>
      <q-tabs class="text-grey-10" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/" icon="eva-search-outline" />
        <q-route-tab to="/" icon="eva-plus-square-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
        <q-route-tab to="/" icon="eva-person-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});
</script>

<style lang="scss">
.q-toolbar {
  @media (min-width: $breakpoint-sm-min) {
    height: 77px;
  }
}

.q-toolbar__title {
  font-size: 30px;

  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
  }
}

.q-footer .q-tab__icon {
  font-size: 30px;
}
</style>
