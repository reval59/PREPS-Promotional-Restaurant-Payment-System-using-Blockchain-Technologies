<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">description</v-icon>
                <v-toolbar-title>Order History</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-img
                        src="/img/sample/history.jpg"
                        aspect-ratio="2.75"
                ></v-img>
                <v-card-text>
                    <!--<h5 class="subheading" color="accent">Please select items below</h5>-->
                    <v-data-table
                            :headers="tableHeaders"
                            :items="ordersToDisplay"
                            item-key="no"
                            hide-actions
                            :expand="expand"
                    >
                        <template v-slot:items="props">
                            <tr @click="props.expanded =! props.expanded">
                                <td class="text-xs-left">{{ props.item.createdDateToDisplay }}</td>
                                <td class="text-xs-left">{{ props.item.restaurantAddress }}</td>
                                <td class="text-xs-left">{{ props.item.no }}</td>
                                <td class="text-xs-left">{{ props.item.finallyPaidAmt }}</td>
                            </tr>

                        </template>
                        <template v-slot:expand="props">
                            <v-card flat>
                                <v-card-title color="accent">
                                    <div>
                                        <h3 class="headline mb-0" color="accent">Order No.
                                            {{props.item.no}}</h3>

                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div>
                                        <div>
                                            <span class="v-label font-weight-bold">Restaurant: </span>
                                            <span class="fs-16">{{props.item.restaurantAddress}}</span>
                                        </div>

                                        <div>
                                            <span class="v-label font-weight-bold">Initially Paid Amount: </span>
                                            <span class="fs-16">{{props.item.totalPrice}} $</span>
                                        </div>

                                        <div>
                                            <span class="v-label font-weight-bold">Discount Amount: </span>
                                            <span class="fs-16">{{props.item.discount}} $</span>
                                        </div>

                                        <div>
                                            <span class="v-label font-weight-bold">Refund Amount: </span>
                                            <span class="fs-16">{{props.item.refund}} $</span>
                                        </div>

                                        <div>
                                            <span class="v-label font-weight-bold">Finally Paid Amount: </span>
                                            <span class="fs-16">{{props.item.finallyPaidAmt}} $</span>
                                        </div>



                                    </div>
                                </v-card-text>

                            </v-card>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>

                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "customerHistory",
        data: () => {
            return {
                orders: [],
                ordersToDisplay: [],
                tableHeaders: [
                    {text: 'Created Date', value: 'createdDateToDisplay'},
                    {text: 'Restaurant', value: 'restaurantAddress'},
                    {text: 'No', value: 'no'},

                    {text: 'Amount paid ($)', value: 'finallyPaidAmt'}

                ],
                expand: false,
                tablePropMap: new Map(),
                visitedRestaurant: null

            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/customer/history') {
                    console.log(to)
                    this.init()
                }
            },
        },
        mounted() {
            this.init()
        },
        computed: {
            restaurantRepository() {
                return this.$store.state.repository.RestaurantRepository
            },
            payer() {
                return this.$store.state.user.account.address
            }
        },
        methods: {

            async init() {
                console.log("init")
                try {
                    console.log(this.restaurantRepository)
                    console.log(this.payer)
                    await this.$middleware.web3.eth.clearSubscriptions()
                    let vm = this
                    let contract = this.$middleware.getContract('RestaurantRepository', this.restaurantRepository)
                    this.subscription = contract.getPastEvents('PaidOrder', {
                            fromBlock: 0,
                        },
                        (error, data) => {
                            let promises = []
                            let restAddrList = []
                            for (let i = 0; i < data.length; i++) {
                                let item = data[i]
                                if(item.returnValues.payer==vm.payer){
                                    let param = {
                                        restaurantAddress:item.returnValues.restaurant,
                                        orderNo: item.returnValues.orderNo
                                    }
                                    restAddrList.push(param.restaurantAddress)
                                    promises.push(vm.$middleware.getOrder(param))
                                }
                            }
                            Promise.all(promises).then(result=>{
                                vm.orders = result
                                vm.initOrdersToDisplay(restAddrList)
                            })

                        })


                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }


            },
            initOrdersToDisplay(restAddrList) {

                let orders = JSON.parse(JSON.stringify(this.orders))
                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i]
                    order.createdDate = new Date(order.createdDate * 1000);
                    let options = {day: 'numeric', month: 'short', year: 'numeric'};
                    order.createdDateToDisplay = order.createdDate.toLocaleDateString('en-US', options)
                    order.createdDateToDisplay += '\n' + order.createdDate.toLocaleTimeString('en-US')
                    order.restaurantAddress = restAddrList[i]
                }

                this.ordersToDisplay = orders
                console.log(this.ordersToDisplay)
            }


        }
    }
</script>

<style scoped>

</style>