// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url) => {
			window.gtag('config', 'G-1S60TZQ5P3', {
				page_path: url,
			});
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<>
			<Head>
				{/* Google Analytics */}
				<script async src='https://www.googletagmanager.com/gtag/js?id=G-1S60TZQ5P3'></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1S60TZQ5P3');
            `,
					}}
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
