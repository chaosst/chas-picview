# v-picview ![version](https://img.shields.io/badge/version-%20v1.0.15%20-green.svg) ![vue](https://img.shields.io/badge/vue-%20v2.5.21%20-green.svg) 

[v-picview](https://github.com/chaosst/v-picview) is a component of picture viewer.

## Demo


## How to use

```bash
npm i v-picview -S
```

```js
/* ignore this if you include vue-scroller.js by <script> tag from a cdn, such as unpkg */
import Vue from 'vue'
import 'v-picview/lib/v-picview.css'
import vPicview from 'v-picview'
import { vImage } from 'v-picview'
Vue.component(vImage)
Vue.use(vPicview,{
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
```

```html
<!-- Component mode initialization -->
<v-image 
    class="inline-block" 
    describe="group set-1" 
    :src="require('@/assets/pic1.png')" 
    mode="aspectFit" 
    group="set-1" 
/>

<!-- Directive mode initialization -->
<img 
    src="~@/assets/logo.png" 
    v-pic-view="{group:'set-2',describe:'group set-2'}" 
/>
```


## API

#### v-pic-view directive attributes:

| Attr. Name | Description | Required | Default Value |
|-----|-----|-----|-----|
| describe | 图片的描述，如果打开了vPicview的footer会显示在底部 | N |   |
| group | 图片的分组，如果是同一分组的图片，在图片查看器里面可以进行左右切换查看 | N | - |


#### vImage component attributes:

| Attr. Name | Description | Required | Default Value |
|-----|-----|-----|-----|
| width | 图片的宽度 | N | 350px |
| height | 图片的高度 | N | 350px |
| src | 图片的地址路径 | Y |   |
| describe | 图片的描述，如果打开了vPicview的footer会显示在底部 | N |   |
| viewSrc | 图片查看器的图片地址路径，如果不填写，则默认取src | N |   |
| group | 图片的分组，如果是同一分组的图片，在图片查看器里面可以进行左右切换查看 | N | - |
| noView | 点击是否打开图片查看器，默认是点击后打开查看器 | N | false |
| mode | scaleToFill：不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素。 aspectFit：缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。 aspectFill：缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 widthFix：缩放模式，宽度不变，高度自动变化，保持原图宽高比不变。 | N | scaleToFill |

#### vPicview component attributes:

| Attr. Name | Description | Required | Default Value |
|-----|-----|-----|-----|
| arrowShortcuts | 是否启用左右箭头键切换图片页数 | N | true |
| zoom | 是否需要放大功能 | N | true |
| footer | 是否启用底部栏显示描述 | N | true |
| animation | 打开的动画：fadein，flyin | N | fadein |
| popperClass | 图片查看器的class | N | - |
| onDownload | 点击下载图标的回调函数 | N | - |
| onNext | 触发下一页图片时的回调函数 | N | - |
| onPrev | 触发上一页图片时的回调函数 | N | - |
| onChange | 页数改变时的回调函数 | N | - |
| onImgLoaded | 图片查看器在图片加载完成后的回调函数 | N | - |
| onZoomIned | 图片放大时的回调函数 | N | - |
| onZoomOuted | 图片缩小时的回调函数 | N | - |
| onDragStart | 图片放大后拖动开始时的回调函数 | N | - |
| onDragMove | 图片放大后拖动进行中的回调函数 | N | - |
| onDragEnd | 图片放大后拖动结束时的回调函数 | N | - |

#### vPicview vm instance methods:

- `download()` 下载查看器当前显示的图片
- `close()` 关闭查看器
- `next()` 下一页图片
- `prev()` 上一页图片