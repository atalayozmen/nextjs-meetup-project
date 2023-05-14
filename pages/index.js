import React, { Fragment } from 'react';
import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>All Meetups</title>
        <meta
          name='description'
          content='All meetups are shown in this page'
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://atalayozmen21:BZW5ONRBLWuR00VK@clusteratalay.x0pldyc.mongodb.net/meetups?retryWrites=true&w=majority'
  ); //db name is defined in the url as "meetups"
  const db = client.db();

  const meetupsCollection = db.collection('meetups'); //collection name is "meetups", if it doesn't exist, it will be created

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
