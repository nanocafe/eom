import Head from 'next/head'
import Header from 'components/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NanoCafe EOM</title>

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />

          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" />

          <link href='https://use.fontawesome.com/releases/v5.8.1/css/all.css' rel='stylesheet' />

        </Head>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }

        .container {
          max-width: 65rem;
          margin: 1.5rem auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
      `}</style>

      <main>
        <div className="container">{children}</div>
      </main>
    </>
  )
}
