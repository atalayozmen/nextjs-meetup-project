import { MongoClient } from 'mongodb';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clusteratalay.x0pldyc.mongodb.net/meetups?retryWrites=true&w=majority`
    ); //db name is defined in the url as "meetups"
    const db = client.db();

    const meetupsCollection = db.collection('meetups'); //collection name is "meetups", if it doesn't exist, it will be created

    const result = await meetupsCollection.insertOne(data);

    client.close();
    res.status(201).json({ message: 'Meetup inserted!' });
  }
};

export default handler;
