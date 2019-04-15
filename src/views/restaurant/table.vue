<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-icon color="black">aspect_ratio</v-icon>
                <v-toolbar-title>Table QR Code</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="primary">
                    <v-icon>print</v-icon>
                    &nbsp
                    Print

                </v-btn>
            </v-toolbar>
        </v-flex>



        <v-flex xs12 md6 lg4 pa-1 v-for="table in tables" :key="table.no">
            <v-card>
                <v-card-title>
                    <div>
                        <h3 class="headline mb-0">Table No. {{table.no}}</h3>
                    </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-flex pa-3>
                    <v-img

                            :src= "table.src"
                            aspect-ratio="1"
                    ></v-img>
                </v-flex>




            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        data:()=>{
            return{
                numOfTables:0,
                tables:[]
            }
        },
        beforeMount(){
            this.numOfTables = this.$store.state.user.myRestaurant.numOfTables
            for(let i=0; i<this.numOfTables; i++){
                this.tables.push({no: i+1, src: '/img/sample/qrcode.jpg'})
            }
        }
    }
</script>

<style scoped>

</style>