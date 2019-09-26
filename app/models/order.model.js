const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    requester: String,
    requester_phone: String,
    vendor: {
        vendor_name: String,
        vendor_address: String,
        vendor_phone: String,
        vendor_fax: String
    },
    manager: String,
    manager_note: String,
    shipment_cost: Number,
    total_cost: Number,
    order_items: Array,
    authorized: String,
    po: String,
    pay_terms: String,
    accounts: String,
    status: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
