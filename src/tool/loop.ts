export namespace Loop {
    export function loop(body: Array<any> | string = [], fn: (val, index, body) => any,from=0) {
        let len = body.length;
        for (let i = from; i < len; i++) {
            if (fn(body[i], i, body) === -1) {
                return;
            }
        }
    }
    export function looptimes(times=0,fn:(index,times)=>any){
        for(let i=0;i<times;i++){
            if (fn( i, times) === -1) {
                return;
            }
        }
    }
    export function loopsteps(times=0,steps=1,fn:(index,times,steps)=>any){
        for(let i=0;i<times;i+=steps){
            if (fn( i, times,steps) === -1) {
                return;
            }
        }
    }
    export function keyloop(obj={},fn:(key,val,obj)=>any){
        for(let key in obj){
            fn(key,obj[key],obj);
        }
    }
}