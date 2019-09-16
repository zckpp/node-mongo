const Order = require('../models/order.model.js');

// Create and Save a new order
exports.create = (req, res) => {
    // Validate request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "order content can not be empty!"
    //     });
    // }

    // Create a order
    const order = new Order({
        order_requester: req.body.order_requester,
        order_requester_phone: req.body.order_requester_phone || '',
        order_vendor: req.body.order_vendor,
        order_manager: req.body.order_manager,
        order_shipment_cost: req.body.order_shipment_cost,
        order_total_cost: req.body.order_total_cost,
        order_items: req.body.order_items,
        order_authorized: req.body.order_authorized || '',
        order_po: req.body.order_po || '',
        order_pay_terms: req.body.order_pay_terms || '',
        order_accounts: req.body.order_accounts || '',
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
        order_requester: req.body.order_requester,
        order_requester_phone: req.body.order_requester_phone || '',
        order_vendor: req.body.order_vendor,
        order_manager: req.body.order_manager,
        order_manager_note: req.body.order_manager_note || '',
        order_shipment_cost: req.body.order_shipment_cost,
        order_total_cost: req.body.order_total_cost,
        order_items: req.body.order_items,
        order_authorized: req.body.order_authorized || '',
        order_po: req.body.order_po || '',
        order_pay_terms: req.body.order_pay_terms || '',
        order_accounts: req.body.order_accounts || '',
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
