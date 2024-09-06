import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import * as Fathom from 'fathom-client'
import 'katex/dist/katex.min.css'
import posthog from 'posthog-js'
import 'prismjs/themes/prism-coy.css'
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
import 'styles/media.css'
// import 'prismjs/themes/prism-okaidia.css';
import 'styles/notion.css'
import 'styles/prism-theme.css'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function updateNestedClasses() {
      const bodyClass = document.body.className
      const nestedElements = document.querySelectorAll(
        '.dark-mode, .light-mode'
      )

      nestedElements.forEach((element) => {
        if (bodyClass.includes('dark-mode')) {
          element.classList.add('dark-mode')
          element.classList.remove('light-mode')
        } else {
          element.classList.add('light-mode')
          element.classList.remove('dark-mode')
        }
      })
    }

    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }

      // Update nested classes on route change
      updateNestedClasses()
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Initial update
    updateNestedClasses()

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
