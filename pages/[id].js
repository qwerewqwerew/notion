// pages/[id].js

import React from 'react';
import { getPage, getBlocks } from '../lib/notion';
import BlockRenderer from '../components/BlockRenderer';
import Link from 'next/link';

const Page = ({ page, blocks }) => {
  return (
    <div>
      <Link href="/" legacyBehavior>
        <a>뒤로 가기</a>
      </Link>
      <h1>{page.properties.class.title[0].plain_text}</h1>
      <BlockRenderer blocks={blocks} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const pageId = params.id;
  const page = await getPage(pageId);
  const blocks = await getBlocks(pageId);

  return {
    props: {
      page,
      blocks,
    },
  };
}

export default Page;
