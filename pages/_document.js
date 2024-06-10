import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics } from "@next/third-parties/google";

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
            <GoogleAnalytics gaId="G-C7Z93C23QW" />
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
