const Order = require('../models/order.model.js');
const Item = require('../models/inventory.model.js');

// CRUD for request orders
// Create and Save a new order
exports.create = (req, res) => {
    // Create an order
    const order = new Order({
        requester: req.body.requester,
        requester_phone: req.body.requester_phone || '',
        vendor: req.body.vendor,
        manager: req.body.manager,
        shipment_cost: req.body.shipment_cost,
        total_cost: req.body.total_cost,
        order_items: req.body.order_items,
        authorized: req.body.authorized || '',
        po: req.body.po || '',
        pay_terms: req.body.pay_terms || '',
        accounts: req.body.accounts || '',
        status: req.body.status || '',
    });
    // Save order in the database
    order.save()
        .then(data => {
            res.status(200).send({
                message: "order saved successfully.",
                status: 200
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the order."
        });
    });
};

// Retrieve and return all orders from the database.
exports.findAll = (req, res) => {
    Order.find()
        .then(orders => {
            res.send(orders);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    });
};

// Find a single order with a orderId
exports.findOne = (req, res) => {
    Order.findById(req.params.orderId)
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.send(order);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
};

// Update a order identified by the orderId in the request
exports.update = (req, res) => {
    // Find order and update it with the request body
    Order.findByIdAndUpdate(req.params.orderId, {
        requester: req.body.requester,
        requester_phone: req.body.requester_phone || '',
        vendor: req.body.vendor,
        manager: req.body.manager,
        manager_note: req.body.manager_note || '',
        shipment_cost: req.body.shipment_cost,
        total_cost: req.body.total_cost,
        order_items: req.body.order_items,
        authorized: req.body.authorized || '',
        po: req.body.po || '',
        pay_terms: req.body.pay_terms || '',
        accounts: req.body.accounts || '',
        status: req.body.status || '',
    }, {new: true})
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.status(200).send({
                message: "Note is added successfully.",
                status: 200
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error updating order with id " + req.params.orderId
        });
    });
};

// Delete a order with the specified orderId in the request
exports.delete = (req, res) => {
    Order.findByIdAndRemove(req.params.orderId)
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.send({message: "order deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Could not delete order with id " + req.params.orderId
        });
    });
};

// CRUD for inventory items
// Create and Save a new item
exports.createItem = (req, res) => {
    let items = [];
    req.body.order_items.forEach(order_item => {
        for (let i = 1; i <= order_item.order_quantity; i++) {
            // Create an item
            let item = new Item({
                item_id: 'not set',
                item_name: order_item.order_name,
                item_unit_price: order_item.order_unit_price,
                item_description: order_item.order_description,
                requester: req.body.requester,
                vendor: req.body.vendor,
                manager: req.body.manager,
                order_id: req.body._id,
            });
            items.push(item);
        }
    });
    // Save items in the database
    Item.insertMany(items, { ordered : false })
        .then(data => {
            res.status(200).send({
                message: data,
                status: 200
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating items."
        });
    });
};

// Retrieve and return all items from the database.
exports.findAllItems = (req, res) => {
    Item.find()
        .then(items => {
            res.send(items);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving items."
        });
    });
};

// Update a item identified by the itemId in the request
exports.updateItem = (req, res) => {
    // Find item and update it with the request body
    Item.findByIdAndUpdate(req.params.itemId, {
        item_id: req.body.item_id,
    }, {new: true})
        .then(item => {
            if(!item) {
                return res.status(404).send({
                    message: "item not found with id " + req.params.itemId
                });
            }
            res.status(200).send({
                message: "Item ID is added successfully.",
                status: 200
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "item not found with id " + req.params.itemId
            });
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.itemId
        });
    });
};
