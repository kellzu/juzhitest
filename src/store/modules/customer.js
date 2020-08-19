
const customer = {
  state: {
    customerId: null,
    customerName: '',
  },

  mutations: {
    SET_CUSTOMER_ID: (state, payload) => {
      state.customerId = payload.id;
      status.customerName = payload.name;
    },
  },

  actions: {
  }
}

export default customer
