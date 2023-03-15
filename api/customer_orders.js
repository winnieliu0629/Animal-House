const express = require('express');
const router = express.Router();
const { requireAdmin, requireCustomer } = require('./utils');
const { 
  createOrder, 
  getOrderById, 
  getAllCustomerOrdersByCustomerId, 
  updateCustomerOrdersByCustomerId,
  getPendingOrderByCustomerId,
 } = require('../db');

router.post('/', requireCustomer, async (req, res, next) => {
  const {
    customerId,
    total_item_amount,
    shipping_fee,
    order_total_amount,
    order_date,
    order_status
  } = req.body;

  try {
    const newOrder = await createOrder({
      customerId,
      total_item_amount,
      shipping_fee,
      order_total_amount,
      order_date,
      order_status
    });
    
    if (req.user.role !== 'customer') {
      res.send({
        error: "Error",
        name: "UnauthorizedUser",
        message: "You must be a logged in customer to perform this action"
      })
    } else if (newOrder) {
      res.send(newOrder);
    } else {
      res.send({
        error: 'createOrderError',
        name: 'createOrderError',
        message: `Unable to create order for customer`
      })
    }
  } catch (error) {
    next(error);  
  }  
});

router.get('/:customerId', requireCustomer, async (req, res, next) => {
  const id = req.params.customerId;
  const customerSale = await getOrderById(id);

  // console.log(customerSale, 'customerSale');
  try {
    if (customerSale) {
      res.send(customerSale);
    } else {
      res.send({
        error: 'idError',
        name: 'idError',
        message: `Sale ID ${id} does not exist`
      })
    }
  } catch (error) {
    next(error);  
  }
});

router.get('/:customerId', requireCustomer, async (req, res, next) => {
  const { customerId } = req.params;

  try {
    const customerCart = getAllCustomerOrdersByCustomerId(customerId)
    res.send(customerCart);

  } catch (error) {
    next(error)
  }

})

router.patch('/:customerId', requireCustomer, async (req, res, next) => {
  const { customerId } = req.params;

  try {
    const customerCart = updateCustomerOrdersByCustomerId(customerId)
    res.send(customerCart);

  } catch (error) {
    next(error)
  }

})

module.exports = router;