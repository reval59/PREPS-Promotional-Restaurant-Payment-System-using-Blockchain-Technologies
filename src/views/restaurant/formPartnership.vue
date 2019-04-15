<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1 v-if="myRest">
            <v-toolbar color="white" light>
                <v-icon color="black">group</v-icon>
                <v-toolbar-title>Form Partnership</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
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

        <v-flex sm12 md6 pa-1>
            <v-card>
                <v-card-title color="accent">
                    <v-icon color="black">supervised_user_circle</v-icon>
                    <v-toolbar-title>Prospective Partner Restaurants:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" dark v-if="selectedRows.length>0" @click="deleteSelectedRows">Delete</v-btn>
                </v-card-title>
                <v-card-text>
                    <h5 class="subheading" color="accent" v-if="selectedItemNoList.length==0">Please select candidates
                        below</h5>
                    <v-data-table
                            :headers="tableHeaders"
                            :items="selectedItemList"
                            v-model="selectedRows"
                            item-key="address"
                            select-all
                            hide-actions
                            v-if="selectedItemNoList.length>0"
                    >
                        <template v-slot:items="props">
                            <td>
                                <v-checkbox
                                        v-model="props.selected"
                                        primary
                                        hide-details
                                ></v-checkbox>
                            </td>

                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.desc }}</td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions v-if="selectedItemNoList.length>0">
                    <v-spacer></v-spacer>
                    <v-btn color="accent" flat @click="openProposalDialog">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-toolbar color="white" light>
            <v-icon color="black">restaurant</v-icon>
            <v-toolbar-title>Nearby Restaurants</v-toolbar-title>
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
                            :aspect-ratio="16/9"
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

                    <v-btn
                            dark
                            color="success"
                            @click="addItem(item.owner)"
                    >
                        SELECT AS CANDIDATE
                    </v-btn>
                </v-card>
            </v-hover>
        </v-flex>
        <v-dialog
                v-model="proposalDialog"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >
                    <div>
                        <span class="headline">Proposal Confirmation</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                            name="msg"
                            label="Message"
                            v-model="proposalMsg"
                            required
                            color="primary"
                    ></v-text-field>
                    Are you sure to propose partnership to the selected candidates?
                </v-card-text>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="accent"
                            flat
                            @click="proposePartnership()"
                    >
                        Confirm
                    </v-btn>
                    <v-btn
                            color="primary"
                            flat
                            @click="proposalDialog = false"
                    >
                        CANCEL
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
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
                                <v-card-text>
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
                                <v-card-text>
                                    <v-btn @click="initRestaurantMap" color="success">Load map</v-btn>
                                </v-card-text>
                                <v-card-text>
                                    <static-restaurant-map
                                            width="100%"
                                            height="320px" ref="map2"
                                            :lng="myRest.location.lng" :lat="myRest.location.lat"
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
    </v-layout>

</template>

<script>
    import StaticLocationMap from "../../components/StaticLocationMap"
    import StaticRestaurantMap from "../../components/StaticRestaurantMap"

    export default {
        name: "formPartnership",
        components: {StaticLocationMap, StaticRestaurantMap},
        data: () => {
            return {
                restaurants: [],
                defaultRating: 4,
                infoDialog: false,
                proposalDialog: false,
                selectedRest: {
                    imgURL: '',
                    name: '',
                    items: [],
                    location: {
                        lnt: '0.0',
                        lat: '0.0'
                    }
                },
                tabs: [
                    'Description',
                    'Picture',
                    'Menu',
                    'Comments',
                    'Location',

                ],
                active: 0,
                proposalMsg: 'I am looking forward to forming partnership with you',

                selectedItemNoList: [],
                tableHeaders: [
                    {text: 'Name', value: 'name'},
                    {text: 'Description', value: 'desc'},

                ],
                selectedRows: []

            }
        },
        computed: {
            myRest() {
                try {
                    return this.$store.state.user.myRestaurant
                } catch (e) {
                    return {imgURL: this.$store.state.default.imgURL}
                }
            },
            selectedItemList() {
                let list = []
                for (let i = 0; i < this.selectedItemNoList.length; i++) {
                    for (let j = 0; j < this.restaurants.length; j++) {
                        let item = this.restaurants[j]
                        if (this.selectedItemNoList[i] == item.owner) {
                            list.push(JSON.parse(JSON.stringify(item)))
                        }
                    }
                }

                return list
            },
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/restaurant/form-partnership') {
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
        methods: {
            async init() {
                try {
                    this.restaurants = []
                    this.restaurants = await this.$middleware.getAllRestaurants()

                    let addrList = []
                    let myRestIndex
                    for (let i = 0; i < this.restaurants.length; i++) {
                        if (this.restaurants[i].address == this.myRest.address) {
                            myRestIndex = i
                        } else {
                            let restLoc = this.restaurants[i].location
                            let distance = this.$utility.distance(this.myRest.location.lat, this.myRest.location.lng, restLoc.lat, restLoc.lng)
                            this.restaurants[i].distance = distance
                            addrList.push(this.restaurants[i].address)
                        }

                    }

                    this.restaurants.splice(myRestIndex, 1)

                    let ratings = await this.$middleware.getAverageRatings(addrList)
                    for (let i = 0; i < this.restaurants.length; i++) {
                        this.restaurants[i].averageRating = ratings[i].toInt()
                    }

                    this.restaurants.sort(function (a, b) {
                        return a.distance - b.distance
                    })

                    if (this.myRest != null) {
                        this.$refs.map.initMap()
                    }
                } catch (e) {
                    this.restaurants = []
                    if(this.$route.path=='/restaurant/form-partnership'){
                        this.$store.dispatch('error', {error: e.message})
                    }

                }
            },
            async openInfoDialog(index) {

                this.selectedRest = this.restaurants[index]
                let vm = this
                let comments = await this.$middleware.getComments(this.selectedRest.address)
                vm.selectedRest.comments = comments.reverse()
                // console.log("selected",this.selectedRest)
                this.active = 0

                this.infoDialog = true
            },
            initRestaurantMap() {
                console.log(this.selectedRest.location)
                this.$refs.map2.initMap()

            },
            openProposalDialog() {
                this.proposalDialog = true
            },
            toReadableDate(uint) {
                let date = new Date(uint.toInt() * 1000);
                let options = {day: 'numeric', month: 'short', year: 'numeric'};
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },
            addItem(addr) {
                let found = false
                for (let i = 0; i < this.selectedItemNoList.length; i++) {
                    if (this.selectedItemNoList[i] == addr) {
                        found = true
                        break
                    }
                }
                if (!found) {
                    this.selectedItemNoList.push(addr)
                }
            },
            async proposePartnership() {
                let vm = this

                let param = {
                    partners: JSON.parse(JSON.stringify(vm.selectedItemNoList)),
                    msg:vm.proposalMsg
                }
                console.log(param)
                await this.$middleware.proposePartnership(param)
                this.$router.push('/restaurant/partnership-management')
                try{

                } catch(e){
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            },
            deleteSelectedRows() {
                let list = []
                console.log(this.selectedRows, this.selectedItemNoList)
                for (let i = 0; i < this.selectedItemNoList.length; i++) {
                    let notSelected = true
                    for (let j = 0; j < this.selectedRows.length; j++) {
                        if (this.selectedRows[j].owner == this.selectedItemNoList[i]) {
                            notSelected = false;
                            break;
                        }
                    }
                    if (notSelected) {
                        console.log(notSelected)
                        list.push(this.selectedItemNoList[i])
                    }
                }
                this.selectedRows = []
                this.selectedItemNoList = list
            },
        }
    }
</script>

<style scoped>

</style>