<template>

    <v-layout row wrap>

        <v-flex xs12 pa-1 v-if="myRest">
            <v-toolbar color="white" light>
                <v-icon color="black">dashboard</v-icon>
                <v-toolbar-title>Dashboard</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>


        <v-flex sm12 md6 pa-1>
            <v-card pa-1>
                <v-img
                        :src="myRest.imgURL"
                        aspect-ratio="2"
                ></v-img>

                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">{{myRest.name}}
                            <v-chip height="23px" small :color="status.color" label dark>{{status.msg}}</v-chip>
                        </h3>

                        <br>
                        <div>
                            <div>
                                <span class="v-label font-weight-bold">Name: </span>
                                <span class="fs-16">{{myRest.name}}</span>
                            </div>

                            <div>
                                <span class="v-label font-weight-bold">Contact: </span>
                                <span class="fs-16">{{myRest.contact}}</span>
                            </div>

                            <div>
                                <span class="v-label font-weight-bold">Number of Tables: </span>
                                <span class="fs-16">{{myRest.numOfTables}}</span>
                            </div>

                            <div>
                                <span class="v-label font-weight-bold">Description: </span>
                                <span class="fs-16">{{myRest.desc}}</span>
                            </div>

                        </div>
                    </div>
                </v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!myRest.opened" dark color="success" @click="openPassDialog">Open my restaurant</v-btn>
                    <v-btn v-if="myRest.opened" dark color="red" @click="closeMyRestaurant">Close my restaurant</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>

        <v-flex sm12 md6 pa-1>
            <v-card>

                <static-location-map
                        width="100%"
                        height="320px" ref="map"
                        :lng="myRest.location.lng" :lat="myRest.location.lat"
                >

                </static-location-map>

                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">Restaurant Location</h3>
                        <br>
                        <div>
                            <div>
                                <span class="v-label font-weight-bold">Longitude: </span>
                                <span class="fs-16">{{myRest.location.lng}}</span>
                            </div>

                            <div>
                                <span class="v-label font-weight-bold">Latitude: </span>
                                <span class="fs-16">{{myRest.location.lat}}</span>
                            </div>


                        </div>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-dialog
                v-model="passDialog"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >Set Password
                </v-card-title>
                <v-card-text>

                    <v-text-field
                            v-model="password"
                            label="Password for placing order"
                            placeholder="Not specified"
                    ></v-text-field>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="accent"
                            flat
                            @click="passDialog = false"
                    >
                        close
                    </v-btn>
                    <v-btn
                            color="accent"
                            flat
                            @click="setPassword"
                    >
                        confirm
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>


    </v-layout>
</template>
<script>
    import StaticLocationMap from "../../components/StaticLocationMap";

    export default {
        components: {StaticLocationMap},
        data: () => {
            return {
                passDialog: false,
                password: null,
                errMsg: null
            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/restaurant/dashboard') {
                    console.log(to)
                    this.init()
                }
            },
        },
        mounted() {
            this.init()
        },
        computed: {
            myRest() {
                try {
                    return this.$store.state.user.myRestaurant
                } catch (e) {
                    return {imgURL: this.$store.state.default.imgURL}
                }
            },
            status() {
                let status = {}

                if (this.myRest.opened) {
                    status.color = 'success'
                    status.msg = 'opend'
                } else {
                    status.color = 'red'
                    status.msg = 'closed'
                }
                return status


            }
        },
        methods: {
            init() {
                if (this.myRest != null) {
                    this.$refs.map.initMap()
                }

            },
            async openMyRestaurant() {
                try {
                    if (this.myRest.location.lng == '0.0' || this.myRest.items.length == 0) {
                        console.log("haha")
                        this.$store.dispatch('error', {error: "Please set the restaurant location and add at least one menu item"})
                    } else {
                        await this.$middleware.openMyRestaurant()
                    }

                } catch (e) {
                    this.$store.dispatch('error', {error: e.message})
                }

            },
            async closeMyRestaurant() {
                try {
                    await this.$middleware.closeMyRestaurant()
                } catch (e) {
                    this.$store.dispatch('error', {error: e.message})
                }

            },
            openPassDialog() {
                this.password = null
                this.passDialog = true
            },

            async setPassword(){
                console.log(this.password)
                try {


                    if(this.password==null || this.password.length==0){
                        throw new Error('Please Enter the password')
                    }

                    await this.$middleware.setRestPassword(this.password)
                    this.passDialog=false
                    await this.openMyRestaurant()




                } catch (e) {
                    this.$store.dispatch('error', {error: e.message})
                }
            }
        }
    }
</script>

<style scoped>

</style>