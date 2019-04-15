<template>
    <div>

        <v-navigation-drawer
                :clipped="drawer.clipped"
                :fixed="drawer.fixed"
                :permanent="drawer.permanent"
                :mini-variant="drawer.mini"
                v-model="drawer.open"
                app
                stateless
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

                <v-list-tile @click="go('/restaurant/register')">
                    <v-list-tile-action>
                        <v-icon>create</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Registration</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/restaurant/dashboard')">
                    <v-list-tile-action>
                        <v-icon>dashboard</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Dashboard</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/restaurant/kitchen')">
                    <v-list-tile-action>
                        <v-icon>restaurant_menu</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Kitchen Monitor</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/restaurant/history')">
                    <v-list-tile-action>
                        <v-icon>description</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Order History</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/restaurant/table')">
                    <v-list-tile-action>
                        <v-icon>aspect_ratio</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Table QR Code</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="go('/restaurant/membership')">
                    <v-list-tile-action>
                        <v-icon>group</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Partnership</v-list-tile-title>
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
            <v-btn color="accent" depressed>
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
            userType:'host',
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
                width:220
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
            currentBalance:0
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
                if (this.drawer.permanent) {
                    this.drawer.permanent = !this.drawer.permanent
                    // set the clipped state of the drawer and toolbar
                    this.drawer.clipped = true
                    this.toolbar.clippedLeft = true
                } else {
                    // normal drawer
                    this.drawer.open = !this.drawer.open
                }
            },
            async logout() {
                try {
                    await this.$store.dispatch('logout')
                } catch (e) {
                    console.log(e.msg)
                }
            },
            go(url){
                this.$router.push(url)
            }

        },
        mounted(){
            this.toggleDrawer()
            // this.$store.watch(this.$store.getters.getUserBalance, (val)=>{
            //     console.log(val)
            //
            // })
            this.currentBalance = this.$store.state.user.account.balance

            this.$store.watch(this.$store.getters.getUserBalance, (value) => {
                this.currentBalance = value
                console.log(value)
            })
        }
    }
</script>