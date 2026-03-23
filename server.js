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
      { name: 'Zesty Burger',        price: 20, emoji: '🍔', img: '' },
      { name: 'Large Pizza',         price: 40, emoji: '🍕', img: '' },
      { name: 'Buffalo Chicken',     price: 15, emoji: '🍗', img: '' },
      { name: 'Loaded Nachos',       price: 15, emoji: '🌮', img: 'https://i.ibb.co/gZYwQqWM/Loaded-Nachos.png' },
      { name: 'Grilled Cheese',      price: 15, emoji: '🧇', img: 'https://i.ibb.co/5gLjG41f/Grilled-Cheese-Tomato-Soup.webp' },
      { name: 'Chicken Tenders',     price: 12, emoji: '🍗', img: 'https://i.ibb.co/MDhwJ7LN/Chicken-Tenders.png' },
      { name: 'Steak Sandwich',      price: 18, emoji: '🥪', img: 'https://i.ibb.co/3mk6SDMg/Steak-Sandwich.png' },
      { name: 'Hot Dogs',            price: 12, emoji: '🌭', img: '' },
      { name: 'BBQ Pork Sandwich',   price: 14, emoji: '🥪', img: '' },
      { name: 'Fish and Chips',      price: 13, emoji: '🐟', img: 'https://i.ibb.co/N62HN4Y0/Fish-and-Chips.png' },
      { name: 'Spaghetti Carbonara', price: 30, emoji: '🍝', img: 'https://i.ibb.co/WNTnXSnK/Spaghetti-Carbonara.png' },
      { name: 'Chicken Quesadillas', price: 20, emoji: '🌮', img: 'https://i.ibb.co/Fkh1rH9x/Chicken-Quesadillas.png' },
      { name: 'Classic Beef Stew',   price: 28, emoji: '🍲', img: '' },
      { name: 'Adobo',               price: 18, emoji: '🍲', img: 'https://i.ibb.co/4RGpDmhY/Adobos.png' },
    ],
    drinks: [
      { name: 'Coca Cola',    price: 5, emoji: '🥤', img: 'https://i.ibb.co/S4rvh4HS/Coca-Cola.jpg' },
      { name: 'Sprite',       price: 5, emoji: '🥤', img: 'https://i.ibb.co/pvgzgNY8/Sprite.png' },
      { name: 'Orange Juice', price: 7, emoji: '🍊', img: 'https://i.ibb.co/fzQSVgy5/Orange-Juice.png' },
      { name: 'Mango Juice',  price: 7, emoji: '🥭', img: '' },
      { name: 'Iced Tea',     price: 6, emoji: '🧋', img: '' },
      { name: 'Lemonade',     price: 6, emoji: '🍋', img: '' },
      { name: 'Water',        price: 3, emoji: '💧', img: '' },
      { name: 'Root Beer',    price: 5, emoji: '🍺', img: '' },
      { name: 'Coffee',       price: 8, emoji: '☕', img: '' },
    ],
    sides: [
      { name: 'French Fries',  price: 8, emoji: '🍟', img: 'https://i.ibb.co/nsNdfgNW/French-Fries.png' },
      { name: 'Onion Rings',   price: 9, emoji: '🧅', img: 'https://i.ibb.co/XkDfTMPT/Onion-Rings.png' },
      { name: 'Coleslaw',      price: 6, emoji: '🥗', img: '' },
      { name: 'Mashed Potato', price: 7, emoji: '🥔', img: '' },
      { name: 'Garlic Bread',  price: 5, emoji: '🥖', img: '' },
      { name: 'Corn on Cob',   price: 6, emoji: '🌽', img: '' },
      { name: 'Side Salad',    price: 7, emoji: '🥗', img: '' },
      { name: 'Mac and Cheese',price: 9, emoji: '🧀', img: 'https://i.ibb.co/gHmNNTc/mac-and-cheese.png' },
      { name: 'Steamed Rice',  price: 4, emoji: '🍚', img: '' },
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZestyBite web server running on port ${PORT}`));

