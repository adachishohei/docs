import crypto from 'crypto';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const cspHashOf = (text) => {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return `'sha256-${hash.digest('base64')}'`;
};

const getCspContent = (context) => {
  const cspInlineScriptHash = cspHashOf(
    NextScript.getInlineScriptSource(context)
  );

  // Dev environment
  if (process.env.NODE_ENV !== 'production') {
    return `default-src 'self';
      style-src 'self' 'unsafe-inline';
      font-src 'self' data:;
      frame-src 'self';
      img-src 'self' data: cm.everesttech.net amazonwebservices.d2.sc.omtrdc.net dpm.demdex.net;
      connect-src 'self' *.shortbread.aws.dev amazonwebservices.d2.sc.omtrdc.net dpm.demdex.net https://*.algolia.net https://*.algolianet.com https://ym8kdcu1hl.execute-api.us-west-2.amazonaws.com/feedback/submissions;
      script-src 'unsafe-eval' 'self' ${cspInlineScriptHash} a0.awsstatic.com;
    `;
  }

  // Prod environment
  return `default-src 'self';
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    frame-src 'self';
    connect-src 'self' *.shortbread.aws.dev amazonwebservices.d2.sc.omtrdc.net dpm.demdex.net;
    img-src 'self' cm.everesttech.net amazonwebservices.d2.sc.omtrdc.net dpm.demdex.net https://*.algolia.net https://*.algolianet.com https://ym8kdcu1hl.execute-api.us-west-2.amazonaws.com/feedback/submissions;
    script-src 'unsafe-eval' 'self' ${cspInlineScriptHash} a0.awsstatic.com;
  `;
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content={getCspContent(this.props)}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
