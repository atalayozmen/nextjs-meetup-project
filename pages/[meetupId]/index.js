import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

const MeetUpDetails = (props) => {
  const router = useRouter();
  console.log('props ' + JSON.stringify(props));

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description}></meta>
      </Head>
      <section style={{ textAlign: 'center' }}>
        <img
          style={{ width: '100%' }}
          src={props.meetupData.image}
          alt='image'
        />
        <h1>{props.meetupData.title}</h1>
        <p>{props.meetupData.description}</p>
      </section>
    </Fragment>
  );
};

export async function getStaticPaths() {
  //this function tells nextjs which dynamic pages should be pre-generated
  //we can return an array of objects with params, which will be the dynamic part of the url
  //we can also return fallback: false, which means that if the page is not pre-generated, it will return 404
  //we can also return fallback: true, which means that if the page is not pre-generated, it will try to generate it on the fly
  //we can also return fallback: 'blocking', which means that if the page is not pre-generated, it will try to generate it on the fly, but it will wait for the page to be generated before it returns it

  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clusteratalay.x0pldyc.mongodb.net/meetups?retryWrites=true&w=majority`
  ); //db name is defined in the url as "meetups"
  const db = client.db();

  const meetupsCollection = db.collection('meetups'); //collection name is "meetups", if it doesn't exist, it will be created

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  const paths = meetups.map((meetup) => ({
    params: { meetupId: meetup._id.toString() },
  }));

  console.log('paths: ' + JSON.stringify(paths));
  client.close();

  return {
    fallback: blocking,
    paths: paths,
  };
}

export async function getStaticProps(context) {
  //fetch data
  const meetupId = context.params.meetupId; //this way we got the dynamic part of the url
  //we could get this with useRouter() hook in the component function, but here we cannot use hooks, thus we use context.params

  console.log('meetupId: ', meetupId);

  // fetch data from an API
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clusteratalay.x0pldyc.mongodb.net/meetups?retryWrites=true&w=majority`
  ); //db name is defined in the url as "meetups"
  const db = client.db();

  const meetupsCollection = db.collection('meetups'); //collection name is "meetups", if it doesn't exist, it will be created

  const selectedMeetUp = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();

  return {
    props: {
      meetupData: {
        title: selectedMeetUp.title,
        address: selectedMeetUp.address,
        image: selectedMeetUp.image,
        description: selectedMeetUp.description,
        id: selectedMeetUp._id.toString(),
      },
    },
  };
}

export default MeetUpDetails;
