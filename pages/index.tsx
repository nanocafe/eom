import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import api from 'services/api'

export default function Home() {

  const { data: guesses, isLoading } = useQuery(["guesses"], () => api.get("guesses"));

  return (
    <Layout navbarOption={{
      name: 'Enter Now',
      href: '/enter'
    }}>
      <main className='p-2'>
        <div id="prize-banner" className="w-full flex justify-center pb-2 sm:pt-2">
          <div className='flex flex-col items-center'>
            <h5 className='text-sm sm:text-lg'>Total Reward Available</h5>
            <h3 className='text-2xl sm:text-3xl font-bold' style={{
              textShadow: '0 0 5px #e2b731'
            }}>10 NANO</h3>
            <div className="text-gray-300 mt-1 flex space-x-4">
              <span>________</span> <img src="/icons/laurel.png" className='-mt-2 w-12 sm:w-16' /> <span>________</span>
            </div>
          </div>
        </div>

        <div className='w-full'>

          <div id="table-header" className='w-full'>
            <div id="header_wrap" className='w-full flex justify-between'>
              <div id="num_rows">
                <select className="text-sm sm:text-base px-4 py-2 rounded bg-alt-gray w-40 border border-dim-gray" name="state" id="maxRows">
                  <option value="15">15</option>
                  <option value="20">30</option>
                  <option value="50">60</option>
                  <option value="70">120</option>
                  <option value="5000">Show ALL Rows</option>
                </select>
              </div>

              <div id="table_search">
                <input type="text" id="input_search"
                  placeholder="Search.." className="text-sm sm:text-base px-4 py-2 rounded bg-alt-gray w-40 sm:w-64 border border-dim-gray" />
              </div>
            </div>

            <div id='pagination-container' className='py-1'>
              <nav>
                <ul id="pagination">
                </ul>
              </nav>
              <div id="rows-count" className='text-xs sm:text-sm' style={{
                color: '#bbb'
              }}>Showing 11 to 20 of 91 entries</div>
            </div>
          </div>

          <div className="overflow-hidden md:rounded-lg my-2">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-dim-gray2 border border-dim-gray">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-200 sm:pl-6">
                    Position
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-200 sm:pl-6">
                    Nickname
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-200">
                    $ Price Guess
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-transparent border-none">
                {guesses?.slice(0, 8).map((guess: any) => (
                  <tr key={guess.id} className="bg-alt-gray">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-200 sm:pl-6 border border-dim-gray">
                      {guess.id}⁰
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-200 sm:pl-6 border border-dim-gray">
                      {guess.nickname}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-200 border border-dim-gray">{guess.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-center py-4">
            <button className="btn btn-transparency">Transparency</button>
          </div>

        </div>



      </main>

      <script src="/head.js" />

    </Layout>

  )
}
