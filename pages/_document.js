import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const isProduction = process.env.NODE_ENV === "production";
  return (
    <Html lang="en">
      <Head>
        {isProduction && (
          <>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566603516601048"
              crossorigin="anonymous"
            ></script>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-C7Z93C23QW"></script>
            <script>
              window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date()); gtag('config', 'G-C7Z93C23QW');
            </script>
          </>
        )}

        <link rel="icon" href="/favicon.svg" />
        <meta
          name="description"
          content="The Word. Use your word association skills to guess the hidden word with feedback on semantic similarity. Can you find the word at position 0?"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
