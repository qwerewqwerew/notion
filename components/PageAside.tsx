import { PageActions } from './PageActions';
import { PageSocial } from './PageSocial';
import { getPageTweet } from '@/lib/get-page-tweet';
import { Block, ExtendedRecordMap } from 'notion-types';
import * as React from 'react';

export const PageAside: React.FC<{
	block: Block;
	recordMap: ExtendedRecordMap;
	isBlogPost: boolean;
}> = ({ block, recordMap, isBlogPost }) => {
	if (!block) {
		return null;
	}

	// only display comments and page actions on blog post pages
	if (isBlogPost) {
		const tweet = getPageTweet(block, recordMap);
		if (!tweet) {
			return null;
		}

		return <PageActions tweet={tweet} />;
	}

	return <PageSocial />;
};
