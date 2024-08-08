// pages/index.js

import React from 'react';
import Link from 'next/link';
import { getDatabase } from '../lib/notion';

export async function getStaticProps() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const database = await getDatabase(databaseId);
  return {
    props: {
      database,
    },
    revalidate: 10,
  };
}

const IndexPage = ({ database }) => {
  return (
    <div>
      <h1>데이터베이스 목록</h1>
      <ul>
        {database.map((item) => (
          <li key={item.id}>
            <Link href={`/${item.id}`}>
              {item.properties.class.title[0].plain_text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
