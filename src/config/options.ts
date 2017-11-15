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
        console.log(nNode.ncode,byid,byclass,byTag)
        this.extends(byid,byclass,byTag)
    }
    // 整合内容
    // 按照标签优先级，先是id，再是class 再是tag
    // 此处内联css样式不存在，如果有应用也不影响
    extends(id,classes,tag){

    }
    // 
    extend(a,b){
        
        if(b == undefined){
            return a;
        }
        Object.keys(b).forEach((key)=>{
            if(key == 'css'){
                a.css = this.cssCopy(a.css,b.css);
            }else if(key == 'classes'){
                a.classes =  this.classesCopy(a.classes,b.classes)
            }else if(key == ''){

            }
        });
    }
    
    cssCopy(cssA,cssB){
        Object.keys(cssB).forEach((css)=>{
            cssA[css] = cssB[css];
        });
        return cssA;
    }
    classesCopy(classA,classB){
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
        }else{
            console.error("classes为数组或者空格分隔的string字符串")
        }
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
        return options.filter((el)=>el!=undefined).reduce((anode,bnode)=>{
            return this.extend(anode,bnode);
        });
    }
    byTag(nNode:Nnode){
        return this.options[nNode.tag]||{};
    }
}