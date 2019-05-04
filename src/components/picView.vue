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
          <div ref="imgBox" class="chas-picview-inbox chas-picview-view">
              <div style="width:100%;height:100%;position:absolute;" :class="{'animation':animation}"
               @mousedown="onDragstart" @mousemove="onDragover" @mouseup="onDragend"
                   :style="{
                   'transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-webkit-transform':`translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-moz-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-o-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-ms-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                    }">
                  <img ref="img" @load="imgLoaded" ondragstart="return false" :style="{width:imgWidth>0?imgWidth+'px':'auto',height:imgHeight>0?imgHeight+'px':'auto'}" class="chas-picview-pic" :class="{'chas-picview-zoomin': scale > 1}" :src="picSrc" @click="zoomInAndOut"></img>
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
  public NOT_DRAG:number = 0;
  public DRAG_START:number = 1;
  public DRAGING:number = 2;
  public SCALE_VAL:number = 1.5;

  public picSrc: string = '';
  public picShow: boolean = true;
  public imgWidth: any = 0;
  public imgHeight: any = 0;
  public scale: number = 1;
  public dragX: number = 0;
  public dragY: number = 0;
  public moveX: number = 0;
  public moveY: number = 0;
  public state: number = this.NOT_DRAG;
  public oldPos: any = {X:0,Y:0};
  public oldSize: any = {width:0, height:0};
  public leftScope: any = {min:0,max:0};
  public topScope: any = {min:0,max:0};
  public animation: boolean = false;

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
      if(this.scale == 1){
          return false
      }
      console.log(e)
      this.dragX = e.clientX
      this.dragY = e.clientY
      this.state = this.DRAG_START;
  }
  public onDragover(e: any){
      if(this.scale == 1 || this.state == this.NOT_DRAG){
          return false
      }
      console.log(this.leftScope.min)
      this.state = this.DRAGING
      const X = this.moveX + e.clientX - this.dragX
      this.moveX = X
      const Y = this.moveY + e.clientY - this.dragY
      this.moveY = Y
      this.dragX = e.clientX
      this.dragY = e.clientY
  }
  public onDragend(e: any){
      if(this.state != this.DRAGING){
          return false
      }
      this.animation = true
      const X = this.moveX + e.clientX - this.dragX
      this.moveX = X>this.leftScope.max?this.leftScope.max:X<this.leftScope.min?this.leftScope.min:X
      const Y = this.moveY + e.clientY - this.dragY
      this.moveY = Y>this.topScope.max?this.topScope.max:Y<this.topScope.min?this.topScope.min:Y
      setTimeout(()=>{
          this.animation = false
      },500)
  }

  public zoomInAndOut(){
      if(this.state == this.DRAGING){
          this.state = this.NOT_DRAG
          return false
      }
      this.animation = true
      this.state = this.NOT_DRAG
      this.scale = this.scale > 1?1:this.SCALE_VAL;
      if(this.scale == 1){
          this.moveX = this.oldPos.X
          this.moveY = this.oldPos.Y
          // this.imgWidth = this.oldSize.width
          // this.imgHeight = this.oldSize.height
      }else{
          const imgbox:any = this.$refs.imgBox
          let leftmax = imgbox.offsetWidth * (this.SCALE_VAL - 1) / 2
          this.leftScope = {min:leftmax - (this.imgWidth * this.SCALE_VAL - imgbox.offsetWidth), max:leftmax}
          let topmax = imgbox.offsetHeight * (this.SCALE_VAL - 1) / 2
          this.topScope = {min:topmax - (this.imgHeight * this.SCALE_VAL - imgbox.offsetHeight), max:topmax}

          // this.imgWidth = this.oldSize.width * this.SCALE_VAL
          // this.imgHeight = this.oldSize.height * this.SCALE_VAL
      }
      setTimeout(()=>{
          this.animation = false
      },500)
  }

  public imgLoaded(){
      const img:any = this.$refs.img
      const imgbox:any = this.$refs.imgBox
      let imgHeight = img['offsetHeight'] > imgbox['offsetHeight']?imgbox['offsetHeight']:img['offsetHeight']
      let imgWidth = img['offsetWidth']/img['offsetHeight'] * imgHeight
      this.imgHeight = imgHeight
      this.imgWidth = imgWidth
      this.oldSize = {width:imgWidth, height:imgHeight}
      this.moveX = (img.parentNode.offsetWidth - this.imgWidth)/2;
      this.moveY = (img.parentNode.offsetHeight - this.imgHeight)/2;
      this.oldPos = {X:this.moveX,Y:this.moveY}
  }

  public mounted(){

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
      overflow: hidden;
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
      height:auto;
      position: absolute;
      top:0;
      left:0;
      text-align: center;
      cursor: zoom-in;
      webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
  }
  .chas-picview-prevbtn, .chas-picview-nextbtn{
      color:#fff;font-size:20px;position:absolute;top:50%;margin-top:-10px;
      left: 50%;
      margin-left: -10px;
  }
  .chas-picview-zoomin{
      cursor: -webkit-grab;
      cursor: -moz-grab;
      cursor: grab;
  }
    .animation{
        transition-duration: .4s;
    }
</style>
