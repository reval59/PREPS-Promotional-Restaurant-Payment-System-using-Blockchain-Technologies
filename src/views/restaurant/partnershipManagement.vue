<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">group</v-icon>
                <v-toolbar-title>Partnership Management</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex sm12 pa-1>
            <v-card>
                <v-img
                        src="/img/sample/partnership.jpg"
                        aspect-ratio="2.75"
                ></v-img>
                <v-card-title primary-title>
                    <div>
                        <h3 class="title mb-0">Partnership Request</h3>
                        <br>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                            :headers="ReqTableHeaders"
                            :items="requestsToDisplay"
                            item-key="no"
                            hide-actions
                            :expand="expand"
                    >
                        <template v-slot:items="props">


                            <tr @click="props.expanded=!props.expanded">
                                <td class="text-xs-center">{{ props.item.no }}</td>
                                <td class="text-xs-left">{{ props.item.msg }}</td>
                                <td class="text-xs-left">{{ toMsgFromSig(props.item.sig) }}</td>

                            </tr>
                        </template>
                        <template v-slot:expand="props">
                            <v-card flat>
                                <v-card-title color="accent">
                                    <div>
                                        <h3 class="title mb-0" color="accent">Request No. {{ props.item.no }}</h3>

                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div>

                                        <div>
                                            <span class="v-label font-weight-bold">Proposer: </span>
                                            <br>
                                            <ul>
                                                <li><a class="" @click="openInfoDialog(props.item.proposer)">{{props.item.proposer}}</a>
                                                    <span class="v-label font-weight-bold"
                                                          v-if="props.item.proposer==myAddress"> (My Account)</span>
                                                </li>
                                            </ul>

                                        </div>
                                        <br>

                                        <div>
                                            <span class="v-label font-weight-bold">Partners: </span>
                                            <br>
                                            <ul>
                                                <li v-for="(p,index) in props.item.partners">
                                                    <a class="" @click="openInfoDialog(p)">{{p}}</a>
                                                    <span class="v-label font-weight-bold" v-if="p==myAddress"> (My Account) </span>
                                                    <v-chip height="23px" small color="red" label dark
                                                            v-if="!props.item.sig[index]">Not Accepted
                                                    </v-chip>
                                                    <v-chip height="23px" small color="success" label dark
                                                            v-if="props.item.sig[index]">Accepted
                                                    </v-chip>

                                                </li>
                                            </ul>

                                        </div>


                                    </div>
                                </v-card-text>
                                <v-card-actions v-if="props.item.actionable">
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" @click="acceptReq(props.item.no)">accept request</v-btn>
                                </v-card-actions>


                            </v-card>
                        </template>

                    </v-data-table>
                </v-card-text>

                <br><br>
                <v-card-title primary-title>
                    <div>
                        <h3 class="title mb-0">Membership Plan</h3>
                        <br>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                            :headers="PlanTableHeaders"
                            :items="plansToDisplay"
                            item-key="no"
                            hide-actions
                            :expand="expand"
                    >
                        <template v-slot:items="props">


                            <tr @click="expandPlanRow(props)">
                                <td class="text-xs-center">
                                    {{ props.item.no }}
                                </td>
                                <td class="text-xs-left">
                                    <span v-if="props.item.name.length==0">Not specified</span>
                                    <span v-else>
                                        {{ props.item.name }}
                                    </span>

                                </td>
                                <td class="text-xs-left">
                                    <v-chip height="23px" small color="red" label dark
                                            v-if="!props.item.active">In Progress
                                    </v-chip>
                                    <v-chip height="23px" small color="success" label dark
                                            v-if="props.item.active">Active
                                    </v-chip>
                                </td>

                            </tr>
                        </template>

                        <template v-slot:expand="props">
                            <v-card flat>
                                <v-card-title color="accent">
                                    <div>
                                        <h3 class="title mb-0" color="accent">Plan No. {{ props.item.no }}</h3>

                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div>
                                        <v-flex>
                                            <v-text-field
                                                    v-model="planToUpdate.name"
                                                    label="Plan Name"
                                                    placeholder="Not specified"
                                                    required
                                                    :readonly="props.item.active"
                                            ></v-text-field>
                                        </v-flex>


                                        <v-flex xs12>
                                            <v-text-field
                                                    v-model="planToUpdate.monthlyFee"
                                                    type="number"
                                                    label="Monthly Fee $"
                                                    placeholder="Not specified"
                                                    required
                                                    :readonly="props.item.active"
                                            ></v-text-field>
                                        </v-flex>

                                        <!--<v-flex xs12>-->
                                            <!--<v-menu-->
                                                    <!--v-model="datepicker1"-->
                                                    <!--:close-on-content-click="false"-->
                                                    <!--:nudge-right="40"-->
                                                    <!--lazy-->
                                                    <!--transition="scale-transition"-->
                                                    <!--offset-y-->
                                                    <!--full-width-->
                                                    <!--min-width="290px"-->
                                            <!--&gt;-->
                                                <!--<template v-slot:activator="{ on }">-->
                                                    <!--<v-text-field-->
                                                            <!--v-model="planToUpdate.startDate"-->
                                                            <!--label="Start Date"-->
                                                            <!--placeholder="Not specified"-->
                                                            <!--readonly-->
                                                            <!--v-on="on"-->
                                                    <!--&gt;</v-text-field>-->
                                                <!--</template>-->
                                                <!--<v-date-picker v-model="planToUpdate.startDate"-->
                                                               <!--:readonly="props.item.active"-->
                                                               <!--@input="datepicker1 = false"></v-date-picker>-->
                                            <!--</v-menu>-->
                                        <!--</v-flex>-->

                                        <v-flex xs12>
                                            <v-menu
                                                    v-model="datepicker2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    lazy
                                                    transition="scale-transition"
                                                    offset-y
                                                    full-width
                                                    min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                            v-model="planToUpdate.endDate"
                                                            label="End Date"
                                                            placeholder="Not specified"
                                                            readonly
                                                            v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="planToUpdate.endDate"
                                                               :readonly="props.item.active"
                                                               @input="datepicker2 = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>


                                    </div>
                                </v-card-text>

                                <v-card-actions v-if="!props.item.active">
                                    <v-spacer></v-spacer>
                                    <v-btn color="info" @click="updateSelectedPlan(props.item.no)">RESET</v-btn>
                                    <v-btn color="success" @click="updatePlan()">Update Plan</v-btn>
                                </v-card-actions>

                                <v-divider></v-divider>

                                <template v-for="(s, index) in planToUpdate.stakeholders">
                                    <v-card-text>
                                        <div>
                                            <v-flex xs12>
                                                <div>
                                                    <span class="title mb-0">Owner: </span>
                                                    <br>
                                                    <a class="" @click="openInfoDialog(s.owner)">{{s.owner}}</a>
                                                    <span class="v-label font-weight-bold"
                                                          v-if="s.owner==myAddress"> (My Account)</span>
                                                </div>
                                            </v-flex>

                                            <br>
                                            <v-flex xs12>
                                                <v-text-field
                                                        v-model="s.minSpentAmt"
                                                        label="Minimum amount required to be spent for a discount $"
                                                        placeholder="Not specified"
                                                        required
                                                        :readonly="s.owner!=myAddress || props.item.active"
                                                ></v-text-field>
                                            </v-flex>

                                            <v-flex xs12>
                                                <v-text-field
                                                        v-model="s.discountAmt"
                                                        label="Discount amount $"
                                                        placeholder="Not specified"
                                                        required
                                                        :readonly="s.owner!=myAddress || props.item.active"
                                                ></v-text-field>
                                            </v-flex>
                                        </div>
                                    </v-card-text>
                                    <v-card-actions v-if="!props.item.active && s.owner==myAddress">
                                        <v-spacer></v-spacer>
                                        <v-btn color="info" @click="updateSelectedPlan(props.item.no)">RESET</v-btn>
                                        <v-btn color="success"
                                               @click="updateDiscountInfo(props.item.no, s.discountAmt, s.minSpentAmt)">
                                            Update Discount Info
                                        </v-btn>
                                    </v-card-actions>


                                </template>


                            </v-card>

                            <v-card flat>
                                <v-card-title color="accent">
                                    <div>
                                        <h3 class="title mb-0" color="accent">Signature</h3>

                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <ul>
                                        <li v-for="(s, index) in planToUpdate.stakeholders">
                                            {{s.owner}}

                                            <span class="v-label font-weight-bold"
                                                  v-if="s.owner==myAddress"> (My Account)</span>

                                            <v-chip height="23px" small color="success" label dark
                                                    v-if="s.sig">Signed
                                            </v-chip>
                                            <v-chip height="23px" small color="red" label dark
                                                    v-else>Not Signed
                                            </v-chip>
                                        </li>
                                    </ul>
                                </v-card-text>
                                <v-card-actions v-if="props.item.active==false && props.item.signature[props.item.owners.indexOf(myAddress)]==false">
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" @click="signPlan(props.item)">Signature</v-btn>
                                </v-card-actions>
                            </v-card>

                            <v-divider>

                            </v-divider>
                        </template>



                    </v-data-table>
                </v-card-text>

                <br><br>
                <v-card-title primary-title>
                    <div>
                        <h3 class="title mb-0">Withdrawal</h3>
                    </div>


                </v-card-title>
                <v-card-text>

                    <div>
                        The total revenue from your own membership plans:
                        <span class="font-weight-bold">{{amtToWithdraw}}$</span>
                    </div>
                </v-card-text>
                <v-card-actions v-if="amtToWithdraw>0">
                    <v-spacer>

                    </v-spacer>
                    <v-btn color="success" @click="withdraw">Withdraw</v-btn>
                </v-card-actions>
            </v-card>


        </v-flex>

        <v-dialog
                v-model="errDialog"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >Error
                </v-card-title>
                <v-card-text>
                    {{errMsg}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="accent"
                            flat
                            @click="errDialog = false"
                    >
                        close
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

    </v-layout>
</template>

<script>
    import StaticLocationMap from "../../components/StaticLocationMap"
    export default {
        name: "PartnershipManagement",
        components:{StaticLocationMap},
        watch: {
            '$route'(to, from) {
                if (to.path == '/restaurant/partnership-management') {
                    console.log(to)
                    this.init()
                }
            }
        },
        data: () => {
            return {
                requests: [],
                plans: [],
                ReqTableHeaders: [
                    {text: 'No', value: 'no', align: 'center'},
                    {text: 'Message from proposer', value: 'msg'},
                    {text: 'Current Status', value: 'sig'}

                ],

                PlanTableHeaders: [
                    {text: 'No', value: 'no', align: 'center'},
                    {text: 'Name', value: 'name'},
                    {text: 'Current Status', value: 'active'}

                ],
                planToUpdate: {
                    no: '',
                    name: '',
                    startDate: '',
                    endDate: '',
                    monthlyFee: '',
                    stakeholders: []
                },

                amtToWithdraw:0,
                restMap: null,
                ownerSet: null,
                selectedReq: null,
                expand: false,
                selectedRest: {
                    imgURL: '',
                    name: '',
                    items:[],
                    location:{
                        lnt:'0.0',
                        lat:'0.0'
                    },
                },
                tabs:[
                    'Description',
                    'Picture',
                    'Menu',
                    'Location',

                ],
                active: 0,

                menu: false,
                datepicker1: false,
                datepicker2: false,

                errDialog: false,
                errMsg: '',
                confirmDialog: false,
                infoDialog:false
            }
        },
        computed: {
            requestsToDisplay() {
                let list = []
                for (let i = 0; i < this.requests.length; i++) {
                    let item = this.requests[i]
                    let el = {
                        no: item['0'],
                        proposer: item['1'],
                        partners: item['2'],
                        msg: item['3'],
                        sig: item['4']
                    }
                    let index = el.partners.indexOf(this.myAddress)

                    if (index > -1 && el.sig[index] == false) {
                        el.actionable = true
                    } else {
                        el.actionable = false
                    }

                    list.push(el)
                }

                for (let i = 0; i < list.length; i++) {
                    let req = list[i]
                    this.ownerSet.add(req.proposer)
                    for (let j = 0; j < req.partners.length; j++) {
                        this.ownerSet.add(req.partners[j])
                    }
                }

                return list
            },
            plansToDisplay() {
                let list = []
                for (let i = 0; i < this.plans.length; i++) {
                    let item = this.plans[i]
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

                    list.push(el)

                }

                return list
            },
            myAddress() {
                return this.$store.state.user.account.address
            },
            membershipRepository() {
                return this.$store.state.repository.MembershipRepository
            }

        },
        mounted() {
            this.init()
        },
        methods: {
            async init() {
                this.restMap = new Map()
                this.ownerSet = new Set()


                this.retrieveRequests()
                this.retrievePlans()
                // this.retrieveRestaurants()


                await this.$middleware.web3.eth.clearSubscriptions()
                this.retrieveAmtToWithdraw()
                let vm = this
                let now = Math.round(+new Date() / 1000)
                this.subscription = this.$middleware.getContract('MembershipRepository', this.membershipRepository).events.allEvents({fromBlock: 0},
                    (error, data) => {
                        if (data) {
                            if (data.event == "RequestEvent" || data.event == "PlanEvent") {
                                if (data.returnValues.date.toInt() > now && data.returnValues.stakeholder == vm.myAddress) {
                                    if (data.event == "RequestEvent") {
                                        this.retrieveRequests()
                                        // this.retrieveRestaurants()
                                    } else {
                                        this.retrievePlans()
                                        this.updateSelectedPlan()
                                    }
                                }
                            }
                        }

                    })

            },
            toMsgFromSig(sig) {
                let count = 0
                for (let i = 0; i < sig.length; i++) {
                    if (sig[i] == true) {
                        count++
                    }
                }


                return count + ' of ' + sig.length + " accepted"
            },

            async openInfoDialog(owner) {

                let rest = await this.$middleware.getRestaurantsByOwnerList([owner])
                console.log(rest)
                this.selectedRest = rest[0]
                console.log(this.restMap, this.restMap.get(owner))
                this.active = 0

                this.infoDialog = true
                console.log(this.infoDialog)
            },

            async acceptReq(no) {
                let param = {
                    no: no.toInt()
                }

                await this.$middleware.acceptPartnershipRequest(param)
                console.log("success")
                this.init()
            },


            initRestaurantMap(){
                console.log(this.selectedRest.location)
                this.$refs.map.initMap()

            },

            async retrieveRequests() {
                let reqs = await this.$middleware.getPartnershipRequests()
                this.requests = reqs
            },

            async retrievePlans() {
                let planList = await this.$middleware.getMembershipPlans()
                this.plans = planList
            },

            // async retrieveRestaurants() {
            //     let restList = await this.$middleware.getRestaurantsByOwnerList(Array.from(this.ownerSet))
            //     for (let i = 0; i < restList.length; i++) {
            //         let rest = restList[i]
            //         this.restMap.set(rest.owner, rest)
            //     }
            // },
            toReadableDate(uint) {
                let date = new Date(uint.toInt() * 1000)
                let options = {day: 'numeric', month: 'short', year: 'numeric'}
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },

            async updatePlan() {


                try {
                    let p = this.planToUpdate
                    let startDate = Math.round(+new Date(this.planToUpdate.startDate) / 1000)
                    let endDate = Math.round(+new Date(this.planToUpdate.endDate) / 1000)
                    let monthlyFee = this.planToUpdate.monthlyFee.toInt()
                    let now = Math.round(+new Date() / 1000);

                    if (monthlyFee > 0 && endDate > (now + 60 * 60 * 24 * 180) && p.name.length>0) {
                        let param = {
                            no: p.no.toInt(),
                            name: p.name,
                            startDate: now,
                            endDate: endDate,
                            monthlyFee: monthlyFee
                        }

                        console.log(param)

                        await this.$middleware.updatePlan(param)
                    } else {
                        throw Error('Not satisfied condition')

                    }
                } catch (e) {
                    console.log(e)
                    this.updateSelectedPlan(this.planToUpdate.no)
                    this.openErrDialog("Name should not be empty, Monthly Fee should have a positive integer, End Date should be at least 180 days later than the current date")
                }
            },

            async updateDiscountInfo(no, disAmt, minAmt) {
                try {
                    if (disAmt.toInt() > 0 && minAmt.toInt() > disAmt.toInt()) {
                        let param = {
                            no: no.toInt(),
                            discountAmt: disAmt.toInt(),
                            minSpentAmt: minAmt.toInt()
                        }
                        console.log(param)

                        await this.$middleware.updateDiscountInfo(param)
                        console.log("success")
                    } else {
                        throw Error('Not satisfied condition')

                    }
                } catch (e) {
                    console.log(e)
                    this.updateSelectedPlan()
                    this.openErrDialog("Discount amount should be a positive integer greater than minimum amount required to be spent for a discount")
                }
            },

            async signPlan(targetPlan){

                try{
                    console.log("signPlan", targetPlan)

                    if (targetPlan.monthlyFee == 0 || targetPlan.endDate.toInt() == 0 ){
                        throw Error('Not satisfied condition')
                    }
                    for(let i=0; i<targetPlan.owners.length; i++){
                        if(targetPlan.discountAmtList[i].toInt()==0 || targetPlan.minSpentAmtList[i].toInt() <= targetPlan.discountAmtList[i].toInt()){
                            throw Error('Not satisfied condition')
                        }
                    }

                    await this.$middleware.acceptPlan(targetPlan.no.toInt())
                    console.log("success")
                } catch (e) {
                        console.log(e)
                        this.updateSelectedPlan()
                        this.openErrDialog("There should be no empty field in the membership plan")

                }
            },

            openErrDialog(msg) {
                this.errMsg = msg
                this.errDialog = true
            },
            
            async withdraw(){
              try{
                  await this.$middleware.withdraw()
                  await this.retrieveAmtToWithdraw()
              }  catch (e) {
                  this.$store.dispatch('error', {error: e.message})
              }
            },

            async retrieveAmtToWithdraw(){
                this.amtToWithdraw = await this.$middleware.getAmtToWithdraw()
            },

            async updateSelectedPlan() {
                let no = this.planToUpdate.no
                await this.retrievePlans()

                for (let i = 0; i < this.plansToDisplay.length; i++) {
                    let plan = this.plansToDisplay[i]

                    if (plan.no != no) {
                        continue
                    } else {
                        let startDate, endDate
                        if (plan.startDate == '0') {
                            startDate = ''
                        } else {
                            startDate = new Date(plan.startDate.toInt() * 1000).toISOString().split('T')[0]
                        }

                        if (plan.endDate == '0') {
                            endDate = ''
                        } else {
                            endDate = new Date(plan.endDate.toInt() * 1000).toISOString().split('T')[0]
                        }

                        this.planToUpdate = {
                            no: no,
                            name: plan.name,
                            startDate: startDate,
                            endDate: endDate,
                            monthlyFee: plan.monthlyFee,
                            stakeholders: []
                        }

                        for (let i = 0; i < plan.owners.length; i++) {
                            this.planToUpdate.stakeholders.push({
                                owner: plan.owners[i],
                                discountAmt: plan.discountAmtList[i],
                                minSpentAmt: plan.minSpentAmtList[i],
                                sig:plan.signature[i]

                            })
                        }
                        console.log(this.planToUpdate)
                        break
                    }


                }
            },


            expandPlanRow(props) {
                this.planToUpdate.no = props.item.no
                this.updateSelectedPlan()
                props.expanded = !props.expanded
            }

        }
    }
</script>

<style scoped>

</style>