<template>
  <div class="ranking">
      <h2>Ranking</h2>
      <div>
        <b-tabs content-class="mt-3" fill>
          <b-tab v-for="term in terms" :key="term" :title="rankingName(term)" @click="update(term)" active></b-tab>
        </b-tabs>
      </div>
      <b-spinner variant="secondary" v-if="isLoading"></b-spinner>
      <div v-show="!isLoading">
        <b-alert v-if="alert.length>0" show>{{alert}}</b-alert>     
        <HaikuListView :delegate="this"/>
      </div>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {HaikuRankingInterecter,Term, term} from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuListView, { HaikuListViewDelegate } from "@/components/HaikuListView.vue"
import {Auth} from '@/user/auth'

@Component({
    components: {
        HaikuListView
    }
})

export default class Ranking extends Vue implements HaikuListViewDelegate{
  private haikus: Haiku[] = []
  private interecter = HaikuRankingInterecter.getInstance()
  private isLoading = false
  private isFetching = false
  private alert = ""
  private queryRange = 12

  private auth = Auth.getInstance()
  private terms = term

  viewList(){
      return this.haikus
  }

  mounted(){
      this.update("date")
  }

  private rankingName(term: Term) {
    switch (term) {
      case "year":
        return "年間TOP6"
      case "month":
        return "月間TOP6"
      case "week":
        return "週間TOP6"
      case "date":
        return "本日のTOP6"
    }
  }

  private update(term: Term){
      if(!this.auth.currentUser){
        return
      }
      this.isLoading = true
      this.interecter.fetchLikeRanking(new Date, term)
        .then(result => {
            this.alert = ""
            this.haikus = result.haikus
        }).catch(err => {
            this.alert = err
        }).finally(() => {
            this.isLoading = false
        })
  }
}
</script>