/**
 * nodle tree 对象
 */

export default class Nnode{
    ncode:string

    // 子对象，创建dom时需要深层迭代
    children:Array<Nnode>  = [];

    // dom标签名
    tag:string

    // dom对象
    dom:HTMLElement

    // id
    id:string

    // dom对象上的类名
    classes:Array<string>;

    //size
    size:number

    // 属性集
    prop:any

    css:{}

    text:string

}