<template>
  <div class="link" @click="selectLink(id)">
    <img class="preview" :src="preview">
    <img class="icon" :src="link.objects[0].icon">
    <div class="details">
      <h4 class="title truncate">{{title}}</h4>
      <!-- TODO: Add excerpt field from DiffBot? -->
      <p class="excerpt truncate">{{text2}}</p>
      <div class="tagContainer">
        <!-- TODO: Throws an error because tags hasn't loaded yet! -->
        <!-- Should the :key be tag or name? -->
        <span class="is-medium" v-for="(tag, name) in link.tags" :key="tag">
          <img class="icon2"
          :src="`https://png.icons8.com/color/50/${tags[name].icon || 'folder'}`">
          <!-- {{name}} -->
          <!-- <button class="delete is-small"></button> -->
        </span>
      </div>
    </div>
  </div>
</template>
<script>

import {mapState, mapMutations} from 'vuex'

export default {
  props: ['link', 'id'],
  methods: mapMutations({
    selectLink: 'SELECT_LINK'
  }),
  computed: {
    ...mapState(['tags']),
    // TODO: Add logic for other types of content: videos, etc.
    title() {
      if (this.link.type === 'article') {
        return this.link.objects[0].title
      }
    },
    preview() {
      if (this.link.type === 'article') {
        // TODO: Add a fallback if there aren't any images at all
        return this.link.objects[0].images[0].url
      }
    },
    text2() {
      return this.link.objects[0].text.substring(0, 150)
    }
  }
}

</script>
<style lang="sass" scoped>

.link
  margin: 0 0 15px 0
  position: relative
  cursor: pointer
  display: flex
  flex-flow: row
  transition: 0.3s transform
  user-select: none
  
  &:active
    transform: scale(0.9)
    
  .preview
    width: 80px
    height: 80px
    margin: 0 10px 0 0
    // TODO: No support for object-* in Edge or IE. What the fuck!?
    // TODO: Weird bug when scrolling like it takes time to load.... hmmm
    object-fit: cover
    object-position: center
    user-select: none
    border-radius: 6px
    
  .icon
    width: 30px
    height: 30px
    border-radius: 50%
    position: absolute
    bottom: -3px
    left: 53px
    
  .details
    width: 0
    display: flex
    flex-flow: column
    flex-grow: 1
    
    .truncate
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      
    .icon2
      width: 32px
      height: 32px
      padding: 3px
      box-sizing: border-box
      border-radius: 50%
      // background: white
      
    .title
      margin: 0 0 3px 0
      // font-family: "Montserrat"
      font-weight: 500
      
    .excerpt
      margin: 0
      font-size: 0.9em
      
    .tagContainer
      flex-grow: 1
      display: flex
      flex-flow: row
      align-items: center
      
      .tag
        margin: 0 4px 0 0
          
</style>
