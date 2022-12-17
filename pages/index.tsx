import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import api from 'services/api'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { classNames } from 'utils'

export default function Home() {

  const [currentPage, setCurrentPage] = useState(1);

  const { data: guesses, isLoading } = useQuery(['guesses'], () =>
    api.get('guesses'),
  )

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
              10 NANO
            </h3>
            <div className="text-gray-300 mt-1 flex space-x-4">
              <span>________</span>{' '}
              <img src="/icons/laurel.png" className="-mt-2 w-12 sm:w-16" />{' '}
              <span>________</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div id="table-header" className="w-full">
            <div id="header_wrap" className="w-full flex justify-between">
              <div id="num_rows">
                <select
                  className="text-sm sm:text-base px-4 py-2 rounded bg-alt-gray w-40 border border-dim-gray"
                  name="state"
                  id="maxRows"
                >
                  <option value="15">15</option>
                  <option value="20">30</option>
                  <option value="50">60</option>
                  <option value="70">120</option>
                  <option value="5000">Show ALL Rows</option>
                </select>
              </div>

              <div id="table_search">
                <input
                  type="text"
                  id="input_search"
                  placeholder="Search.."
                  className="text-sm sm:text-base px-4 py-2 rounded bg-alt-gray w-40 sm:w-64 border border-dim-gray"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden md:rounded-lg my-2">
              <table className="min-w-full border border-dim-gray">
                <thead className="bg-dim-gray2 border-b border-dim-gray">
                  <tr className="w-full flex justify-between">
                    <th
                      scope="col"
                      className="flex-1 flex items-center justify-center py-3.5 px-2 sm:px-4 pr-3 text-sm font-semibold text-gray-200"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="flex-1 flex items-center justify-center py-3.5 px-2 sm:px-4 pr-3 text-sm font-semibold text-gray-200"
                    >
                      Nickname
                    </th>
                    <th
                      scope="col"
                      className="flex-1 flex items-center justify-center py-3.5 px-2 sm:px-4 pr-3 text-sm font-semibold text-gray-200"
                    >
                      $ Price Guess
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dim-gray bg-transparent border-none">
                  {guesses?.slice(0, 8).map((guess: any) => (
                    <tr
                      key={guess.id}
                      className="bg-alt-gray flex justify-between w-full divide-x divide-dim-gray"
                    >
                      <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium text-gray-200 sm:pl-6 flex-1">
                        {guess.id}⁰
                      </td>
                      <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium text-gray-200 sm:pl-6 flex-1">
                        {guess.nickname}
                      </td>
                      <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium text-gray-200 sm:pl-6 flex-1">
                        {guess.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {
                /* Loading Skeleton */
                isLoading && <div className="w-full h-20 bg-alt-gray loading" />
              }
            </div>

            <div className="flex items-center justify-betweenpx-4 py-2">
              <div className="flex flex-1 justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p
                    className="text-sm px-2"
                    style={{
                      color: '#bbb',
                    }}
                  >
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">{guesses?.length}</span> of{' '}
                    <span className="font-medium">{guesses?.length}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center rounded-l-md border border-dim-gray bg-alt-gray px-2 py-2 text-sm font-medium text-gray-200 hover:bg-gold/80 hover:border-gold focus:z-20"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

                    {[1, 2, 3, 4, 5, 6].map((page) => (
                      <button
                        className={classNames(
                          'relative inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gold/10 focus:z-20',
                          currentPage === page ? "z-10 text-gold border border-gold/80 bg-gold/10" : "border border-dim-gray bg-alt-gray text-gray-200"
                        )}
                        onClick={() => setCurrentPage(page)}
                        disabled={currentPage === page}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="relative inline-flex items-center rounded-r-md border border-dim-gray bg-alt-gray px-2 py-2 text-sm font-medium text-gray-200 hover:bg-gold/80 hover:border-gold focus:z-20"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === 6}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

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
