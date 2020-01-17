import Image from './image.vue'
const chasImage:any = Image

// 为组件添加 install 方法，用于按需引入
chasImage.install = function (Vue:any):void {
    Vue.component(chasImage.name, chasImage)
}

export default chasImage