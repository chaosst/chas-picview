import { DirectiveOptions } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

interface setting{
    group?:string;
    src?:string;
    describe?:string;
}

const bindPicview: any = (el: any, binding: DirectiveOptions, vnode: any, oldVnode: any)=>{
    if(el.tagName != 'IMG'){
        throw new Error('指令只能在img标签内使用');
        return false;
    }
    if(oldVnode.elm && !el.$picviewId){
        el.$picviewId =  String(new Date().getTime())
    }
    let $bind:any = binding
    let opt:string | setting = $bind.value
    let s:setting = {}
    const attr:any = el.attributes
    if(typeof opt == 'object') {
        s = opt
        s.src = s.src?s.src:attr.src.value
    }else{
        s.group = opt
        s.src = attr.src.value
    }
    s.describe = s.describe || ''
    el.setAttribute('__pv-group',s.group)
    el.setAttribute('__pv-describe',s.describe)
    el.style.cursor = 'pointer'
    if(!el.getAttribute('__pv-id')){
        el.setAttribute('__pv-id',new Date().getTime())
    }
    let o:setting = {}
    if(oldVnode.elm){
        let oldOpt:string | setting = $bind.oldValue
        const oldAttr:any = oldVnode.elm.attributes
        if(typeof oldOpt == 'object') {
            o = oldOpt
            o.src = o.src?o.src:oldAttr.src.value
        }else{
            o.group = oldOpt
            o.src = oldAttr.src.value
        }
        o.describe = o.describe || ''
        const $window:any = window
        if(o.src != s.src || o.describe != s.describe || o.group != s.group){
            s.group?$window.$picView.groupInit(s.group):null
            if(o.group != s.group){
                o.group?$window.$picView.groupInit(o.group):null
            }
        }
    }
    el.onclick = (e:any)=>{
        const $window:any = window
        const vm = $window.$picView
        const attr:any = el.attributes
        let src:string = s.src?s.src:attr.src.value
        src = src+'__$id'+el.getAttribute('__pv-id')
        vm.src = src
        vm.describe = s.describe
        vm.setName = s.group
        vm.open()
    }
}

export const picview: DirectiveOptions = {
    // bind(el, binding, vnode, oldvnode) {
    // },
    update(el, binding, vnode, oldvnode) {
        bindPicview(el, binding, vnode, oldvnode)
    },
    unbind(el, binding) {
    }
}