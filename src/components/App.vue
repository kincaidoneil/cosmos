<template>
  <div class="container3">
    <NavBar class="navPane" />
    <List class="listPane" />
    <Reader class="readingPane" v-if="showReader" />
  </div>
</template>
<script>

import {mapState} from 'vuex'
import NavBar from '@/components/Nav.vue'
import List from '@/components/List.vue'
import Reader from '@/components/Reader.vue'

export default {
  components: {NavBar, List, Reader},
  computed: mapState(['showReader']),
  methods: {
    addLink() {
      const url = prompt('Enter a URL')
      this.$firebase.database().ref('links').push({url})
    }
  }
}

</script>
<style lang="sass">

@import '~bulma/sass/utilities/_all'
@import '~bulma/sass/elements/button'
@import '~bulma/sass/elements/icon'
@import '~bulma/sass/elements/other'
@import '~bulma/sass/elements/tag'

html, body
  width: 100%
  height: 100%
  margin: 0
  padding: 0
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif
  overflow: hidden
  
// TODO: Add a flex transition
.container3
  width: 100%
  height: 100%
  display: flex
  flex-flow: row
  background: url("../../static/nebula.jpg")
  background-position: center
  
  .navPane
    flex: 2 0
    padding: 15px
    box-sizing: border-box
    color: white
    // background: #303030
    // TODO: Fix the path
    
  .listPane
    flex: 3 0
    
  .readingPane
    flex: 5 0
    background: white
    
</style>
