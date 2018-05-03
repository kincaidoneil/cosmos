<template>
  <div class="container2">
    <!-- TODO: Add Share button for Facebook, Twitter, etc. Other services? Evernote? Download? -->
    <button class="button" @click="openLink">Web View</button>
    <button class="button">Reading View</button>
    <button class="button">Share</button>
    <button class="button" @click="deleteLink">Delete</button>
    <!-- TODO: Add a cover image -->
    <!-- TODO: Change all other links to target="_blank" -->
    <div class="tags">
      <transition-group name="list" tag="div">
        <span class="tag is-primary is-medium" v-for="(tag, name) in link.tags"
          :style="{background: tags[name].color}" :key="name">
          <!-- <span class="icon">
            <i class="fa fa-home"></i>
          </span> -->
          {{name}}
          <button class="delete is-medium" @click="removeTag(name)"></button>
        </span>
      </transition-group>
      <input class="newTag" ref="newTag" v-model="newTag" placeholder="Add a tag..."
        @keydown.tab.prevent="addTag"
        @keydown.enter="addTag" />
      <!-- TODO: Add input autocomplete here -->
    </div>
    <h1>{{_link.title}}</h1>
    <p class="content author">By {{_link.author}} &middot; {{timePublished}}</p>
    <!-- TODO: Look into XSS -->
    <!-- TODO: How can change all links so they open in a new tab? -->
    <!-- TODO: Do I just want to render the text content? Idk -->
    <div class="content" v-html="_link.html"></div>
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
      window.open(this.link.request.resolvedPageUrl || this.link.request.pageUrl)
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
    },
    deleteLink() {
      // TODO: Add "are you sure?" prompt
      const db = this.$firebase.database()
      // Remove individual link references from each tag with that link
      const link = this.selectedLink
      for (let tag in this.links[link].tags) {
        db.ref(`tags/${tag}/links/${link}`).remove()
      }
      // Remove the link
      db.ref(`links/${link}`).remove()
      
      // TODO: Change selected link!
      // TODO: Is there a way to do undo/redo with Firebase? Probably not
      
    }
  },
  computed: {
    ...mapState(['links', 'tags', 'selectedLink']),
    _link() {
      if (this.link.type === 'article') {
        return this.link.objects[0]
      }
    },
    link() {
      return this.links[this.selectedLink]
    },
    timePublished() {
      // TODO: Add the time to this
      return dateFns.format(new Date(this._link.estimatedDate), 'MMM D, YYYY')
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
    max-height: 500px
    
  figcaption, label
    font-style: italic
    font-size: 0.85em
    
h1
  margin: 0 0 10px 0
  font-family: "Montserrat"
  font-weight: 300
  line-height: 1.1em
  
// TODO: lets try to implement list transitions...
  
.flip-list-move
  transition: transform 1s
  
.list-item
  display: inline
  margin-right: 10px
  
.list-enter-active, .list-leave-active
  transition: width .5s ease-in-out, opacity .5s ease-in-out
  width: 80px
  margin: 2px 4px
  
.list-enter .delete, .list-leave-to .delete
  display: none
  
.list-enter, .list-leave-to
  opacity: 0
  width: 0
  // TODO: fix this
  margin: 0
  
</style>
