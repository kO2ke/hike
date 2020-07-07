<template>
<b-modal id="composeModal" class="modal fade" tabindex="-1" role="dialog">
      <template v-slot:modal-title>
          ここで一句
      </template>
      <div class="d-block p-3">
        <form>
        <InputTypeTextView v-for="form in textForms" :key="form.id" :delegate="form" class="row form-group mb-3">
        </InputTypeTextView>
        <div class="row form-group mb-3">
            <label for="season" class="col-3 text-right">季節:</label>
            <div class="col-8">
                <select id="season" class="custom-select" v-model="newHaiku.season">
                    <option v-for="seasonObj in seasons" 
                        :key="seasonObj.class" 
                        :value="seasonObj.class" 
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
        <b-button type="button" :disabled="!allValidate" variant="primary" @click="composeEnd">詠む</b-button>
      </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Const} from '@/constant/Constant.ts'
import {Haiku, emptyHaiku} from "@/components/repogitory/Haiku"
import InputTypeTextView, {InputTypeText} from "@/components/inputItem/InputItem.vue"

@Component({
    components:{
        InputTypeTextView
    }
})

export default class HaikuComposeView extends Vue {

    @Prop({type: Object as () => ComposeViewDelegate})
    delegate?: ComposeViewDelegate

    @Prop()
    modalId!: string

    seasons = Const.seasons

    newHaiku: Haiku = emptyHaiku()
    
    private getComposer(caller: InputTypeText): boolean{
        this.newHaiku.composer = caller.text
        return true
    }

    private getFirst(caller: InputTypeText): boolean{
        this.newHaiku.first = caller.text
        return true
    }

    private getSecond(caller: InputTypeText): boolean{
        this.newHaiku.second = caller.text
        return true
    }
    private getThird(caller: InputTypeText): boolean{
        this.newHaiku.third = caller.text
        return true
    }

    private composer: InputTypeText = 
    {
            title: "詠み人", 
            id:"composer", 
            text:"", 
            placeholder: "詠み人知らず", 
            alert: "", 
            getValue:this.getComposer,
            validate(): boolean{
                return true
            }
    }

    private first: InputTypeText = 
    {
            title: "五",
            id:"first",
            text:"",
            placeholder: "古池や",
            alert: "10文字以内で入力してください", 
            getValue: this.getFirst,
            validate(): boolean{
                return this.text.length > 0 && this.text.length <=10
            }
    }

    private second: InputTypeText = 
    {
            title: "七",
            id:"second",
            text:"",
            placeholder: "蛙飛び込む",
            alert: "11文字以内で入力してください",
            getValue: this.getSecond,
            validate(): boolean{
                return this.text.length > 0 && this.text.length <=14
            }
    }

    private third: InputTypeText = 
    {
            title: "五",
            id:"third",
            text:"",
            placeholder: "水の音",
            alert: "10文字以内で入力してください",
            getValue: this.getThird,
            validate(): boolean{
                return this.text.length > 0 && this.text.length <=10
            }
    }

    private textForms: InputTypeText[] = 
    [
        this.composer,
        this.first,
        this.second,
        this.third
    ]

    private composeEnd() {
        if(!this.allValidate){return}

        this.textForms.forEach(form => {
            form.getValue(form)
        });

        this.textForms.forEach(form => {
            form.text = ""
        })

        this.delegate?.composeEnd(this.newHaiku)
        this.newHaiku = emptyHaiku()
        this.$bvModal.hide('composeModal')
    }

    private get allValidate(){
        let validate = true
        this.textForms.forEach(form => {
            if(!form.validate()){
                console.log(form.alert)
                validate = false
            }
        });
        return validate
    }
}

export interface ComposeViewDelegate {
    composeEnd(newHaiku: Haiku): void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
