import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Order from '@models/order';
import Product from '@models/product';

export const createOrder = async (req: Request, res: Response) => {
  const { shippingInfo, orderItems, paymentInfo, taxAmount, shippingAmount, totalAmount } = req.body;

  if (!shippingInfo || !orderItems || !taxAmount || !shippingAmount || !totalAmount) {
    return res.status(400).json({ err: 'Order cannot be processed without all details' });
  }

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user?._id,
    });

    await Promise.all(
      order.orderItems.map(async ({ product, quantity }) => {
        await updateProductstock(product, quantity);
      })
    );

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error();
    return res.status(500).json({ err: 'Something went wrong' });
  }
};

/**
 * Update the product stock quantity in the database
 * @param productId Product's MongoDB ObjectId
 * @param quantity Product's quantity
 * @param increment Whether product stock should increment or decrement
 */
const updateProductstock = async (productId: Types.ObjectId, quantity: number, increment = false) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const stock = product.stock;

    if (increment) {
      // Increment the stock quantity (e.g Order is canceled)
      product.stock = stock + quantity;
    } else {
      // Decrement the stock quantity (e.g Order is created)
      if (stock < quantity) {
        throw new Error('Product stock is less than required quanity');
      }

      product.stock = stock - quantity;
    }

    await product.save({ validateBeforeSave: false });
  } catch (err) {
    console.error(err);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({ err: 'Order ID is required to get an order' });
  }

  try {
    const order = await Order.findById(orderId).populate('user', 'name email photo.secure_url role');

    if (!order) {
      return res.status(400).json({ err: 'Order ID is not valid' });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error();
    return res.status(500).json({ err: 'Something went wrong' });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id });

    if (!orders) {
      return res.status(400).json({ err: `No orders found for ${req.user?.name}` });
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error();
    return res.status(500).json({ err: 'Something went wrong' });
  }
};

/*
 * ### ADMIN ###
 */

export const adminGetAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error();
    return res.status(500).json({ err: 'Something went wrong' });
  }
};

export const adminUpdateOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const orderStatus = req.body.orderStatus;

  if (!orderStatus || !orderId) {
    return res.status(400).json({ err: 'Order ID and status is required to update order' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ err: 'No order found with given ID' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ err: 'Order is already delivered' });
    }

    if (orderStatus === 'canceled') {
      await Promise.all(
        order.orderItems.map(async ({ product, quantity }) => {
          await updateProductstock(product, quantity, true);
        })
      );
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error();
    return res.status(500).json({ err: 'Something went wrong' });
  }
};

export const adminDeleteOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ err: 'No order found with this order ID' });
    }

    const removedOrder = await order.remove();

    // TODO: Increase stock quantity again
    // order.orderItems.map(async ({ product, quantity }) => {
    //   await Product.findByIdAndUpdate(
    //     product,
    //     {
    //       stock: quantity,
    //     },
    //     {
    //       new: true,
    //       runValidators: true,
    //       useFindAndModify: false,
    //     }
    //   );
    // });

    return res.status(200).json({
      success: true,
      order: removedOrder,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Something went wrong' });
  }
};
