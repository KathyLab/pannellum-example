<template>
  <div>
    <SimpleDialog
      v-model="visible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @closed="onClose"
      :header="header"
    >
      <div class="form-item" v-if="hsType === SCENE_HOT_SPOT_TYPE">
        <label>sceneId: </label>
        <input type="text" v-model="form.sceneId" />
      </div>
      <div class="form-item">
        <label>text: </label>
        <input type="text" v-model="form.text" />
      </div>
    </SimpleDialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import SimpleDialog from './SimpleDialog.vue'
import {
  default as useDialog,
  CLOSE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT
} from '@/hooks/useDialog'
import { CONFIRM_EVENT, CANCEL_EVENT } from '@/constants/events'
import { INFO_HOT_SPOT_TYPE, SCENE_HOT_SPOT_TYPE } from '@/constants/hotspot-types'

const HEADER_MAP = {
  [INFO_HOT_SPOT_TYPE]: 'add info',
  [SCENE_HOT_SPOT_TYPE]: 'add tour'
}

const emit = defineEmits([
  CLOSE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
  CONFIRM_EVENT,
  CANCEL_EVENT
])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  value: {
    type: Boolean,
    default: false
  },
  hsType: {
    type: String,
    default: ''
  }
})

const { visible, close, doClose } = useDialog(props, emit)

const form = reactive({
  sceneId: '',
  text: ''
})
const header = ref('')

function resetForm() {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}

function onClose() {
  resetForm()
  close()
}

function handleConfirm() {
  emit(CONFIRM_EVENT, { ...form })
  doClose()
}

function handleCancel() {
  emit(CANCEL_EVENT)
  doClose()
}

watch(
  () => props.value,
  (val) => {
    if (val) {
      header.value = HEADER_MAP[props.hsType]
    }
  }
)
</script>

<style lang="stylus" scoped>
.form-item
  margin 10px 0px
  label
    display inline-block
    text-align right
    font-size 14px
    color #606266
    width 56px
  input
    border: 1px solid #dcdfe6;
    height: 30px;
    line-height: 30px;
    width calc(100% - 76px)
    margin-left 10px
</style>
