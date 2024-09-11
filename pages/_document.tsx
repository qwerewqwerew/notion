import * as React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import { IconContext } from '@react-icons/all-files'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default class MyDocument extends Document {
  render() {
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang='ko'>
          <Head>
            <link rel='shortcut icon' href='/favicon.ico' />
            <link
              rel='icon'
              type='image/png'
              sizes='32x32'
              href='favicon.png'
            />

            <link rel='manifest' href='/manifest.json' />
          </Head>

          <body>
            <Main />

            <NextScript />
            <SpeedInsights />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}
