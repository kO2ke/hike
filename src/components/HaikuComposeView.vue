<template>
<div id="composeModal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">ここで一句</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
        <div v-for="form in textForms" :key="form.id" class="row form-group mb-3">
            <label :for="form.id" class="col-3 text-right col-form-label">
                {{form.title}}:
            </label>
            <div class="col-8">
                <input :id="form.id" :placeholder="form.placeholder" v-model="form.model" class="form-control" type="text" size="10">
            </div>
        </div>
        <div class="row form-group mb-3">
            <label for="season" class="col-3 text-right">季節:</label>
            <div class="col-8">
                <select id="season" class="custom-select" v-model="season">
                    <option v-for="seasonObj in seasons" 
                        :key="seasonObj.class" 
                        :value="seasonObj.value" 
                        :class="seasonObj.class">
                    {{seasonObj.name}}
                    </option>
                </select>
            </div>
        </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">閉じる</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="composeEnd">詠む</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Const} from '@/constant/Constant.ts'
import {Haiku} from "@/components/repogitory/Haiku"

@Component
export default class HaikuComposeView extends Vue implements Haiku {

    @Prop({type: Object as () => ComposeViewDelegate})
    delegate?: ComposeViewDelegate

    seasons = Const.seasons

    composer = ""
    first = ""
    second = ""
    third = ""
    season = 0
    id?: number
    createdAt?: string

    private textForms: {title: string; id: string; model: string; placeholder: string}[] = [
        {title: "詠み人", id:"composer", model: this.composer, placeholder: "詠み人知らず"},
        {title: "五", id:"first", model: this.first, placeholder: "古池や"},
        {title: "七", id:"second", model: this.second, placeholder: "蛙飛び込む"},
        {title: "五", id:"third", model: this.third, placeholder: "水の音"}
    ]

    private composeEnd() {
        this.delegate?.composeEnd(this)
    }
}

export interface ComposeViewDelegate {
    composeEnd(newHaiku: Haiku): void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
