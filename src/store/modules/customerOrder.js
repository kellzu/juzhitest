
const customerOrder = {
    state: JSON.parse(sessionStorage.getItem('customerOrder')) == null ? null : JSON.parse(sessionStorage.getItem('customerOrder')),
    mutations: {
        SET_CUSTOMER_ORDER: (state, orderEntity) => {
            sessionStorage.setItem('customerOrder', JSON.stringify(orderEntity))
            state = orderEntity;
        },
        CLEAR_CUSTOMER_ORDER: (state) => {
            sessionStorage.setItem('customerOrder', null)
            state = null;
        }
    },
    // actions
}

export default customerOrder