<script setup>
import 'pannellum'
import 'pannellum/build/pannellum.css'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import useContextMenu from './useContextMenu'
import { default as usePannellum, GLOBAL_CONTEXT_TYPE } from './usePannellum'
import {
  PANNELLUM_LOAD_EVENT,
  PANNELLUM_ERROR_EVENT,
  PANNELLUM_SCENE_CHANGE_EVENT,
  PANNELLUM_MOUSE_DOWN_EVENT
} from '@/constants/easy-pannellum'
import AddHotSpots from './AddHotSpots.vue'
import ContextMenu from './ContextMenu.vue'

const props = defineProps({
  firstScene: {
    type: String,
    default: ''
  },
  sceneOption: {
    type: Object,
    default: () => {},
    required: true
  },
  enableEdit: {
    type: Boolean,
    default: false
  },
  hotSpotDebug: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  PANNELLUM_LOAD_EVENT,
  PANNELLUM_ERROR_EVENT,
  PANNELLUM_SCENE_CHANGE_EVENT
])

const vrRef = ref(null)
const viewer = ref(null)

const { menuTop, menuLeft, contextMenu, isShowContextMenu, showMenu, hideMenu } = useContextMenu()

const {
  clickPos,
  hsType,
  hsDialogVisible,
  menuOptions,
  contextType,
  // onAddHotSpot,
  // onAddSceneHs,
  // onEditHotSpot,
  // deleteSceneHs,
  createHotSpot,
  handleAddSpots,
  // addHotSpot,
  loadScene,
  resize
} = usePannellum(emit, viewer)

function addHsCreateFn() {
  let sceneOption = {}
  Object.keys(props.sceneOption).forEach((key) => {
    const scene = props.sceneOption[key]
    const hotSpots = (scene?.hotSpots ?? []).map((hs) => {
      return {
        ...hs,
        createTooltipFunc: createHotSpot,
        createTooltipArgs: {
          id: hs.id,
          text: hs.text
        }
      }
    })

    sceneOption[key] = { ...scene, hotSpots }
  })
  return sceneOption
}

function handleContextMenuEvent(e) {
  contextMenu.value = menuOptions
  showMenu(e)
  const pos = viewer.value.mouseEventToCoords(e)
  clickPos.value = pos
  contextType.value = GLOBAL_CONTEXT_TYPE
}

function loadPannellum() {
  let scenes = props.sceneOption
  if (props.enableEdit) {
    scenes = addHsCreateFn()
  }

  let firstScene = props.firstScene
  if (!props.firstScene) {
    const keys = Object.keys(scenes)
    firstScene = keys[0] ?? ''
  }
  const options = {
    default: {
      autoLoad: true,
      sceneFadeDuration: 1000,
      firstScene,
      hotSpotDebug: props.hotSpotDebug
    },
    scenes
  }

  viewer.value = window.pannellum.viewer(vrRef.value, options)

  // load
  viewer.value.on(PANNELLUM_LOAD_EVENT, () => {
    /**
     * @TODO remove listener after destroyed
     */
    if (props.enableEdit) {
      // show menu
      vrRef.value.addEventListener('contextmenu', handleContextMenuEvent, true)
      // hide menu
      document.addEventListener('click', hideMenu)
    }
    const aboutMsg = document.querySelector('.pnlm-about-msg')
    if (aboutMsg) {
      aboutMsg.style.visibility = 'hidden'
    }
    emit(PANNELLUM_LOAD_EVENT)
  })

  // error
  viewer.value.on(PANNELLUM_ERROR_EVENT, (err) => {
    emit(PANNELLUM_ERROR_EVENT, err)
  })
}

function onMousedown() {
  const pitch = viewer.value.getPitch()
  const yaw = viewer.value.getYaw()
  console.log(pitch, yaw)
  emit(PANNELLUM_MOUSE_DOWN_EVENT, { pitch, yaw })
}

watch(
  () => [props.firstScene, props.sceneOption],
  (val) => {
    if (val.length) {
      viewer.value && viewer.value.destroy()
      loadPannellum()
    }
  }
)

onMounted(() => {
  loadPannellum()
})

onUnmounted(() => {
  vrRef.value && vrRef.value.removeEventListener('contextmenu', handleContextMenuEvent)
  viewer.value && viewer.value.destroy()

  document.removeEventListener('click', hideMenu)
})

defineExpose({
  // addHotSpot,
  loadScene,
  resize
})
</script>

<template>
  <section>
    <div ref="vrRef" class="easy-pannellum" @mousedown="onMousedown"></div>
    <ContextMenu
      v-if="isShowContextMenu"
      :menu-options="menuOptions"
      :top="menuTop"
      :left="menuLeft"
      :contextType="contextType"
    />
    <AddHotSpots v-model="hsDialogVisible" :hs-type="hsType" @confirm="handleAddSpots" />
  </section>
</template>

<style lang="stylus" scoped>
.easy-pannellum
    // position absolute
  width 100%
  height 100%
</style>
