<style scoped lang="scss">
    .chas-picview-box {
        width:100vw;
        height:100vh;
        position:fixed;top:0;left:0;
        z-index:8001;
        .chas-picview-header{
            position:absolute; display:inline-block;
            top:0;left:0;
            width:100%;height:50px;
            z-index:8010;
            background:rgba(60,60,60,.5);
            .chas-picview-page{
                float:left;line-height:50px;
                padding:0 10px;
                font-size:16px;color:#fff;
            }
            .chas-picview-btn{
                float:right;padding:10px;
            }
        }
        .chas-picview-footer{
            position:absolute; display:inline-block;
            text-align:center;line-height:50px;
            color:#fff;font-size:16px;
            width:100%;height:50px;
            bottom:0;left:0;
            z-index:8010;
            background:rgba(60,60,60,.5)
        }
        .chas-picview-view{
            width: calc(100% - 160px);
            overflow:hidden;z-index:8002;
            .chas-picview-pic{
                width:auto;
                height:auto;
                position: absolute;
                top:0;
                left:0;
                text-align: center;
                webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
            }
        }
        .chas-picview-main{
            height:100%;
            z-index:8002;
            .chas-picview-prev, .chas-picview-next{
                width:80px;
                z-index:8003 !important;
            }
            .chas-picview-inbox{
                float: left;
                height:100%;
                position: relative;
                overflow: inherit;
                z-index:8002;
                .chas-picview-prevbtn, .chas-picview-nextbtn{
                    color:#fff;font-size:24px;position:absolute;top:50%;margin-top:-10px;
                    padding:10px;background-color: rgba(100,100,100,.3);
                    left: 50%;
                    margin-left: -20px;
                }
            }
        }
    }
    .grap{
        cursor: pointer;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
    }
    .zoom-in{
        cursor: pointer;
        cursor: -moz-zoom-in;
        cursor: -webkit-zoom-in;
        cursor: zoom-in;
    }
    .zoom-out{
        cursor: pointer;
        cursor: -moz-zoom-out;
        cursor: -webkit-zoom-out;
        cursor: zoom-out;
    }
    .animation{
        transition-duration: .4s;
    }
    button{
        /* for IE */
        filter:alpha(opacity=80);
        /* CSS3 standard */
        opacity:0.8;
    }
    button:hover{
        /* for IE */
        filter:alpha(opacity=100);
        /* CSS3 standard */
        opacity:1;
    }
