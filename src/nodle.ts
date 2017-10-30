/**
 * 类 zencoding语法的dom库
 * 分为 zencode -->基本的 dom 树语法
 * 
 */



import CharacterAnalysis from './config/characteranalysis'
import { regexps } from './tool/regexps';
import { strings } from './tool/strings';
import { propanalysis } from './config/propanalysis';
import { Loop } from './tool/loop';
class nodle {
    zencode: string;
    zentree = {};
    zendom;
    constructor(zencode, options, parent) {
        this.zencode = zencode;
        this.rebuild();
        this.spliter(this.zentree);
        if(typeof parent == 'string'){
            parent = document.querySelector(parent);
        }
        this.treeCreate(this.zentree, parent);
    }
    /**
     * 用来重新构建传递进来的类zen coding语法字符串内容，将其整理为标准内容
     */
    rebuild() {
        this.zencode = CharacterAnalysis.analyze(this.zencode);
    }
    /**
     * 解构器
     */
    spliter(tree, str = this.zencode) {
        if (regexps.isSimple(str)) {
            propanalysis.parse(str, tree);
            return tree;
        }
        if (!tree.child) {
            tree.child = [];
        }
        if (str[0] == '(') { // 如果是 (  strings .. ) 这种情况
            if (strings.findEndParenthese(str) == str.length - 1) {
                return this.spliter(tree, str.substring(1, str.length - 1));
            }
        }
        let start = 0, // 上一次游标开始位置
            end = 0, // 上一次游标结束为止
            cursor = 0, // 游标当前位置
            startPoint = false,
            parseBreacket = 0;

        for (; cursor < str.length; cursor++) {
            let char = str[cursor]; // 当前的字符内容
            if (regexps.bracket(char) == 0) {
                end = strings.findEndParenthese(str, cursor + 1) + cursor;
                let part = str.substring(cursor + 1, end);
                // 重置开始位置
                start = cursor;
                tree.child.push(this.spliter({}, part));
            }
            else if (regexps.gt(char) || regexps.bracket(str[cursor + 1]) == 0) {
                // 左侧归档树内容
                propanalysis.parse(str.substring(start, cursor), tree);
                let child = this.spliter({}, str.substring(cursor + 1));
                return tree.child.push(child), tree;
            }
            // 同级兄弟元素处理
            else if (regexps.viv(char)) {
                /**
                 * 如果遇到 + 号，则需要从当前位置到start的位置将值切下。右侧单独进入循环内容
                 */
                if (startPoint) {
                    startPoint = false;
                } else {
                    // 左边的部分可能已经被处理过了
                    if (parseBreacket > 0) {
                        parseBreacket--
                    } else {
                        tree.child.push(this.spliter({}, str.substring(start, cursor)));
                    }
                }
                start = cursor + 1;
                // 如何理解 div + div + div + div的结构呢
                // FIXME: 右边部分可能还是存在兄弟结构
                tree.child.push(this.spliter({}, str.substring(start)));
            }
        }
        if (tree.child && tree.child.length == 0) {
            delete tree.child;
        }
        return tree;
    }
    /**
     * 动态组装
     */
    treeCreate(result, parent) {
        if (result instanceof Array) {
            for (var i = 0; i < result.length; i++) {
                this.treeCreate(result[i], parent);
            }
        } else {
            var cdom;
            Loop.looptimes(result.size, () => {
                cdom = document.createElement(result.tag);
                if(result.class.length>0){
                    cdom.classList.add(...result.class);
                }
                if(result.id){
                    cdom.setAttribute('id', result.id)
                }
                Loop.keyloop(result.prop, (key, val) => {
                    cdom.setAttribute(key, val)
                });
                cdom.innerText = result.text;
                if (parent instanceof HTMLElement) {
                    parent.appendChild(cdom);
                }
                if (!this.zendom) {
                    this.zendom = cdom;
                }
            });
            if (result.child) {
                this.treeCreate(result.child, cdom || parent)
            }
        }
    }
    /**
     * 附件工厂
     */
}

window['nodle'] = nodle;