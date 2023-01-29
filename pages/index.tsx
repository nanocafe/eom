import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import api from 'services/api'
import { useEffect, useState } from 'react'
import LeaderBoard from 'components/Leaderboard'

const DEFAULT_PAGINATION_LIMIT = 10

export default function Home() {
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: guesses, isLoading, refetch } = useQuery(['guesses'], () =>
    api.get(`/guesses?page=${currentPage}&limit=${limit}`),
  )

  useEffect(() => {
    refetch()
  }, [currentPage, limit])

  return (
    <Layout
      navbarOption={{
        name: 'Enter Now',
        href: '/enter',
      }}
    >
      <main className="p-2">
        <div
          id="prize-banner"
          className="w-full flex justify-center pb-2 sm:pt-2"
        >
          <div className="flex flex-col items-center">
            <h5 className="text-sm sm:text-lg">Total Reward Available</h5>
            <h3
              className="text-2xl sm:text-3xl font-bold"
              style={{
                textShadow: '0 0 5px #e2b731',
              }}
            >
              100 NANO
            </h3>
            <div className="text-gray-300 mt-1 flex space-x-4">
              <span>________</span>{' '}
              <img src="/icons/laurel.png" className="-mt-2 w-12 sm:w-16" />{' '}
              <span>________</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <LeaderBoard
            total={guesses?.total || 0}
            guesses={guesses?.values || []}
            isLoading={isLoading}
            limit={limit}
            currentPage={currentPage}
            onLimitChange={setLimit}
            onPageChange={setCurrentPage}
          />

          <div className="w-full flex justify-center py-4 mt-8">
            <Link href="/transparency">
              <a className="px-2 py-1 text-gold/80 hover:text-gold border border-gold/70 hover:border-gold hover:shadow rounded">
                TRANSPARENCY
              </a>
            </Link>
          </div>
        </div>
      </main>

      <script src="/head.js" />
    </Layout>
  )
}
