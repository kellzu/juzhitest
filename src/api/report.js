import request from '@/utils/request'

/**
 * name:新增报表
 * 参数：id,startTime,endTime,userName,createId，productCount，inquiryTm，inquiry，inquiryPercentConversion，timelyReversionRate
 * avgReplyTime，amountOrderCount，completeOrderCount，gmtCreate，gmtModify，remark，emsBusinessGroupId，productExposure，productChickCount
 * arrivalAmount，pmsShopId
 *  */ 
export function insertReport(data) {
  return request({
    url: '/api/report/insertReport',
    method: 'post',
    data: data,
  });
}

/**
 * name:删除报表
 * 参数：id
 */
export function delReport(id){
    return request({
        url:'/api/report/delReport?id='+id,
        method:'GET'
    })
}

 /**
  * name:查询店铺id name
  * 参数：shopId，shopName，groupId，groupName
  */
 export function findShop(shopId,shopName){
    if(shopId){
        return request({
            url:'/api/report/findShopId?shopId='+shopId,
            method:'GET'
        })     
    }if (shopName) {
        return request({
            url:'/api/report/findShopId?shopName='+shopName,
            method:'GET'
        })
    } else {
        return request({
            url:'/api/report/findShopId',
            method:'GET'
        })
    }
    
}

 /**
  * name:查询业务组id name
  * 参数：shopId，shopName，groupId，groupName
  */
 export function findGroup(groupId,groupName){
    if(groupId){
        return request({
            url:'/api/report/findGroupId?groupId='+groupId,
            method:'GET'
        })     
    }if (groupName) {
        return request({
            url:'/api/report/findGroupId?groupName='+groupName,
            method:'GET'
        })
    } else {
        return request({
            url:'/api/report/findGroupId',
            method:'GET'
        })
    }
    
}

/**
 * name:获取报表列表
 * 参数：page，size
 */

export function getReportList(data){
    return request({
        url:'/api/report/reportList',
        method:'post',
        data:data
    })
}

/**
 * 获取报表详情
 * groupId，startTime，endTime，pmsShopId
 */

export function reportDetailInfo(data){
    return request({
        url:'/api/report/reportDetail',
        method:'post',
        data
    })
}