//docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
const { createClient } = require('redis');//npm install redis
const client = createClient();// connect on localhost using the default port 6379
//createClient({url: 'redis://user:password@server_ip:server_port' });
client.on('error', err => console.log('Redis Client Error', err));
 (async ()=>{
  await client.connect();
   const objectReadFromRedis = await client.get("data-aula");
  console.log("Read from Redis value", objectReadFromRedis);
  /*
  const objectId = "1000-9999";
  let object = {id: objectId, content: "Redis is a great NoSQL on memory key-value database"};
  //write and read key x values
  await client.set(object.id, JSON.stringify(object));
  // some point in future, using the same id....
  const objectReadFromRedis = await client.get(objectId);
  console.log("Read from Redis value", JSON.parse(objectReadFromRedis));
   //write and read key x maps
  await client.hSet('user-session:123', {
    name: 'John',
    surname: 'Smith',
    company: 'Redis',
    age: 29
  })
   let userSession = await client.hGetAll('user-session:123');
  console.log("Read map value", JSON.stringify(userSession, null, 2));
  */
})();
