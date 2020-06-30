<template>
    <div class="p-3">
        <div v-bind:class="haiku.season" class="card">
            <div class="card-body">
                <div class="row">
                    <div class="like">
                        <b-icon :icon="isUserLiked ? 'star-fill' : 'star'"></b-icon><br>
                        {{haiku.likeCount}}
                    </div>
                    <div class="poet">
                        <div class="third">{{haiku.third}}</div>
                        <div class="second">{{haiku.second}}</div>
                        <div class="first">{{haiku.first}}</div>
                    </div>
                    <div class="composer">
                        {{haiku.composer}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {Haiku} from "@/components/repogitory/Haiku"
import HaikuInterecter from "@/components/repogitory/HaikuInterecter";

@Component
export default class HaikuView extends Vue {

  @Prop({type: Object as () => Haiku})
  haiku!: Haiku

  @Prop()
  userId?: string

  interecter = HaikuInterecter.getInstance()

  mounted() {
      this.interecter.watchHaiku(this.haiku.id, (haikuStatus) => {
          this.haiku.likeCount = haikuStatus.likeCount
      })
  }

  private get isUserliked(){
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card{
    padding: 10px;
}

.card-body{
  height: 250px;
  padding: 10px;
}

.poet{
    position: absolute;
    top: 10px;
    right: 10px;
    -ms-writing-mode: tb-lr;
    writing-mode: vertical-lr;
    font-size: 20px;
    text-align: left;
}

.composer{
    position: absolute;
    bottom: 10px;
    left: 10px;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-lr;
    font-size: 15px;
}

.like{
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>
