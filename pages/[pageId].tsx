import { NotionPage } from '../components/NotionPage';
import { domain, isDev } from '@/lib/config';
import { getSiteMap } from '@/lib/get-site-map';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { PageProps, Params } from '@/lib/types';
import { GetStaticProps, GetStaticPaths } from 'next';
import * as React from 'react';

export const getStaticProps: GetStaticProps<PageProps, Params> = async (context) => {
	const rawPageId = context.params?.pageId as string;

	try {
		// 페이지 데이터를 가져오는 비동기 작업
		const props = await resolveNotionPage(domain, rawPageId);

		return {
			props,
			revalidate: 10, // 10초마다 이 페이지를 새로 빌드하도록 설정
		};
	} catch (err) {
		console.error('Error resolving Notion page', {
			domain,
			rawPageId,
			error: err,
		});

		// 에러 발생 시 404 페이지를 반환하여 사용자 경험을 개선
		return {
			notFound: true,
			revalidate: 10, // 재시도 가능성을 위해 revalidate를 설정
		};
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	if (isDev) {
		return {
			paths: [], // 개발 환경에서는 경로를 빈 배열로 설정
			fallback: true, // 동적 경로를 허용
		};
	}

	try {
		const siteMap = await getSiteMap();

		const paths = Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
			params: { pageId },
		}));

		return {
			paths,
			fallback: 'blocking', // 페이지 로드 시 대기 화면 제공
		};
	} catch (err) {
		console.error('Error generating static paths', err);
		return {
			paths: [], // 오류 발생 시 경로를 빈 배열로 설정
			fallback: 'blocking', // 페이지 로드 시 대기 화면 제공
		};
	}
};

const NotionDomainDynamicPage: React.FC<PageProps> = (props) => {
	return <NotionPage {...props} />;
};

export default NotionDomainDynamicPage;
