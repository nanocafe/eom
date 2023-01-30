import { HomeIcon } from '@heroicons/react/20/solid'
import Button from 'components/Button'
import Layout from 'components/Layout'
import Link from 'next/link'

export default function Transparency() {
  return (
    <Layout
      navbarOption={
        <Link href="/">
          <a>
            <Button
              style={{
                width: '100px',
              }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </a>
        </Link>
      }
    >
      <div></div>
    </Layout>
  )
}
