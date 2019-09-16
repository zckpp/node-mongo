const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    order_requester: String,
    order_requester_phone: String,
    order_vendor: {
        order_vendor_name: String,
        order_vendor_address: String,
        order_vendor_phone: String,
        order_vendor_fax: String
    },
    order_manager: String,
    order_manager_note: String,
    order_shipment_cost: Number,
    order_total_cost: Number,
    order_items: Array,
    order_authorized: String,
    order_po: String,
    order_pay_terms: String,
    order_accounts: String,
    status: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
