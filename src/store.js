import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        error: null,
        user: {
            account: null,
            myRestaurant: null,
            visitedRestaurant: null

        },
        restaurants: [],
        default: {
            testAccounts: null,
            location: {
                lat: '22.330613',
                lng: '114.181065'
            },
            imgURL:'/img/notfound.png'
        },
        repository: null
    },
    getters: {
        getUser: state => () => state.user,
        getAccount: state => () => state.account,
        getError: state => () => state.error
    },
    mutations: {
        SET_REPOSITORY: function (state, repository) {
            state.repository = repository
        },
        SET_ACCOUNT: function (state, account) {
            state.user.account = account
        },
        SET_USER: function (state, user) {
            state.user = user
        },
        SET_TEST_ACCOUNTS: function (state, accounts) {
            state.default.testAccounts = accounts
        },
        SET_ERROR: function (state, error) {
            state.error = error
        },
        SET_MY_RESTAURANT: function (state, restaurant) {
            state.user.myRestaurant = restaurant
        },
        SET_VISITED_RESTAURANT: function (state, restaurant) {
            state.user.visitedRestaurant = restaurant
        },
        SET_MY_RESTAURANT_LOCATION: function (state, location) {
            state.user.myRestaurant.location = location
        },
        SET_RESTAURANTS: function (state, res) {
            state.restaurants = res
        }
    },
    actions: {
        // setUser //

        // set user.account
        setUserAccount({commit, dispatch}, account) {
            try {
                commit('SET_ACCOUNT', account)

            } catch (error) {
                throw error
            }
        },

        // set user.myRestaurant
        setMyRestaurant({commit}, restaurant) {
            commit('SET_MY_RESTAURANT', restaurant)
        },

        // set user.visitedRestaurant
        setVisitedRestaurant({commit}, restaurant) {
            commit('SET_VISITED_RESTAURANT', restaurant)
        },

        // set user directly
        setCurrentUser({commit}, user) {
            try {
                commit('SET_USER', user)

            } catch (error) {
                throw error
            }
        },
        // end setUser //


        setTestAccounts({commit}, accounts) {
            commit('SET_TEST_ACCOUNTS', accounts)
        },

        logout({commit}) {
            let user = {
                account: null,
                myRestaurant: null,
                visitedRestaurant: null,
                currentOrder: null,

            }
            commit('SET_USER', user)
            router.push('/login')

        },

        error({commit}, {error}) {
            commit('SET_ERROR', error)
        },
        setRepository({commit}, repository) {
            // console.log(repository)
            commit('SET_REPOSITORY', repository)
        }
    }

})

