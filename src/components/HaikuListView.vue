<template>
    <div>
        <button @click="update">update</button>       
        <h1 v-if="isLoading">Loading....</h1>
        <div class="container-fluid">
            <div class="row">
                <HaikuView class="col-3" v-for="haiku in viewList" v-bind:key="haiku.id" v-bind:haiku="haiku"></HaikuView>
            </div>
        </div>
        <button data-toggle="modal" data-target="#composeModal" @click="compose">ここで一句</button>
        
        <HaikuComposeView :delegate="this"></HaikuComposeView>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HaikuInterecter from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuView from "@/components/HaikuView.vue";
import HaikuComposeView from "@/components/HaikuComposeView.vue";
import {ComposeViewDelegate} from "@/components/HaikuComposeView.vue";

@Component({
    components: {
        HaikuView,
        HaikuComposeView
    }
})



export default class HaikuListView extends Vue implements ComposeViewDelegate{

  viewList: Haiku[] = []
  interecter: HaikuInterecter= new HaikuInterecter()
  isLoading = false

  private isCompose = false

  public update(){
      this.isLoading = true
      this.interecter.fetchAll((haikuList)=>{
          this.viewList = haikuList
          console.log(this.viewList)
          this.isLoading = false
      })
  }

  private compose(){
      this.isCompose = true;
  }

  public composeEnd(newHaiku: Haiku): void {
      console.log(newHaiku)
      this.isCompose = false
      return
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
