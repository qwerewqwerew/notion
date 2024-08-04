// next.config.js
module.exports = {
	reactStrictMode: true, // 엄격 모드 활성화
	webpack: (config, { isServer }) => {
		// Webpack 설정 수정
		if (!isServer) {
			config.resolve.fallback = {
				fs: false, // 클라이언트 사이드에서 'fs' 모듈 사용 방지
			};
		}
		return config;
	},
};
