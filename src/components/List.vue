<template>
  <div class="linkContainer">
    <input class="searchBox" placeholder="Search stars...">
    <div class="link" v-for="(link, key) in links"
      @click="selectLink(key)">
      <img class="preview" :src="link.article.lead_image_url">
      <!-- TODO: Insert a photo here -->
      <div class="details">
        <h4 class="title truncate">{{link.article.title}}</h4>
        <p class="excerpt truncate">{{link.article.excerpt}}</p>
        <div class="tagContainer">
          <span class="tag is-primary" v-for="(tag, name) in link.tags"
            :style="{background: tags[name].color}">
            {{name}}
            <!-- TODO: Throws an error because tags hasn't loaded yet! -->
            <!-- <button class="delete is-small"></button> -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {mapState, mapMutations} from 'vuex'

export default {
  computed: {
    ...mapState(['links', 'tags']),
    // TODO: should sorting or filtering be applied in the store?
    // sortedLinks() {
    //   this.links.filter(link => {
    //     return this.selectedTag ? link.tags.includes(this.selectedTag) : true
    //   })
    // }
  },
  methods: mapMutations({
    selectLink: 'SELECT_LINK'
  })
}

</script>
<style lang="sass" scoped>

.searchBox
  width: 100%
  margin: 0 0 15px 0
  background: transparent
  outline: none
  border: none
  font-size: 1rem

.linkContainer
  padding: 15px 15px 0 15px
  box-sizing: border-box
  overflow-y: auto
  background: whitesmoke
  
.link
  margin: 0 0 15px 0
  cursor: pointer
  display: flex
  flex-flow: row
  transition: 0.3s transform
  
  &:active
    // TODO: C'MON... NEED A BETTER EFFECT!
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
    
  .details
    width: 0
    display: flex
    flex-flow: column
    flex-grow: 1
    
    .truncate
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      
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
