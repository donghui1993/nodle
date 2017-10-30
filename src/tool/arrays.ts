import { Loop } from "./loop";

export namespace Arrays {
    /**
     * 数组穿插
     * 将左侧数组为基准，右侧一次穿插到左侧中来，
     * 如果左侧数量不足，将右侧全部插入到末尾
     * 如果右侧数量不足，则停止穿插内容
     */
    export function zipper(arrA: Array<any> = [], arrB: Array<any> = []) {
        let alen = arrA.length;
        let blen = arrB.length;
        let times = alen < blen ? alen : blen;
        let trueArr = [];
        let left;
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
        Loop.looptimes(times, (i) => {
            trueArr.push(arrA[i]);
            trueArr.push(arrB[i]);
        });
        trueArr.concat(left);
        return trueArr;
    }
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
    export function group(arr: Array<any>, grouplength, adhesion = 0) {
        if (grouplength <= adhesion) {
            throw Error('粘连步长不得超过步长')
        }
        if(adhesion<0){
            adhesion = 0;
        }
        let arrs = [];
        let cursor = 0
        Loop.loopsteps(arr.length + arr.length /(adhesion+1), grouplength, (index, times) => {
            let temparr = [];
            let from = cursor;
            Loop.looptimes(grouplength, index => {
                temparr.push(arr[from++]);
            });
            cursor +=( grouplength-adhesion)
            arrs.push(temparr);
        });
        return arrs;
    }
}