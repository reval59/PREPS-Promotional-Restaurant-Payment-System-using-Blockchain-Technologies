import config from '../config/config.json'
import contracts from '../config/contracts'
import store from '../store'
import Web3 from 'web3'

export default {

    // The install method will be called with the Vue constructor as the first argument, along with possible options
    install(Vue, options) {

        // ES6 way of const job = options.job
        // const {providerAddress} = options
        let web3 = new Web3(config.rpcServer.default)

        // Add $plugin instance method directly to Vue components
        // Vue.prototype.$myInfo = (name, age) => info(name, age, job)

        // Add $surname instance property directly to Vue components


        let util = {
            web3: web3,
            getContract(contractName, address) {
                let web3 = this.web3
                // console.log("getContract:",contracts.getJSON(contractName))
                return new web3.eth.Contract(contracts.getJSON(contractName).abi, address)
            },
            async getAccounts() {
                let web3 = this.web3
                let accounts = await web3.eth.getAccounts()
                return accounts
            },
            init() {
                let vue = this
                let restaurantRepository, membershipRepository, commentRepository, deployment
                let contracts = []
                const INITIAL_DEPLOYER_ADDRESS = config.deployerAccount
                vue.web3.eth.getTransactionCount(INITIAL_DEPLOYER_ADDRESS).then(function (result) {
                    if (result == 0) {
                        store.dispatch('error', {error: "No Deployment Contract in the network"})
                    } else {
                        vue.web3.eth.getTransactionFromBlock(1, 0).then(transaction => {
                            return transaction
                        }).then(transaction => {
                            return vue.web3.eth.getTransactionReceipt(transaction.hash)
                        }).then(receipt => {
                            // console.log(receipt)
                            deployment = vue.getContract("Deployment", receipt.contractAddress);
                            console.log("Already deployed: ", receipt.contractAddress)
                            contracts.push(deployment.methods.getRestaurantRepository().call({from: INITIAL_DEPLOYER_ADDRESS}))
                            contracts.push(deployment.methods.getMembershipRepository().call({from: INITIAL_DEPLOYER_ADDRESS}))
                            contracts.push(deployment.methods.getCommentRepository().call({from: INITIAL_DEPLOYER_ADDRESS}))
                            return Promise.all(contracts)
                        }).then(addrList => {
                            // restaurantRepository = vue.getContract("RestaurantRepository",  addrList[0]);
                            // membershipRepository = vue.getContract("MembershipRepository",  addrList[1]);
                            // commentRepository = vue.getContract("CommentRepository",  addrList[2]);

                            console.log("RestaurantRepository", addrList[0])
                            console.log("MembershipRepository", addrList[1])
                            console.log("CommentRepository", addrList[2])
                            store.dispatch('setRepository', {

                                RestaurantRepository: addrList[0],
                                MembershipRepository: addrList[1],
                                CommentRepository: addrList[2]

                            })
                        })
                    }
                })
            },
            async getDueDate(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('CommentRepository', store.state.repository.CommentRepository)
                    return repo.methods.getDueDate(param.restaurantAddress).call({
                        from: sender
                    })
                } catch (e) {
                    throw e
                }
            },
            async proposePartnership(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    await repo.methods.proposePartnership(param.partners, param.msg).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            async getPartnershipRequests() {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    let reqNoList = await repo.methods.getRequestNoList(sender).call({
                        from: sender
                    })

                    let promises = []
                    for (let i = 0; i < reqNoList.length; i++) {
                        promises.push(
                            repo.methods.getRequest(reqNoList[i]).call({
                                from: sender
                            })
                        )
                    }
                    return Promise.all(promises)
                } catch (e) {
                    throw e
                }
            },

            async getMembershipPlans(address) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let addressToSearch = sender
                    if (address) {
                        addressToSearch = address
                    }
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    let planNoList = await repo.methods.getPlanNoList(addressToSearch).call({
                        from: sender
                    })

                    let promises = []
                    for (let i = 0; i < planNoList.length; i++) {
                        promises.push(
                            repo.methods.getPlan(planNoList[i]).call({
                                from: sender
                            })
                        )
                    }
                    return Promise.all(promises)
                } catch (e) {
                    throw e
                }
            },

            async getSubscribedPlans(address) {
                //getPurchasedMembershipNoList(address addr)
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let addressToSearch = sender
                    if (address) {
                        addressToSearch = address
                    }
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    let planNoList = await repo.methods.getPurchasedMembershipNoList(addressToSearch).call({
                        from: sender
                    })

                    let promises = []
                    for (let i = 0; i < planNoList.length; i++) {
                        promises.push(
                            repo.methods.getPlan(planNoList[i]).call({
                                from: sender
                            })
                        )
                    }
                    return Promise.all(promises)
                } catch (e) {
                    throw e
                }
            },

            async getAmtToWithdraw() {
                try {
                    //getAmtToWithdraw

                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    let wei = await repo.methods.getAmtToWithdraw().call({
                        from: sender
                    })

                    return parseFloat(this.web3.utils.fromWei(wei, "ether")).toFixed(2)

                } catch (e) {
                    throw e
                }
            },

            async setRestPassword(password) {
                try {
                    //getAmtToWithdraw

                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = store.state.user.myRestaurant.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.setPassword(password).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })

                } catch (e) {
                    throw e
                }
            },

            async setOrderAllowance(password, restAddr) {
                try {
                    //getAmtToWithdraw

                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.setOrderAllowance(password).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })

                } catch (e) {
                    throw e
                }

            },

            async getDiscountAmount(priceToPay, restAddr) {
                //getDiscountAmount(address customer, uint originalPriceToPay)
                //getDiscountAmount(address customer, uint originalPriceToPay, address restaurant)
                try {
                    //getAmtToWithdraw

                    console.log(priceToPay, restAddr)

                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    return await repo.methods.getDiscountAmount(sender, priceToPay,restAddr).call({
                        from: sender,
                    })


                } catch (e) {
                    throw e
                }
            },

            async getOrderAllowance(restAddr) {
                try {
                    //getAmtToWithdraw

                    console.log("re", restAddr)
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    return await restaurant.methods.getOrderAllowance().call({
                        from: sender
                    })

                } catch (e) {
                    throw e
                }
            },

            async withdraw() {
                try {
                    //getAmtToWithdraw

                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)

                    await repo.methods.withdraw().send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT,
                    })

                    await this.updateMyBalance()

                } catch (e) {
                    throw e
                }
            },

            async getMembershipPlan(no) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)

                    return repo.methods.getPlan(no).call({
                        from: sender
                    })

                } catch (e) {
                    throw e
                }
            },

            async getPlanExpiryDate(no) {
                //getExpiryDate(uint no, address member)

                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)

                    return repo.methods.getExpiryDate(no, sender).call({
                        from: sender
                    })

                } catch (e) {
                    throw e
                }
            },


            //subscribeMembership(uint no, uint numOfMonths)
            async subscribePlan(plan) {
                try {
                    console.log("subscribePlan")
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)

                    return repo.methods.subscribeMembership(plan.no, 1).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT,
                        value: web3.utils.toWei(plan.monthlyFee.toString(), "ether")
                    })

                } catch (e) {
                    throw e
                }
            },


            async acceptPartnershipRequest(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    await repo.methods.acceptPartnershipRequest(param.no).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },


            // setPlan(uint no, string _name, uint _startDate, uint _endDate, uint _monthlyFee)
            async updatePlan(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    await repo.methods.setPlan(param.no, param.name, param.startDate, param.endDate, param.monthlyFee).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            //acceptPlan(uint no)
            async acceptPlan(no) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    await repo.methods.acceptPlan(no).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            // setPlanDiscountAmt(uint no, uint discountAmt, uint minSpentAmt)
            async updateDiscountInfo(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let repo = await this.getContract('MembershipRepository', store.state.repository.MembershipRepository)
                    await repo.methods.setPlanDiscountAmt(param.no, param.discountAmt, param.minSpentAmt).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            async placeOrder(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restaurant = await this.getContract('Restaurant', param.restaurantAddress)
                    await restaurant.methods.placeOrder(param.tableNo, param.itemNoList).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT,
                        value: web3.utils.toWei(param.totalPrice.toString(), "ether")
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                }
            },
            async getOrder(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    // console.log(param.restaurantAddress)
                    let restaurant = await this.getContract('Restaurant', param.restaurantAddress)


                    return restaurant.methods.getOrder(param.orderNo.toInt()).call({
                        from: sender
                    })
                        .then(result => {

                            let json = {
                                no: result[0],
                                payer: result[1],
                                createdDate: result[2],
                                paidDate: result[3],
                                tableNo: result[4],
                                itemNoList: result[5],
                                totalPrice: result[6],
                                refund: result[7],
                                discount: result[8],
                                finallyPaidAmt: result[9],
                                cookingStatusList: result[10]
                            }


                            return json
                        })
                } catch (e) {
                    throw e
                }
            },
            async getCurrentOrders(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    console.log(param.restaurantAddress)
                    let restaurant = await this.getContract('Restaurant', param.restaurantAddress)

                    let orders = []
                    return restaurant.methods.getUnpaidOrderNoList().call({
                        from: sender
                    }).then(result => {
                        let promises = []
                        // console.log(result)
                        for (let i = 0; i < result.length; i++) {
                            let promise = restaurant.methods.getOrder(result[i].toInt()).call({
                                from: sender
                            })
                            promises.push(promise)
                        }
                        return Promise.all(promises)
                    }).then(result => {
                        for (let i = 0; i < result.length; i++) {
                            let json = {
                                no: result[i][0],
                                payer: result[i][1],
                                createdDate: result[i][2],
                                paidDate: result[i][3],
                                tableNo: result[i][4],
                                itemNoList: result[i][5],
                                totalPrice: result[i][6],
                                refund: result[i][7],
                                discount: result[i][8],
                                finallyPaidAmt: result[i][9],
                                cookingStatusList: result[i][10]
                            }
                            orders.push(json)
                        }
                        return orders
                    })
                } catch (e) {
                    throw e
                }
            },
            async getOrderStatus(param) {
                try {
                    let web3 = this.web3
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let numOfItems = param.numOfItems
                    let no = param.no.toInt()
                    let restaurant = await this.getContract('Restaurant', param.restaurantAddress)
                    let promises = []
                    for (let i = 0; i < numOfItems; i++) {
                        let promise = restaurant.methods.getCookingState(no, i).call({
                            from: sender
                        })
                        promises.push(promise)
                    }
                    return await Promise.all(promises)
                } catch (e) {
                    throw e
                }
            },
            async makeProgress(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = store.state.user.myRestaurant.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.makeProgress(param.orderNo, param.itemNoIndex).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },


            async rejectOrderItem(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = store.state.user.myRestaurant.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    console.log(param)
                    await restaurant.methods.rejectMenuItem(param.orderNo, param.itemNoIndex).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            async cancelOrderItem(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = param.restaurantAddress
                    console.log(restAddr)
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.cancelMenuItem(param.orderNo, param.itemNoIndex).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },

            async openMyRestaurant() {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = store.state.user.myRestaurant.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.open().send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                }
            },
            async closeMyRestaurant() {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address
                    let restAddr = store.state.user.myRestaurant.address
                    let restaurant = this.getContract('Restaurant', restAddr)
                    await restaurant.methods.close().send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    console.log(e)
                    throw e
                }
            },
            async registerRestaurant(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    console.log("register: ", sender, param)
                    let restaurantRepository = this.getContract("RestaurantRepository", store.state.repository.RestaurantRepository)
                    await restaurantRepository.methods.registerRestaurant(param.name, param.desc, param.contact, param.imgUrl, param.numOfTables).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })

                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                    // console.log(e)
                    // this.$store.dispatch('error', {error: e.message})
                }
            },

            async getAllRestaurants() {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let restaurantRepository = this.getContract("RestaurantRepository", store.state.repository.RestaurantRepository)
                    return restaurantRepository.methods.getRestaurantAddressList().call({
                        from: sender
                    }).then(restAddrList => {
                        let promises = []
                        for (let i = 0; i < restAddrList.length; i++) {
                            let promise = this.getRestaurant(restAddrList[i], sender)
                            promises.push(promise)
                        }
                        return Promise.all(promises)
                    }).then(result => {
                        return result
                    })
                } catch (e) {
                    throw e
                }
            },

            async updateRestaurant(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    console.log("update: ", sender, param)
                    let myRestAddress = await this.getOwnedRestaurantAddress(store.state.user.myRestaurant.owner)
                    let restaurant = this.getContract("Restaurant", myRestAddress)
                    await restaurant.methods.changeRestaurantInfo(param.name, param.desc, param.contact, param.imgUrl, param.numOfTables).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                    // console.log(e)
                    // this.$store.dispatch('error', {error: e.message})
                }
            },
            async updateRestaurantLoc(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    console.log("updateLoc: ", sender, param)
                    let myRestAddress = await this.getOwnedRestaurantAddress(store.state.user.myRestaurant.owner)
                    let restaurant = this.getContract("Restaurant", myRestAddress)
                    await restaurant.methods.setLocation(param.lng.int, param.lng.dec, param.lat.int, param.lat.dec).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                }
            },
            async addRestaurantMenu(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    console.log("addRestaurantMenu: ", sender, param)
                    let myRestAddress = await this.getOwnedRestaurantAddress(store.state.user.myRestaurant.owner)
                    let restaurant = this.getContract("Restaurant", myRestAddress)
                    await restaurant.methods.addMenuItem(param.name, param.desc, param.imgURL, param.price).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                }
            },
            async removeRestaurantMenu(menuNo) {
                try {
                    console.log(menuNo)
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    console.log("removeRestaurantMenu: ", sender)
                    let myRestAddress = await this.getOwnedRestaurantAddress(store.state.user.myRestaurant.owner)
                    let restaurant = this.getContract("Restaurant", myRestAddress)
                    await restaurant.methods.removeMenuItem(menuNo).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                    this.retrieveUserInfo(currentAccount.address, currentAccount.privateKey)
                } catch (e) {
                    throw e
                }
            },
            async updateMyBalance() {
                try {
                    // console.log("Start retrieveAccount")
                    let account = JSON.parse(JSON.stringify(store.state.user.account))
                    account.balance = await this.getBalance(account.address)
                    store.dispatch('setUserAccount', account)
                } catch (e) {
                    console.log(e)
                    throw e
                }
            },
            async retrieveAccount(address, privateKey) {
                try {
                    // console.log("Start retrieveAccount")

                    if (config.testMode) {
                        let account = {}
                        account.address = address
                        account.balance = await this.getBalance(address)
                        // account.unlocked = await this.isUnlocked(address)
                        account.privateKey = null
                        store.dispatch('setUserAccount', account)

                    } else {
                        throw "Only test mode is allowed"
                    }
                    // console.log("End retrieveAccount")
                } catch (e) {
                    console.log(e)
                    store.dispatch('error', {error: e.message})
                }

            },
            async retrieveMyRestaurant() {
                try {
                    // console.log("Start retrieveMyRestaurant")
                    let restAddress = await this.getOwnedRestaurantAddress(store.state.user.account.address)
                    if (restAddress == null) console.log("Current user logged in does not have his own restaurant")
                    else {
                        let myRestaurant = await this.getRestaurant(restAddress)
                        store.dispatch('setMyRestaurant', myRestaurant)
                    }
                    // console.log("End retrieveMyRestaurant")
                } catch (e) {
                    console.log(e)
                    store.dispatch('error', {error: e.message})
                }

            },
            async getCurrentlyVisitingRestAddr() {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let address = store.state.repository.RestaurantRepository
                    let restReopo = this.getContract("RestaurantRepository", address)
                    let result = await restReopo.methods.getVisitedRestaurant(sender).call({
                        from: sender
                    })
                    return result
                } catch (e) {
                    throw e
                }
            },
            async retrieveUserInfo(address, privateKey) {
                try {
                    // console.log("Start retrieveUserInfo")
                    await this.retrieveAccount(address, privateKey)
                    await this.retrieveMyRestaurant(address, privateKey)
                    // console.log("End retrieveUserInfo")
                } catch (e) {
                    console.log(e)
                    store.dispatch('error', {error: e.message})

                }
            },
            async getAverageRatings(restList) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let address = store.state.repository.CommentRepository
                    //makeComment(address _restaurant, string _comment, uint _rating)
                    let commentRepo = this.getContract("CommentRepository", address)
                    let promises = []
                    for (let i = 0; i < restList.length; i++) {
                        promises.push(
                            commentRepo.methods.getAverageRating(restList[i]).call({
                                from: sender
                            })
                        )
                    }
                    return Promise.all(promises)

                } catch (e) {
                    throw e
                }
            },

            async getComments(restaurant) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let address = store.state.repository.CommentRepository
                    //makeComment(address _restaurant, string _comment, uint _rating)
                    let commentRepo = this.getContract("CommentRepository", address)
                    let noList = await commentRepo.methods.getCommentNoList(restaurant).call({
                        from: sender
                    })
                    let promises = []

                    for (let i = 0; i < noList.length; i++) {
                        promises.push(
                            commentRepo.methods.getComment(noList[i].toInt()).call({
                                from: sender
                            })
                        )
                    }
                    return Promise.all(promises)


                } catch (e) {
                    throw e
                }
            },
            async makeComment(param) {
                try {
                    let currentAccount = store.state.user.account
                    let sender = currentAccount.address

                    let address = store.state.repository.CommentRepository
                    //makeComment(address _restaurant, string _comment, uint _rating)
                    let commentRepo = this.getContract("CommentRepository", address)
                    return commentRepo.methods.makeComment(param.restaurant, param.comment, param.rating).send({
                        from: sender,
                        gasPrice: config.GAS_PRICE,
                        gas: config.GAS_LIMIT
                    })
                } catch (e) {
                    throw e
                }
            },
            async getRestaurantsByOwnerList(ownerList) {
                let sender = store.state.user.account.address
                let repo = this.getContract("RestaurantRepository", store.state.repository.RestaurantRepository)
                //getRestaurantAddress

                let promises = []

                for (let i = 0; i < ownerList.length; i++) {
                    promises.push(
                        repo.methods.getRestaurantAddress(ownerList[i]).call({
                            from: sender
                        })
                    )
                }

                let restList = await Promise.all(promises)
                promises = []
                let h = this
                for (let i = 0; i < restList.length; i++) {
                    promises.push(
                        h.getRestaurant(restList[i])
                    )
                }

                return await Promise.all(promises)
            },
            getRestaurant(restAddress) {
                let sender = store.state.user.account.address
                let json = {
                    address: restAddress,
                    owner: null,
                    name: null,
                    contact: null,
                    desc: null,
                    imgURL: null,
                    numOfTables: null,
                    location: {
                        lat: null,
                        lng: null
                    },
                    itemNoList: [],
                    items: [],
                    balance: null,
                    opened: null
                }
                let web3 = this.web3
                let restaurant = this.getContract("Restaurant", restAddress)
                // console.log("restAddress", restAddress)
                // return restaurant.methods.getRestaurantInfo().call({from:sender}).then(result=>{
                //     console.log(result)
                // })
                return restaurant.methods.getRestaurantInfo().call({from: sender})
                    .then(result => {
                        // console.log("1",result)
                        json.owner = result[0]
                        json.name = result[1]
                        json.desc = result[2]
                        json.contact = result[3]
                        json.imgURL = result[4]
                        json.numOfTables = result[5]
                        json.opened = result[6]
                        return restaurant.methods.getLocationInfo().call({from: sender})
                    }).then(result => {
                        // console.log("2",result)
                        json.location.lng = result[0] + '.' + result[1]
                        json.location.lat = result[2] + '.' + result[3]
                        return restaurant.methods.getMenuItemNoList().call({from: sender})
                    }).then(result => {
                        // console.log("3",result)
                        json.itemNoList = result
                        let promises = []
                        for (let i = 0; i < result.length; i++) {
                            promises.push(restaurant.methods.getMenuItem(result[i]).call({from: sender}))
                        }
                        return Promise.all(promises)
                    }).then(result => {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                no: result[i][0],
                                name: result[i][1],
                                desc: result[i][2],
                                imgURL: result[i][3],
                                available: result[i][4],
                                price: result[i][5]
                            }
                            json.items.push(item)
                        }
                        return web3.eth.getBalance(restAddress)

                    }).then(result => {
                        let balance = Number.parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2)
                        json.balance = balance
                        return json
                    })
            },
            async getOwnedRestaurantAddress(accountAddress) {
                let restaurantRepository = this.getContract("RestaurantRepository", store.state.repository.RestaurantRepository)
                // console.log(store.state.repository.RestaurantRepository)
                return restaurantRepository.methods.isOwner(accountAddress).call({
                    from: accountAddress
                }).then(result => {
                    if (!result) {
                        throw "notOwner"
                    }
                    return restaurantRepository.methods.getRestaurantAddress(accountAddress).call({
                        from: accountAddress
                    }).then(result => {
                        return result
                    })
                }).catch(e => {
                    return null
                })
            },
            // async isUnlocked(address) {
            //     let web3 = this.web3
            //     try {
            //         await web3.eth.sign("", address);
            //     } catch (e) {
            //         return false;
            //     }
            //     return true;
            // },
            async getBalance(address) {
                // console.log("Start getBalance")
                let balanceInWei = await this.web3.eth.getBalance(address)
                // console.log("End getBalance")
                return this.web3.utils.fromWei(balanceInWei, "ether")
            }


        }
        Vue.prototype.$middleware = util

        // Web3.js
    }
}