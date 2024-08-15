import * as config from '../lib/config';
import { useDarkMode } from '../lib/use-dark-mode';
import styles from './styles.module.css';
import * as React from 'react';

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
	const [hasMounted, setHasMounted] = React.useState(false);
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const currentYear = new Date().getFullYear();

	const onToggleDarkMode = React.useCallback(
		(e) => {
			e.preventDefault();
			toggleDarkMode();
		},
		[toggleDarkMode]
	);

	React.useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<footer className={styles.footer}>
			<div className={styles.copyright}>
				Copyright {currentYear} {config.author}
			</div>

			<div className={styles.settings}>
				{hasMounted && (
					<a className={styles.toggleDarkMode} href='#' role='button' onClick={onToggleDarkMode} title='Toggle dark mode'>
						{isDarkMode ? '🌜' : '🌞'}
					</a>
				)}
			</div>
		</footer>
	);
};

export const Footer = React.memo(FooterImpl);
