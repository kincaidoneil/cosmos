<template>
  <div class="container">
    <h2>Cosmos</h2>
    <button class="button is-primary" @click="addLink">Add Link</button>
    <div v-for="tag in orderedTags" :key="tag.name" class="tag2"
      :style="{marginLeft: `${20 * tag.level}px`}">
      <img class="icon" :src="`https://png.icons8.com/color/50/${tag.icon || 'folder'}`">
      <div class="name">{{tag.name}}</div>
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
import axios from 'axios'
import _get from 'lodash'

export default {
  computed: {
    ...mapState(['tags']),
    orderedTags() {
      return Object.keys(this.tags)
        .map(name => ({name, ...this.tags[name]}))
        .sort((a, b) => a.order > b.order)
    }
  },
  methods: {
    addLink() {
      const url = prompt('Enter a URL:')
      // Fetch metadata and readable page from Diffbot
      axios.get('https://api.diffbot.com/v3/analyze', {
        params: {
          url, token: 'e832d195707446eb376987e4346dd1af'
        }
      }).then(response => {
        // TODO: this is only if type = 'article'
        const article = response.data.objects[0]
        // TODO: Fix this code so it doesn't error if "Twitter" doesn't exist
        
        const description = _get(article, 'meta.description') ||
          _get(article, ['meta', 'twitter', 'twitter:description']) ||
          _get(article, ['meta', 'og', 'og:description']) ||
          // If there isn't a description in metadata, use beginning of text 
          article.text.substring(0, 200)
        const author = _get(article, 'meta.author') || article.author
        const date = new Date(
          _get(article, ['meta', 'article:published_time']) ||
          article.estimatedDate
        ).getTime()
        const data = {
          type: 'article',
          description,
          date,
          author,
          icon: article.icon,
          html: article.html,
          text: article.text,
          url: article.pageUrl,
          // Primary image and video return undefined if there aren't any
          primaryImage: _get(article, 'images', []).find(n => n.primary),
          primaryVideo: _get(article, 'videos', []).find(n => n.primary),
          title: article.title,
          publisher: article.siteName
        }
        // TODO: Search Algolia for suggested tags!
        // TODO: Add support for other APIs -- product, discussion, image, video, "other"
        // TODO: Will this take too long to save a page? 20 seconds+ for some!
        // Update Firebase with new data
        this.$firebase.database().ref('links').push(response.data)
          .then(response => {
            // Success!
            // this.loading = false
          }).catch(error => {
            // TODO: Add error handler here
            // console.error(error)
          })
      }).catch(error => {
        console.error(error)
      })
      // TODO: Add additional code here
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
  
  h2
    margin: 0 0 15px 0
    font-family: "Montserrat"
    font-weight: 600
    font-size: 36px
    text-transform: lowercase
    line-height: 100%
    
  .button
    margin: 0 0 15px 0
  
  .tag2
    margin: 0 0 6px 0
    display: flex
    flex-flow: row
    align-items: center
    justify-content: space-between
    // cursor: move
    
    .name
      margin-left: 10px
      flex-grow: 1
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      
    .number2
      min-width: 20px
      
    .icon
      width: 32px
      height: 32px
      padding: 3px
      box-sizing: border-box
      border-radius: 50%
      background: white
      
</style>
