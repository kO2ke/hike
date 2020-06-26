<template>
    <div class="p-3">
        <div v-bind:class="season" class="card">
            <div class="card-body">
                <div class="poet">
                    <div class="first">{{haiku.first}}</div>
                    <div class="second">{{haiku.second}}</div>
                    <div class="third">{{haiku.third}}</div>
                </div>
                <div class="composer float-left ml-2 mr-5 ">
                    {{haiku.composer}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {Haiku} from "@/components/repogitory/Haiku"

@Component
export default class HaikuView extends Vue {

  @Prop({type: Object as () => Haiku})
  haiku!: Haiku

  private get season() {
      switch (this.haiku.season) {
        case 0:
            return "spring"
        case 1:
            return "summer"
        case 2:
            return "autumn"
        case 3:
            return "winter"
        default:
            return "spring" 
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card{
    padding: 10px;
}

.card-body{
  -ms-writing-mode: tb-rl;
  writing-mode: vertical-rl;
  padding: 10px;
  text-align: left;
}

.poet{
    font-size: 18px;
}

.composer{
    vertical-align: bottom;
    margin-top: 200px;
}
</style>
