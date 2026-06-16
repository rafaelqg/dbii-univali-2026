let cassandra = require('cassandra-driver');
const keyspace="news";
let contactPoints = ['localhost'];
let client = new cassandra.Client({
contactPoints:contactPoints,
keyspace:keyspace,localDataCenter:
'datacenter1'
});

 async function cassandra_interaction(){
  /* execute on cqlsh
  CREATE KEYSPACE IF NOT EXISTS news WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
  CREATE TABLE news (id UUID PRIMARY KEY, content text, published timestamp, category text);
  */

  const sql_insert = "INSERT INTO news (id, content, category, published) VALUES (uuid (), 'Today we had a very nice class about cassandra.', 'technology', toTimestamp(now()));";
  const sql_select = "SELECT * FROM NEWS";
  await client.execute(sql_insert);
  //letquery='select*fromcyclist_byname';
  let query = sql_select;
  //letparameters=[];
  let parameters= [];//["Rafael", "Gonçalves"];
  client.execute(query,parameters, function(error, result){
    if(error!=undefined){
      console.log('Error:',error);
    }else{
      console.table(result.rows);
    }
  });
}
cassandra_interaction();
