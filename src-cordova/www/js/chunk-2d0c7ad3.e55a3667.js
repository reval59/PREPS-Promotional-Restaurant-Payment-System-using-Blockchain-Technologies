(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c7ad3"],{5244:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-navigation-drawer",{attrs:{clipped:t.drawer.clipped,fixed:t.drawer.fixed,permanent:t.drawer.permanent,temporary:t.drawer.temporary,"mini-variant":t.drawer.mini,app:"",touchless:t.drawer.touchless,width:t.drawer.width},model:{value:t.drawer.open,callback:function(e){t.$set(t.drawer,"open",e)},expression:"drawer.open"}},[i("v-list",[i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/register")}}},[i("v-list-tile-action",[i("v-icon",[t._v("create")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Registration")])],1)],1),i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/dashboard")}}},[i("v-list-tile-action",[i("v-icon",[t._v("dashboard")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Dashboard")])],1)],1),i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/kitchen")}}},[i("v-list-tile-action",[i("v-icon",[t._v("restaurant_menu")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Kitchen Monitor")])],1)],1),i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/history")}}},[i("v-list-tile-action",[i("v-icon",[t._v("description")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Order History")])],1)],1),i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/table")}}},[i("v-list-tile-action",[i("v-icon",[t._v("aspect_ratio")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Table QR Code")])],1)],1),i("v-list-tile",{on:{click:function(e){return t.go("/restaurant/membership")}}},[i("v-list-tile-action",[i("v-icon",[t._v("group")])],1),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Partnership")])],1)],1)],1)],1),i("v-toolbar",{attrs:{app:"",fixed:t.toolbar.fixed,"clipped-left":t.toolbar.clippedLeft,color:"primary",dark:""}},[i("v-toolbar-side-icon",{on:{click:function(e){return e.stopPropagation(),t.toggleDrawer(e)}}}),i("v-toolbar-title",[t._v("PREPS")]),i("v-spacer"),i("v-btn",{attrs:{color:"accent",depressed:""}},[t._v("\n            Your Balance: "+t._s(t.currentBalance)+" ETH\n        ")]),i("v-btn",{attrs:{icon:""},on:{click:t.logout}},[i("v-icon",[t._v("exit_to_app")])],1)],1),i("v-content",{ref:"content"},[i("v-container",{attrs:{fluid:"","fill-height":""}},[i("v-layout",{attrs:{"justify-center":"","align-center":""}},[i("router-view")],1)],1)],1),i("v-footer",{attrs:{app:"",fixed:t.footer.fixed,"clipped-left":t.footer.clippedLeft,dark:"",color:"primary"}},[i("span",{staticClass:"caption mx-3"},[t._v("© 2019, Noah Kim - City University of Hong Kong")])])],1)},r=[],o=i("59ad"),a=i.n(o),l={data:function(){return{userType:"host",drawer:{open:!1,clipped:!0,fixed:!1,permanent:!1,mini:!1,width:220,temporary:!1,touchless:!1},toolbar:{fixed:!0,clippedLeft:!0},footer:{fixed:!0,clippedLeft:!0},windowWidth:window.innerWidth,windowHeight:window.innerHeight}},methods:{toggleDrawer:function(){this.windowWidth<960&&(this.drawer.temporary=!0),this.drawer.permanent?(this.drawer.permanent=!this.drawer.permanent,this.drawer.clipped=!0,this.toolbar.clippedLeft=!0):this.drawer.open=!this.drawer.open},logout:function(){this.$router.push("/login")},go:function(t){this.$router.push(t)},handleResize:function(){this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight},autoToggle:function(){this.windowWidth<960&&this.drawer.open?this.drawer.permanent=!1:this.windowWidth>=960&&!this.drawer.open&&(this.drawer.temporary=!1,this.drawer.permanent=!0,this.drawer.open=!0)}},mounted:function(){},watch:{windowWidth:function(t){this.autoToggle()}},created:function(){window.addEventListener("resize",this.handleResize),this.autoToggle()},destroyed:function(){window.removeEventListener("resize",this.handleResize)},computed:{currentBalance:function(){try{var t=a()(this.$store.state.user.account.balance).toFixed(2);return t}catch(e){return 0}}}},s=l,c=i("2877"),d=i("6544"),p=i.n(d),u=i("8336"),v=i("a523"),h=i("549c"),w=i("553a"),f=i("132d"),g=i("a722"),m=i("8860"),b=i("ba95"),_=i("40fe"),y=i("5d23"),V=i("f774"),k=i("9910"),T=i("71d9"),x=i("706c"),L=i("2a7f"),W=Object(c["a"])(s,n,r,!1,null,null,null);e["default"]=W.exports;p()(W,{VBtn:u["a"],VContainer:v["a"],VContent:h["a"],VFooter:w["a"],VIcon:f["a"],VLayout:g["a"],VList:m["a"],VListTile:b["a"],VListTileAction:_["a"],VListTileContent:y["a"],VListTileTitle:y["b"],VNavigationDrawer:V["a"],VSpacer:k["a"],VToolbar:T["a"],VToolbarSideIcon:x["a"],VToolbarTitle:L["a"]})}}]);
//# sourceMappingURL=chunk-2d0c7ad3.e55a3667.js.map