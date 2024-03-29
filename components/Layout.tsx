import Head from 'next/head'
import { ReactNode } from 'react';
import Navbar from './Navbar'

export interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  navbarOption?: ReactNode | string;
}

export default function Layout({ children, showNavbar = true, navbarOption }: LayoutProps) {
  return (
    <>
      <Head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EOM by NanoCafe</title>
      </Head>

      <main className='w-full flex flex-col items-center'>
        {
          showNavbar && (
            <Navbar option={navbarOption} />
          )
        }
        <div className='w-full max-w-7xl'>{children}</div>
      </main>
    </>
  )
}
