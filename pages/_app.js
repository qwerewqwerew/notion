import { useEffect } from 'react';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		// GA 초기화
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-1S60TZQ5P3');
	}, []);

	return (
		<>
			<Script strategy='afterInteractive' src='https://www.googletagmanager.com/gtag/js?id=G-1S60TZQ5P3' />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
