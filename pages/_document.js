import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const isProduction = process.env.NODE_ENV === "production";
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
        {isProduction && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566603516601048"
            crossorigin="anonymous"
          ></script>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
