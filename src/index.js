require('dotenv').config();
const express = require('express');
const http = require('http');
require('./kitchen');
const {placeOrder} = require('./waiter');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

// ROUTES

app.get('/', (req, res) => {
  res.send('😋 We are serving freshly cooked food 🍲');
});

app.post('/order', (req, res) => {
  const order = {
    dish: req.body.dish,
    qty: req.body.qty,
    orderNo: Date.now().toString(36),
  };

  if (order.dish && order.qty) {
    placeOrder(order)
        .then(() => res.json({
          done: true, message: 'Your order will be ready in a while',
        }))
        .catch(() => res.json({
          done: false, message: 'Your order could not be placed',
        }));
  } else {
    return res.status(401).json({message: 'Bad request!'});
  }
});

app.post('/order-legacy', (req, res) => {
  const order = {
    dish: req.body.dish,
    qty: req.body.qty,
    orderNo: Date.now().toString(36),
  };
  if (order.dish && order.qty) {
    setTimeout(
        () => console.log('Getting the ingredients ready... 🥬 🧄 🧅 🍄'), 1000,
    );
    setTimeout(() => console.log(`🍳 Preparing ${order.dish}`), 1500);
    setTimeout(() => {
      console.log(`🧾 Order ${order.orderNo}: ${order.dish} ready`);
      res.json({
        done: true, message: `Your ${order.qty}x ${order.dish} is ready`,
      });
    }, order.qty * 5000);
  } else {
    console.log('Incomplete order rejected');
    res.status(422).json({
      done: false, message: 'Your order could not be placed',
    });
  }
});

//

const server = http.createServer(app);
const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT}`);
});
