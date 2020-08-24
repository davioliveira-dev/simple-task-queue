const Queue = require('bee-queue');
const options = require('./utils/options');

const cookQueue = new Queue('cook', options);
const serveQueue = new Queue('serve', options);

cookQueue.process(3, (job, done) => {
  setTimeout(() => console.log('Getting the ingredients ready 🥬 🧄 🧅 🍄'), 1000);
  setTimeout(() => console.log(`🍳 Preparing ${job.data.dish}`), 3000);
  setTimeout(() => {
    console.log(`🧾 Order ${job.data.orderNo}: ${job.data.dish} ready`);
    done();
  }, job.data.qty * 7000);
});

cookQueue.on('succeeded', (job, result) => {
  serveQueue.createJob(job.data).save();
});
