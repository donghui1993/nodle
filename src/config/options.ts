import Nnode from '../nodle/Nnode'
export default class Options {
    options;
    constructor(options){
        this.options = options;
    }
    find(nNode:Nnode){
        let byid = this.byId(nNode);
        let byclass = this.byClass(nNode);
        let byTag = this.byTag(nNode);
        let newnode =  this.extends([byTag,byclass,byid]);
        return this.extendNode(newnode,nNode);
    }
    // 整合内容
    // 按照标签优先级，先是id，再是class 再是tag
    // 此处内联css样式不存在，如果有应用也不影响
    extends(arr){
        return arr.reduce((a,b)=>{
            return this.extend(a,b);
        })
    }
    extendNode(newnode,nNode:Nnode){
        if(newnode == undefined){
            return nNode;
        }
        Object.keys(newnode).forEach((key)=>{
            let v = nNode[key];
            if(key == 'classes'){
                nNode.classes =  this.classesCopy(nNode.classes,newnode.classes)
            }
            if(v == undefined||v==""||v==1||( v instanceof Array && v.length == 0) || typeof v == 'object' && Object.keys(v).length == 0){
                nNode[key] = newnode[key]
            }
        });
        return nNode;
    }
    // 混合两个对象的属性值
    extend(a,b){
        if(b == undefined){
            return a;
        }else if(a==undefined){
            return b;
        }
        Object.keys(b).forEach((key)=>{
            if(key == 'classes'){
                a.classes =  this.classesCopy(a.classes,b.classes)
            }else {
                a[key] = this.mixin(a[key],b[key]);
            }
        });
        return a;
    }
    mixin(a,b){
        if(b == undefined || b == "") {
            return a;
        }else if(a == undefined || a == ""){
            return b
        }
        if(typeof b == "string"){
            return b;
        }
        Object.keys(b).forEach((key)=>{
            a[key] = b[key];
        });
        return a;
    }
    classesCopy(classA,classB){ // class单独去重操作
        classA = typeof classA == 'string'?classA.split(' '):classA;
        classB = typeof classB == 'string'?classB.split(' '):classB;
        if(classA instanceof Array && classB instanceof Array){ // 同时为array时才可以使用
            let  _class =[];
             classA.concat(classB).forEach((c)=>{
                if(_class.indexOf(c) == -1){
                    _class.push(c);
                }
            });
            return _class;
        }else if( classB instanceof Array){
            return classB;
        }
        return classA;
    }

    byId(nNode:Nnode){
        if(nNode.id){
            return this.options["#"+nNode.id]||{};
        }else{
            return {};
        }
    }
    // 按照class的优先顺序进行查询
    byClass(nNode:Nnode){
        let options = [];
        if(nNode.classes && nNode.classes.length>0){
            nNode.classes.forEach((_class)=>{
                options.push(this.options['.'+_class]);
            })
        }
        options = options.filter((el)=>el!=undefined);
        if(options.length>0)
            return options.reduce((anode,bnode)=>{
                return this.extend(anode,bnode);
            });
        return {};
    }
    byTag(nNode:Nnode){
        return this.options[nNode.tag]||{};
    }
}