<template>
    <div>
        <label :for="delegate.id" class="col-3 text-right col-form-label">
            {{delegate.title}}:
        </label>
        <div class="col-8">
            <input :id="delegate.id" :placeholder="delegate.placeholder" v-model="delegate.text" class="form-control" type="text" size="10">
        </div>
        <div class="col-12 text-right" v-if="delegate.alert.length > 0">
            <b-badge class="mr-5" variant="danger">{{delegate.alert}}</b-badge>
        </div>
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
    getValue: (caller: InputTypeText) => boolean;
}

@Component

export default class InputTypeTextView extends Vue{
    @Prop({type: Object as () => InputTypeText})
    delegate?: InputTypeText

    private get isAlert(): boolean {
        if (this.delegate == null){return false}
        return this.delegate?.alert.length > 0
    }
}
</script>>
