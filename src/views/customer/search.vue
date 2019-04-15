<template>

    <v-layout row wrap>

        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">search</v-icon>
                <v-toolbar-title>Search Restaurants</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>


        <v-flex sm12 md6 pa-1>
            <v-card>

                <v-layout
                        fill-height
                        align-center
                        justify-center
                        ma-0
                        v-if="!loaded"
                        style="height:320px"
                >
                    <v-progress-circular indeterminate color="grey darken-5"></v-progress-circular>
                </v-layout>
                <span v-if="loaded">
                    <static-location-map


                            width="100%"
                            height="320px" ref="map"
                            :lng="currentLoc.lng" :lat="currentLoc.lat"
                    >

                </static-location-map>
                </span>


                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">Current Location</h3>
                        <br>
                        <div>
                            <div>
                                <span class="v-label">Longitude: </span>
                                <span class="fs-16">{{currentLoc.lng}}</span>
                            </div>

                            <div>
                                <span class="v-label">Latitude: </span>
                                <span class="fs-16">{{currentLoc.lat}}</span>
                            </div>


                        </div>
                    </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            flat
                            @click="init()"
                    >
                        RELOAD LOCATION
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex sm12 md6 pa-1>
            <v-card>


                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">Subscribed Membership Plan</h3>
                        <br>
                        <div>

                            <v-card flat>
                                <v-card-text v-if="subscribedPlans.length>0">
                                    There are total {{subscribedPlans.length}} membership plan(s):
                                </v-card-text>

                                <v-card-text v-if="subscribedPlans.length==0">
                                    There is no membership plan for this restaurant
                                </v-card-text>

                                <v-card-text v-if="subscribedPlans.length>0">
                                    <ul>
                                        <li v-for="(plan, index) in subscribedPlans">
                                            <v-btn flat @click="$router.push('/customer/membership/'+plan.no)">
                                                {{plan.name}} Subscription plan
                                            </v-btn>
                                        </li>
                                    </ul>
                                </v-card-text>
                            </v-card>

                        </div>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>

        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">restaurant</v-icon>
                <v-toolbar-title>Restaurants nearby the current location</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>

        <v-flex sm12 md6 pa-1 v-for="(item,index) in restaurants" :key="`item-${index}`">
            <v-hover>
                <v-card
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 12 : 2}`"
                        class="mx-auto"

                >
                    <v-img
                            :aspect-ratio="3"
                            :src="item.imgURL"
                    >
                        <template v-slot:placeholder>
                            <v-layout
                                    fill-height
                                    align-center
                                    justify-center
                                    ma-0
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                        </template>
                    </v-img>
                    <v-card-title>
                        <div>
                            <span class="headline">
                                {{item.name}}
                                <v-chip v-if="item.opened" height="23px" small color="success" label
                                        dark>opened</v-chip>
                                 <v-chip v-if="!item.opened" height="23px" small color="red" label dark>closed</v-chip>
                            </span>
                            <div class="d-flex">
                                <v-rating
                                        :value="item.averageRating"
                                        color="yellow darken-3"
                                        dense
                                        half-increments
                                        readonly
                                        size="14"
                                        length="7"
                                        background-color="yellow darken-3"
                                ></v-rating>
                                <div class="ml-2 grey--text text--darken-2">

                                </div>
                            </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon class="mr-0" @click="openInfoDialog(index)">
                            <v-icon>info</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        {{item.desc}}
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-btn
                            dark
                            color="info"
                            @click="openInfoDialog(index)"
                    >
                        DETAILS
                    </v-btn>
                    <v-btn v-if="item.opened"
                           dark
                           color="accent"
                           @click="openPassDialog(index)"
                    >
                        place Order
                    </v-btn>
                </v-card>
            </v-hover>
        </v-flex>

        <v-dialog
                v-model="infoDialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                scrollable
        >
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="infoDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Restaurant Detail</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-img
                        :aspect-ratio="30/6"
                        :src="selectedRest.imgURL"
                        style="max-height:20%"
                ></v-img>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                        style="max-height:15%"
                >
                    <div>
                        <span class="headline">{{selectedRest.name}}</span>
                        <div class="d-flex">
                            <v-rating
                                    :value="selectedRest.averageRating"
                                    color="yellow darken-3"
                                    dense
                                    half-increments
                                    readonly
                                    size="14"
                                    length="7"
                                    background-color="yellow darken-3"
                            ></v-rating>
                        </div>
                    </div>
                </v-card-title>

                <v-card-text style="padding: 0px">
                    <v-tabs
                            v-model="active"
                            color="primary"
                            dark
                            slider-color="primary"
                            show-arrows
                    >
                        <v-tab
                                v-for="tab in tabs"
                                :key="tab"
                                ripple
                        >
                            {{ tab }}

                        </v-tab>
                    </v-tabs>
                    <v-tabs-items
                            v-model="active">


                        <v-tab-item
                                key="Membership"
                        >
                            <v-card flat>
                                <v-card-text v-if="selectedRest.plans && selectedRest.plans.length>0">
                                    There are total {{selectedRest.plans.length}} membership plan(s):
                                </v-card-text>

                                <v-card-text v-if="selectedRest.plans && selectedRest.plans.length==0">
                                    There is no membership plan for this restaurant
                                </v-card-text>

                                <v-card-text v-if="selectedRest.plans && selectedRest.plans.length>0">
                                    <ul>
                                        <li v-for="(plan, index) in selectedRest.plans">
                                            <v-btn flat @click="$router.push('/customer/membership/'+plan.no)">
                                                {{plan.name}} Subscription plan
                                            </v-btn>
                                        </li>
                                    </ul>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item
                                key="Description"
                        >
                            <v-card flat>
                                <v-card-text>{{selectedRest.desc}}</v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item
                                key="Picture"
                        >
                            <v-card flat>
                                <v-container grid-list-sm fluid>
                                    <v-layout row wrap>
                                        <v-flex
                                                v-for="item in selectedRest.items"
                                                :key="item.no"
                                                xs4
                                                d-flex
                                        >
                                            <v-card flat tile class="d-flex">
                                                <v-img
                                                        :src="item.imgURL"
                                                        aspect-ratio="1"
                                                        class="grey lighten-2"
                                                >
                                                    <template v-slot:placeholder>
                                                        <v-layout
                                                                fill-height
                                                                align-center
                                                                justify-center
                                                                ma-0
                                                        >
                                                            <v-progress-circular indeterminate
                                                                                 color="grey lighten-5"></v-progress-circular>
                                                        </v-layout>
                                                    </template>
                                                </v-img>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-tab-item>


                        <v-tab-item
                                key="Menu"
                        >
                            <v-card flat>

                                <v-card-text>
                                    <v-list three-line>
                                        <v-list-tile avatar v-for="item in selectedRest.items">
                                            <v-list-tile-content>
                                                <v-list-tile-title>
                                                    {{item.name}}

                                                </v-list-tile-title>
                                                <v-list-tile-title>{{item.price}} $</v-list-tile-title>
                                                <v-list-tile-sub-title>{{item.desc}}</v-list-tile-sub-title>
                                                <br>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item
                                key="Comments"
                        >
                            <v-card flat>
                                <v-card-text >
                                    <span v-if="selectedRest.comments && selectedRest.comments.length==0">
                                           Currently, there is no comments on this restaurant.
                                    </span>
                                    <v-list three-line>
                                        <v-list-tile avatar v-for="item in selectedRest.comments">
                                            <v-list-tile-content>
                                                <v-list-tile-title>
                                                    <v-rating
                                                            :value="item['4'].toInt()"
                                                            color="yellow darken-3"
                                                            dense
                                                            half-increments
                                                            readonly
                                                            size="14"
                                                            length="7"
                                                            background-color="yellow darken-3"
                                                    ></v-rating>

                                                </v-list-tile-title>
                                                <v-list-tile-title>{{item['3']}}</v-list-tile-title>
                                                <v-list-tile-sub-title>{{toReadableDate(item['5'])}}
                                                </v-list-tile-sub-title>
                                                <br>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item
                                key="Location"
                        >
                            <v-card flat>
                                <!--<v-card-text>-->
                                <!--<v-btn @click="initRestaurantMap" color="success">Load map</v-btn>-->
                                <!--</v-card-text>-->
                                <v-card-text>
                                    <static-restaurant-map
                                            width="100%"
                                            height="320px" ref="map2"
                                            :lng="currentLoc.lng" :lat="currentLoc.lat"
                                            :lng2="selectedRest.location.lng" :lat2="selectedRest.location.lat"
                                    >

                                    </static-restaurant-map>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                    </v-tabs-items>


                    <!--{{selectedRest.desc}}-->
                </v-card-text>

            </v-card>
        </v-dialog>



        <v-dialog
                v-model="orderDialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                scrollable
        >
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="orderDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Table Selection</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-img
                        :aspect-ratio="16/6"
                        :src="selectedRest.imgURL"
                ></v-img>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >
                    <div>
                        <span class="headline">{{selectedRest.name}}</span>
                    </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text style="min-height: 50%">
                    <v-layout row wrap>
                        <v-flex xs12 sm6 pa-1 v-for="(tableNo, index) in tableNoList" :key="`item-${index}`">
                            <v-btn block dark color="primary" dark @click="placeOrder(tableNo)">
                                Table {{tableNo}}
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>


            </v-card>
        </v-dialog>

        <v-dialog
                v-model="passDialog"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >Enter Password
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
                            @click="enterPassword"
                    >
                        confirm
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>


    </v-layout>
</template>
<script>
    import StaticLocationMap from "../../components/StaticLocationMap"
    import StaticRestaurantMap from "../../components/StaticRestaurantMap"

    export default {
        components: {StaticLocationMap, StaticRestaurantMap},
        data: () => {
            return {
                currentLoc: {
                    lng: '0',
                    lat: '0'
                },
                restaurants: null,
                defaultRating: 4,
                infoDialog: false,
                orderDialog: false,
                passDialog:false,
                selectedRest: {
                    imgURL: '',
                    name: '',
                    items: [],
                    location: {
                        lnt: '0.0',
                        lat: '0.0'
                    },
                    plans: []
                },
                tabs: [
                    'Membership',
                    'Description',
                    'Picture',
                    'Menu',
                    'Comments',
                    'Location',

                ],
                active: 0,
                password:null,
                subscribedPlans: [],
                index:0,
                loaded:false
            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/customer/search') {
                    console.log(to)
                    this.init()
                }
            },
            active(val) {
                console.log(val)
                this.initRestaurantMap()
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            tableNoList() {
                try {
                    let list = []
                    for (let i = 1; i <= this.selectedRest.numOfTables; i++) {
                        list.push(i)
                    }
                    return list
                } catch (e) {
                    return null
                }

            }
        },
        methods: {
            async init() {
                try {
                    this.loaded = false
                    await this.loadCurrentLocation()
                    this.loaded = true
                    this.restaurants = []
                    this.restaurants = await this.$middleware.getAllRestaurants()

                    let addrList = []
                    for (let i = 0; i < this.restaurants.length; i++) {
                        let restLoc = this.restaurants[i].location
                        let distance = this.$utility.distance(this.currentLoc.lat, this.currentLoc.lng, restLoc.lat, restLoc.lng)
                        this.restaurants[i].distance = distance
                        addrList.push(this.restaurants[i].address)
                    }

                    let ratings = await this.$middleware.getAverageRatings(addrList)
                    for (let i = 0; i < this.restaurants.length; i++) {
                        this.restaurants[i].averageRating = ratings[i].toInt()
                    }

                    this.restaurants.sort(function (a, b) {
                        return a.distance - b.distance
                    })

                    let subscribedPlans = await this.$middleware.getSubscribedPlans()
                    this.subscribedPlans = this.plansToDisplay(subscribedPlans)

                    console.log(this.subscribedPlans)

                    console.log(this.restaurants)
                } catch (e) {
                    this.restaurants = []
                    if (this.$route.path == '/customer/search') {
                        this.$store.dispatch('error', {error: e.message})
                    }
                }
                try {
                    this.$refs.map.setLoc(this.currentLoc.lng, this.currentLoc.lat)
                } catch (e) {
                    console.log("this.$refs not loaded")
                }


            },
            toReadableDate(uint) {
                let date = new Date(uint.toInt() * 1000);
                let options = {day: 'numeric', month: 'short', year: 'numeric'};
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },
            async openInfoDialog(index) {

                this.selectedRest = this.restaurants[index]
                let vm = this
                let comments = await this.$middleware.getComments(this.selectedRest.address)
                vm.selectedRest.comments = comments.reverse()
                // console.log("selected",this.selectedRest)
                let plans = await this.$middleware.getMembershipPlans(this.selectedRest.owner)
                vm.selectedRest.plans = this.plansToDisplay(plans)
                this.active = 0

                this.infoDialog = true
            },
            async openOrderDialog(index) {
                this.selectedRest = this.restaurants[index]
                // console.log("selected",this.selectedRest)

                this.orderDialog = true
            },
            placeOrder(tableNo) {
                this.$store.dispatch('setVisitedRestaurant', JSON.parse(JSON.stringify(this.selectedRest)))
                this.$router.push('/customer/place-order/restaurant/' + this.selectedRest.address + '/table/' + tableNo)
            },
            initRestaurantMap() {
                console.log(this.selectedRest.location)
                this.$refs.map2.initMap()

            },

            plansToDisplay(plans) {
                let list = []
                for (let i = 0; i < plans.length; i++) {
                    let item = plans[i]
                    //return(p.no, p.name, p.owners, p.restaurants, p.minSpentAmtList, p.discountAmtList, p.startDate, p.endDate, p.monthlyFee, p.active);
                    let el = {
                        no: item['0'],
                        name: item['1'],
                        owners: item['2'],
                        minSpentAmtList: item['3'],
                        discountAmtList: item['4'],
                        startDate: item['5'],
                        endDate: item['6'],
                        monthlyFee: item['7'].toInt(),
                        active: item['8'],
                        signature: item['9']
                    }
                    console.log(el)

                    if (el.active) {
                        list.push(el)
                    }

                }

                return list
            },

            openPassDialog(index) {
                this.password = null
                this.passDialog = true
                this.index = index
            },

            async enterPassword(){
                console.log(this.password, this.restaurants[this.index].address)
                try {


                    // if(this.password==null || this.password.length==0){
                    //     throw new Error('Please Enter the password')
                    // }

                    await this.$middleware.setOrderAllowance(this.password, this.restaurants[this.index].address)
                    this.passDialog=false

                    this.openOrderDialog(this.index)

                } catch (e) {
                    this.$store.dispatch('error', {error: "Incorrect Password"})
                }
            },

            async loadCurrentLocation(){
                try {
                    let pos = await this.$utility.currentPos()
                    this.currentLoc.lng = pos.lng
                    this.currentLoc.lat = pos.lat
                } catch (e) {
                    this.currentLoc.lng = this.$store.state.default.location.lng
                    this.currentLoc.lat = this.$store.state.default.location.lat
                    if (this.$route.path == '/customer/search') {
                        this.$store.dispatch('error', {error: e.message})
                    }
                }
            }

        }
    }
</script>

<style scoped>

</style>