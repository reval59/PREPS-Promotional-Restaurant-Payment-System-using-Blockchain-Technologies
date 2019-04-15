<template>
    <v-layout row wrap>
        <v-layout>
            <v-flex xs12 sm10 offset-sm1>
                <v-card>
                    <v-img
                            src="/img/sample/register.jpg"
                            aspect-ratio="2.75"
                    ></v-img>

                    <v-card-title color="accent">
                        <div>
                            <h3 class="headline mb-0" color="accent">Register your own restaurant !!!</h3><br>
                            <div>There are only 3 steps to register.
                                <br> Contact with other restaurant hosts to design your own membership plan for
                                customers.
                                <br>PREPS will also make your management extremely easy.
                            </div>
                            <br>
                        </div>
                    </v-card-title>

                </v-card>
            </v-flex>
        </v-layout>
        <v-flex xs12 sm10 offset-sm1>

            <v-stepper v-model="step" vertical="">

                <v-stepper-step :complete="step > 1" step="1">Provide necessary information</v-stepper-step>
                <v-stepper-content step="1">
                    <v-card>
                        <v-card-text primary-title>
                            <div>
                                <h3 class="headline mb-0">Provide necessary information</h3>
                                <div>
                                    <v-form v-model="valid" ref="form"
                                            lazy-validation>
                                        <template>

                                        </template>
                                        <v-text-field
                                                v-model="name"
                                                label="Name"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>

                                        <v-text-field
                                                v-model="contact"
                                                label="Contact"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>

                                        <v-text-field
                                                v-model="imgUrl"
                                                label="Image URL"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>

                                        <v-text-field
                                                v-model="numOfTables"
                                                type="number"
                                                label="Number of Tables"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>

                                        <v-text-field
                                                name="desc"
                                                label="Description"
                                                :rules="textRules"
                                                v-model="desc"
                                                required
                                                color="primary"
                                        ></v-text-field>


                                        <v-layout align-end justify-end>
                                            <v-btn v-if="!alreadyRegistered" @click="register()" color="primary">next
                                            </v-btn>
                                            <v-btn v-if="alreadyRegistered" @click="update()" color="primary">next
                                            </v-btn>
                                        </v-layout>


                                    </v-form>
                                </div>
                            </div>
                        </v-card-text>

                    </v-card>

                </v-stepper-content>


                <v-stepper-step :complete="step > 2" step="2">Select location</v-stepper-step>
                <v-stepper-content step="2">
                    <v-card>
                        <v-card-text primary-title>
                            <div>
                                <h3 class="headline mb-0">Select location</h3>
                                <div>
                                    <v-form v-model="valid2" ref="form2"
                                            lazy-validation>
                                        <template>

                                        </template>
                                        <v-text-field
                                                v-model="lng"
                                                label="longitude"
                                                :rules="textRules"
                                                readonly
                                                color="primary"
                                        ></v-text-field>

                                        <v-text-field
                                                v-model="lat"
                                                label="latitude"
                                                :rules="textRules"
                                                readonly
                                                color="primary"
                                        ></v-text-field>
                                        <location-selection-map
                                                width="100%"
                                                height="500px" ref="map"
                                        />

                                        <v-layout align-end justify-end>
                                            <v-btn @click="previous" color="primary" dark>Previous</v-btn>

                                            <v-btn @click="updateLocation" color="primary">next</v-btn>
                                        </v-layout>


                                    </v-form>
                                </div>
                            </div>
                        </v-card-text>

                    </v-card>

                </v-stepper-content>


                <v-stepper-step :complete="step > 3" step="3">Create menu items</v-stepper-step>
                <v-stepper-content step="3">
                    <v-card>
                        <v-card-text primary-title>
                            <div>
                                <h3 class="headline mb-0">Create Menu items</h3>
                                <div>
                                    <br>
                                    <div class="">

                                        <span class="v-label">Current Items:</span> <span v-if="items.length==0"> No items</span>

                                        <!--<v-chip color="primary" dark close v-for="item in items" key="item.id">-->
                                        <!--<v-avatar color="accent">$ {{item.price}}</v-avatar>-->
                                        <!--<span class="v-label">{{item.name}}</span>-->
                                        <!--</v-chip>-->
                                        <v-layout v-if="items.length>=1" row wrap>
                                            <v-flex xs12 md6 lg4 v-for="(item,index) in items" :key="`item-${index}`">
                                                <br>
                                                <v-card
                                                        color="primary"
                                                        class="white--text">
                                                    <v-layout>

                                                        <v-flex xs5>
                                                            <v-img
                                                                    :src="item.imgURL"
                                                                    height="125px"
                                                                    contain
                                                            ></v-img>
                                                        </v-flex>
                                                        <v-flex xs7>
                                                            <v-card-title primary-title>
                                                                <div>
                                                                    <div class="title">{{item.name}}</div>
                                                                    <div class="subheading">$ {{item.price}}</div>
                                                                    <div>{{item.desc}}</div>
                                                                </div>
                                                            </v-card-title>
                                                        </v-flex>
                                                        <v-btn dark icon @click="removeItem(item.no, index)">
                                                            &#10006;
                                                        </v-btn>
                                                    </v-layout>
                                                </v-card>
                                            </v-flex>
                                        </v-layout>


                                    </div>
                                    <br>
                                    <br>
                                    <v-form v-model="valid3" ref="form3"
                                            lazy-validation>
                                        <template>

                                        </template>

                                        <!--<h4 class="v-label">New Item</h4>-->
                                        <v-text-field
                                                v-model="currentItem.name"
                                                label="Name"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>
                                        <v-text-field
                                                v-model="currentItem.price"
                                                label="Price ($)"
                                                type="number"
                                                :rules="intRules"
                                                required
                                                color="primary"
                                        ></v-text-field>
                                        <v-text-field
                                                v-model="currentItem.imgURL"
                                                label="Image URL"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>
                                        <v-text-field
                                                name="desc"
                                                label="Description"
                                                v-model="currentItem.desc"
                                                :rules="textRules"
                                                required
                                                color="primary"
                                        ></v-text-field>


                                        <v-layout align-end justify-end>
                                            <v-btn @click="previous" color="primary" dark>Previous</v-btn>
                                            <v-btn @click="clear" color="primary" dark>Clear</v-btn>
                                            <v-btn @click="addMenuItem" color="primary" light>Create</v-btn>
                                            <v-btn @click="goHome" color="accent" v-if="items.length>1">Submit</v-btn>
                                        </v-layout>


                                    </v-form>
                                </div>
                            </div>
                        </v-card-text>

                    </v-card>


                </v-stepper-content>

            </v-stepper>
        </v-flex>
        <br>
        <v-flex xs10 offset-xs1>


        </v-flex>


    </v-layout>

