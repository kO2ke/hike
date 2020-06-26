<template>
    <div>
        <b-spinner variant="secondary" v-if="isLoading">Loading....</b-spinner>
        <div v-if="!isLoading">
            <b-button @click="update"><b-icon icon="arrow-repeat"></b-icon></b-button>       
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <HaikuView class="col-7 col-sm-4 col-md-3 col-lg-2" v-for="haiku in viewList" v-bind:key="haiku.id" v-bind:haiku="haiku"></HaikuView>
                </div>
            </div>
        </div>

        <b-button class="compose-btn" @click="compose"><b-icon icon="pencil"></b-icon>ここで一句</b-button>

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

  public update(){
      this.isLoading = true
      this.interecter.fetchAll((haikuList)=>{
          this.viewList = haikuList
          console.log(this.viewList)
          this.isLoading = false
      })
  }

  private compose(){
      this.$bvModal.show('composeModal')
  }

  public composeEnd(newHaiku: Haiku): void {
     this.interecter.postHaiku(newHaiku, (haikus)=>{
         this.viewList = haikus
         this.isLoading = false
     })
      return
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.compose-btn{
    position: fixed;
    top: 10px;
    right: max(50vw - 400px, 100px); 
    z-index: 101;
}
</style>
