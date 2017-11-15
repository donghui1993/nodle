
import { Loop } from "../tool/loop";
import { Arrays } from "../tool/arrays";
import { strings } from "../tool/strings";


export default class CharacterAnalysis {
    static anayl: CharacterAnalysis;
    zencode: string;
    static analyze(zencode: string) {
        let anayl = CharacterAnalysis.anayl;
        if (!anayl) {
            anayl = CharacterAnalysis.anayl = new CharacterAnalysis();
        }
        anayl.zencode = zencode;
        anayl.wash();
        return anayl.zencode;
    }

    wash() {

        strings.testBracket(this.zencode);
        this.gt2plus();
        this.doubleparenttheses();
        // TODO: 如何将括号和元素组合变为正确的父子级关系
        //this.movePart();

        this.plusWithParentheses();
        this.moreParentheses();
        this.atStartParenthes();

    }

    /**
     * 如果第一个字符是 ( 则需要去掉该部分内容
     */
    atStartParenthes() {
        if (this.zencode.startsWith('(')) {
            let end = strings.findEndBracket(this.zencode);
            if (this.zencode[end + 1] == "+") {//如果该值为 + 号，则说明该区域内容为同级元素，不需要去除
                return;
            }
            let str = this.zencode.substring(1, end);
            if (end != this.zencode.length - 1) {
                str += this.zencode.substr(end + 1);
                this.zencode = str;
            }
            return this.atStartParenthes();
        }
    }
    /**
     * 用来去除同级行为 +(div) 的多余括号 --> +div
     */
    plusWithParentheses() {
        this.zencode = this.zencode.replace(/\+\(([^\)]+)\)/g, "+$1")
    }

    /**
     * 同级转换 ()() 为()+()
     */
    doubleparenttheses() {
        this.zencode = this.zencode.replace(/\((.+)\)\((.+)\)/g, '($1)+($2)')
    }

    /**
     * 将 div(span)或者 (span)div 转为 div>(span)
     * 如果两侧都有则以右侧为准  h1(span)div 转为 div>(span)
     * FIXME:
     * 如何解决两侧的不对等关系，如果确定父子级关系和兄弟关系
     */
    movePart() {
        // 查询开括号位置
        let index = strings.findCharIndex(this.zencode, /\(/);
        let backindex = [];
        Loop.loop(index, (val) => { // 查询对应的反括号的位置
            backindex.push(strings.findEndBracket(this.zencode, val));
        });

        index = Arrays.zipper(index, backindex);
        if (index[0] != 0) {
            index = [0].concat(index);
        }
        index = Arrays.group(index, 2, 1); // 获取分组内容
        console.log(this.zencode)
        //  获取到可以分割的数组内容
        //  依次排查各个部分的组成内容
        index.forEach((arr, index) => {
            if (arr[1] - arr[0] > 1) {
                let str = "";
                if (this.zencode[arr[0]] == '(') {//该部分是括号的左边开始位置
                    str = this.zencode.substring(arr[0], arr[1] + 1)
                } else { // 非括号部分
                    // 取该部的纯内容，将内容分割出来
                    let from = arr[0] == 0 ? 0 : arr[0] + 1;
                    let to = arr[1];

                    let l = this.zencode[from];
                    let r = this.zencode[to-1];
                    if((r=='>'||r=='+') || (l=='>'||l=='+')){//说明前面部分是有排列关系的不予处理
                        return  
                    }

                    str = this.zencode.substring(from, to); 

                }
                // console.log('breaket is :  ' + str);
            }
        })
        // div (span) div (span) (span) 


        //反向查询

        // let rightmatch = /\)[^\)\(\+>]/.exec(this.zencode);
        // let leftmatch = /[^\)\(\+>]\(/.exec(this.zencode);
        // let rightstr, leftstr;
        // if (rightmatch) {
        //     let str = this.zencode.slice(rightmatch.index + 1); // 截取从括号开始的最后字符串内容
        //     let end = /[\(\])\+>]/.exec(str) || [] as RegExpExecArray;
        //     if (!end.index) {
        //         end.index = str.length;
        //     }
        //     rightstr = str.substring(0, end.index); // 获取父级
        // }
        // if (leftmatch) {
        //     let str = this.zencode.substring(0, leftmatch.index + 1);// 截取从开始到括号之前的内容
        //     let parsestr = str.split('').reverse().join('');
        //     let end = /[\(\])\+>]/.exec(parsestr) || [] as RegExpExecArray;
        //     if (!end.index) {
        //         end.index = str.length;
        //     }
        //     parsestr = parsestr.substring(0, end.index); // 获取父级
        //     leftstr = parsestr.split('').reverse().join('');
        // }
        // if (rightstr) {
        //     // TODO

        // }
    }

    /**
     * 用来替换多余的括号嵌套 (((span))) --> (span)
     */
    moreParentheses() {
        // 查找多括号的位置
        let match = /\({2,}/.exec(this.zencode);
        if (match) {
            let len = match[0].length; // 匹配的多括号长度
            let from = match.index; // 第一次匹配的位置
            let end = strings.findEndBracket(this.zencode, from);
            if (end) { // 查询到end位置
                let str = "(" + this.zencode.substring(from + len, end - len + 1) + ")" + this.zencode.substring(end + 1);
                if (from != 0) { // 不是从0开始需要补足之前的内容
                    str = this.zencode.substring(0, from) + str
                }
                this.zencode = str
                //尾递归替换迭代
                return this.moreParentheses();
            }
        }
    }

    /**
     * 将 ()> 替换为 ()+
     */
    gt2plus() {
        this.zencode = this.zencode.replace(/\((.+)\)>/g, "($1)+")
    }

    /**
     * 将 >()替换出来为 
     */
    gtParenthese() {

    }
}