</style>
<template>
  <div id="____chas-picview-box" :class="popperClass+` ${animation == 'flyin'?'chas-animation-flyin':animation == 'fadein'?'chas-animation-fade':''}`" class="chas-picview-box" v-cloak v-if="picShow" @mouseup="onOtherDragend">
      <div class="chas-picview-header">
          <span class="chas-picview-page" v-if="setName && srcs[setName].length>1">
              {{index+1}}/{{srcs[setName].length}}
          </span>
          <span class="chas-picview-btn">
              <button class="chas-btn text-white text-24 f-mr-sm chas-icon-xiazai" @click="download"></button>
              <button v-if="zoom" class="chas-btn text-white text-24 f-mr-sm" :class="{'chas-icon-zoomout': scale > 1,'chas-icon-zoomin': scale == 1}" @click="zoomInAndOut"></button>
              <button class="chas-btn text-white text-24 chas-icon-close" style="" @click="close"></button>
          </span>
          <span class="clear-both"></span>
      </div>
      <div class="chas-picview-main">
          <div class="chas-picview-inbox chas-picview-prev">
              <button v-if="setName && index > 0" class="chas-btn-clear chas-icon-arrowleft chas-picview-prevbtn" @click="prev"></button>
          </div>
          <div ref="imgBox" class="chas-picview-inbox chas-picview-view">
              <div style="width:100%;height:100%;position:absolute;" :class="{'animation':animationKey}"
               @mousedown="onDragstart" @mousemove="onDragover" @mouseup.stop="onDragend"
                   :style="{
                   'transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-webkit-transform':`translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-moz-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-o-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                   '-ms-transform': `translate(${moveX}px,${moveY}px) scale(${scale})` ,
                    }">
                  <img ref="img" v-show="loaded" @load="imgLoaded" ondragstart="return false" :style="{width:imgWidth?imgWidth+'px':'auto',height:imgHeight?imgHeight+'px':'auto'}" class="chas-picview-pic" :class="{'zoom-in':scale==1 && zoom,'zoom-out': state == NOT_DRAG && scale > 1,'grap': state == DRAGING}" :src="getSrc(src)" @click="zoomInAndOut"></img>
              </div>
          </div>
          <div class="chas-picview-inbox chas-picview-next">
              <button v-if="setName && index < srcs[setName].length-1" class="chas-btn-clear chas-icon-arrowright chas-picview-nextbtn" @click="next"></button>
          </div>
      </div>
      <div class="chas-picview-footer" v-if="footer">
          {{describe}}
      </div>
      <div class="chas-mask"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
const enum drag{
    NOT_DRAG,DRAG_START,DRAGING
}

interface img{
    src:string;
    describe:string;
}

@Component
export default class picView extends Vue {
  private NOT_DRAG:number = drag.NOT_DRAG;
  private DRAG_START:number = drag.DRAG_START;
  private DRAGING:number = drag.DRAGING;
  private SCALE_VAL:number = 1.5;

  //储存不同系列的图片路径数组
  public srcs:object = {}
  //储存不同系列的图片描述数组
  public descs:object = {}
  //标识当前图片所在图片系列的索引
  private index:number = 0

  public picShow: boolean = false;
  private imgWidth: number = 0;
  private imgHeight: number = 0;
  private scale: number = 1;
  private dragX: number = 0;
  private dragY: number = 0;
  private moveX: number = 0;
  private moveY: number = 0;
  private state: number = this.NOT_DRAG;
  private oldPos: any = {X:0,Y:0};
  private oldSize: any = {width:0, height:0};
  private leftScope: any = {min:0,max:0};
  private topScope: any = {min:0,max:0};
  private animationKey: boolean = false;

  private loaded:boolean = false

  public src:string = ''
  public describe:string = ''
  public setName:string = ''

//  @Prop({ default: '' }) private src!: string;
//  @Prop({ default: '' }) private setName!: string;
  /**
   * esc快捷键关闭
   */
  @Prop({ type:Boolean, default: true }) private escClose!: boolean;
  /**
   * 左右箭头快捷键切换上一页下一页
   */
  @Prop({ type:Boolean, default: true }) private arrowShortcuts!: boolean;
  @Prop({ type:String, default: '' }) private popperClass!: string;
  /**
   * 可以选择打开预览时的动画，可以fadein和flyin，设为空字符串可以取消动画
   */
  @Prop({ type:String, default: 'fadein' }) private animation!: string;
  @Prop({ type:Boolean, default: true }) private footer!: boolean;
  @Prop({ type:Boolean, default: true }) private zoom!: boolean;

  @Watch('src', { immediate: true })
  private onSrcChange(val: string, oldVal: string):void {
      let srcs:any = this.srcs
      if(val && this.setName && srcs[this.setName]){
          this.index = srcs[this.setName].indexOf(val)
      }
  }
    @Watch('picShow', { immediate: true })
    private onPicShowChange(val: boolean, oldVal: boolean):void {
        if(val){
            window.document.body.style.overflow = 'hidden'
        }else{
            window.document.body.style.overflow = 'auto'
        }
    }

  private getSrc(src:string){
      return src.split('__$id')[0]
  }

  private reset():void{
      this.scale = 1
      this.dragX = 0
      this.dragY = 0
      this.moveX = 0
      this.moveY = 0
      this.loaded = false
  }

  public download():void{
      let item:img = {src:this.src,describe:this.describe}
      this.$emit('download', item)
  }

  private groupInit(setName?:string):void{
      setName = setName?setName:this.setName
      const $arr = document.querySelectorAll("[__pv-group="+setName+"]")
      let groupSrcs:any = [],groupDescs:any = []
      $arr.forEach(item=>{
          groupSrcs.push(item.getAttribute('src')+'__$id'+item.getAttribute('__pv-id'))
          groupDescs.push(item.getAttribute('__pv-describe'))
      })
      this.$set(this.srcs, setName, groupSrcs)
      this.$set(this.descs, setName, groupDescs)
  }

  public open():void {
      this.index = 0
      this.reset()
      let srcs:any = this.srcs
      if(this.setName && !srcs[this.setName]){
          this.groupInit()
      }
      this.picShow = true
  }
  public close():void {
      this.src = ''
      this.loaded = false
      this.picShow = false
  }
  public prev():any{
      if(!this.setName || this.index==0){
          return false
      }
      this.reset()
      this.index--
      const srcs:any = this.srcs
      const descs:any = this.descs
      this.src = ''
      this.$nextTick(()=> {
          this.src = srcs[this.setName][this.index]
          this.describe = descs[this.setName][this.index]
          let prevItem: img = {src: this.getSrc(srcs[this.setName][this.index]), describe: this.describe}
          let item: img = {
              src: this.getSrc(srcs[this.setName][this.index + 1]),
              describe: descs[this.setName][this.index + 1]
          }
          this.$emit('prev', this.index, prevItem, item)
          this.$emit('change', this.index, prevItem, item)
      })
  }
  public next():any{
      const srcs:any = this.srcs
      if(!this.setName || this.index==(srcs[this.setName].length-1)){
          return false
      }
      const descs:any = this.descs
      this.reset()
      this.index++
      this.src = ''
      this.$nextTick(()=>{
          this.src = srcs[this.setName][this.index]
          this.describe = descs[this.setName][this.index]
          let nextItem:img = {src:this.getSrc(srcs[this.setName][this.index]),describe:this.describe}
          let item:img = {src:this.getSrc(srcs[this.setName][this.index-1]),describe:descs[this.setName][this.index-1]}
          this.$emit('next', this.index, nextItem, item)
          this.$emit('change', this.index, nextItem, item)
      })
  }
  public onDragstart(e: any):any{
      if(this.scale == 1){
          return false
      }
      this.dragX = e.clientX
      this.dragY = e.clientY
      this.state = this.DRAG_START;
      this.$emit('dragStart',e)
  }
  public onDragover(e: any):any{
      if(this.scale == 1 || this.state == this.NOT_DRAG){
          return false
      }
      this.state = this.DRAGING
      const X = this.moveX + e.clientX - this.dragX
      this.moveX = X
      const Y = this.moveY + e.clientY - this.dragY
      this.moveY = Y
      this.dragX = e.clientX
      this.dragY = e.clientY
      this.$emit('dragMove',e)
  }
  public onDragend(e: any):any{
      if(this.state != this.DRAGING){
          return false
      }
      this.animationKey = true
      const X = this.moveX + e.clientX - this.dragX
      this.moveX = X>this.leftScope.max?this.leftScope.max:X<this.leftScope.min?this.leftScope.min:X
      const Y = this.moveY + e.clientY - this.dragY
      this.moveY = Y>this.topScope.max?this.topScope.max:Y<this.topScope.min?this.topScope.min:Y
      setTimeout(()=>{
          this.animationKey = false
      },500)
      this.$emit('dragEnd',e)
  }
    public onOtherDragend(e: any):any{
        if(this.state != this.DRAGING){
            return false
        }
        const img:any = this.$refs.img
        this.animationKey = true
        const X = this.moveX + e.clientX - this.dragX
        this.moveX = X>this.leftScope.max?this.leftScope.max:X<this.leftScope.min?this.leftScope.min:X
        const Y = this.moveY + e.clientY - this.dragY
        this.moveY = Y>this.topScope.max?this.topScope.max:Y<this.topScope.min?this.topScope.min:Y
        this.state = this.NOT_DRAG
        setTimeout(()=>{
            this.animationKey = false
        },500)
        this.$emit('dragEnd',img)
    }

  public zoomInAndOut():any{
      if(!this.zoom){
          return false
      }
      if(this.state == this.DRAGING){
          this.state = this.NOT_DRAG
          return false
      }
      this.animationKey = true
      this.state = this.NOT_DRAG
      this.scale = this.scale > 1?1:this.SCALE_VAL;
      if(this.scale == 1){
          this.moveX = this.oldPos.X
          this.moveY = this.oldPos.Y
      }else{
          const imgbox:any = this.$refs.imgBox
          const W:number = imgbox.offsetWidth
          const H:number = imgbox.offsetHeight
          const sW:number = this.imgWidth
          const sH:number = this.imgHeight

          if(sW*this.SCALE_VAL<=W){
              let left = (W - sW)*this.SCALE_VAL/2
              this.leftScope = {min:left, max:left}
              this.moveX = left
          }else{
              //80为两侧上一页下一页按钮所在容器的宽度
              let leftmax = W * (this.SCALE_VAL - 1) / 2
              const dis1 = sW * this.SCALE_VAL - (W+80*2)
              this.leftScope = {min:leftmax - dis1, max:leftmax - 80}
          }
          if(sH*this.SCALE_VAL<=H){
              let top = (H - sH)*this.SCALE_VAL/2
              this.topScope = {min:top, max:top}
              this.moveY = top
          }else{
              let topmax = H * (this.SCALE_VAL - 1) / 2
              const dis2= sH * this.SCALE_VAL - H
              this.topScope = {min:topmax - dis2, max:topmax}
          }
          // this.imgWidth = this.oldSize.width * this.SCALE_VAL
          // this.imgHeight = this.oldSize.height * this.SCALE_VAL
      }
      setTimeout(()=>{
          const img:any = this.$refs.img
          this.animationKey = false
          if(this.scale == 1){
              this.$emit('zommOuted',img)
          }else{
              this.$emit('zommIned',img)
          }
      },500)
  }

  private initImg(e:any):void{
      const img:any = this.$refs.img
      const imgbox:any = this.$refs.imgBox
      const W:number = imgbox.offsetWidth
      const H:number = imgbox.offsetHeight
      const nW:number = img.naturalWidth
      const nH:number = img.naturalHeight
      let imgWidth:number = 0, imgHeight:number = 0
      if(nW>=nH){
          imgWidth = W<=nW?W:nW
          imgHeight = W<=nW?W/nW*nH:nH
          img.style.margin = 'auto'
      }else{
          imgHeight = H<=nH?H:nH
          imgWidth = H<=nH?H/nH*nW:nW
          img.style.margin = 'auto'
      }
      this.imgHeight = imgHeight
      this.imgWidth = imgWidth
      this.oldSize = {width:imgWidth, height:imgHeight}
      this.moveX = (img.parentNode.offsetWidth - imgWidth)/2;
      this.moveY = (img.parentNode.offsetHeight - imgHeight)/2;
      this.oldPos = {X:this.moveX,Y:this.moveY}
      this.$emit('imgLoaded',e)
  }

    /**
     * 图片加载完成
     */
  public imgLoaded(e:any):void{
      this.loaded = true
      this.initImg(e)
  }

  private shortcuts():void{
      document.onkeydown = (event)=> {
          //esc
          if(event && this.escClose && event.keyCode == 27){
              this.close()
          }
          //左箭头
          if(event && this.arrowShortcuts && event.keyCode == 37){
              this.prev()
          }
          //右箭头
          if(event && this.arrowShortcuts && event.keyCode == 39){
              this.next()
          }
      }
  }

  public mounted():void{
      const $window:any = window
      $window.$picView = this
      //键盘esc事件
      if(this.escClose || this.arrowShortcuts){
          this.shortcuts()
      }
  }
}
</script>
