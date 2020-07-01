<template>
  <div class="home">
    <HaikuListView/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HaikuInterecter from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuView from "@/components/HaikuView.vue";
import HaikuComposeView from "@/components/HaikuComposeView.vue";
import {ComposeViewDelegate} from "@/components/HaikuComposeView.vue"

export default class Mypage extends Vue{
    
}
</script>