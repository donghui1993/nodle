import CharacterAnalysis from './config/characteranalysis'
import { regexps } from './tool/regexps';
import { strings } from './tool/strings';
import { propanalysis } from './config/propanalysis';
import { Loop } from './tool/loop';
import Nnode from './nodle/Nnode';
class nodle {
    ncode;
    nNode = new Nnode();
    constructor(ncode, options, parent) {
        this.ncode = ncode;
        this.rebuild();
        this.nLoad(this.ncode, this.nNode);
        if (typeof parent == 'string') {
            parent = document.querySelector(parent);
        }
        this.nNodeCreate(this.nNode, parent);
    }
    /**
     * 用来重新构建传递进来的类zen coding语法字符串内容，将其整理为标准内容
     */
    rebuild() {
        this.ncode = CharacterAnalysis.analyze(this.ncode);
    }
    nLoad(ncode, nNode = new Nnode()) {
        let preCode = this.samelevel(ncode);
        if (preCode.length == 1) { // 这里是剥离单时候使用的内容
            return this.nSplitter(nNode, ncode);
        } else {
            preCode.forEach((partCode) => {
                nNode.children.push(this.nLoad(partCode));
                return partCode;
            })
        }
        if (!nNode.dom) { // 不需要保留未使用的key 值
            delete nNode.dom;
        }
        return nNode;
    }
    // 同级关系解构
    samelevel(ncode) {
        let codepart = [];
        if (!regexps.hasSamelevel(ncode)) {
            codepart.push(ncode);
        } else {
            let len = ncode.length,
                cursor = 0
            for (let i = 0; i < len; i++) {
                let char = ncode[i];
                if (char == '+') {
                    let ncodepart = ncode.substring(cursor, i);
                    cursor = i;
                    cursor++;
                    ncodepart != '+' && codepart.push(ncodepart);
                } else if (char == '>') {
                    let ncodepart = ncode.substring(cursor, len);
                    cursor = len;
                    codepart.push(ncodepart);
                    break;
                } else if (char == '(') {
                    let ebIndex = strings.findEndBracket(ncode, i );
                    let ncodepart = ncode.substring(cursor + 1, ebIndex); // 顺带去掉括号内容
                    codepart.push(ncodepart);
                    i = ebIndex;
                    cursor = ++i;
                    cursor++; // 排除一个)所占的位置
                }
            }
            if (cursor < len - 1) { // 如果循环结束cursor还未到末尾的话说明漏了最后部分的内容
                let ncodepart = ncode.substring(cursor, len);
                codepart.push(ncodepart);
            }
        }
        return codepart;
    }
    /**
     * 解构器,不存在兄弟关系的内容
     */
    nSplitter(nNode:Nnode, ncode) {
        if (ncode[0] == '(') {
            //查询末尾括号位置是否和
            let end = strings.findEndBracket(ncode, 0);
            if (end == ncode.length - 1) {
                ncode = ncode.substring(1, ncode.length - 1);
            }
        }
        if (!/[\(\+>]/.test(ncode)) {
            propanalysis.parse(ncode,nNode);
            return nNode;
        }
        let len = ncode.length,
            cursor = 0
        // 是否首尾括号内容

        for (let i = 0; i < len; i++) {
            let char = ncode[i];
            if (char == '>') {
                // 左边归为父元素，
                propanalysis.parse(ncode.substring(cursor, i),nNode);
                // 右边归为子元素
                nNode.children.push(this.nLoad(ncode.substring(i + 1, len)))
                return nNode;
            } else if (char == '(') {
                let end = strings.findEndBracket(ncode, i);

            } else if (char == '+') { // 同级关系
                return this.nLoad(ncode)
            }
        }
        return nNode;
    }
    /**
     * 动态组装
     */
    nNodeCreate(nNode:Nnode|Array<Nnode>, parent) {
        if (nNode instanceof Array) {
            for (var i = 0; i < nNode.length; i++) {
                this.nNodeCreate(nNode[i], parent);
            }
        } else {
            var cdom: HTMLElement;
            Loop.looptimes(nNode.size, () => {
                cdom = document.createElement(nNode.tag);
                if (nNode.class.length > 0) {
                    cdom.classList.add(...nNode.class);
                }
                if (nNode.id) {
                    cdom.setAttribute('id', nNode.id)
                }
                Loop.keyloop(nNode.prop, (key, val) => {
                    cdom.setAttribute(key, val)
                });
                cdom.innerText = nNode.text;
                if (parent instanceof HTMLElement) {
                    parent.appendChild(cdom);
                }
            });
            if (nNode.children) {
                this.nNodeCreate(nNode.children, cdom || parent)
            }
        }
    }
    /**
     * 附件工厂
     */
    annex(){}
}

window['nodle'] = nodle;