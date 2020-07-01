<template>
  <div class="home">
      <b-spinner variant="secondary" v-if="isLoading"></b-spinner>
      <div v-show="!isLoading">
        <b-alert v-if="alert.length>0" show>{{alert}}</b-alert>
        <b-button @click="update"><b-icon icon="arrow-repeat"></b-icon></b-button>     
        <HaikuListView :delegate="this"/>
      </div>
      
      <b-overlay :show="isFetching" v-if="nextQuery" rounded="sm">
        <b-button @click="fetchNext" block>次の{{queryRange}}件</b-button>
      </b-overlay>

      <!-- fixed Buttons -->
      <b-button class="compose-btn" @click="compose"><b-icon icon="pencil"></b-icon><span class="d-none d-sm-inline">ここで一句</span></b-button>
      <HaikuComposeView :delegate="this"></HaikuComposeView>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HaikuInterecter, { FetchResult } from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuComposeView from "@/components/HaikuComposeView.vue";
import {ComposeViewDelegate} from "@/components/HaikuComposeView.vue"
import HaikuListView, { HaikuListViewDelegate } from "@/components/HaikuListView.vue"

@Component({
    components: {
        HaikuComposeView,
        HaikuListView
    }
})

export default class Home extends Vue implements ComposeViewDelegate, HaikuListViewDelegate{

  private haikus: Haiku[] = []
  private interecter: HaikuInterecter= HaikuInterecter.getInstance()
  private isLoading = false
  private isFetching = false
  private alert = ""
  private queryRange = 12

  private nextQuery: Promise<FetchResult> | null = null

  viewList(){
      return this.haikus
  }

  mounted(){
      this.update()
  }

  private fetchNext() {
      if (this.nextQuery == null){return}

      this.isFetching = true
      this.nextQuery
        .then(result => {
          console.log(result.haikus)
          this.haikus.splice(this.haikus.length, 0, ...result.haikus)
          this.nextQuery = result.nextQuery
          this.alert = ""
        }).catch(err => {
          this.alert = err
        }).finally(() => {
          this.isFetching = false
        })
  }

  private update(){
      this.isLoading = true
      this.interecter.fetchHaiku(this.queryRange)
        .then(result => {
            this.alert = ""
            this.haikus = result.haikus
            this.nextQuery = result.nextQuery
        }).catch(err => {
            this.alert = err
        }).finally(() => {
            this.isLoading = false
        })
  }

  private compose(){
      this.$bvModal.show('composeModal')
  }

  public composeEnd(newHaiku: Haiku): void {
     this.interecter.postHaiku(newHaiku)
        .then( (docRef) => {
            console.log(docRef)
            this.update()
        }).catch((error) => {
            this.alert = error as string
        })
      return
  }
}
</script>

<style scoped>
.compose-btn{
    position: fixed;
    top: 80px;
    right: max(50vw - 400px, 20px); 
    z-index: 99;
}

.mobile .compose-btn{
    top:auto;
    bottom: 10px;
}
</style>
