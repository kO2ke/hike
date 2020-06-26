<template>
<b-modal id="composeModal" class="modal fade" tabindex="-1" role="dialog">
      <template v-slot:modal-title>
          ここで一句
      </template>
      <div class="d-block">
        <form>
        <InputTypeTextView v-for="form in textForms" :key="form.id" :delegate="form" class="row form-group mb-3">
        </InputTypeTextView>
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
      <template v-slot:modal-footer>
        <b-button type="button" @click="$bvModal.hide('composeModal')" variant="secondary" >閉じる</b-button>
        <b-button type="button" variant="primary" @click="composeEnd">詠む</b-button>
      </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Const} from '@/constant/Constant.ts'
import {Haiku} from "@/components/repogitory/Haiku"
import InputTypeTextView, {InputTypeText} from "@/components/inputItem/InputItem.vue"

@Component({
    components:{
        InputTypeTextView
    }
})

export default class HaikuComposeView extends Vue implements Haiku {

    @Prop({type: Object as () => ComposeViewDelegate})
    delegate?: ComposeViewDelegate

    @Prop()
    modalId!: string

    seasons = Const.seasons

    composer = ""
    first = ""
    second = ""
    third = ""
    season = 0
    id?: number
    createdAt?: string

    private getComposer(caller: InputTypeText): boolean{
        this.composer = caller.text
        return true
    }
    private getFirst(caller: InputTypeText): boolean{
        if (caller.text.length == 0){
            caller.alert = "必須項目です"
            return false
        }
        this.first = caller.text
        return true
    }
    private getSecond(caller: InputTypeText): boolean{
        if (caller.text.length == 0){
            caller.alert = "必須項目です"
            return false
        }
        this.second = caller.text
        return true
    }
    private getThird(caller: InputTypeText): boolean{
        if (caller.text.length == 0){
            caller.alert = "必須項目です"
            return false
        }
        this.third = caller.text
        return true
    }

    private textForms: InputTypeText[] = [
        {
            title: "詠み人", 
            id:"composer", 
            text:"", 
            placeholder: "詠み人知らず", 
            alert: "", 
            getValue:this.getComposer
        },
        {
            title: "五",
            id:"first",
            text:"",
            placeholder: "古池や",
            alert: "", 
            getValue: this.getFirst
        },
        {
            title: "七",
            id:"second",
            text:"",
            placeholder: "蛙飛び込む",
            alert: "",
            getValue: this.getSecond
        },
        {
            title: "五",
            id:"third",
            text:"",
            placeholder: "水の音",
            alert: "",
            getValue: this.getThird
        }
    ]

    private composeEnd() {
        let validate = true
        this.textForms.forEach(form => {
            if(!form.getValue(form)){
                console.log(form.alert)
                validate = false
            }
        });
        if(!validate){
            return
        }
        console.log(this.first)
        this.delegate?.composeEnd(this)
        this.$bvModal.hide('composeModal')
    }

    private validate() {
        this.first 
    }
}

export interface ComposeViewDelegate {
    composeEnd(newHaiku: Haiku): void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
