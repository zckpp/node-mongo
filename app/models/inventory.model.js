const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    item_id: String,
    item_name: String,
    item_unit_price: Number,
    item_description: String,
    requester: String,
    manager: String,
    manager_email: String,
    vendor: {
        vendor_name: String,
        vendor_address: String,
        vendor_phone: String,
        vendor_fax: String
    },
    order_id: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);
