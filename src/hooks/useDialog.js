import { ref, watch } from 'vue'

export const CLOSE_EVENT = 'close'
export const INPUT_EVENT = 'input'
export const SUCCESS_EVENT = 'success'
export const UPDATE_MODEL_EVENT = 'update:modelValue'

export default function (props, emit) {
  // const visible = computed({
  //   get() {
  //     return props.modelValue
  //   },
  //   set(value) {
  //     emit('update:modelValue', value)
  //   }
  // })
  const visible = ref(false)

  function open() {
    visible.value = true
  }

  function doClose() {
    visible.value = false
  }

  function close() {
    emit(CLOSE_EVENT)
    emit(INPUT_EVENT, visible.value)
    emit(UPDATE_MODEL_EVENT, visible.value)
  }

  watch(
    () => props.modelValue,
    (val) => {
      visible.value = val
    },
    { immediate: true }
  )

  watch(
    () => props.value,
    (val) => {
      visible.value = val
    },
    { immediate: true }
  )

  return {
    visible,
    open,
    doClose,
    close
  }
}
