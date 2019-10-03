module.exports = (app) => {
    const orders = require('../controllers/order.controller.js');

    // Create a new order
    app.post('/orders', orders.create);

    // Retrieve all orders
    app.get('/orders', orders.findAll);

    // Retrieve a single order with orderId
    app.get('/orders/:orderId', orders.findOne);

    // Update a order with orderId
    app.put('/orders/:orderId', orders.update);

    // Delete a order with orderId
    app.delete('/orders/:orderId', orders.delete);

    // Create new items
    app.post('/items', orders.createItem);

    // Retrieve all items
    app.get('/items', orders.findAllItems);

    // Update a order with orderId
    app.put('/items/:itemId', orders.updateItem);
}
