import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import customerOrder from './modules/customerOrder'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    customerOrder
  },
  getters,
  strict: debug,
})

export default store
