<template>
  <div class="mypage">
      <h2>お気に入りの俳句</h2>
      <b-spinner variant="secondary" v-if="isLoading"></b-spinner>
      <div v-show="!isLoading">
        <b-alert v-if="alert.length>0" show>{{alert}}</b-alert>
        <b-button @click="update"><b-icon icon="arrow-repeat"></b-icon></b-button>     
        <HaikuListView :delegate="this"/>
      </div>    
      <b-overlay :show="isFetching" v-if="nextQuery" rounded="sm">
        <b-button @click="fetchNext" block>次の{{queryRange}}件</b-button>
      </b-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HaikuInterecter, { FetchResult } from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuListView, { HaikuListViewDelegate } from "@/components/HaikuListView.vue"
import {Auth} from '@/user/auth'

@Component({
    components: {
        HaikuListView
    }
})

export default class Mypage extends Vue implements HaikuListViewDelegate{
  private haikus: Haiku[] = []
  private interecter: HaikuInterecter= HaikuInterecter.getInstance()
  private isLoading = false
  private isFetching = false
  private alert = ""
  private queryRange = 12

  private nextQuery: Promise<FetchResult> | null = null

  private auth = Auth.getInstance()

  viewList(){
      return this.haikus
  }

  mounted(){
      if(!this.auth.currentUser){
        this.$router.push("/")
      }
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
      if(!this.auth.currentUser){
        return
      }
      this.isLoading = true
      this.interecter.fetchHaikuWithLikedBy(this.auth.currentUser.uid, this.queryRange)
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
}
</script>