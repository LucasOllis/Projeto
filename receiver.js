const amqplib = require('amqplib');

const exchange = 'logs';

async function createChannel(conn, name) {
  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const { queue } = await channel.assertQueue("", { exclusive: true });

  console.log(`[FILIAL ${name}] Esperando mensagem`);

  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, (msg) => {
    if (msg.content) {
      console.log(`[FILIAL ${name}] Recebeu a mensagem: ${msg.content}`);
    }
  }, { noAck: true })
}

(async () => {
  const conn = await amqplib.connect('amqps://xnibqkke:8LovTPriDxf_B3cgYR3cec8x2McEDcwC@jackal.rmq.cloudamqp.com/xnibqkke');

  for (let filial of ["1", "2", "3", "4", "5"]) {
    await createChannel(conn, filial)
  }
  console.log("Todas as filiais foram criadas!")
})();