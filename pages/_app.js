import { useEffect } from 'react';
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 가져오기
import '../styles/global.scss'; // 커스텀 SCSS 파일 가져오기
function MyApp({ Component, pageProps }) {
	useEffect(() => {
		// GA 초기화
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-1S60TZQ5P3');
		import('bootstrap/dist/js/bootstrap.bundle.min.js');
	}, []);

	return (
		<>
			<Script strategy='afterInteractive' src='https://www.googletagmanager.com/gtag/js?id=G-1S60TZQ5P3' />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
