<style scoped lang="scss">
    .chas-img-box{
        width:350px;
        height:350px;
        overflow:hidden;
        position:relative;
        img{
            position:absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
<template>
    <div class="chas-img-box" :class="{cursor:!noView}" :style="{width:boxWidth,height:boxHeight}" @click="picView">
        <img ref="img" :src="src" :__pv-group="group" :__pv-describe="describe" @load="imgLoad" @error="imgError" :style="{width:imgWidth,height:imgHeight}"></img>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    const TYPE_SCALETOFILL:string = 'scaleToFill', TYPE_ASPECTFIT:string = 'aspectFit', TYPE_ASPECTFILL:string = 'aspectFill', TYPE_WIDTHFIX:string = 'widthFix'
    @Component({name:'vImage'})
    export default class chasImage extends Vue {
        public loaded:boolean = false;
        public boxWidth: string = '350px';
        public boxHeight: string = '350px';

        private boxHforNum: number = 350;
        private boxWforNum: number = 350;

        public imgWidth:string = '100%';
        public imgHeight:string = '100%';

        @Prop({ type:[String,Number], default: '350px' }) private width!: string | number;
        @Prop({ type:[String,Number], default: '350px' }) private height!: string | number;
        @Prop({ type:String, default: '' }) private src!: string;
        @Prop({ type:String, default: '' }) private describe!: string;
        /**
         * 如果设定了该属性，则此属性为预览的图片路径
         */
        @Prop({ default: '' }) private viewSrc!: string;
        /**
         * scaleToFill    不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
         * aspectFit    缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
         * aspectFill    缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
         * widthFix    缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
         */
        @Prop({ default: TYPE_SCALETOFILL }) private mode!: string;
        /**
         * 指定了group属性后（不为空字符串），group相同的image组件会被归为同一系列的图片，可以在预览大图的时候进行左右切换查看
         */
        @Prop({ default: '' }) private group!: string;
        /**
         * noView属性，是否不可预览图片
         */
        @Prop({ default: false }) private noView!: boolean;

        private numberToCss(val: string | number):string{
            if(!Number.isNaN(Number(val))){
                return val+'px'
            }else{
                return String(val)
            }
        }

        private picView():void{
            const $window:any = window
            const vm = $window.$picView
            let src:string = this.viewSrc?this.viewSrc:this.src
            const $img:any = this.$refs.img
            src = src+'__$id'+$img.getAttribute('__pv-id')
            vm.src = src
            vm.describe = this.describe
            vm.setName = this.group
            this.$emit('open')
            vm.open()
        }

        private initByMode(mode:string):void{
            const $el:any = this.$el
            const img:any = this.$refs.img
            const W:number = this.boxHforNum
            const H:number = this.boxWforNum
            const nW:number = img.naturalWidth
            const nH:number = img.naturalHeight

            $el.style.height = this.boxHforNum+'px'
            if(mode == TYPE_SCALETOFILL){ //不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
                this.imgWidth = '100%'
                this.imgHeight = '100%'
            }else if(mode == TYPE_ASPECTFIT){ //缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
                if(nW>=nH){
                    this.imgWidth = W<=nW?'100%':nW+'px'
                    this.imgHeight = nH<=H?nH+'px':'auto'
                    img.style.margin = 'auto'
                }else{
                    this.imgHeight = H<=nH?'100%':nH+'px'
                    this.imgWidth = nW<=W?nW+'px':'auto'
                    img.style.margin = 'auto'
                }
            }else if(mode == TYPE_ASPECTFILL){//缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
                if(nW<=nH){
                    this.imgWidth = W<=nW?'100%':nW+'px'
                    this.imgHeight = 'auto'
                    img.style.margin = '0 auto'
                }else{
                    this.imgHeight = H<=nH?'100%':nH+'px'
                    this.imgWidth = 'auto'
                    img.style.margin = 'auto 0'
                }
            }else if(mode == TYPE_WIDTHFIX){
                this.imgWidth = W<=nW?'100%':nW+'px'
                this.imgHeight = 'auto'
                const imgH = W/nW*nH
                $el.style.height = W<=nW && imgH>H?imgH+'px':W>nW && nH>H?nH+'px':H+'px'
                img.style.margin = '0 auto'
            }
        }

        @Watch('group')
        private onGroupChange(val:string, oldVal:string):void{
            const $window:any = window
            this.$nextTick(()=>{
                if(val)
                    $window.$picView.groupInit(val)
                if(oldVal)
                    $window.$picView.groupInit(oldVal)
            })
        }
        @Watch('src')
        private onSrcChange(val:string, oldVal:string):void{
            const $window:any = window
            this.$nextTick(()=> {
                this.group?$window.$picView.groupInit(this.group):null
            })
        }
        @Watch('viewSrc')
        private onViewSrcChange(val:string, oldVal:string):void{
            const $window:any = window
            this.$nextTick(()=> {
                this.group?$window.$picView.groupInit(this.group):null
            })
        }
        @Watch('describe')
        private onDescribeChange(val:string, oldVal:string):void{
            const $window:any = window
            this.$nextTick(()=> {
                this.group?$window.$picView.groupInit(this.group):null
            })
        }
        @Watch('width', { immediate: true })
        private onWidthChange(val:string | number, oldVal:string | number):void{
            this.boxWidth = this.numberToCss(val)
            this.$nextTick(()=>{
                const $el:any = this.$el
                this.boxWforNum = $el.offsetWidth
            })
            if(this.loaded){
                this.initByMode(this.mode)
            }
        }
        @Watch('height', { immediate: true })
        private onHeightChange(val:string | number, oldVal:string | number):void{
            this.boxHeight = this.numberToCss(val)
            this.$nextTick(()=>{
                const $el:any = this.$el
                this.boxHforNum = $el.offsetHeight
            })
            if(this.loaded){
                this.initByMode(this.mode)
            }
        }
        @Watch('mode')
        private onModeChange(val:string, oldVal:string):void{
            this.initByMode(val)
        }

        /**
         * 图片加载完成
         * @param {any} e
         */
        private imgLoad(e:any):void{
            this.loaded = true
            this.initByMode(this.mode)
            this.$emit('loaded',e)
        }

        /**
         * 图片加载错误
         * @param {any} e
         */
        private imgError(e:any):void{
            this.$emit('error',e)
        }

        public mounted(){
            const $img:any = this.$refs.img
            $img.setAttribute('__pv-id',new Date().getTime())
        }
    }
</script>