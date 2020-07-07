<template>
    <div class="py-3">
        <p v-if="haiku.staticData" :class="award">
            <b-icon :class="award" class="award-icon" icon="award-fill"></b-icon>
            {{haiku.staticData}} の誉
        </p>
        <div v-bind:class="haiku.season" class="card shadow">
            <div class="like rounded-circle" :class="[isUserLiked ? 'liked' : '']" @click="toggleLike">誉</div>
            <div class="likeCount">{{displayLikeNum}}</div>
            <div class="card-body display-flex">
                <div class="poet">
                    <div class="third">{{haiku.third}}</div>
                    <div class="second">{{haiku.second}}</div>
                    <div class="first">{{haiku.first}}</div>
                </div>
                <div class="composer">
                    {{haiku.composer.length > 0 ? haiku.composer : "読み人知らず"}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {Haiku, HaikuLikeStatus} from "@/components/repogitory/Haiku"
import {HaikuInterecter} from "@/components/repogitory/HaikuInterecter";
import {Auth} from '@/user/auth'
import {numbersToKanji} from '@/constant/Constant'


@Component
export default class HaikuView extends Vue {

  @Prop({type: Object as () => Haiku})
  haiku!: Haiku

  @Prop()
  rank!: number

  private likeStatus: HaikuLikeStatus = {likeCount:0, likedUser:{}}

  auth = Auth.getInstance()

  interecter = HaikuInterecter.getInstance()

  mounted() {
      this.interecter.watchHaikuLikeStatus(this.haiku.id, (likeStatus: HaikuLikeStatus) => {
          this.likeStatus.likeCount = likeStatus?.likeCount ?? 0
          this.likeStatus.likedUser = likeStatus?.likedUser ?? {}
      })
  }

  private get award() {
      switch (this.rank){
          case 1:
              return "first h3"
          case 2:
              return "second h3"
          case 3:
              return "third h3"
          default:
              return "none"
      }
  }

  private get displayLikeNum() {
      return numbersToKanji(this.likeStatus.likeCount as number)
  }

  private toggleLike(){
      const userId = this.auth.currentUser?.uid

      if(!userId){
          return
      }

      if (this.isUserLiked) {
          this.interecter.cancelLikeToHaiku(userId, this.haiku)
      }else{
          this.interecter.likeToHaiku(userId, this.haiku)
      }
  }

  private get isUserLiked() {
      if (this.auth.currentUser != null){
          return this.likeStatus.likedUser[this.auth.currentUser.uid] ?? false
      }else{
          return false
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card{
    overflow: hidden;
    height: 250px;
    width: 164px;
    margin: auto;
    background-color: rgb(255, 255, 255, 0.7);
}

.backText {
    opacity: 0.05;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-rl;
}

.like{
    position: absolute;
    top: 10px;
    left: 10px;
    padding-top: 5.5px;
    height: 40px;
    width: 40px;
    color: rgb(255, 255, 255);
    background: rgba(173, 172, 172, 0.7);
    box-sizing: border-box;
    transition: 0.5s;
}

.like.liked{
    border:2px solid rgb(235, 160, 160);
}

.like:hover{
    background: rgba(100, 100, 100, 0.7);
}

.likeCount{
    position: absolute;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-rl;
    top: 60px;
    left: 18px;
    color: rgba(138, 136, 136, 0.7);
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

.first>.award-icon{
    color: rgb(184, 161, 36);
}

.second>.award-icon{
    color: rgb(95, 107, 114);
}

.third>.award-icon{
    color: rgb(105, 71, 55);
}

.none>.award-icon{
    display: none;
}


.star-fill{
    transition: 0.5s;;
}

.star-fill.notLiked{
    opacity: 0;
}
</style>