</template>
<script>

    import LocationSelectionMap from "../../components/LocationSelectionMap";
    import {EventBus} from '../../plugins/eventBus'

    export default {
        components: {LocationSelectionMap},
        data: () => ({
            alreadyRegistered: false,
            step: '1',
            valid: true,
            valid2: true,
            valid3: true,
            textRules: [
                v => !!v || 'This field is required'
            ],
            intRules: [
                v => !!v || 'This field is required'
            ],
            name: null,
            desc: null,
            contact: null,
            imgUrl: null,
            lng: null,
            lat: null,
            numOfTables: null,
            currentItem: {
                name: null,
                desc: null,
                imgUrl: null,
                price: null
            }
        }),
        watch: {
            '$route'(to, from) {
                if (to.path == '/restaurant/register') {
                    console.log(to)
                    this.init()
                }
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            items() {
                let restaurant = this.$store.state.user.myRestaurant
                if (restaurant) {
                    return restaurant.items
                } else {
                    return []
                }
            }
        },
        methods: {
            init() {
                this.$refs.form.reset()
                this.$refs.form2.reset()
                this.$refs.form3.reset()
                console.log("init")


                EventBus.$off("change-loc");
                EventBus.$on('change-loc', this.listener)

                let rest = this.$store.state.user.myRestaurant
                if (rest != null) {
                    this.name = rest.name
                    this.desc = rest.desc
                    this.contact = rest.contact
                    this.imgUrl = rest.imgURL
                    this.lng = rest.location.lng
                    this.lat = rest.location.lat
                    this.numOfTables = rest.numOfTables

                }
                if (rest == null) {
                    this.currentItem = {
                        name: null,
                        desc: null,
                        imgUrl: null,
                        price: null
                    }
                    this.alreadyRegistered = false
                } else {
                    this.alreadyRegistered = true
                }

                if (rest == null) this.step = 1
                else if (rest.location.lng == '0.0') this.step = 2
                else this.step = 3

                // console.log("here")
                if (rest == null || rest.location.lng == '0.0') {
                    // console.log("hello")
                    this.lng = this.$store.state.default.location.lng
                    this.lat = this.$store.state.default.location.lat
                }

                this.$refs.map.setLoc(this.lng, this.lat)


            },
            listener(loc) {
                this.lat = loc.lat
                this.lng = loc.lng
            },
            goHome() {
                this.$router.push('/restaurant/dashboard')
            },
            next() {

                if (this.step == 1) {
                    if (this.$refs.form.validate()) {
                        this.step++
                        this.$refs.map.setLoc(this.lng, this.lat)
                    }
                } else if (this.step == 2) {
                    if (this.$refs.form2.validate()) {
                        this.step++
                    }
                }
            },
            clear() {
                this.$refs.form3.reset()
            },
            async register() {
                if (this.$refs.form.validate()) {
                    let vue = this
                    let param = {
                        name: this.name,
                        desc: this.desc,
                        imgUrl: this.imgUrl,
                        contact: this.contact,
                        numOfTables: this.numOfTables.toInt()
                    }
                    try {
                        await this.$middleware.registerRestaurant(param)
                        this.alreadyRegistered = true
                        this.next()

                    } catch (e) {
                        console.log(e)
                        this.$store.dispatch('error', {error: e.message})
                    }

                }

            },
            async update() {
                if (this.$refs.form.validate()) {
                    let vue = this
                    let param = {
                        name: this.name,
                        desc: this.desc,
                        imgUrl: this.imgUrl,
                        contact: this.contact,
                        numOfTables: this.numOfTables
                    }
                    try {
                        await this.$middleware.updateRestaurant(param)
                        this.next()
                    } catch (e) {
                        console.log(e)
                        this.$store.dispatch('error', {error: e.message})
                    }

                }
            },
            async updateLocation() {
                let param = {
                    lng: {
                        int: this.lng.toInt(),
                        dec: this.lng.toDec()
                    },
                    lat: {
                        int: this.lat.toInt(),
                        dec: this.lat.toDec()
                    }
                }
                try {
                    await this.$middleware.updateRestaurantLoc(param)
                    this.next()
                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            },
            async addMenuItem() {
                if (this.$refs.form3.validate()) {
                    let param = {
                        name: this.currentItem.name,
                        desc: this.currentItem.desc,
                        price: this.currentItem.price,
                        imgURL: this.currentItem.imgURL
                    }
                    try {
                        await this.$middleware.addRestaurantMenu(param)
                        this.clear()
                    } catch (e) {
                        console.log(e)
                        this.$store.dispatch('error', {error: e.message})
                    }
                }
            },
            async removeItem(menuNo, index) {
                try {
                    await this.$middleware.removeRestaurantMenu(menuNo)
                    this.clear()
                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            },
            previous() {
                if (this.step > 1) {
                    this.step--
                    if (this.step == 2) {
                        this.$refs.map.setLoc(this.lng, this.lat)
                    }
                }
            },
            loadMap() {
                this.$refs.map.setLoc(this.lng, this.lat)
            }


        },
        beforeDestroy() {
            EventBus.$off("change-loc", this.listener);
        }


    }
</script>
<style scoped>

</style>
