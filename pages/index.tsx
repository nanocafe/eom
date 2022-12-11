import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import api from 'services/api'

export default function Home() {

  const { data: guesses, isLoading } = useQuery(["guesses"], () => api.get("guesses"));

  return (
    <Layout>
      <main>
        <div className="info-section">
          <div>
            Current Nano Price: <span className="nano-price up" id="nano-price"></span>
          </div>
          <div className="countdown">
            Ending In:
            <div>
              <span className="time-ending" id="ending-days">XX</span>
              <div className="unity-time">Days</div>
            </div>
            -
            <div>
              <span className="time-ending" id="ending-hours">XX</span>
              <div className="unity-time">Hours</div>
            </div>
            :
            <div>
              <span className="time-ending" id="ending-minutes">XX</span>
              <div className="unity-time">Mins</div>
            </div>
            :
            <div>
              <span className="time-ending" id="ending-seconds">XX</span>
              <div className="unity-time">Secs</div>
            </div>
          </div>
        </div>

        <div className="prize-banner">
          <h5>Total Reward Available</h5>
          <h3>10 Nano</h3>
          <div className="laurel w-full flex justify-center">
            _________ <img src="/icons/laurel.png" width="60px" /> _________
          </div>
        </div>

        <div className='w-full'>
          <div className="table-header">

            <div className="header_wrap">
              <div className="num_rows">
                <select className="form-control px-4 py-1 rounded" name="state" id="maxRows">
                  <option value="15">15</option>
                  <option value="20">30</option>
                  <option value="50">60</option>
                  <option value="70">120</option>
                  <option value="5000">Show ALL Rows</option>
                </select>
              </div>

              <div className="table_search">
                <input type="text" id="search_input_all"
                  placeholder="Search.." className="form-control px-4 py-1 rounded" />
              </div>
            </div>

            <div className='pagination-container'>
              <nav>
                <ul className="pagination">
                </ul>
              </nav>
              <div className="rows_count">Showing 11 to 20 of 91 entries</div>
            </div>
          </div>

          <div className="overflow-hidden md:rounded-lg ">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-dim-gray border border-dim-gray">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-200 sm:pl-6">
                    Position
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-200 sm:pl-6">
                    Nickname
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-200">
                    Price Guess
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-transparent border-none">
                {guesses?.map((guess: any) => (
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
