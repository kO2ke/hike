<template>
    <div role="group">
    <label for="input-live">{{delegate.title}}</label>
    <b-form-input
      :id="delegate.id"
      v-model="delegate.text"
      :state="state"
      aria-describedby="input-live-help input-live-feedback"
      :placeholder="delegate.placeholder"
      trim
    ></b-form-input>

    <!-- This will only be shown if the preceding input has an invalid state -->
    <b-form-invalid-feedback id="input-live-feedback">
      {{delegate.alert}}
    </b-form-invalid-feedback>

    <!-- This is a form text block (formerly known as help block) -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

export interface InputTypeText{
    title: string;
    id: string;
    text: string;
    placeholder: string;
    alert: string;
    getValue(caller: InputTypeText): void;
    validate(): boolean;
}


interface Array<InputTypeText>{
    resetAll(): () => void;
}



@Component

export default class InputTypeTextView extends Vue{
    @Prop({type: Object as () => InputTypeText})
    delegate?: InputTypeText

    private get state(): boolean {
        return this.delegate?.validate() ?? true
    }
}
</script>>
