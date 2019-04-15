<template>
    <v-layout align-center justify-center fill-height>
        <v-btn icon @click="logout" style="position: absolute; top:5px; right:5px;" v-if="loggedIn">
            <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-flex xs6>
            <v-layout align-center justify-center fill-height column>

                <img src="img/logo/login.png" alt="login.png" width="198px" height="274px">
                <span style="color: red; font-weight: 500;">Test Version</span>
            </v-layout>
            <br><br>

            <div v-show="loggedIn">
                <v-layout align-center justify-center>

                    <span class="subheading">Select User Type</span>
                </v-layout>

                <hr>
                <br>
                <v-layout align-center justify-center column fill-height offset-xs5 v-if="!hide">

                    <v-btn color="primary" @click="loginAsCustomer">Customer</v-btn>
                    <v-btn color="primary" @click="loginAsHost">Restaurant Host</v-btn>
                </v-layout>
            </div>
            <div v-show="!loggedIn">
                <v-form ref="form" lazy-validation>
                    <!--<v-text-field-->
                    <!--v-model="address"-->
                    <!--label="Your Password"-->
                    <!--:rules="textRules"-->
                    <!--solo-->
                    <!--&gt;</v-text-field>-->

                    <v-select
                            :items="accounts"
                            label=""
                            v-model="address"
                            placeholder="Select Account"
                            solo
                    ></v-select>

                    <v-layout align-center justify-center>

                        <v-btn @click="login" color="primary">submit</v-btn>
                    </v-layout>


                </v-form>
            </div>

        </v-flex>
    </v-layout>

</template>

<script>

    export default {
        data: () => ({
            address: null,
            textRules: [
                v => !!v || 'Please Enter Your Password'
            ],
            hide:false
        }),
        computed: {
            loggedIn() {
                return this.$store.state.user.account != null
            },
            accounts() {
                return this.$store.state.default.testAccounts
            }
        },
        mounted(){
        },
        methods: {
            async login() {
                if (this.address == null) {
                    this.$store.dispatch('error', {error: "Please input the address and private key"})
                } else {
                    this.hide = true
                    await this.$middleware.retrieveUserInfo(this.address)



                    this.hide = false
                }
            },

            go(url) {
                this.$router.push(url)
            },

            loginAsHost() {
                try {
                    if (this.$store.state.user.myRestaurant.items.length > 0)
                        this.$router.push('/restaurant/dashboard')
                    else {
                        this.$router.push('/restaurant/register')
                    }
                } catch (e) {
                    this.$router.push('/restaurant/register')
                }
            },

            loginAsCustomer() {
                this.$router.push('/customer/search')
            },
            logout() {
                this.$store.dispatch('logout')
                this.address = null
            },
        }
    }
</script>
