// mongoose models
const Order = require('../models/order.model.js');
const Item = require('../models/inventory.model.js');
// config logging
const logger = require('../../config/winston.config').logger;
// config nodemailer
const serviceEmail = require('../../config/nodeMailer.config').serviceEmail;
const transporter = require('../../config/nodeMailer.config').transporter;

// CRUD for request orders
// Create and Save a new order
exports.create = (req, res) => {
    // Create an order
    const order = new Order({
        requester: req.body.requester,
        requester_phone: req.body.requester_phone || '',
        vendor: req.body.vendor,
        manager: req.body.manager,
        manager_email: req.body.manager_email,
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
            let mailOptions = {
                from: serviceEmail,
                to: 'qzhang@carnegiescience.edu',
                subject: 'An gas cylinder order was created!',
                html: `
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
    <title>Carnegie Gas Cylinder Order System</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
</head>
<body style='margin: 0; padding: 0; background-color: #f7f9fa;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%'>
    <tr>
        <td style='padding: 10px 0 30px 0;'>
            <table align='center' border='0' cellpadding='0' cellspacing='0' width='600'
                   style='border-collapse: collapse;'>
                <tr>
                    <td bgcolor='#f7f9fa'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td>

                                    <h3>Carnegie Gas Cylinder Order System</h3>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor='#ffffff' style='padding: 30px; border-top: 2px solid #5eb6cd;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style='padding: 10px 0 20px 20px;font-size: 11.5pt; line-height: 23px; font-family: helvetica,sans-serif; color: rgb(96,96,96);'>

                                    <p>A request from ${req.body.requester} was created!</p>
  <p><a href="https://mycarnegie.carnegiescience.edu/bbr-gas-order-dashboard-manager">Click here to check out.</a></p>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    logger.log('error', `Error Message : ${error}`);
                } else {
                    logger.log('info', 'Email sent: ' + info.response);
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the order."
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};

// Retrieve and return all orders from the database.
exports.findAll = (req, res) => {
    Order.find().sort( { createdAt: -1 } )
        .then(orders => {
            res.send(orders);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};

// Find a single order with a orderId
exports.findOne = (req, res) => {
    Order.findById(req.params.orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.send(order);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
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
        manager_email: req.body.manager_email,
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
            if (!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            } else {
                res.status(200).send({
                    message: "Note is added successfully.",
                    status: 200
                });
                if ('approved' == req.body.status) {
                    // TODO: send email to requester and accounting when approved
                    let mailOptions = {
                        from: serviceEmail,
                        to: 'qzhang@carnegiescience.edu',
                        subject: 'Your cylinder order was approved!',
                        html: `
                        <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
    <title>Carnegie Gas Cylinder Order System</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
</head>
<body style='margin: 0; padding: 0; background-color: #f7f9fa;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%'>
    <tr>
        <td style='padding: 10px 0 30px 0;'>
            <table align='center' border='0' cellpadding='0' cellspacing='0' width='600'
                   style='border-collapse: collapse;'>
                <tr>
                    <td bgcolor='#f7f9fa'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td>

                                    <h3>Carnegie Gas Cylinder Order System</h3>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor='#ffffff' style='padding: 30px; border-top: 2px solid #5eb6cd;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style='padding: 10px 0 20px 20px;font-size: 11.5pt; line-height: 23px; font-family: helvetica,sans-serif; color: rgb(96,96,96);'>

                                    <p>Your request was approved by ${req.body.manager}.</p>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            logger.log('error', `Error Message : ${error}`);
                        } else {
                            logger.log('info', 'Email sent: ' + info.response);
                        }
                    });
                } else if ('declined' == req.body.status) {
                    // TODO: send email to requester when declined
                    let mailOptions = {
                        from: serviceEmail,
                        to: 'qzhang@carnegiescience.edu',
                        subject: 'Your cylinder order was declined.',
                        html: `
                        <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
    <title>Carnegie Gas Cylinder Order System</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
</head>
<body style='margin: 0; padding: 0; background-color: #f7f9fa;'>
<table border='0' cellpadding='0' cellspacing='0' width='100%'>
    <tr>
        <td style='padding: 10px 0 30px 0;'>
            <table align='center' border='0' cellpadding='0' cellspacing='0' width='600'
                   style='border-collapse: collapse;'>
                <tr>
                    <td bgcolor='#f7f9fa'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td>

                                    <h3>Carnegie Gas Cylinder Order System</h3>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor='#ffffff' style='padding: 30px; border-top: 2px solid #5eb6cd;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style='padding: 10px 0 20px 20px;font-size: 11.5pt; line-height: 23px; font-family: helvetica,sans-serif; color: rgb(96,96,96);'>

                                    <p>Your request was declined by ${req.body.manager}.</p>
                                    <p>The reason is ${req.body.manager_note}</p>

                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            logger.log('error', `Error Message : ${error}`);
                        } else {
                            logger.log('info', 'Email sent: ' + info.response);
                        }
                    });
                }
            }
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error updating order with id " + req.params.orderId
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};

// Delete a order with the specified orderId in the request
exports.delete = (req, res) => {
    Order.findByIdAndRemove(req.params.orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.send({message: "order deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
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
    Item.insertMany(items, {ordered: false})
        .then(data => {
            res.status(200).send({
                message: data,
                status: 200
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating items."
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};

// Retrieve and return all items from the database.
exports.findAllItems = (req, res) => {
    Item.find().sort( { createdAt: -1 } )
        .then(items => {
            res.send(items);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving items."
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};

// Update a item identified by the itemId in the request
exports.updateItem = (req, res) => {
    // Find item and update it with the request body
    Item.findByIdAndUpdate(req.params.itemId, {
        item_id: req.body.item_id,
    }, {new: true})
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "item not found with id " + req.params.itemId
                });
            }
            res.status(200).send({
                message: "Item ID is added successfully.",
                status: 200
            });
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "item not found with id " + req.params.itemId
            });
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.itemId
        });
        logger.log('error', `Error Message : ${err.message}`);
    });
};
