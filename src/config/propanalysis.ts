import { strings } from "../tool/strings";
import { Loop } from "../tool/loop";
import Nnode from "../nodle/Nnode";
/**
 * 分离基本属性内容
 */
export namespace propanalysis {
    export function parse(ncode: string, nNode:Nnode) {
        // 分离一般属性
        nNode.classes = parseClass(ncode);
        nNode.id = parseId(ncode)[0];
        nNode.attr = parseAttr(ncode);
        nNode.text = parseText(ncode);
        nNode.tag = parseTag(ncode);
        nNode.size = parseSize(ncode);
        nNode.ncode = ncode;
    }
    function parseClass(ncode) {
        return (ncode.match(/\.\w+/g) || []).map(clazz => {
            return clazz.slice(1);
        });
    }
    function parseId(ncode) {
        return (ncode.match(/#\w+/g) || []).map(id => {
            return id.slice(1);
        });
    }
    function parseText(ncode):string {
        return [strings.findCharIndex(ncode, /\{/)[0]].map((from) => {
            let end = strings.findEndBracket(ncode, from, '{', '}');
            return ncode.substring(from + 1, end);
        }).join('');
    }
    function parseAttr(ncode) {
        let prop = {};
        let propsArray = strings.findCharIndex(ncode, /\[/).map((from) => {
            let end = strings.findEndBracket(ncode, from, '[', ']');
            return ncode.substring(from + 1, end);
        });
        Loop.loop(propsArray, (val: string, index) => {

            let ncode = val.split(" ").forEach((p) => {
                let cb = p.split('=');
                prop[cb[0]] = cb[1];
            });
        })
        return prop;
    }
    function parseTag(ncode) {
        return (/^[a-zA-Z]\w*/.exec(ncode) || [])[0] || "div";
    }
    function parseSize(ncode) {
        return parseInt(((/\*[0-9]/.exec(ncode) || [])[0] || "*1").slice(1));
    }
}