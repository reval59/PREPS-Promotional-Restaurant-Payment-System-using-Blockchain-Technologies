<template>

    <div class="here-map" style="position:relative">
        <v-btn icon @click="initMap" dark color='#1f262a'style="position:absolute; top:8px; z-index: 1">
            <v-icon>refresh</v-icon>
        </v-btn>
        <div ref="map" v-bind:style="{ width: width, height: height }"></div>
    </div>
</template>

<script>
    import { EventBus } from '../plugins/eventBus'
    export default {
        data() {
            return {

                hereMap:{
                    zoom: 18
                },
                lat:'0',
                lng:'0',
            }
        },
        props: {
            width: String,
            height: String

        },
        watch:{
            lat:function(val){
                this.initMap()
            },
            lng:function(val){
                this.initMap()
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init() {
                let hereMap = this.hereMap
                let vm = this
                if(hereMap.platform){
                    // console.log("delete hereMap.platform")
                    delete hereMap.platform
                }
                if(hereMap.map){
                    // console.log("delete hereMap.map")
                    delete hereMap.map
                }
                hereMap.platform = new H.service.Platform({
                    "app_id": 'uOYQuBoZvaABSIXZFI3j',
                    "app_code": 'SiC0j4FFOtR01GJ9OdGTdA'
                });
                let pixelRatio = window.devicePixelRatio || 1;
                let defaultLayers = hereMap.platform.createDefaultLayers({
                    tileSize: pixelRatio === 1 ? 256 : 512,
                    ppi: pixelRatio === 1 ? undefined : 320
                });



                hereMap.map = new H.Map(vm.$refs.map,
                    defaultLayers.normal.map, {
                        center: {lng: vm.lng, lat: vm.lat},
                        zoom: hereMap.zoom,
                        pixelRatio: pixelRatio
                    });

                let icon =  new H.map.Icon("/img/marker2.png")
                let marker = new H.map.Marker({lat:vm.lat, lng:vm.lng}, {icon:icon})
                hereMap.map.addObject(marker)


                let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hereMap.map));
                behavior.disable(H.mapevents.Behavior.WHEELZOOM);

                hereMap.map.addEventListener('tap', function (evt) {
                    let pointer = evt.currentPointer;
                    let coord = hereMap.map.screenToGeo(pointer.viewportX, pointer.viewportY);
                    vm.lat = coord.lat.toFixed(6)
                    vm.lng = coord.lng.toFixed(6)
                    marker.setPosition(hereMap.map.screenToGeo(pointer.viewportX, pointer.viewportY));
                    EventBus.$emit('change-loc', {lat:vm.lat, lng:vm.lng})
                });
                let ui = H.ui.UI.createDefault(hereMap.map, defaultLayers);
                window.removeEventListener('resize', this.resize)
                window.addEventListener('resize', this.resize);
            },
            resize(){
                this.hereMap.map.getViewPort().resize();
            },
            initMap(){
                this.$refs.map.innerHTML=''
                this.init()
            },
            setLoc(lng, lat){
                this.lng = lng
                this.lat = lat
            }
        }
    }
</script>

<style scoped></style>
