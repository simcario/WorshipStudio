import Vue from 'vue'
import { vuexfireMutations } from 'vuexfire'
import Vuex from 'vuex'


 import defaultModule from './default'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      defaultModule,
      
    },
    mutations(){
      vuexfireMutations
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
