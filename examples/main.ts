import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import plugin from '../packages/index'

Vue.config.productionTip = false;

Vue.use(plugin,{
    escClose:true,
    arrowShortcuts:true,
    zoom:true,
    footer:true,
    animation:'fadein',
    popperClass:'my-picview-box',
    onDownload(item:any){
        console.log(item)
    },
    onNext(index:number, item:object, oldItem:object){
        console.log('下一页',index,item,oldItem)
    },
    onPrev(index:number, item:object, oldItem:object){
        console.log('上一页',index,item,oldItem)
    },
    onChange(index:number, item:object, oldItem:object){
        console.log('页数改变',index,item,oldItem)
    },
    onImgLoaded(e:any){
        console.log('图片加载完成',e)
    },
    onZoomIned(e:any){
        console.log('图片放大',e)
    },
    onZoomOuted(e:any){
        console.log('图片缩小',e)
    },
    onDragStart(e:any){
        console.log('拖拽开始',e)
    },
    onDragMove(e:any){
        console.log('拖拽中',e)
    },
    onDragEnd(e:any){
        console.log('拖拽结束',e)
    }
})


new Vue({
  render: (h) => h(App),
}).$mount('#app');
