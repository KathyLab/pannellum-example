<template>
  <div class="dialog-mask" v-if="visible">
    <div class="dialog-container">
      <div class="dialog-header">{{ header }}</div>
      <div class="dialog-body">
        <slot />
      </div>

      <div class="dialog-footer">
        <button @click="OnConfirm" class="confirm">Confirm</button>
        <button @click="OnCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  CONFIRM_EVENT,
  CLOSED_EVENT,
  OPENED_EVENT,
  CANCEL_EVENT,
  UPDATE_MODEL_EVENT,
  INPUT_EVENT
} from '@/constants/events'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  value: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: '提示'
  }
})

const emit = defineEmits([
  CLOSED_EVENT,
  OPENED_EVENT,
  CONFIRM_EVENT,
  CANCEL_EVENT,
  UPDATE_MODEL_EVENT,
  INPUT_EVENT
])

const visible = ref(false)

function doOpen() {
  visible.value = true
}

function doClose() {
  visible.value = false
}

function open() {
  emit(OPENED_EVENT)
  doOpen()
}

function close() {
  // doClose()
  emit(CLOSED_EVENT)
  emit(UPDATE_MODEL_EVENT, visible.value)
  emit(INPUT_EVENT, visible.value)
}

function OnConfirm() {
  emit(CONFIRM_EVENT)
  doClose()
}

function OnCancel() {
  emit(CANCEL_EVENT)
  doClose()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open()
    } else {
      close()
    }
  }
)
// compatible for vue2
watch(
  () => props.value,
  (val) => {
    if (val) {
      open()
    } else {
      close()
    }
  }
)
</script>

<style lang="stylus" scoped>
.dialog-mask
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.5)
  z-index 1000
.dialog-container
  position relative
  background #fff
  width 300px
  border-radius 10px
  overflow hidden
  margin 20vh auto

  .dialog-header
    height 30px
    line-height 30px
    border 1px solid #ebf0ff
    padding 4px 20px
  .dialog-body
    padding 20px
    word-break break-all
  .dialog-footer
    display flex
    justify-content center
    overflow hidden
    border-top 1px solid #EBEDF0
    box-sizing border-box
    padding 10px 20px 10px

    button
      display: inline-block;
      font-size: 12px;
      line-height: 1;
      text-align: center;
      margin: 0 5px;
      padding: 9px 10px;
      outline: 0;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-radius 3px
      box-sizing: border-box;
      cursor: pointer;

      &.confirm
        background #409eff
        color #fff
        border-color #409eff
</style>
