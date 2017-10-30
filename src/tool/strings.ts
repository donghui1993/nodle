import { Loop } from "../tool/loop";

export namespace strings {
    /**
     * 查找闭括号位置,应该从左括号开始
     * 如果查询到则返回字符串的index值，否则返回0
     */
    export function findEndParenthese(str :string, from = 0,left="(",right=')') {
        strings.testParenthes(str);
        let size = -1;//当前左括号计数器
        let endcursor = 0;
        Loop.loop(str, (char, index, any) => {
            if (char == left) {//从当前位置查询到char为左括号，则当前位置的数量+1
                size++;
            } else if (char == right) {
                size--;
                if (size == -1) {//为 -1则标识当前的循环值结束了
                    endcursor = index;
                    return -1; // 结束loop
                }
            }
        }, from);
        return endcursor;
    }
    /**
     * 测试括号是否数量一致
     */
   export function testParenthes(str) {
        let left = str.match(/\(/g)||"";
        let rigth = str.match(/\)/g)||"";
        if (left.length !== rigth.length) {
            throw Error('<\'' + str + '\'> 括号开闭数量不匹配')
        }
    }
     /**
     * 查找指定字符的索引位置
     * @param str 字符串
     * @param char 需要查找的字符 
     */
    export function findCharIndex(str: string, reg, indexarr = [], from = 0): Array<any> {
        let arr = str.match(reg);
        if (arr) {
            let lastest = indexarr[indexarr.length - 1];
            lastest = lastest == undefined ? 0 : lastest + 1;
            indexarr.push(arr.index + lastest);
            return strings.findCharIndex(str.slice(arr.index + 1), reg, indexarr);
        } else {
            return indexarr;
        }
    }
}