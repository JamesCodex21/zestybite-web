const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// In-memory order queue (orders wait here until PC app picks them up)
let pendingOrders = [];
let orderHistory = [];

// ── PC app polls this endpoint every second to get new orders ──────────────
app.get('/api/poll', (req, res) => {
  const orders = [...pendingOrders];
  pendingOrders = []; // clear after PC picks them up
  res.json({ orders });
});

// ── Customer submits order from phone/browser ──────────────────────────────
app.post('/api/order', (req, res) => {
  const order = req.body;
  order.id = 'ORD-' + Date.now();
  order.timestamp = new Date().toISOString();
  pendingOrders.push(order);
  orderHistory.push(order);
  console.log(`[ORDER] ${order.customer} — ${order.items.length} items — $${order.total}`);
  res.json({ status: 'received', orderId: order.id });
});

// ── Menu data ──────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  res.json({
    food: [
      { name: 'Zesty Burger',        price: 20, emoji: '🍔' },
      { name: 'Large Pizza',         price: 40, emoji: '🍕' },
      { name: 'Buffalo Chicken',     price: 15, emoji: '🍗' },
      { name: 'Loaded Nachos',       price: 15, emoji: '🌮' },
      { name: 'Grilled Cheese',      price: 15, emoji: '🧇' },
      { name: 'Chicken Tenders',     price: 12, emoji: '🍗' },
      { name: 'Steak Sandwich',      price: 18, emoji: '🥪' },
      { name: 'Hot Dogs',            price: 12, emoji: '🌭' },
      { name: 'BBQ Pork Sandwich',   price: 14, emoji: '🥪' },
      { name: 'Fish and Chips',      price: 13, emoji: '🐟' },
      { name: 'Spaghetti Carbonara', price: 30, emoji: '🍝' },
      { name: 'Chicken Quesadillas', price: 20, emoji: '🌮' },
      { name: 'Classic Beef Stew',   price: 28, emoji: '🍲' },
      { name: 'Adobo',               price: 18, emoji: '🍲' },
    ],
    drinks: [
      { name: 'Coca Cola',    price: 5, emoji: '🥤' },
      { name: 'Sprite',       price: 5, emoji: '🥤' },
      { name: 'Orange Juice', price: 7, emoji: '🍊' },
      { name: 'Mango Juice',  price: 7, emoji: '🥭' },
      { name: 'Iced Tea',     price: 6, emoji: '🧋' },
      { name: 'Lemonade',     price: 6, emoji: '🍋' },
      { name: 'Water',        price: 3, emoji: '💧' },
      { name: 'Root Beer',    price: 5, emoji: '🍺' },
      { name: 'Coffee',       price: 8, emoji: '☕' },
    ],
    sides: [
      { name: 'French Fries',  price: 8, emoji: '🍟' },
      { name: 'Onion Rings',   price: 9, emoji: '🧅' },
      { name: 'Coleslaw',      price: 6, emoji: '🥗' },
      { name: 'Mashed Potato', price: 7, emoji: '🥔' },
      { name: 'Garlic Bread',  price: 5, emoji: '🥖' },
      { name: 'Corn on Cob',   price: 6, emoji: '🌽' },
      { name: 'Side Salad',    price: 7, emoji: '🥗' },
      { name: 'Mac and Cheese',price: 9, emoji: '🧀' },
      { name: 'Steamed Rice',  price: 4, emoji: '🍚' },
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZestyBite web server running on port ${PORT}`));
