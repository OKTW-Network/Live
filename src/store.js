import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: []
  },
  mutations: {
    SET_LIST(state, items) {
      state.items = items
    }
  },
  actions: {
    async getList({ commit }) {
      const data = (await axios.get('https://live.oktw.one/record/list.json')).data
      const items = data.filter(i => Object.keys(i).length > 0)
      commit('SET_LIST', items)
    }
  }
})
