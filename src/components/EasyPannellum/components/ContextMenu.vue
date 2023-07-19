<template>
  <section>
    <ul :class="['custom-context-menu']" :style="{ top: `${top}px`, left: `${left}px` }">
      <template v-for="menu of menuOptions">
        <li :key="menu.name" v-if="menu.type === contextType" @click="menu.onClick">
          {{ menu.name }}
        </li>
      </template>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  menuOptions: {
    type: Array,
    default: () => []
  },
  contextType: {
    type: String,
    default: 'global'
  },
  top: {
    type: Number,
    default: 0
  },
  left: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="stylus" scoped>
.custom-context-menu
  position fixed
  border 1px solid #ccc
  list-style none
  padding 4px 0
  border-radius 4px
  box-shadow 0px 2px 6px 2px #ddd
  background #000
  color #fff

  &.hidden
    display none

  li
    padding 8px 12px
    border-bottom 1px solid #f0f2f5
    user-select none
    transition all 0.1s
    font-size 12px

    &:last-child
      border-bottom none;

    &:hover
      cursor pointer
      background-color #f0f2f5
      color #0c0c0c

    &:active
      background-color #f0f2f7
</style>
