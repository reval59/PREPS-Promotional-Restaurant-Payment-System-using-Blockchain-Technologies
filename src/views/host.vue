<template>
    <v-app>
        <v-toolbar :fixed="fixed" color="primary" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat>Link One</v-btn>
                <v-btn flat>Link Two</v-btn>
                <v-btn flat>Link Three</v-btn>
            </v-toolbar-items>
        </v-toolbar>


            <v-navigation-drawer
                    v-model="drawer"
                    permanent
                    absolute
            >
                <v-toolbar class="transparent">
                    <v-list class="pa-0">
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <img src="https://randomuser.me/api/portraits/men/85.jpg">
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>John Leider</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>

                <v-list class="pt-0" dense>
                    <v-divider></v-divider>

                    <v-list-tile
                            v-for="item in items"
                            :key="item.title"
                            @click=""
                    >
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>



        <v-content>

            <v-container>
                <br><br><br>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer
                :fixed="fixed"
                app
        >
            <span>&copy;  Noah Kim, City University of Hong Kong 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        name: 'default',
        data() {
            return {
                fixed:true,
                title: 'PREPS',
                items: [
                    { title: 'Home', icon: 'dashboard' },
                    { title: 'About', icon: 'question_answer' }
                ],
                right: null
            }
        },
        computed:{
        },
        watch: {

        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('logout')
                } catch (e) {
                    console.log(e.msg)
                }

            },
        }
    }
</script>