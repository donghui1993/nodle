/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loop;
(function (Loop) {
    function loop(body, fn, from) {
        if (body === void 0) { body = []; }
        if (from === void 0) { from = 0; }
        var len = body.length;
        for (var i = from; i < len; i++) {
            if (fn(body[i], i, body) === -1) {
                return;
            }
        }
    }
    Loop.loop = loop;
    function looptimes(times, fn) {
        if (times === void 0) { times = 0; }
        for (var i = 0; i < times; i++) {
            if (fn(i, times) === -1) {
                return;
            }
        }
    }
    Loop.looptimes = looptimes;
    function loopsteps(times, steps, fn) {
        if (times === void 0) { times = 0; }
        if (steps === void 0) { steps = 1; }
        for (var i = 0; i < times; i += steps) {
            if (fn(i, times, steps) === -1) {
                return;
            }
        }
    }
    Loop.loopsteps = loopsteps;
    function keyloop(obj, fn) {
        if (obj === void 0) { obj = {}; }
        for (var key in obj) {
            fn(key, obj[key], obj);
        }
    }
    Loop.keyloop = keyloop;
})(Loop = exports.Loop || (exports.Loop = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 类 zencoding语法的dom库
 * 分为 zencode -->基本的 dom 树语法
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var characteranalysis_1 = __webpack_require__(2);
var regexps_1 = __webpack_require__(5);
var strings_1 = __webpack_require__(6);
var propanalysis_1 = __webpack_require__(7);
var loop_1 = __webpack_require__(0);
var nodle = /** @class */ (function () {
    function nodle(zencode, options, parent) {
        this.zentree = {};
        this.zencode = zencode;
        this.rebuild();
        this.spliter(this.zentree);
        this.treeCreate(this.zentree, parent);
    }
    /**
     * 用来重新构建传递进来的类zen coding语法字符串内容，将其整理为标准内容
     */
    nodle.prototype.rebuild = function () {
        this.zencode = characteranalysis_1.default.analyze(this.zencode);
    };
    /**
     * 解构器
     */
    nodle.prototype.spliter = function (tree, str) {
        if (str === void 0) { str = this.zencode; }
        if (regexps_1.regexps.isSimple(str)) {
            propanalysis_1.propanalysis.parse(str, tree);
            return tree;
        }
        if (!tree.child) {
            tree.child = [];
        }
        if (str[0] == '(') {
            if (strings_1.strings.findEndParenthese(str) == str.length - 1) {
                return this.spliter(tree, str.substring(1, str.length - 1));
            }
        }
        var start = 0, // 上一次游标开始位置
        end = 0, // 上一次游标结束为止
        cursor = 0, // 游标当前位置
        startPoint = false, parseBreacket = 0;
        for (; cursor < str.length; cursor++) {
            var char = str[cursor]; // 当前的字符内容
            if (regexps_1.regexps.bracket(char) == 0) {
                end = strings_1.strings.findEndParenthese(str, cursor + 1) + cursor;
                var part = str.substring(cursor + 1, end);
                // 重置开始位置
                start = cursor;
                tree.child.push(this.spliter({}, part));
            }
            else if (regexps_1.regexps.gt(char) || regexps_1.regexps.bracket(str[cursor + 1]) == 0) {
                // 左侧归档树内容
                propanalysis_1.propanalysis.parse(str.substring(start, cursor), tree);
                var child = this.spliter({}, str.substring(cursor + 1));
                return tree.child.push(child), tree;
            }
            else if (regexps_1.regexps.viv(char)) {
                /**
                 * 如果遇到 + 号，则需要从当前位置到start的位置将值切下。右侧单独进入循环内容
                 */
                if (startPoint) {
                    startPoint = false;
                }
                else {
                    // 左边的部分可能已经被处理过了
                    if (parseBreacket > 0) {
                        parseBreacket--;
                    }
                    else {
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
    };
    /**
     * 动态组装
     */
    nodle.prototype.treeCreate = function (result, parent) {
        var _this = this;
        if (result instanceof Array) {
            for (var i = 0; i < result.length; i++) {
                this.treeCreate(result[i], parent);
            }
        }
        else {
            var cdom;
            loop_1.Loop.looptimes(result.size, function () {
                cdom = document.createElement(result.tag);
                (_a = cdom.classList).add.apply(_a, result.class);
                cdom.setAttribute('id', result.id);
                loop_1.Loop.keyloop(result.prop, function (key, val) {
                    cdom.setAttribute(key, val);
                });
                cdom.innerText = result.text;
                if (parent instanceof HTMLElement) {
                    parent.appendChild(cdom);
                }
                if (!_this.zendom) {
                    _this.zendom = cdom;
                }
                var _a;
            });
            if (result.child) {
                this.treeCreate(result.child, cdom || parent);
            }
        }
    };
    return nodle;
}());
window['nodle'] = nodle;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loop_1 = __webpack_require__(0);
var arrays_1 = __webpack_require__(3);
var strings_1 = __webpack_require__(6);
var CharacterAnalysis = /** @class */ (function () {
    function CharacterAnalysis() {
    }
    CharacterAnalysis.analyze = function (zencode) {
        var anayl = CharacterAnalysis.anayl;
        if (!anayl) {
            anayl = CharacterAnalysis.anayl = new CharacterAnalysis();
        }
        anayl.zencode = zencode;
        anayl.wash();
        return anayl.zencode;
    };
    CharacterAnalysis.prototype.wash = function () {
        strings_1.strings.testParenthes(this.zencode);
        this.gt2plus();
        this.doubleparenttheses();
        // TODO: 如何将括号和元素组合变为正确的父子级关系
        //this.movePart();
        this.plusWithParentheses();
        this.moreParentheses();
        this.atStartParenthes();
    };
    /**
     * 如果第一个字符是 ( 则需要去掉该部分内容
     */
    CharacterAnalysis.prototype.atStartParenthes = function () {
        if (this.zencode.startsWith('(')) {
            var end = strings_1.strings.findEndParenthese(this.zencode);
            if (this.zencode[end + 1] == "+") {
                return;
            }
            var str = this.zencode.substring(1, end);
            if (end != this.zencode.length - 1) {
                str += this.zencode.substr(end + 1);
                this.zencode = str;
            }
            return this.atStartParenthes();
        }
    };
    /**
     * 用来去除同级行为 +(div) 的多余括号 --> +div
     */
    CharacterAnalysis.prototype.plusWithParentheses = function () {
        this.zencode = this.zencode.replace(/\+\(([^\)]+)\)/g, "+$1");
    };
    /**
     * 同级转换 ()() 为()+()
     */
    CharacterAnalysis.prototype.doubleparenttheses = function () {
        this.zencode = this.zencode.replace(/\((.+)\)\((.+)\)/g, '($1)+($2)');
    };
    /**
     * 将 div(span)或者 (span)div 转为 div>(span)
     * 如果两侧都有则以右侧为准  h1(span)div 转为 div>(span)
     * FIXME:
     * 如何解决两侧的不对等关系，如果确定父子级关系和兄弟关系
     */
    CharacterAnalysis.prototype.movePart = function () {
        var _this = this;
        // 查询开括号位置
        var index = strings_1.strings.findCharIndex(this.zencode, /\(/);
        var backindex = [];
        loop_1.Loop.loop(index, function (val) {
            backindex.push(strings_1.strings.findEndParenthese(_this.zencode, val));
        });
        index = arrays_1.Arrays.zipper(index, backindex);
        if (index[0] != 0) {
            index = [0].concat(index);
        }
        index = arrays_1.Arrays.group(index, 2, 1); // 获取分组内容
        console.log(this.zencode);
        //  获取到可以分割的数组内容
        //  依次排查各个部分的组成内容
        index.forEach(function (arr, index) {
            if (arr[1] - arr[0] > 1) {
                var str = "";
                if (_this.zencode[arr[0]] == '(') {
                    str = _this.zencode.substring(arr[0], arr[1] + 1);
                }
                else {
                    // 取该部的纯内容，将内容分割出来
                    var from = arr[0] == 0 ? 0 : arr[0] + 1;
                    var to = arr[1];
                    var l = _this.zencode[from];
                    var r = _this.zencode[to - 1];
                    if ((r == '>' || r == '+') || (l == '>' || l == '+')) {
                        return;
                    }
                    str = _this.zencode.substring(from, to);
                }
                // console.log('breaket is :  ' + str);
            }
        });
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
    };
    /**
     * 用来替换多余的括号嵌套 (((span))) --> (span)
     */
    CharacterAnalysis.prototype.moreParentheses = function () {
        // 查找多括号的位置
        var match = /\({2,}/.exec(this.zencode);
        if (match) {
            var len = match[0].length; // 匹配的多括号长度
            var from = match.index; // 第一次匹配的位置
            var end = strings_1.strings.findEndParenthese(this.zencode, from);
            if (end) {
                var str = "(" + this.zencode.substring(from + len, end - len + 1) + ")" + this.zencode.substring(end + 1);
                if (from != 0) {
                    str = this.zencode.substring(0, from) + str;
                }
                this.zencode = str;
                //尾递归替换迭代
                return this.moreParentheses();
            }
        }
    };
    /**
     * 将 ()> 替换为 ()+
     */
    CharacterAnalysis.prototype.gt2plus = function () {
        this.zencode = this.zencode.replace(/\((.+)\)>/g, "($1)+");
    };
    /**
     * 将 >()替换出来为
     */
    CharacterAnalysis.prototype.gtParenthese = function () {
    };
    return CharacterAnalysis;
}());
exports.default = CharacterAnalysis;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loop_1 = __webpack_require__(0);
var Arrays;
(function (Arrays) {
    /**
     * 数组穿插
     * 将左侧数组为基准，右侧一次穿插到左侧中来，
     * 如果左侧数量不足，将右侧全部插入到末尾
     * 如果右侧数量不足，则停止穿插内容
     */
    function zipper(arrA, arrB) {
        if (arrA === void 0) { arrA = []; }
        if (arrB === void 0) { arrB = []; }
        var alen = arrA.length;
        var blen = arrB.length;
        var times = alen < blen ? alen : blen;
        var trueArr = [];
        var left;
        if (alen == 0) {
            return arrB;
        }
        if (blen == 0) {
            return arrA;
        }
        if (alen < blen) {
            left = arrB.slice(blen - alen);
        }
        if (blen < alen) {
            left = arrA.slice(alen - blen);
        }
        loop_1.Loop.looptimes(times, function (i) {
            trueArr.push(arrA[i]);
            trueArr.push(arrB[i]);
        });
        trueArr.concat(left);
        return trueArr;
    }
    Arrays.zipper = zipper;
    /**
     * 将数组分组归类
     * 步长为 1
     * 粘连步长 = 0时
     * [1,2,3,4] --> [[1,2],[3,4]]
     * 粘连步长 =1 时
     * [1,2,3,4] --> [[1,2],[2,3],[3,4]]
     * 粘连步长不超过步长值
     * @param arr 数组
     * @param grouplength 步长
     * @param adhesion 粘连步长
     */
    function group(arr, grouplength, adhesion) {
        if (adhesion === void 0) { adhesion = 0; }
        if (grouplength <= adhesion) {
            throw Error('粘连步长不得超过步长');
        }
        if (adhesion < 0) {
            adhesion = 0;
        }
        var arrs = [];
        var cursor = 0;
        loop_1.Loop.loopsteps(arr.length + arr.length / (adhesion + 1), grouplength, function (index, times) {
            var temparr = [];
            var from = cursor;
            loop_1.Loop.looptimes(grouplength, function (index) {
                temparr.push(arr[from++]);
            });
            cursor += (grouplength - adhesion);
            arrs.push(temparr);
        });
        return arrs;
    }
    Arrays.group = group;
})(Arrays = exports.Arrays || (exports.Arrays = {}));


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var regexps;
(function (regexps) {
    /**
     * 简单字符串
     * 不存在 ( ) + > 关系
     * @param str
     */
    function isSimple(str) {
        return !/[\(\)\+>]+/.test(str);
    }
    regexps.isSimple = isSimple;
    /**
     * 获取左右括号内容
     * @param char
     */
    function bracket(char) {
        return char == "(" ? 0 : char == ")" ? 1 : -1;
    }
    regexps.bracket = bracket;
    function viv(char) {
        return char == "+";
    }
    regexps.viv = viv;
    function gt(char) {
        return char == ">";
    }
    regexps.gt = gt;
})(regexps = exports.regexps || (exports.regexps = {}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loop_1 = __webpack_require__(0);
var strings;
(function (strings) {
    /**
     * 查找闭括号位置,应该从左括号开始
     * 如果查询到则返回字符串的index值，否则返回0
     */
    function findEndParenthese(str, from, left, right) {
        if (from === void 0) { from = 0; }
        if (left === void 0) { left = "("; }
        if (right === void 0) { right = ')'; }
        strings.testParenthes(str);
        var size = -1; //当前左括号计数器
        var endcursor = 0;
        loop_1.Loop.loop(str, function (char, index, any) {
            if (char == left) {
                size++;
            }
            else if (char == right) {
                size--;
                if (size == -1) {
                    endcursor = index;
                    return -1; // 结束loop
                }
            }
        }, from);
        return endcursor;
    }
    strings.findEndParenthese = findEndParenthese;
    /**
     * 测试括号是否数量一致
     */
    function testParenthes(str) {
        var left = str.match(/\(/g) || "";
        var rigth = str.match(/\)/g) || "";
        if (left.length !== rigth.length) {
            throw Error('<\'' + str + '\'> 括号开闭数量不匹配');
        }
    }
    strings.testParenthes = testParenthes;
    /**
    * 查找指定字符的索引位置
    * @param str 字符串
    * @param char 需要查找的字符
    */
    function findCharIndex(str, reg, indexarr, from) {
        if (indexarr === void 0) { indexarr = []; }
        if (from === void 0) { from = 0; }
        var arr = str.match(reg);
        if (arr) {
            var lastest = indexarr[indexarr.length - 1];
            lastest = lastest == undefined ? 0 : lastest + 1;
            indexarr.push(arr.index + lastest);
            return strings.findCharIndex(str.slice(arr.index + 1), reg, indexarr);
        }
        else {
            return indexarr;
        }
    }
    strings.findCharIndex = findCharIndex;
})(strings = exports.strings || (exports.strings = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = __webpack_require__(6);
var loop_1 = __webpack_require__(0);
/**
 * 分离基本属性内容
 */
var propanalysis;
(function (propanalysis) {
    function parse(str, tree) {
        // 分离一般属性
        tree.class = parseClass(str);
        tree.id = parseId(str)[0];
        tree.prop = parseProp(str);
        tree.text = parseText(str);
        tree.tag = parseTag(str);
        tree.size = parseSize(str);
    }
    propanalysis.parse = parse;
    function parseClass(str) {
        return (str.match(/\.\w+/g) || []).map(function (clazz) {
            return clazz.slice(1);
        });
    }
    function parseId(str) {
        return (str.match(/#\w+/g) || []).map(function (id) {
            return id.slice(1);
        });
    }
    function parseText(str) {
        return [strings_1.strings.findCharIndex(str, /\{/)[0]].map(function (from) {
            var end = strings_1.strings.findEndParenthese(str, from, '{', '}');
            return str.substring(from + 1, end);
        });
    }
    function parseProp(str) {
        var prop = {};
        var propsArray = strings_1.strings.findCharIndex(str, /\[/).map(function (from) {
            var end = strings_1.strings.findEndParenthese(str, from, '[', ']');
            return str.substring(from + 1, end);
        });
        loop_1.Loop.loop(propsArray, function (val, index) {
            var str = val.split(" ").forEach(function (p) {
                var cb = p.split('=');
                prop[cb[0]] = cb[1];
            });
        });
        return prop;
    }
    function parseTag(str) {
        return (/^[a-zA-Z]\w+/.exec(str) || [])[0] || "div";
    }
    function parseSize(str) {
        return parseInt(((/\*[0-9]/.exec(str) || [])[0] || "*1").slice(1));
    }
})(propanalysis = exports.propanalysis || (exports.propanalysis = {}));


/***/ })
/******/ ]);