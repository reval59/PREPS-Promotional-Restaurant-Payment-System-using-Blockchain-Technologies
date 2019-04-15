<template>
    <v-layout row wrap>

        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">restaurant_menu</v-icon>
                <v-toolbar-title>Place Order</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title color="accent">
                    <v-icon color="black">shopping_cart</v-icon>
                    <v-toolbar-title>Current Items:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" dark v-if="selectedRows.length>0" @click="deleteSelectedRows">Delete</v-btn>
                </v-card-title>
                <v-card-text>
                    <h5 class="subheading" color="accent" v-if="selectedItemNoList.length==0">Please select items
                        below</h5>
                    <v-data-table
                            :headers="tableHeaders"
                            :items="selectedItemList"
                            v-model="selectedRows"
                            item-key="key"
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
                            <td class="text-xs-left">{{ props.item.no }}</td>
                            <td class="text-xs-left">{{ props.item.name }}</td>
                            <td class="text-xs-left">{{ props.item.desc }}</td>
                            <td class="text-xs-left">{{ props.item.price }}</td>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-text v-if="selectedItemNoList.length>0" class="text-xs-right">
                    <v-divider></v-divider>

                    <br>
                   <span class="font-weight-bold">Total Price: {{totalPriceToPay}} HKD </span><br>
                    <span class="font-weight-bold">Discount: {{discountAmt}} HKD </span><br>
                    <span class="font-weight-bold">Final Price: {{finalPriceToPay}} HKD </span>

                </v-card-text>
                <v-card-actions v-if="selectedItemNoList.length>0">
                    <v-spacer></v-spacer>
                    <v-btn color="accent" flat @click="openOrderDialog">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex pa-1>
            <v-card>
                <v-img
                        :src="visitedRestaurant.imgURL"
                        aspect-ratio="2.75"
                ></v-img>

                <v-card-title color="accent">
                    <div>
                        <h3 class="headline mb-0" color="accent">{{visitedRestaurant.name}} (Table No:
                            {{currentTableNo}})</h3>

                    </div>
                </v-card-title>
                <v-card-text>
                    You can place order until {{orderAllowance}}
                </v-card-text>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 lg4 pa-1 v-for="(item,index) in visitedRestaurant.items"
                                :key="`item-${index}`">
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
                                </v-layout>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="accent" @click="addItem(item.no)">Add to cart</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card-text>


            </v-card>
        </v-flex>
        <v-dialog
                v-model="orderDialog"
                width="500"
        >
            <v-card>
                <v-card-title
                        class="headline lighten-2"
                        primary-title
                >
                    <div>
                        <span class="headline">Order Confirmation</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    The final amount is {{finalPriceToPay}} HKD in case of no cancellation <br>
                    Are you sure to pay that amount and place an order?
                </v-card-text>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="accent"
                            flat
                            @click="checkout"
                    >
                        CHECKOUT
                    </v-btn>
                    <v-btn
                            color="primary"
                            flat
                            @click="orderDialog = false"
                    >
                        CANCEL
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>


</template>

<script>
    export default {
        data: () => ({
            selectedItemNoList: [],
            tableHeaders: [
                {text: 'No', value: 'no'},
                {text: 'Name', value: 'name'},
                {text: 'Description', value: 'desc'},
                {text: 'Unit Price (HKD)', value: 'price'},

            ],
            orderDialog: false,
            selectedRows: [],
            orderAllowance: 0,
            visitedRestaurant:null,
            discountAmt:0,

        }),
        watch: {
            '$route'(to, from) {
                console.log(to)
                if (to.path == '/customer/place-order') {
                    console.log(to)
                    this.init()
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            async init() {
                let restaurantAddress = await this.$middleware.getCurrentlyVisitingRestAddr()
                let zeroAddress = '0x0000000000000000000000000000000000000000'
                console.log(restaurantAddress, this.currentRestaurantAddress)
                if (restaurantAddress !== zeroAddress && restaurantAddress !== this.currentRestaurantAddress) {
                    this.$router.push('/customer/current-orders')
                    this.$store.dispatch('error', {error: 'You have already ordered in a restaurant'})
                }

                this.visitedRestaurant = await this.$middleware.getRestaurant(this.currentRestaurantAddress)
                let allowance = await this.$middleware.getOrderAllowance(this.currentRestaurantAddress)
                this.orderAllowance =this.toReadableDate(allowance)

                let now = Math.round(+new Date() / 1000)


                console.log(now>=allowance.toInt())
                if(now>=allowance.toInt()){
                    this.$router.push('/customer/search')
                    this.$store.dispatch('error', {error: 'You should enter the password again'})
                }

            },
            async addItem(itemNo) {
                this.selectedItemNoList.push(itemNo)

                let discountAmt = await this.$middleware.getDiscountAmount(this.totalPriceToPay, this.visitedRestaurant.address)
                this.discountAmt = discountAmt
                console.log(discountAmt)

            },
            toReadableDate(uint) {
                let date = new Date(uint.toInt() * 1000);
                let options = {day: 'numeric', month: 'short', year: 'numeric'};
                let result = date.toLocaleDateString('en-US', options)
                result += '\n' + date.toLocaleTimeString('en-US')
                return result
            },
            deleteSelectedRows() {
                let list = []
                for (let i = 0; i < this.selectedItemNoList.length; i++) {
                    let notSelected = true
                    for (let j = 0; j < this.selectedRows.length; j++) {
                        if (this.selectedRows[j].key == i) {
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
            openOrderDialog() {
                this.orderDialog = true;
            },
            async checkout() {
                try {
                    let param = {}
                    param.tableNo = this.currentTableNo.toInt()
                    param.restaurantAddress = this.currentRestaurantAddress
                    param.itemNoList = this.selectedItemNoList.map(Number)
                    param.totalPrice = this.totalPriceToPay
                    console.log(param)
                    await this.$middleware.placeOrder(param)
                    this.$router.push('/customer/current-orders')
                } catch (e) {
                    console.log(e)
                    this.$store.dispatch('error', {error: e.message})
                }
            }

        },
        computed: {
            selectedItemList() {
                let list = []
                for (let i = 0; i < this.selectedItemNoList.length; i++) {
                    for (let j = 0; j < this.visitedRestaurant.items.length; j++) {
                        let item = this.visitedRestaurant.items[j]
                        if (this.selectedItemNoList[i] == item.no) {
                            list.push(JSON.parse(JSON.stringify(item)))
                        }
                    }
                }

                for (let i = 0; i < list.length; i++) {
                    list[i].key = i
                }
                return list
            },
            totalPriceToPay() {
                if (this.selectedItemNoList.length == 0) return 0;
                else {
                    let sum = 0;
                    for (let i = 0; i < this.selectedItemList.length; i++) {
                        sum += this.selectedItemList[i].price.toInt()
                    }
                    return sum
                }
            },

            finalPriceToPay() {
                return this.totalPriceToPay - this.discountAmt
            },
            currentTableNo() {
                return this.$route.params.no
            },
            currentRestaurantAddress() {
                return this.$route.params.address
            }
        }
    }
</script>

<style scoped>

</style>