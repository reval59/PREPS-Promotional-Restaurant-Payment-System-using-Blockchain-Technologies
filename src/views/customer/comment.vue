<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">thumbs_up_down</v-icon>
                <v-toolbar-title>Comment</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-img
                        src="/img/sample/evaluate.jpg"
                        aspect-ratio="2.75"
                ></v-img>
                <v-card-text>
                    <v-data-table
                            :headers="tableHeaders"
                            :items="allowanceToDisplay"
                            item-key="restaurant"
                            hide-actions
                            :expand="expand"
                    >
                        <template v-slot:items="props">
                            <tr>
                                <td class="text-xs-center">{{ toReadableDate(props.item.duedate) }}</td>
                                <td class="text-xs-left">{{ props.item.restaurant }}</td>
                                <td class="text-xs-center"><v-btn color="green" dark @click="openCommentPanel(props)">Comment on</v-btn></td>
                            </tr>

                        </template>
                        <template v-slot:expand="props">
                            <v-card>
                                <v-img
                                        :aspect-ratio="30/6"
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

                                <v-card-text>
                                    {{selectedRest.desc}}
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-text>
                                    <div>
                                        <span class="headline">Comment on {{selectedRest.name}}</span>
                                        <br><br>
                                        <span class="">Proposed Rating: </span>
                                        <v-rating
                                                v-model="selectedRest.proposedRating"
                                                color="yellow darken-3"
                                                dense
                                                size="20"
                                                length="7"
                                                background-color="yellow darken-3"
                                        ></v-rating>
                                        <br>
                                        <v-text-field
                                                v-model="selectedRest.proposedComments"
                                                :counter="40"
                                                label="Comments"
                                                required
                                        ></v-text-field>
                                    </div>
                                </v-card-text>

                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="accent"
                                            flat
                                            @click="openCommentPanel(props)"
                                    >
                                        CLOSE
                                    </v-btn>
                                    <v-btn
                                            color="accent"
                                            flat
                                            @click="makeComment(props)"
                                    >
                                        Confirm
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "comment",
        data: () => {
            return {
                allowanceToDisplay: [],
                tableHeaders: [
                    {text: 'Due Date', value: 'duedate'},
                    {text: 'Restaurant', value: 'restaurant',},
                    {text: 'Actions', value: 'name', sortable: false, align: 'center'}
                ],
                expand: false,
                selectedRest:null,
            }
        },
        computed: {
            restaurantRepository() {
                return this.$store.state.repository.RestaurantRepository
            },
            payer() {
                return this.$store.state.user.account.address
            },
            commentRepository() {
                return this.$store.state.repository.CommentRepository
            }
        },
        mounted() {
            this.init()
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/customer/comment') {
                    console.log(to)
                    this.init()
                }
            },
        },
        methods: {
            async init() {
                await this.$middleware.web3.eth.clearSubscriptions()
                let vm = this
                let contract = this.$middleware.getContract('CommentRepository', this.commentRepository)
                let now = Math.round(+new Date() / 1000);
                // console.log(now)
                let addrSet = new Set()
                let addrList = []
                let dueDateMap = new Map()
                this.subscription = contract.getPastEvents('CommentAllowed', {
                        fromBlock: 0,
                    },
                    (error, data) => {
                        let promises = []
                        for (let i = 0; i < data.length; i++) {
                            let item = data[i]
                            console.log(data[i],vm.payer)
                            if (item.returnValues.payer == vm.payer && item.returnValues.duedate.toInt() > now) {
                                let param = {
                                    restaurantAddress: item.returnValues.restaurant
                                }
                                addrList.push(param.restaurantAddress)
                                promises.push(vm.$middleware.getDueDate(param))
                            }
                        }
                        Promise.all(promises).then(result=>{
                            for(let i=0; i<result.length; i++){
                                if(result[i].toInt()>now){
                                    addrSet.add(addrList[i])
                                    dueDateMap.set(addrList[i], result[i])
                                }
                            }
                            // console.log(addrSet)
                            // console.log(dueDateMap)
                            for(let el of addrSet){
                                let duedate = dueDateMap.get(el)
                                vm.allowanceToDisplay.push({
                                    restaurant: el,
                                    duedate:duedate
                                })
                            }
                        })
                        console.log(vm.allowanceToDisplay)
                    })
            },
            async openCommentPanel(props){
                if(!props.expanded){
                    this.selectedRest = await this.$middleware.getRestaurant(props.item.restaurant)
                    this.selectedRest.proposedRating = 4
                    this.selectedRest.proposedComments = "Food was yummy!"
                }
                props.expanded = !props.expanded


            },

            toReadableDate(uint){
                let date = new Date(uint.toInt() * 1000);
                let options = {day: 'numeric', month: 'short', year: 'numeric'};
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },

            async makeComment(props){
                let vm = this
                try{
                    let param = {
                        restaurant: vm.selectedRest.address,
                        rating: vm.selectedRest.proposedRating,
                        comment: vm.selectedRest.proposedComments
                    }
                    await this.$middleware.makeComment(param)
                    console.log("success", param)
                    props.expanded = false
                    for(let i=0; i<this.allowanceToDisplay.length; i++){
                        if(this.allowanceToDisplay[i].restaurant==vm.selectedRest.address){
                            this.allowanceToDisplay.splice(i, 1)
                        }
                    }
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