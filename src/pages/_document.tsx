import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-3940256099942544"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4521347864074429"
          crossOrigin="anonymous"></script> */}
        {/* <script
          data-ad-client="ca-pub-4521347864074429"
          data-adbreak-test="on"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4521347864074429"
        ></script> */}
        <meta name="description" content="Pomodoro is a customizable pomodoro timer that works on desktop & mobile browser" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="android-chrome-512x512" sizes="512x512" href="/images/android-chrome-512x512.png" />
        <link rel="android-chrome-192x192" sizes="192x192" href="/images/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <meta property="og:url" content="https://pomodoro.atseeds.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="An online Pomodoro Timer to boost your productivity" />
        <meta property="og:description" content="A simple Pomodoro Timer app that works on a desktop & mobile browser. Pomodoro will help you manage your time and let you focus on any tasks such as study, writing, or coding." />
        <meta property="og:image" content="https://asset.atseeds.com/assets/image1.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
