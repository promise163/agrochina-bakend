import {ElLoading} from 'element-plus'

let loading:any = null;
let loadingCount = 0;


const stringLoading = ()=>{
    loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
}

const endLoading = ()=>{
    loading.close()
}

export const showLoading = ()=>{
    if(loadingCount == 0){
        stringLoading()
    }
    loadingCount += 1;
}

export const hideLoading = ()=>{
    if(loadingCount <= 0){
        return
    }
    loadingCount -= 1;
    if(loadingCount == 0){
        endLoading()
    }
}