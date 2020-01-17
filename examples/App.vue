<template>
  <div id="app">
    <div style="width:100%;">
      <h2>分组1：</h2>
      <v-image class="inline-block" describe="分组为1的预览" :src="require('@/assets/pic1.png')" mode="aspectFit" group="set-1" />
      <v-image class="inline-block" :src="require('@/assets/pic2.jpg')" mode="aspectFit" group="set-1" />
    </div>
    <div style="width:100%;">
      <h2>分组2：</h2>
      <v-image class="inline-block" :src="require('@/assets/logo.png')" mode="aspectFit" group="set-2" />
      <v-image class="inline-block" :src="require('@/assets/pic3.jpg')" mode="aspectFit" group="set-2" />
      <h2>分组2的指令方式：</h2>
      <img src="~@/assets/logo.png" v-picview="{group:'set-2',describe:'指令方式预览logo'}" />
    </div>
    <div style="width:100%;">
      <h2>无分组：</h2>
      <v-image class="inline-block" describe="无分组方式预览1" :src="require('@/assets/pic1.png')" mode="aspectFit"/>
      <v-image class="inline-block" describe="无分组方式预览2" :src="require('@/assets/pic2.jpg')" mode="aspectFit"/>
    </div>




  </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { vImage } from '../packages';

    @Component({
        components: {
            vImage
        },
    })
    export default class Home extends Vue {
        public mounted(){
        }
    }
</script>
<style lang="scss">
  body{
    margin:0;
    padding:0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
