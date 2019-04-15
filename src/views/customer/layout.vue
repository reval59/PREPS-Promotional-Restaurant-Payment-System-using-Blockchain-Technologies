<template>
    <div>

        <v-navigation-drawer
                :clipped="drawer.clipped"
                :fixed="drawer.fixed"
                :permanent="drawer.permanent"
                :temporary="drawer.temporary"
                :mini-variant="drawer.mini"
                v-model="drawer.open"
                app

                :touchless = "drawer.touchless"
                :width="drawer.width"
        >
            <v-list>
                <!--<v-list-tile-->
                <!--v-if="!drawer.permanent"-->
                <!--@click="makeDrawerPermanent">-->
                <!--<v-list-tile-action><v-icon>chevron_right</v-icon></v-list-tile-action>-->
                <!--<v-list-tile-content><v-list-tile-title>Static Drawer</v-list-tile-title>-->
                <!--</v-list-tile-content>-->
                <!--</v-list-tile>-->
                <!--<v-list-tile @click="toggleMiniDrawer">-->
                <!--<v-list-tile-action><v-icon>aspect_ratio</v-icon></v-list-tile-action>-->
                <!--<v-list-tile-content><v-list-tile-title>Mini Drawer</v-list-tile-title>-->
                <!--</v-list-tile-content>-->
                <!--</v-list-tile>-->

                <!--<v-divider></v-divider>-->

                <v-list-tile @click="go('/customer/search')">
                    <v-list-tile-action>
                        <v-icon>search</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Search Restaurants</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/customer/current-orders')">
                    <v-list-tile-action>
                        <v-icon>restaurant_menu</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Current Orders</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/customer/history')">
                    <v-list-tile-action>
                        <v-icon>description</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Order History</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>


                <v-list-tile @click="go('/customer/comment')">
                    <v-list-tile-action>
                        <v-icon>thumbs_up_down</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Comments</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>


            </v-list>
        </v-navigation-drawer>

        <v-toolbar
                app
                :fixed="toolbar.fixed"
                :clipped-left="toolbar.clippedLeft"
                color="primary" dark
        >
            <v-toolbar-side-icon
                    @click.stop="toggleDrawer"
            ></v-toolbar-side-icon>
            <v-toolbar-title>PREPS</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="accent" depressed class="hidden-xs-only">
                Your Balance: {{currentBalance}} ETH
            </v-btn>
            <v-btn icon @click="logout">
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                    <router-view></router-view>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer app :fixed="footer.fixed" :clipped-left="footer.clippedLeft" dark color="primary">
            <span class="caption mx-3">&copy; 2019, Noah Kim - City University of Hong Kong</span>

        </v-footer>

    </div>
</template>

<script>
    export default {
        data: () => ({
            userType: 'host',
            drawer: {
                // sets the open status of the drawer
                open: false,
                // sets if the drawer is shown above (false) or below (true) the toolbar
                clipped: true,
                // sets if the drawer is CSS positioned as 'fixed'
                fixed: false,
                // sets if the drawer remains visible all the time (true) or not (false)
                permanent: false,
                // sets the drawer to the mini variant, showing only icons, of itself (true)
                // or showing the full drawer (false)
                mini: false,
                width: 220,
                temporary: false,
                touchless: false
            },
            toolbar: {
                //
                fixed: true,
                // sets if the toolbar contents is leaving space for drawer (false) or not (true)
                clippedLeft: true
            },
            footer: {
                // sets the CSS position of the footer
                fixed: true,
                // sets if the footer is full width (true) or gives space to the drawer (false)
                clippedLeft: true
            },
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            subscription:null
        }),

        methods: {
            // // changes the drawer to permanent
            // makeDrawerPermanent () {
            //   this.drawer.permanent = true
            //   // set the clipped state of the drawer and toolbar
            //   this.drawer.clipped = false
            //   this.toolbar.clippedLeft = false
            // },
            // // toggles the drawer variant (mini/full)
            // toggleMiniDrawer () {
            //   this.drawer.mini = !this.drawer.mini
            // },
            // toggles the drawer type (permanent vs temporary) or shows/hides the drawer
            toggleDrawer() {
                if (this.windowWidth < 960) {
                    this.drawer.temporary = true
                }
                if (this.drawer.permanent) {
                    this.drawer.permanent = !this.drawer.permanent
                    // set the clipped state of the drawer and toolbar
                    this.drawer.clipped = true
                    this.toolbar.clippedLeft = true
                } else {
                    // normal drawer
                    if(this.windowWidth >= 960){
                        this.drawer.permanent = true
                    }
                    this.drawer.open = !this.drawer.open
                }


            },
            logout() {
                this.$router.push('/login')
            },
            go(url) {
                this.$router.push(url)
            },
            handleResize() {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;

            },
            autoToggle() {
                if (this.windowWidth < 960 && this.drawer.open) {
                    this.drawer.permanent = false
                    // this.drawer.open = false


                } else if (this.windowWidth >= 960 && !this.drawer.open) {
                    this.drawer.temporary = false
                    this.drawer.permanent = true
                    this.drawer.open = true

                }
            }

        },
        watch: {
            windowWidth: function (val) {
                this.autoToggle()
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize)
            this.autoToggle()
        },
        destroyed() {
            window.removeEventListener("resize", this.handleResize);
        },
        computed: {
            currentBalance() {
                try {
                    let balance = parseFloat(this.$store.state.user.account.balance).toFixed(2)
                    return balance
                } catch (e) {
                    return 0
                }
            }
        }
    }
</script>