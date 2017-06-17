<template>
  <div class="container2">
    <!-- TODO: Add Share button for Facebook, Twitter, etc. Other services? Evernote? Download? -->
    <button class="button" @click="openLink">Open in New Tab</button>
    <button class="button">Share</button>
    <button class="button">Go Fullscreen</button>
    <div class="tags">
      <span class="tag is-primary is-medium" v-for="(tag, name) in link.tags"
        :style="{background: tags[name].color}">
        <!-- <span class="icon">
          <i class="fa fa-home"></i>
        </span> -->
        {{name}}
        <button class="delete is-medium" @click="removeTag(name)"></button>
      </span>
      <input class="newTag" ref="newTag" v-model="newTag" placeholder="Add a tag..."
        @keydown.tab.prevent="addTag"
        @keydown.enter="addTag" />
      <!-- TODO: Add input autocomplete here -->
    </div>
    <h1>{{link.article.title}}</h1>
    <p class="content author">By {{link.article.author}} &middot; {{timePublished}}</p>
    <!-- TODO: Look into XSS -->
    <div class="content" v-html="link.article.content"></div>
  </div>
</template>
<script>

// TODO: Save scroll posiiton of each article

import {mapState} from 'vuex'
import dateFns from 'date-fns'

export default {
  data: () => ({
    newTag: ''
  }),
  methods: {
    openLink() {
      window.open(this.link.url)
    },
    addTag() {
      // Verify tag isn't empty
      // TODO: Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
      if (!this.newTag) return
      // Each tag must be unique; add it if it doesn't already exist
      // Add the link under the new tag
      const db = this.$firebase.database()
      db.ref(`tags/${this.newTag}/links/${this.selectedLink}`).set(true)
      // Add the tag to the selected link
      db.ref(`links/${this.selectedLink}/tags/${this.newTag}`).set(true)
      // Empty the field and focus it so the user can add more tags
      this.newTag = ''
      this.$refs.newTag.focus()
    },
    removeTag(tag) {
      const db = this.$firebase.database()
      db.ref(`links/${this.selectedLink}/tags/${tag}`).remove()
      // TODO: Should removing the last link from a tag auto-delete the tag?
      db.ref(`tags/${tag}/links/${this.selectedLink}`).remove()
    }
  },
  computed: {
    ...mapState(['links', 'tags', 'selectedLink']),
    link() {
      return this.links[this.selectedLink]
    },
    timePublished() {
      // TODO: Add the time to this
      return dateFns.format(new Date(this.link.article.date_published), 'MMM D, YYYY')
    }
  }
}

</script>
<style lang="sass">

// TODO: Add special styling for quotes

.tags
  margin: 10px 0
  display: flex
  
  .tag
    margin: 2px 4px
    
.newTag
  margin: 2px 4px
  background: transparent
  padding: 0
  border: none
  outline: none
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif
  font-size: 1rem
  height: 2em

.container2
  padding: 15px
  box-sizing: border-box
  overflow-y: auto

h2
  font-family: "Montserrat"
  font-weight: normal
  
.author
  margin: 0
  font-weight: bold
  text-transform: uppercase
  
.content
  line-height: 1.5em
  
  a
    color: dodgerblue
    
  a:hover
    opacity: 0.6
    
  img
    max-width: 100%
    
  figcaption, label
    font-style: italic
    font-size: 0.85em
    
h1
  margin: 0 0 10px 0
  font-family: "Montserrat"
  font-weight: bold
  line-height: 1.1em
  
</style>
