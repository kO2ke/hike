<template>
    <div>
        <b-spinner variant="secondary" v-if="isLoading">Loading....</b-spinner>
        <div v-if="!isLoading">
            <b-alert v-if="alert.length>0" show>{{alert}}</b-alert>
            <b-button @click="update"><b-icon icon="arrow-repeat"></b-icon></b-button>       
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <HaikuView class="col-7 col-sm-4 col-md-3 col-lg-2" v-for="haiku in viewList" :key="`haiku-${haiku.id}`" :haiku="haiku"></HaikuView>
                </div>
            </div>
        </div>

        <b-button class="compose-btn" @click="compose"><b-icon icon="pencil"></b-icon><span class="d-none d-sm-inline">ここで一句</span></b-button>

        <HaikuComposeView :delegate="this"></HaikuComposeView>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HaikuInterecter from "@/components/repogitory/HaikuInterecter";
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuView from "@/components/HaikuView.vue";
import HaikuComposeView from "@/components/HaikuComposeView.vue";
import {ComposeViewDelegate} from "@/components/HaikuComposeView.vue"

@Component({
    components: {
        HaikuView,
        HaikuComposeView
    }
})



export default class HaikuListView extends Vue implements ComposeViewDelegate{

  viewList: Haiku[] = []
  interecter: HaikuInterecter= HaikuInterecter.getInstance()
  isLoading = false
  alert = ""

  mounted(){
      this.update()
  }

  private update(){
      this.isLoading = true
      this.interecter.fetchAll()
        .then(haikus => {
            this.alert = ""
            this.viewList = haikus
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
        }).catch((error) => {
            this.alert = error as string
        })
      return
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .compose-btn{
    position: fixed;
    top: 10px;
    right: max(50vw - 400px, 20px); 
    z-index: 101;
}

.mobile .compose-btn{
    top:auto;
    bottom: 10px;
} */
</style>
