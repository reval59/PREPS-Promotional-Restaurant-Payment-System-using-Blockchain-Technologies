export default {
    // The install method will be called with the Vue constructor as
    // the first argument, along with possible options
    install(Vue, options) {
        // // Add or modify global methods or properties.
        // Vue.yourMethod = (value) => value
        // // Add a component or directive to your plugin, so it will be installed globally to your project.
        // Vue.component('component', Component)
        // // Add `Vue.mixin()` to inject options to all components.

        String.prototype.toDec = function () {
            return Number(String(this).substr(String(this).indexOf('.') + 1));
        }
        String.prototype.toInt = function () {
            return parseInt(String(this));
        }

        Number.prototype.toDec = function () {
            return Number(String(this).substr(String(this).indexOf('.') + 1));
        }
        Number.prototype.toInt = function () {
            return parseInt(String(this));
        }


        let utility = {
            async currentPos() {
                let gpsOptions = {maximumAge: 300000, timeout: 5000, enableHighAccuracy: true};
                function getCoordinates() {
                    return new Promise(function (resolve, reject) {
                        navigator.geolocation.getCurrentPosition(resolve, reject, gpsOptions);
                    });
                }
                try{
                    const position = await getCoordinates()
                    let latitude = position.coords.latitude.toFixed(6)
                    let longitude = position.coords.longitude.toFixed(6)
                    return {lng: longitude, lat: latitude}
                } catch(e){
                    throw e
                }

            },
            distance(lat1, lon1, lat2, lon2) {
                var p = 0.017453292519943295;    // Math.PI / 180
                var c = Math.cos;
                var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                    c(lat1 * p) * c(lat2 * p) *
                    (1 - c((lon2 - lon1) * p)) / 2;

                return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            }
        }
        Vue.prototype.$utility = utility
    }
}
