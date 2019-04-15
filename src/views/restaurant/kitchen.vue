<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">restaurant_menu</v-icon>
                <v-toolbar-title>Kitchen Monitor</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-img
                        src="/img/sample/kitchen.jpg"
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
                            <tr @click="props.expanded=!props.expanded">
                                <td class="text-xs-center">{{ props.item.no }}</td>
                                <td class="text-xs-left">{{ props.item.createdDateToDisplay }}</td>
                                <td class="text-xs-center">{{ props.item.tableNo }}</td>
                                <td class="text-xs-left">{{ props.item.itemNameList }}</td>
                                <td class="text-xs-left">{{ props.item.totalPrice }}</td>
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
                                            <span class="v-label font-weight-bold">Payer: </span>
                                            <span class="fs-16">{{props.item.payer}}</span>
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

                                <v-card-text>
                                    <v-data-table
                                            :headers="subTableHeaders"
                                            :items="props.item.status"
                                            item-key="props.index"
                                            hide-actions
                                    >
                                        <template v-slot:items="props">


                                            <tr>
                                                <td class="text-xs-center">{{ props.item.no }}</td>
                                                <td class="text-xs-left">{{ props.item.name }}</td>
                                                <td class="text-xs-left">
                                                    <v-chip height="23px" small
                                                            :color="props.item.cookingStatus.color" label dark>
                                                        {{props.item.cookingStatus.name}}
                                                    </v-chip>
                                                </td>
                                                <td class="justify-center layout px-0">
                                                    <v-btn @click="makeProgress(props)"
                                                           v-if="props.item.cookingStatus.value==0 || props.item.cookingStatus.value==1"
                                                           dark color="blue" small depressed>progress
                                                    </v-btn>
                                                    <v-btn  @click="rejectOrderItem(props)"
                                                            v-if="props.item.cookingStatus.value==0 || props.item.cookingStatus.value==1"
                                                           dark color="red" small depressed> reject
                                                    </v-btn>
                                                </td>
                                            </tr>
                                        </template>

                                    </v-data-table>
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
        name: "kitchen",
        data: () => {
            return {
                orders: [],
                ordersToDisplay: [],
                tableHeaders: [
                    {text: 'No', value: 'no', align: 'center'},
                    {text: 'Created Date', value: 'createdDateToDisplay'},
                    {text: 'Table No', value: 'tableNo', align: 'center'},
                    {text: 'Menu Item List', value: 'itemNameList'},


                    {text: 'Amount paid ($)', value: 'totalPrice'}

                ],
                subTableHeaders: [
                    {text: 'Item No', value: 'no', align: 'center'},
                    {text: 'Name', value: 'name'},
                    {text: 'Current Status', value: 'cookingStatus.value'},
                    {text: 'Actions', value: 'name', sortable: false, align: 'center'}
                ],
                expand: false,
                subscription: null

            }
        },
        watch: {
            '$route'(to, from) {
                if (to.path == '/restaurant/kitchen') {
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
            }
        },
        methods: {
            async init() {

                try {
                    await this.updateOrders()

                    await this.$middleware.web3.eth.clearSubscriptions()

                    let vm = this
                    let now = Math.round(+new Date()/1000);
                    console.log(now)
                    this.subscription = this.$middleware.getContract('Restaurant', this.myRest.address).events.allEvents({fromBlock: 0},
                        (error, data) => {
                            if (data) {
                                if (data.event == "UpdateOrderStatus" || data.event == "NewOrder") {
                                    if (data.returnValues.emitTime.toInt()>now) {
                                        vm.updateOrders()
                                        vm.$middleware.updateMyBalance()
                                    }
                                }
                            }

                        })



                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }


            },

            initOrdersToDisplay() {

                let orders = JSON.parse(JSON.stringify(this.orders))
                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i]
                    order.createdDate = new Date(order.createdDate * 1000);
                    let options = {day: 'numeric', month: 'short', year: 'numeric'};
                    order.createdDateToDisplay = order.createdDate.toLocaleDateString('en-US', options)
                    order.createdDateToDisplay += '\n' + order.createdDate.toLocaleTimeString('en-US')
                    order.itemNameList = this.getItemNameList(order.itemNoList).join(', ')
                    order.status = this.displayOrderStatus(order)

                }

                this.ordersToDisplay = orders
                console.log(orders)
            },

            getItemNameList(itemNoList) {

                let list = []
                let items = JSON.parse(JSON.stringify(this.myRest.items))
                for (let i = 0; i < itemNoList.length; i++) {
                    for (let j = 0; j < items.length; j++) {
                        if (itemNoList[i] == items[j].no) {
                            list.push(items[j].name)
                            break
                        }
                    }
                }
                return list
            },
            displayOrderStatus(item) {
                let list = []
                for (let i = 0; i < item.itemNoList.length; i++) {
                    let nameList = item.itemNameList.split(', ')
                    let value = item.cookingStatusList[i]
                    let name, color

                    if (value == '0') {
                        name = "Pending"
                        color = "green"
                    } else if (value == '1') {
                        name = "inProgress"
                        color = "orange"
                    } else if (value == '2') {
                        name = "Cancelled"
                        color = "red"
                    } else if (value == '3') {
                        name = "Rejected"
                        color = "red"
                    } else { // value == '4'
                        name = "Completed"
                        color = "red"
                    }
                    let el = {
                        no: item.itemNoList[i],
                        name: nameList[i],

                        cookingStatus: {
                            value: value,
                            name: name,
                            color: color
                        },
                        index: i,
                        orderNo: item.no
                    }
                    list.push(el)
                }
                // item.status = list
                return list
            },
            async makeProgress(props) {
                try {
                    let param = {
                        orderNo: props.item.orderNo.toInt(),
                        itemNoIndex: props.item.index
                    }
                    console.log(props.item)
                    await this.$middleware.makeProgress(param)
                    await this.updateOrders()

                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            },
            async rejectOrderItem(props) {
                try {
                    let param = {
                        orderNo: props.item.orderNo.toInt(),
                        itemNoIndex: props.item.index
                    }
                    console.log(props.item)
                    await this.$middleware.rejectOrderItem(param)
                    await this.updateOrders()

                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            },
            async updateOrders() {
                if (this.myRest != null) {
                    let restaurantAddress = this.myRest.address
                    let param = {
                        restaurantAddress: restaurantAddress
                    }
                    try {
                        this.orders = await this.$middleware.getCurrentOrders(param)
                        this.orders = JSON.parse(JSON.stringify(this.orders))
                        this.orders.sort(function (a, b) {
                            return a.no.toInt() - b.no.toInt()
                        })
                        this.initOrdersToDisplay()
                    } catch (e) {
                        console.log(e)
                        // this.$store.dispatch('error', {error: e.message})

                    }

                }

            }
        }
    }
</script>

<style scoped>

</style>