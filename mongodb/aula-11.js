const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27023/";//$ mongo mongodb://<host>:<port>
const client = new MongoClient(uri);

function geraObjetoCandito(nome, sobrenome, genero, dataNascimento, caracteristicas,cargo,valor){
    return {
        "nome": nome,
        sobrenome: sobrenome,
        genero,
        dataNascimento: dataNascimento,
        caracteristicas: caracteristicas,
        cargo: cargo,
        valor: valor
    }
}

async function removeDocuments(dbName, collectionName, queryDocument){
    let db=client.db(dbName);//access or create a new database
    let collection = db.collection(collectionName);// access or create a new collection
    let result = await collection.deleteMany(queryDocument);
    console.log("Documents removed", result);
}

async function updateDocuments(dbName, collectionName, queryDocument, updateDocument){
    let db=client.db(dbName);//access or create a new database
    let collection = db.collection(collectionName);// access or create a new collection
    let result = await collection.updateMany(queryDocument, {$set: updateDocument});
    console.log("Documents updated", result);
}



async function insertDocument(dbName, collectionName, document){
    let db=client.db(dbName);//access or create a new database
    let collection = db.collection(collectionName);// access or create a new collection
    let generatedDoc = await collection.insertOne(document);
    console.log("1 document inserted", generatedDoc);
}

async function insertDocuments(dbName, collectionName, documents){
    let db=client.db(dbName);//access or create a new database
    let collection = db.collection(collectionName);// access or create a new collection
    let generatedDocs = await collection.insertMany(documents);
    console.log("Documents inserted", generatedDocs);
}

async function main() { 
        await client.connect();
       // await listDatabases(client);
       let document = {codigo: "C004", nome: "Analista de Economia", conteudos: ["Economia", "Macroeconomia", "Microeconomia", "Finanças Públicas", "Econometria"]};
       //insertDocument("concurso", "cargos", document);
        const document1 = geraObjetoCandito("Maria", "Silva", "Feminino", new Date("1990-05-15"), [], {nome: "Analista de Economia", codigo: "C004"}, 8500);
        const document2 = geraObjetoCandito("João", "Santos", "Masculino", new Date("1985-10-20"), ["PCD"], {nome: "Analista de Economia", codigo: "C004"}, 9000);
        const document3 = geraObjetoCandito("Ana", "Costa", "Feminino", new Date("1992-03-10"), ["Cota racial"], {nome: "Analista de Economia", codigo: "C004"}, 8700);
        const document4 = geraObjetoCandito("Carlos", "Oliveira", "Masculino", new Date("1988-07-25"), [], {nome: "Analista de Economia", codigo: "C004"}, 8800);
        const document5 = geraObjetoCandito("Fernanda", "Lima", "Feminino", new Date("1991-12-05"), [], {nome: "Analista de Economia", codigo: "C004"}, 8600);
       //await insertDocuments("concurso", "inscritos", [ document1, document2, document3, document4, document5]);

       //removeDocuments("concurso", "cargos", {sobrenome: { $exists: true}});
       updateDocuments("concurso", "cargos", {}, {dataAtualizacao: new Date()});
}
/*
 async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    //.db(): Create a new Db instance sharing the current socket connections.
    //admin():Object to give access to administrtives commands on mongodb
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
*/
 main();
