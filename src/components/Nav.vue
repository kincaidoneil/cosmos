<template>
  <div class="container">
    <h2>Stars</h2>
    <!-- <button class="button" @click="addLink">Add Link</button> -->
    <div v-for="(tag, name) in tags" :key="name" class="tag2" @mousedown="startDrag" @mouseup="endDrag">
      <img class="icon" :src="`https://png.icons8.com/color/50/${tag.icon || 'folder'}`">
      <div class="name">{{name}}</div>
      <div class="number2">{{numOfLinks(tag)}}</div>
      <button class="delete is-medium" @click="deleteTag(name)"></button>
    </div>
    <!-- TODO: Add link to open source software somewhere -->
    <!-- TODO: I should also probably pay for using their API -->
    <!-- <a href="https://icons8.com/color-icons/">Free icons by Icons8</a> -->
  </div>
</template>
<script>

import {mapState} from 'vuex'

export default {
  computed: mapState(['tags']),
  methods: {
    startDrag() {
      console.log(1)
    },
    endDrag() {
      console.log(2)
    },
    numOfLinks(tag) {
      return Object.keys(tag.links || {}).length
    },
    deleteTag(tag) {
      // TODO: Add "are you sure?" prompt
      const db = this.$firebase.database()
      // Remove individual tag references from each link with that tag
      for (let link in this.tags[tag].links) {
        db.ref(`links/${link}/tags/${tag}`).remove()
      }
      // Remove the tag
      db.ref(`tags/${tag}`).remove()
    }
  }
}

</script>
<style lang="sass" scoped>

.container
  display: flex
  flex-flow: column
  user-select: none
  
  .tag2
    margin: 0 0 6px 0
    display: flex
    flex-flow: row
    align-items: center
    justify-content: space-between
    cursor: move
    
    .name
      margin-left: 10px
      flex-grow: 1
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      
    .number2
      min-width: 20px
      
    .icon
      width: 24px
      height: 24px
      padding: 3px
      border-radius: 50%
      background: white
    
</style>
