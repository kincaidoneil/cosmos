<template>
  <div class="linkContainer">
    <input class="searchBox" placeholder="Search stars...">
    <Link v-for="(link, key) in links"
      :link="link" :id="key" :key="key" />
  </div>
</template>
<script>

import Link from '@/components/Link.vue'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {Link},
  computed: mapState(['links', 'tags'])
}

</script>
<style lang="sass" scoped>

.linkContainer
  padding: 15px 15px 0 15px
  box-sizing: border-box
  overflow-y: auto
  background: rgba(245, 245, 245, 0.65)
  
  .searchBox
    width: 100%
    margin: 0 0 15px 0
    background: transparent
    outline: none
    border: none
    font-size: 1rem
    
</style>
