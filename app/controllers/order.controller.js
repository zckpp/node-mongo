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
        requester: req.body.requester,
        requester_phone: req.body.requester_phone || '',
        vendor: req.body.vendor,
        manager: req.body.manager,
        shipment_cost: req.body.shipment_cost,
        total_cost: req.body.total_cost,
        items: req.body.items,
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
        items: req.body.items,
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
