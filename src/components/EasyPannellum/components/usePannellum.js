import { ref } from 'vue'
import {
  INFO_HOT_SPOT_TYPE,
  SCENE_HOT_SPOT_TYPE,
  ADD_HOT_SPOT_EVENT,
  DELETE_HOT_SPOT_EVENT
} from '@/constants/easy-pannellum'

export const GLOBAL_CONTEXT_TYPE = 'global'
export const HS_CONTEXT_TYPE = 'hs'

/**
 * Escapes HTML string (to mitigate possible DOM XSS attacks).
 * @private
 * @param {string} s - String to escape
 * @returns {string} Escaped string
 */
function escapeHTML(s) {
  return String(s)
    .split(/&/g)
    .join('&amp;')
    .split('"')
    .join('&quot;')
    .split("'")
    .join('&#39;')
    .split('<')
    .join('&lt;')
    .split('>')
    .join('&gt;')
    .split('/')
    .join('&#x2f;')
    .split('\n')
    .join('<br>') // Allow line breaks
}

export default function (emit, viewer) {
  const clickPos = ref([])
  const hsType = ref(INFO_HOT_SPOT_TYPE)
  const hsDialogVisible = ref(false)
  const contextType = ref(GLOBAL_CONTEXT_TYPE)
  let currentHsArgs = null
  // let currentHsConfig = null
  let hsContextMenuEventListener = null

  /**
   * menu options
   */
  const menuOptions = [
    {
      name: 'Add Info Hot Spot',
      onClick: onAddHotSpot,
      type: GLOBAL_CONTEXT_TYPE
    },
    {
      name: 'Add Tour Hot Spot',
      onClick: onAddSceneHs,
      type: GLOBAL_CONTEXT_TYPE
    },
    {
      name: 'Delete',
      onClick: removeSceneHs,
      type: HS_CONTEXT_TYPE
    }
  ]

  function onAddHotSpot() {
    hsDialogVisible.value = true
    hsType.value = INFO_HOT_SPOT_TYPE
  }
  function onAddSceneHs() {
    hsDialogVisible.value = true
    hsType.value = SCENE_HOT_SPOT_TYPE
  }

  const createHotSpot = (hotSpotDiv, args) => {
    hotSpotDiv.classList.add('pnlm-tooltip')

    var span = document.createElement('span')
    span.innerHTML = escapeHTML(args.text)
    hotSpotDiv.appendChild(span)
    span.style.width = span.scrollWidth - 20 + 'px'
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px'
    span.style.marginTop = -span.scrollHeight - 12 + 'px'

    hsContextMenuEventListener = () => {
      contextType.value = 'hs'
      currentHsArgs = {
        ...args,
        sceneId: viewer.value.getScene(),
        contextTarget: hotSpotDiv
      }
    }
    hotSpotDiv.addEventListener('contextmenu', hsContextMenuEventListener, true)
  }

  function handleAddSpots(form) {
    const pitch = clickPos.value[0]
    const yaw = clickPos.value[1]
    const id = parseInt(Math.random() * 100000)
    const hs = {
      type: hsType.value,
      pitch,
      yaw,
      text: form?.text,
      id,
      createTooltipFunc: createHotSpot,
      createTooltipArgs: {
        id,
        text: form?.text
        //   sceneId,
      }
    }
    if (hsType.value === SCENE_HOT_SPOT_TYPE) {
      hs.sceneId = form.sceneId
    }

    // currentHsConfig = hs
    viewer.value.addHotSpot(hs)
    /**
     * @workaround call api, refresh id, 'addHotSpot' should wait until id return
     */
    emit(ADD_HOT_SPOT_EVENT, hs)
  }

  // function addHotSpot(id) {
  //   const option = {
  //     id,
  //     createTooltipFunc: createHotSpot,
  //     createTooltipArgs: {
  //       id
  //     }
  //   }

  //   viewer.value.addHotSpot({ ...currentHsConfig, ...option })
  // }

  function removeSceneHs() {
    const id = currentHsArgs?.id
    const target = currentHsArgs.contextTarget
    target.removeEventListener('contextmenu', hsContextMenuEventListener)
    viewer.value.removeHotSpot(id)
    emit(DELETE_HOT_SPOT_EVENT)
  }

  function loadScene(sceneId) {
    viewer.value.loadScene(sceneId)
    /**
     * @TODO need to add hotspot if initial config doesn't include it
     */
  }

  function resize() {
    viewer.value && viewer.value.resize()
  }

  return {
    clickPos,
    hsType,
    hsDialogVisible,
    menuOptions,
    contextType,
    onAddHotSpot,
    onAddSceneHs,
    removeSceneHs,
    createHotSpot,
    handleAddSpots,
    loadScene,
    resize
  }
}
