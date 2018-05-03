import Vue from 'vue'

import firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyDLgt04HRYy6K7-bwDEwTNbs4k6CeWIK7g',
  authDomain: 'cosmos-98963.firebaseapp.com',
  databaseURL: 'https://cosmos-98963.firebaseio.com',
  projectId: 'cosmos-98963'
})

// Allow the Firebase instance to be accessed from any component
Object.defineProperty(Vue.prototype, '$firebase', {
  value: firebase
})

import App from '@/components/App.vue'
import store from '@/vuex/store'
import axios from 'axios'

const db = firebase.database()

db.ref('links').on('value', snapshot => {
  store.commit('UPDATE_LINKS', snapshot.val())
})

db.ref('tags').on('value', snapshot => {
  store.commit('UPDATE_TAGS', snapshot.val())
})

// db.ref('links').on('child_added', snapshot => {
//   const url = snapshot.val().url
//   axios.get('https://mercury.postlight.com/parser', {
//     params: {url},
//     headers: {
//       'x-api-key': 'b8iyzm2hYRJzamqXdoVG8iB0KPqmsUHzfKyGhgSn'
//     }
//   }).then(response => {
//     // Update the data in Firebase
//     snapshot.ref.update({
//       article: response.data
//     })
//   }).catch(error => {
//     // TODO: Add error handler here
//     console.error(error)
//   })
// })

// TODO: Move this to a Firebase function
db.ref('tags').on('child_added', snapshot => {
  const tag = snapshot.key
  axios.get('https://qs.icons8.com/api/iconsets/v3/search', {
    params: {
      term: tag,
      amount: 1,
      offset: 0,
      platform: 'color',
      language: 'en-US'
    }
  }).then(response => {
    // Add an icon for the tag, change the name to lowercase and replace
    // spaces with hyphens so it's ready for the same URL format as Icons8
    const icon = response.data.result.search[0].name
      .toLowerCase()
      .replace(' ', '-')
    snapshot.ref.update({icon})
  }).catch(error => {
    // TODO: Add error handler here
    console.error(error)
  })
})

import * as Vibrant from 'node-vibrant'

db.ref('tags').on('child_changed', (snapshot, prevChildKey) => {
  const icon = snapshot.val().icon
  Vibrant.from(`https://png.icons8.com/color/50/${icon}`)
    .getPalette()
    .then(palette => {
      const color = palette.Vibrant.getHex()
      // Update the color palette in Firebase
      snapshot.ref.update({color})
    }).catch(error => {
      // TODO: Add error handler here
      console.error(error)
    })
})

// TODO: Add this module
import algoliasearch from 'algoliasearch'

db.ref('links').on('child_changed', (snapshot, prevChildKey) => {
  // const ALGOLIA_ID = functions.config().algolia.app_id
  const ALGOLIA_ID = '0BUYDPK0SC'
  // const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
  const ALGOLIA_ADMIN_KEY = '308d005593bc5143c5c4c9b760baced7'
  const ALGOLIA_INDEX_NAME = 'links'
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
  const index = client.initIndex(ALGOLIA_INDEX_NAME)
  // TODO: can i combine thse into a single api call?
  // If it's non-null, it's an updated child
  if (prevChildKey) {
    return index.saveObject({
      objectId: snapshot.key,
      ...snapshot.val()
    }).catch(err => {
      console.error(err)
    })
  }
  // If it's null, it's a new child 
  else {
    // This requires an objectID
    return index.addObject({
      objectId: snapshot.key,
      ...snapshot.val()
    }).catch(err => {
      console.error(err)
    })
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  store
  // router
})
