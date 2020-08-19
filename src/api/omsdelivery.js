import request from '@/utils/request';

export function addDelivery(data) {
    return request({
        url: "/purcher/order/addLogisticsInformation",
        method: "post",
        data: data
    })
}