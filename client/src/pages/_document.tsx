import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script type="text/javascript" src="./splitsdk/splitsdk.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{ __html: `
            document.addEventListener('DOMContentLoaded', function () {
              var split = new Split.sdk.constructor();
              split.init("2475f6952ed7901cbc9b3333ac9cd46b");
            });
          `}} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
