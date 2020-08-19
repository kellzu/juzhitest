import request from '@/utils/request'

export function acceptanceOrder(purchaseId, deliveryId, acceptances) {
    return request({
        url: '/order/acceptance/' + purchaseId + "/" + deliveryId,
        method: "post",
        data: acceptances
    })
}