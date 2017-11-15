import { strings } from "../tool/strings";
import { Loop } from "../tool/loop";
/**
 * 分离基本属性内容
 */
export namespace propanalysis {
    export function parse(str: string, tree) {
        // 分离一般属性
        tree.class = parseClass(str);
        tree.id = parseId(str)[0];
        tree.prop = parseProp(str);
        tree.text = parseText(str);
        tree.tag = parseTag(str);
        tree.size = parseSize(str);
    }
    function parseClass(str) {
        return (str.match(/\.\w+/g) || []).map(clazz => {
            return clazz.slice(1);
        });
    }
    function parseId(str) {
        return (str.match(/#\w+/g) || []).map(id => {
            return id.slice(1);
        });
    }
    function parseText(str) {
        return [strings.findCharIndex(str, /\{/)[0]].map((from) => {
            let end = strings.findEndBracket(str, from, '{', '}');
            return str.substring(from + 1, end);
        })
    }
    function parseProp(str) {
        let prop = {};
        let propsArray = strings.findCharIndex(str, /\[/).map((from) => {
            let end = strings.findEndBracket(str, from, '[', ']');
            return str.substring(from + 1, end);
        });
        Loop.loop(propsArray, (val: string, index) => {

            let str = val.split(" ").forEach((p) => {
                let cb = p.split('=');
                prop[cb[0]] = cb[1];
            });
        })
        return prop;
    }
    function parseTag(str) {
        return (/^[a-zA-Z]\w+/.exec(str) || [])[0] || "div";
    }
    function parseSize(str) {
        return parseInt(((/\*[0-9]/.exec(str) || [])[0] || "*1").slice(1));
    }
}