<template>
    <v-app>
        <v-snackbar
                v-model="snackbar"
                :timeout="2500"
                top
                vertical
        >
            {{ errMsg }}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <transition>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </v-app>
</template>

<script>
    export default {
        data: () => {
            return {
                snackbar: false,
                errMsg: ''
            }
        },
        beforeMount() {
            this.$middleware.init()
        },

        watch: {
            snackbar: function (val) {
                if (val == false) {
                    this.$store.dispatch('error', {error: null})
                }
            },

            getters: {
                account: (state) => {
                    return state.user.account
                }
            },
            '$route':'showCurrentRoute'

        },
        async mounted() {
            this.$store.watch(this.$store.getters.getError, (value) => {
                if (value != null) {
                    if(value.startsWith("Node error")){
                        console.log(value)
                        this.errMsg = "[EVM Error] Unauthorized action due to invalid parameters or contract state "
                    } else {
                        this.errMsg = value
                    }
                    this.snackbar = true
                }

            })
            let testAccounts = await this.$middleware.getAccounts()
            this.$store.dispatch('setTestAccounts', testAccounts)

        },
        methods:{
            showCurrentRoute(){
                console.log(this.$route.path)
            }
        }
    }
</script>