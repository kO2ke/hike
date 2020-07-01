<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <HaikuView class="col-7 col-sm-4 col-md-3 col-lg-2" v-for="haiku in viewList" :key="`haiku-${haiku.id}`" :haiku="haiku"></HaikuView>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Haiku} from "@/components/repogitory/Haiku";
import HaikuView from "@/components/HaikuView.vue";

export interface HaikuListViewDelegate {
    viewList(): Haiku[];
}

@Component({
    components: {
        HaikuView
    }
})

export default class HaikuListView extends Vue{
  @Prop({type: Object as () => HaikuListViewDelegate})
  delegate?: HaikuListViewDelegate

  private get viewList(): Haiku[] {
      return this.delegate?.viewList() ?? []
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
