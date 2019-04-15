import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#313842', // #E53935
    secondary: colors.red.darken4, // #FFCDD2
    accent: '#bc3845'
  },
  customProperties: true,
  iconfont: 'md'
})
