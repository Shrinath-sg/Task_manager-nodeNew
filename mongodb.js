
const {MongoClient} = require("mongodb")
async function main(){
  const uri = "mongodb+srv://shrinath:Shruta1998@cluster0.bcfzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try{
    await client.connect();
  //   await createNew(client,{
  //     name: "shrinath",
  //     discription: "Modern home with infinite views from the infinity pool",
  //     age: 24,
  //     country: "India"
  // },)
    // await createCollection(client);
    // await updateMultiple(client,"shrinath","need to work on new project");
    await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client,{minimumNumberOfBathrooms : 4,minimumNumberOfBedrooms : 3,maximumNumberOfResults : 4})
    // await findOneListingByName(client, "shrinath");
  //   await createMultipleListings(client, [
  //     {
  //       name: "John Mic",
  //       discription: "Modern home with infinite views from the infinity pool",
  //       age: 27,
  //       country: "USA"
  //     },
  //     {
  //       name: "Jimmy Anderson",
  //       discription: "Modern home with infinite views from the infinity pool",
  //       age: 24,
  //       country: "India"
  //     },
  //     {
  //       name: "Jairaj",
  //       discription: "Modern home with infinite views from the infinity pool",
  //       age: 27,
  //       country: "India"
  //     },
  // ]);
    // await createNew(client,{name:"Ribeira Charming Duplex",
    //   summary
    //   :
    //   "Fantastic duplex apartment with three bedrooms, located in the histori...",
    //   space
    //   :
    //   "Privileged views of the Douro River and Ribeira square, our apartment ..."
    //   });
    // await listDatabases(client);
  }catch(e){
    console.error(e)
  }finally{
    client.close();
  }
}
main().catch(console.error);

async function createCollection(client){
  const res = await client.db('sample_airbnb').createCollection("my_collection");
  console.log(res);
}
async function listDatabases(client){
  const databaseList = await client.db().admin().listDatabases();
  console.log('Databses:');
  databaseList.databases.forEach(db => {
    console.log("-" + db.name);
  });
}
async function createNew(client, newObject){
  const result = await client.db('sample_airbnb').collection('my_collection').insertOne(newObject);
  console.log("new data : " + result.insertedId);
}
async function createMultipleListings(client, newListings){
  const result = await client.db("sample_airbnb").collection("my_collection").insertMany(newListings);

  console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
  console.log(result.insertedIds);      
  const data = `aksjasklaksslaskaas`;
}

async function findOneListingByName(client, nameOfListing) {
  const result = await client.db("sample_airbnb").collection("my_collection").findOne({ name: nameOfListing });

  if (result) {
      console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);
  } else {
      console.log(`No listings found with the name '${nameOfListing}'`);
  }
}
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
  minimumNumberOfBedrooms = 0,
  minimumNumberOfBathrooms = 0,
  maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
  // const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find(
  //                         {
  //                             bedrooms: { $gte: minimumNumberOfBedrooms },
  //                             bathrooms: { $gte: minimumNumberOfBathrooms }
  //                         }
  //                         ).sort({ last_review: -1 })
  //                         .limit(maximumNumberOfResults);
  const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find(
    {
      maximum_nights: {$not:{$gte:20} }
        // bathrooms: { $gte: minimumNumberOfBathrooms }
    }
    );
  const results = await cursor.toArray();
  console.log(results);

  // if (results.length > 0) {
  //     console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
  //     results.forEach((result, i) => {
  //         date = new Date(result.last_review).toDateString();

  //         console.log();
  //         console.log(`${i + 1}. name: ${result.name}`);
  //         console.log(`   _id: ${result._id}`);
  //         console.log(`   bedrooms: ${result.bedrooms}`);
  //         console.log(`   bathrooms: ${result.bathrooms}`);
  //         console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
  //     });
  // } else {
  //     console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
  // }
}

async function updateMultiple(client,myName,myDescription){
  const result = await client.db('sample_airbnb').collection('my_collection').remove({task_status: false});
  // const result = await client.db('sample_airbnb').collection('my_collection').updateMany({$and:[{task_status: false},{age:27}]},{$set: {task_status: true}});
  // {property_type: {$exists:false}}
  // {$set: {property_type: "UNKNOWN"}}
  console.log(result)
  console.log(`${result.matchedCount} documents(s) are matched the query criteria.`);
  console.log(`${result.modifiedCount} documents(s) are updated`);
}


// const {MongoClient} = require('mongodb');
// const mongoClient = mongodb.mongoClient
// const connectionUrl = 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// const url = "mongodb://127.0.0.1:27017/";
// const client = new MongoClient(url, { useUnifiedTopology: true }); // useUnifiedTopology removes a warning

// // Connect
// client
//   .connect()
//   .then(client =>
//     client
//       .db()
//       .admin()
//       .listDatabases() // Returns a promise that will resolve to the list of databases
//   )
//   .then(dbs => {
//     const db = client.db(databaseName)
//     db.collection('users').insertOne({name:'jack',age:27})
//     console.log("Mongo databases", dbs);
//   });