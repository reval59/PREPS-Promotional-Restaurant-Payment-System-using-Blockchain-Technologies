<template>
    <v-layout row wrap>


        <v-flex x12 pa-1>
            <v-card>
                <v-card-title primary-title>

                    <h3 class="title mb-0"> <v-icon color="black">card_membership</v-icon> {{plan.name}}</h3>
                    <v-chip height="20px" small color="error" label dark v-if="plan.expiryDate==0">Not subscribed</v-chip>
                    <v-chip height="20px" small color="yellow darken-3" label dark v-else-if="plan.expiryDate.toInt()<now">Subscribed but expired</v-chip>
                    <v-chip height="20px" small color="success" label dark v-else>Subscribed</v-chip>

                </v-card-title>
                <v-card-text>
                    <div>
                        <div>
                            <span class="v-label font-weight-bold">Membership No: </span>
                            <span class="fs-16">{{plan.no}}</span>
                        </div>

                        <div>
                            <span class="v-label font-weight-bold">Membership Name: </span>
                            <span class="fs-16">{{plan.name}}</span>
                        </div>

                        <div>
                            <span class="v-label font-weight-bold">Offering Start Date: </span>
                            <span class="fs-16">{{ toReadableDate(plan.startDate)}}</span>

                        </div>
                        <div>
                            <span class="v-label font-weight-bold">Offering End Date: </span>
                            <span class="fs-16">{{ toReadableDate(plan.endDate)}}</span>
                        </div>

                        <div>
                            <span class="v-label font-weight-bold">Monthly Fee: </span>
                            <span class="fs-16">{{ plan.monthlyFee}}$</span>
                        </div>

                        <div>
                            <span class="v-label font-weight-bold">Expiry Date: </span>
                            <span class="fs-16" v-if="plan.expiryDate==0"> Not subscribed</span>
                            <span class="fs-16" v-else>{{ toReadableDate(plan.expiryDate)}}</span>

                        </div>


                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions v-if="(now + 30*3600*24) < plan.endDate.toInt()">

                    <v-spacer></v-spacer>
                    <v-btn color="success" v-if="plan.expiryDate==0" @click="subDialog = true">subscribe</v-btn>
                    <v-btn color="success" v-else @click="subDialog = true">renew subscription</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>

        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">restaurant</v-icon>
                <v-toolbar-title>Discount Offers</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>

        <v-flex sm12 md6 pa-1 v-for="(item,index) in plan.restaurants" :key="`item-${index}`">
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
                                <v-chip v-if="item.opened" height="23px" small color="success" label dark>opened</v-chip>
                                 <v-chip v-if="!item.opened" height="23px" small color="red" label dark>closed</v-chip>
                            </span>

                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon class="mr-0" @click="openInfoDialog(index)">
                            <v-icon>info</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>

                        <div>
                             <span class="subheading font-weight-bold">
                                {{plan.discountAmtList[index]}}$ discount offers over {{plan.minSpentAmtList[index]}}$ purchase
                            </span>
                        </div>
                        <br>
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
                        style="max-height:10%"
                >
                    <div>
                        <span class="headline">{{selectedRest.name}}</span>
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
                                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
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
                                            <v-list-tile-content >
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
                                key="Location"
                        >
                            <v-card flat>
                                <!--<v-card-text>-->
                                    <!--<v-btn @click="initRestaurantMap" color="success">Load map</v-btn>-->
                                <!--</v-card-text>-->
                                <v-card-text>
                                    <static-location-map
                                            width="100%"
                                            height="320px" ref="map"
                                            :lng="selectedRest.location.lng" :lat="selectedRest.location.lat"
                                    >

                                    </static-location-map>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                    </v-tabs-items>


                    <!--{{selectedRest.desc}}-->
                </v-card-text>

            </v-card>
        </v-dialog>

        <v-dialog
                v-model="subDialog"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >Confirmation
                </v-card-title>
                <v-card-text>
                    Are you sure to subscribe this membership plan? You need to pay {{plan.monthlyFee}}$ as the monthly fee
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="accent"
                            flat
                            @click="subscribePlan()"
                    >
                        Confirm
                    </v-btn>

                    <v-btn
                            color="accent"
                            flat
                            @click="subDialog = false"
                    >
                        close
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>
    import StaticLocationMap from "../../components/StaticLocationMap";


    export default {
        name: "membership",
        components: {StaticLocationMap},
        data:()=>{
            return {
                plan: null,
                now:null,
                tabs:[
                    'Description',
                    'Picture',
                    'Menu',
                    'Location',

                ],

                selectedRest: {
                    imgURL: '',
                    name: '',
                    items:[],
                    location:{
                        lnt:'0.0',
                        lat:'0.0'
                    },
                },
                active: 0,
                infoDialog: false,
                subDialog:false
            }
        },
        computed:{

        },
        beforeMount(){
            this.init()
        },
        methods:{
            async init(){
                try{
                    let no = this.$route.params.no
                    let plan = await this.$middleware.getMembershipPlan(no)
                    this.plan = await this.plansToDisplay(plan)
                    console.log(this.plan)
                    this.now = Math.round(+new Date() / 1000)
                } catch(e){
                    console.log(e)
                    // this.$router.go(-1)
                }

            },
            async plansToDisplay(plan) {
                let item = plan
                let restaurants = await this.$middleware.getRestaurantsByOwnerList(item['2'])
                let exDate = await this.$middleware.getPlanExpiryDate(item['0'])
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
                    signature: item['9'],
                    restaurants:restaurants,
                    expiryDate:exDate
                }
                return el
            },

            toReadableDate(uint){
                let date = new Date(uint.toInt() * 1000);
                let options = {day: 'numeric', month: 'short', year: 'numeric'};
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },

            async openInfoDialog(index) {

                this.selectedRest = this.plan.restaurants[index]
                this.active = 0

                this.infoDialog = true
            },

            initRestaurantMap(){
                console.log(this.selectedRest.location)
                this.$refs.map.initMap()

            },

            async subscribePlan(){
                try{
                    await this.$middleware.subscribePlan(this.plan)
                    console.log("success")
                    await this.$middleware.updateMyBalance()
                    await this.init()
                    this.subDialog = false
                } catch(e){
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }


            }


        }
    }
</script>

<style scoped>

</style>