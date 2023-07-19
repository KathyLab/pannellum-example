import { ref } from 'vue'

export default function () {
  const menuTop = ref(0)
  const menuLeft = ref(0)
  const isShowContextMenu = ref(false)
  /**
   * @type {{ name: string, onClick: function, type: string}}
   */
  const contextMenu = ref([])

  function showMenu(e) {
    e.preventDefault()
    menuTop.value = e.clientY
    menuLeft.value = e.clientX
    isShowContextMenu.value = true
  }

  function hideMenu() {
    isShowContextMenu.value = false
  }



  return {
    menuTop,
    menuLeft,
    contextMenu,
    isShowContextMenu,
    showMenu,
    hideMenu,
  }
}
