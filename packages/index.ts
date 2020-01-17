import picView from './components/picView.vue'
import { DirectiveOptions } from 'vue'
import * as directives from './directives/directives';
import './css/base.scss';
import vImageComponent from './components/Image/index'

interface picOption{
    escClose?:boolean;
    arrowShortcuts?:boolean;
    popperClass?:string;
    animation?:string;
    footer?:boolean;
    zoom?:boolean;
    onDownload?:any;
    onNext?:any;
    onPrev?:any;
    onChange?:any;
    onImgLoaded?:any;
    onZoomIned?:any;
    onZoomOuted?:any;
    onDragStart?:any;
    onDragMove?:any;
    onDragEnd?:any;
}

// install 方法
const install:any = function (Vue:any, options:picOption):void {
    if (install.installed) return
    install.installed = true

    options = options || {}
    let $DIV = document.createElement('div')
    $DIV.id = '____chas-picview-box'
    document.body.appendChild($DIV);
    new Vue({
        render: (h:any) => h(picView,{
            props: {
                escClose:options.escClose,
                arrowShortcuts:options.arrowShortcuts,
                popperClass:options.popperClass,
                animation:options.animation,
                footer:options.footer,
                zoom:options.zoom
            },
            on: {
                download: options.onDownload?options.onDownload:()=>{},
                next: options.onNext?options.onNext:()=>{},
                prev: options.onPrev?options.onPrev:()=>{},
                change: options.onChange?options.onChange:()=>{},
                imgLoaded: options.onImgLoaded?options.onImgLoaded:()=>{},
                zoomIned: options.onZoomIned?options.onZoomIned:()=>{},
                zoomOuted: options.onZoomOuted?options.onZoomOuted:()=>{},
                dragStart: options.onDragStart?options.onDragStart:()=>{},
                dragMove: options.onDragMove?options.onDragMove:()=>{},
                dragEnd: options.onDragEnd?options.onDragEnd:()=>{}
            },
        })
    }).$mount('#____chas-picview-box');
    // 注册全局指令
    Object.keys(directives).forEach(key => {
        Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install
}
export const vImage = vImageComponent

