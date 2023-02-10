import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
} from '@heroicons/react/20/solid'
import { GuessComplete } from 'types/guess'
import { classNames } from 'utils'

interface LeaderBoardProps {
  total: number
  guesses: GuessComplete[]
  isLoading: boolean
  limit: number
  currentPage: number
  onLimitChange: (limit: number) => void
  onPageChange: (page: number) => void
  winner?: number
}

export default function LeaderBoard({
  total,
  guesses,
  isLoading,
  limit,
  currentPage,
  onLimitChange,
  onPageChange,
  winner,
}: LeaderBoardProps) {
  const showingFrom = (currentPage - 1) * limit + 1
  const showingTo = (currentPage - 1) * limit + total

  return (
    <div className="w-full">
      <div id="table-header" className="w-full">
        <div id="header_wrap" className="w-full flex justify-between">
          <div id="num_rows">
            <select
              className="w-32 text-sm sm:text-base px-4 py-2 rounded bg-alt-gray border border-dim-gray focus:outline-none"
              name="state"
              id="maxRows"
              onChange={(e) => {
                onLimitChange(parseInt(e.target.value))
                onPageChange(1)
              }}
            >
              <option value={10}>10</option>
              <option value={20} disabled={total <= 10}>
                20
              </option>
              <option value={50} disabled={total < 20}>
                50
              </option>
              <option value={100} disabled={total < 50}>
                100
              </option>
              <option value={total}>Show ALL</option>
            </select>
          </div>

          <div id="table_search">
            <input
              type="text"
              id="input_search"
              placeholder="Search.."
              className="text-sm sm:text-base px-4 py-2 rounded bg-alt-gray w-40 sm:w-64 border border-dim-gray focus:outline-none"
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
                  Name
                </th>
                <th
                  scope="col"
                  className="flex-1 flex items-center justify-center py-3.5 px-2 sm:px-4 pr-3 text-sm font-semibold text-gray-200"
                >
                  $ Price Guessed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dim-gray bg-transparent border-none">
              {guesses.map((guess: any) => (
                <tr
                  key={guess.id}
                  className={classNames(
                    'flex justify-between w-full divide-x',
                    guess.id === winner
                      ? 'bg-gold/10 divide-gold/40 border border-gold/40 text-gray-200'
                      : 'bg-alt-gray divide-dim-gray text-gray-200',
                  )}
                  // style={{ 'textShadow': guess.id === winner ? 'rgb(226, 183, 49) 0px 0px 5px' : undefined }}
                >
                  <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium sm:pl-6 flex-1">
                    <span className="flex items-center justify-center">
                      {guess.id === winner && (
                        <TrophyIcon className="w-5 h-5 text-gold mr-2" />
                      )}
                      {guess.position}⁰
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium sm:pl-6 flex-1">
                    {guess.nickname}
                  </td>
                  <td className="whitespace-nowrap py-4 px-4 pr-3 text-center text-sm font-medium sm:pl-6 flex-1">
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
          <div className="flex flex-1 flex-wrap items-center justify-center sm:justify-between">
            <div className='hidden sm:block'>
              <p
                className="text-sm px-2"
                style={{
                  color: '#bbb',
                }}
              >
                Showing <span className="font-medium">{showingFrom}</span> to{' '}
                <span className="font-medium">{showingTo}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  className="relative inline-flex items-center rounded-l-md border border-dim-gray bg-alt-gray px-2 py-2 text-sm font-medium text-gray-200 hover:bg-gold/80 hover:border-gold focus:z-20"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {Array.from({
                  length: Math.ceil((total || 10) / limit),
                }).map((_, index) => (
                  <button
                    className={classNames(
                      'relative inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gold/10 focus:z-20',
                      currentPage === index + 1
                        ? 'z-10 text-gold border border-gold/80 bg-gold/10'
                        : 'border border-dim-gray bg-alt-gray text-gray-200',
                    )}
                    onClick={() => onPageChange(index + 1)}
                    disabled={currentPage === index + 1}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="relative inline-flex items-center rounded-r-md border border-dim-gray bg-alt-gray px-2 py-2 text-sm font-medium text-gray-200 hover:bg-gold/80 hover:border-gold focus:z-20"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil((total || 10) / limit)}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
