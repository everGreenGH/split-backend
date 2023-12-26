// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

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
          <script dangerouslySetInnerHTML={{
            __html: `
          (async function () {
            document.addEventListener('DOMContentLoaded', async function () {
              try {
                var split = new Split.sdk.constructor();
                await split.init("c92f5b322d6d76d4981df4ce164e2151");
                var res = await split.referral("c92f5b322d6d76d4981df4ce164e2151",'0x13B4805f15468387012AA7de2BB25D2690A81300', '0x7476494aaD80a504173364E8ED0BC1C65Bd8660B' );
                console.log(res);
              } catch (error) {
                console.error('Error:', error);
              }
            });
          })();
        `}} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;