const Queue = require('bee-queue');
const options = require('./utils/options');

const cookQueue = new Queue('cook', options);
const serveQueue = new Queue('serve', options);


const placeOrder = (order) => {
  return cookQueue.createJob(order).save();
};

serveQueue.process((job, done) => {
  console.log(`🧾 ${job.data.qty}x ${job.data.dish} ready to be served 😋`);
  // Notify the client via push notification, web socket or email etc.
  done();
});


module.exports.placeOrder = placeOrder;
