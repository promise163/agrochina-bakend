import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};
// 登录
export const fetchLogin = (data:any)=>{
    return request({
        url: '/user/login',
        method: 'post',
        data
    });
}
// 客户信息
export const fetchCustomList = (data:any)=>{
    return request({
        url: '/custom/list',
        method: 'get',
        params:data
    });
}

// 查询新闻列表
export const fetchNewsList = (data:any)=>{
    return request({
        url: '/news/list',
        method: 'get',
        params:data
    });
}

// id查询新闻产品
export const fetchNewsDetail = (id:any)=>{
    return request({
        url: '/news/'+id,
        method: 'get'
    });
}

// 上下架新闻产品
export const fetchNewsStatus = (data:any)=>{
    return request({
        url: '/news/update',
        method: 'put',
        data
    });
}

// 删除新闻产品
export const fetchNewsDetele = (id:any)=>{
    return request({
        url: '/news/del',
        method: 'get',
        params:{id}
    });
}

// 图片上传
export const fetchUpload = (data:any)=>{
    return request({
        url: '/files/upload',
        method: 'post',
        data,
        headers:{
            'Content-Type':'multipart/formData'
        }
    });
}

// 保存新闻和产品
export const fetchContentSave = (data:any)=>{
    return request({
        url: '/news/save',
        method: 'post',
        data
    });
}

