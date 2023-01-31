import { useQuery } from '@tanstack/react-query'
import LeaderBoard from 'components/Leaderboard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from 'services/api'
import Button from 'components/Button'
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid'
import {
  DocumentMagnifyingGlassIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
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
      retry: false,
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
    return <div>{error as any}</div>
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
        <section className="w-full py-4 my-4 border-t border-dim-gray">
          <h2 className="text-xl mb-2">Export Snapshot</h2>
          <div className="flex flex-wrap justify-between">
            <div className="max-w-full break-all mt-2 text-sm text-white">
              <p>
                <span className="text-gold">MD5:</span> {snapshot?.checksum.csv.md5}
              </p>
              <p className="mt-1">
                <span className="text-gold">SHA-256:</span>{' '}
                {snapshot?.checksum.csv.sha256}
              </p>
            </div>
            <div className="flex pt-4 items-end justify-center md:justify-end flex-1">
              <Link href={snapshot?.download?.csv || ''}>
                <Button
                  startIcon={
                    <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                  }
                >
                  Download CSV
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-300 p-2 bg-dim-gray/80 rounded">
            <InformationCircleIcon className="w-10 h-10" />
            <div>
              <p className="flex items-start ">
                <span>
                  By downloading the snapshot and saving the hash for later
                  comparison you have <b>the proof</b> that no data has changed.
                </span>
              </p>
              <p className="flex items-start mt-1">
                <span>
                  You can open the CSV file in any spreadsheet software, like
                  Microsoft Excel, LibreOffice Calc or{' '}
                  <a
                    href="https://csv-viewer-online.github.io/"
                    target="_blank"
                    className="text-gold hover:underline"
                  >
                    Online Tools
                  </a>
                  .
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
