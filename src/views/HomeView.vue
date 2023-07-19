<script setup>
import EasyPannellum from '../components/EasyPannellum'
import livingroom from '@/assets/livingroom.jpg'
import bedroom from '@/assets/bedroom.jpg'


const sceneOption = {
  livingRoom: {
    title: 'living room',
    hfov: 110,
    yaw: 5,
    type: 'equirectangular',
    panorama: livingroom,
    hotSpots: [
      {
        pitch: 1.57,
        yaw: -66.7,
        type: 'scene',
        text: 'enter bedroom',
        sceneId: 'bedroom',
        targetYaw: -23,
        targetPitch: 2,
        id: 1
      },
      {
        pitch: -17.79,
        yaw: -122.95,
        type: 'info',
        text: 'dinner table',
        id: 2
      },
      {
        pitch: 2.93,
        yaw: 57.28,
        type: 'info',
        text: 'TV',
        id: 3
      }
    ]
  },
  bedroom: {
    title: 'bed room',
    hfov: 110,
    yaw: 5,
    type: 'equirectangular',
    panorama: bedroom,
    hotSpots: [
      {
        pitch: 2.25,
        yaw: -167.9,
        type: 'scene',
        text: 'out to living room',
        sceneId: 'livingRoom',
        targetYaw: -23,
        targetPitch: 2,
        id: 4
      }
    ]
  }
}
</script>

<template>
  <main class="vr-wrapper">
    <h3>pannellum example</h3>
    <EasyPannellum
      class="pannellum"
      :scene-option="sceneOption"
      :hot-spot-debug="true"
      :enableEdit="true"
    />
  </main>
</template>
<style lang="stylus" scoped>
.vr-wrapper
  padding 20px
  h3
    text-align center

.pannellum
  width: 80%;
  height: 80vh;
  margin 0 auto
</style>
