import { useQuery } from '@tanstack/react-query'
import LeaderBoard from 'components/Leaderboard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from 'services/api'

const DEFAULT_PAGINATION_LIMIT = 10

export default function SnapshotsPage() {
  const { query, isReady } = useRouter()

  const year = Number(query.year)
  const month = Number(query.month)

  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: snapshot, isError, error, isLoading, refetch } = useQuery(
    ['guesses', year, month],
    () =>
      api.get(`snapshots/${year}/${month}?page=${currentPage}&limit=${limit}`),
    {
      enabled: !isNaN(year) && !isNaN(month),
      retry: false
    },
  )

  useEffect(() => {
    if (snapshot) {
      refetch()
    }
  }, [currentPage, limit])

  if (isReady && (isNaN(year) || isNaN(month))) {
    return <div>Invalid year or month</div>
  }

  if (isError) {
    return <div>{error}</div>
  }

  const winner = snapshot?.winner

  const monthName = new Date(year, month - 1, 1).toLocaleString('default', {
    month: 'long',
  })

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl p-2">
        <div>
          <Link href="/">
            <a className="text-gray-300 hover:text-gray-100">Back to Home</a>
          </Link>
        </div>
        <h1 className="text-xl py-4 border-b mb-4 border-dim-gray">
          Snapshot for{' '}
          <span className="text-gold">
            {monthName} {year}
          </span>{' '}
          competition
        </h1>
        <LeaderBoard
          guesses={snapshot?.values || []}
          total={snapshot?.total}
          isLoading={isLoading || !isReady}
          limit={limit}
          currentPage={currentPage}
          onLimitChange={setLimit}
          onPageChange={setCurrentPage}
          winner={winner}
        />
      </div>
    </div>
  )
}
