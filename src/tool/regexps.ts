export namespace regexps {
    /**
     * 简单字符串
     * 不存在 ( ) + > 关系
     * @param str 
     */
    export function isSimple(str: string) {
        return !/[\(\)\+>]+/.test(str)
    }
    /**
     * 获取左右括号内容
     * @param char 
     */
    export function bracket(char) {
        return char == "(" ? 0 : char == ")" ? 1 : -1;
    }
    
    export function viv(char) {
        return char == "+";
    }

    export function gt(char) {
        return char == ">";
    }
}