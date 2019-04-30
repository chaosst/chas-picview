<template>
  <div class="chas-picview-box" v-show="picShow">
      <div class="chas-picview-header">
          <span style="float:right;padding:10px;">
              <button class="chas-btn iconfont" :class="{'chas-zoomout': scale > 1,'chas-zoomin': scale == 1}" style="color:#fff;font-size:20px;" @click="zoomInAndOut"></button>
          </span>
      </div>
      <div class="chas-picview-main">
          <div v-show="changePage" class="chas-picview-inbox chas-picview-prev">
              <button class="chas-btn-clear iconfont chas-arrowleft chas-picview-prevbtn" @click="prev"></button>
          </div>
          <div class="chas-picview-inbox chas-picview-view">
              <div style="width:100%;height:100%;" :style="{'transform': `scale(${scale})`, '-webkit-transform': `scale(${scale})`,'-moz-transform': `scale(${scale})`, '-o-transform': `scale(${scale})`,'-ms-transform': `scale(${scale})`}">
                  <img ref="img" @dragstart="onDragstart" @dragover="onDragover" class="chas-picview-pic" :class="{'chas-picview-zoomin': scale > 1}" :src="picSrc" @click="zoomInAndOut"></img>
              </div>
          </div>
          <div v-show="changePage" class="chas-picview-inbox chas-picview-next">
              <button class="chas-btn-clear iconfont chas-arrowright chas-picview-nextbtn" @click="next"></button>
          </div>
      </div>
      <div class="chas-picview-footer"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  public picSrc = '';
  public picShow = true;
  public scale = 1;
  public dragX = 0;
  public dragY = 0;

  @Prop({ default: true }) private changePage!: boolean;
  @Prop({ default: '' }) private src!: string;

  @Watch('src', { immediate: true })
  private onSrcChange(val: string, oldVal: string) {
      this.picSrc = val;
  }

  public open() {
      this.picShow = true;
  }
  public close() {
      this.picShow = false;
  }
  public prev(){
  }
  public next(){
  }
  public onDragstart(e: any){
      console.log(e)
      this.dragX = e.clientX
      this.dragY = e.clientY
  }
  public onDragover(e: any){
      console.log(e)
      if(this.scale == 1){
          return false;
      }
      let X: number = e.clientX - this.dragX
      let Y: number = e.clientY - this.dragY
      let $img: any = this.$refs.img
      $img.style.marginLeft = X
      $img.style.marginTop = Y
  }

  public zoomInAndOut(){
      this.scale = this.scale > 1?1:5;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .chas-picview-box {
    width:100%;
    height:100%;
    position:absolute;
    background:#333;
  }
  .chas-picview-header, .chas-picview-main, .chas-picview-footer{
      float:left;
      width:100%;
  }
  .chas-picview-header, .chas-picview-footer{
      height:50px;
  }
  .chas-picview-main{
      height:calc(100% - 100px);
  }
  .chas-picview-inbox{
      float: left;
      height:100%;
      position: relative;
  }
  .chas-picview-prev, .chas-picview-next{
      width:80px;
  }
  .chas-picview-view{
      width: calc(100% - 160px);
      overflow:hidden;
  }
  .chas-picview-pic{
      width:auto;
      max-height:100%;
      position: absolute;
      top:50%;
      left:50%;
      text-align: center;
      cursor: zoom-in;
      transform: translate(-50%,-50%) ;
      -webkit-transform: translate(-50%,-50%) ;
      -moz-transform: translate(-50%,-50%) ;
      -o-transform:translate(-50%,-50%) ;
      -ms-transform: translate(-50%,-50%) ;
  }
  .chas-picview-prevbtn, .chas-picview-nextbtn{
      color:#fff;font-size:20px;position:absolute;top:50%;margin-top:-10px;
      left: 50%;
      margin-left: -10px;
  }
  .chas-picview-zoomin{
      cursor: zoom-out;
  }
</style>
