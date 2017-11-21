import { Loop } from "../tool/loop";

/**
 * nodle tree 对象
 */

export default class Nnode {
    // 对象字符串
    ncode: string
    parent:Nnode;
    // 子对象，创建dom时需要深层迭代
    children: Array<Nnode> = [];

    // dom标签名
    _tag: string
    set tag(_tag){
        this._tag = _tag;
        if(!this.dom){
            this.dom = document.createElement(_tag);
        }
    }
    get tag(){
        return this._tag;
    }
    // dom对象
    _dom: HTMLElement
    get dom() {
        return this._dom
    }
    set dom(_dom){
        if(!this._dom){
            this._dom = _dom;
        }
    }

    // id
    _id: string
    get id(){
        return this._id;
    }
    set id(_id){
        if(typeof _id == 'string'){
            this._id =_id;
        }
    }
    // dom对象上的类名
    _classes;
    get classes() {
        return this._classes
    }
    set classes(_classes) {
        this._classes = _classes
    }

    //size
    _size: number = 1
    get size(){return this._size}
    set size(_size){
        if(this._size == 1){
            this._size = _size;
        }
    }

    _from =0;
    get from(){
        return this._from++ %(this.size+1);
    }
    set from(_from){}

    // 属性集
    _attr: any
    get attr(){return this._attr}
    set attr(_attr){

        this.id = _attr.id;
        delete _attr.id;

        this._attr = _attr;
    }
    _style;
    get style() {
        return this._style
    }
    set style(_style) {
        this._style = _style
    }

    _text="";
    get text() {
        return typeof  this._text == 'function'?this._text():this._text;
    }
    set text(_text) {
        this._text = _text;
    }
    _html="";
    get html() {
        let html = typeof  this._html == 'function'?this._html():this._html;
        if(Object.keys(html).indexOf('nNode') != -1){
            if(html.nNode.tag == undefined){ // 如果没有tag标识当前的是容器树
                let t = document.createElement('div');
                html.nNode.children.forEach(element => {
                    t.appendChild (element.dom);
                });
                return t.innerHTML;
            }
            return html.nNode.dom.outerHTML;
        }else{
            return html;
        }
    }
    set html(_html) {
        this._html = _html;
    }
}