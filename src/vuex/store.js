import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    links: {},
    showReader: false,
    selectedLink: null,
    selectedTag: null,
    tags: {}
  },
  mutations: {
    // TODO: Is there a more efficient way to do this?
    UPDATE_LINKS(state, links) {
      state.links = links
    },
    UPDATE_TAGS(state, tags) {
      state.tags = tags
    },
    SELECT_LINK(state, key) {
      state.selectedLink = key
      state.showReader = true
    }
  }
})
