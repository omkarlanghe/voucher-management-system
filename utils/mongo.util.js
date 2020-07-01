const MongoClient = require('mongodb').MongoClient;
const { database } = require('../configurations/config');
const mongo_url = database.url;
const database_name = database.name;

let mongo_client;

function getMongoClient(p_database) {
    if (!mongo_client) {
        return (new Promise((resolve, reject) => {
            MongoClient.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 200 }, async (err, client) => {
                if (err) {
                    return reject(err);
                }
                mongo_client = client.db(p_database);
                resolve(mongo_client);
            });
        }));
    } else {
        return (mongo_client);
    }
};

module.exports.dbClient = async () => {
    let database = await getMongoClient(database_name);
    return (database);
};
