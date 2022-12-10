import Layout from 'components/Layout'
import Navbar from 'components/Navbar'

export default function Home() {
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

        <div id="table">
          <div className="container table-container">

            <div className="header_wrap">
              <div className="num_rows">

                <div className="form-group ">

                  <select className="form-control px-4 py-1" name="state" id="maxRows">

                    <option value="15">15</option>
                    <option value="20">30</option>
                    <option value="50">60</option>
                    <option value="70">120</option>
                    <option value="5000">Show ALL Rows</option>
                  </select>

                </div>
              </div>
              <div className="tb_search">
                <input type="text" id="search_input_all"
                  placeholder="Search.." className="form-control px-4 py-1" />
              </div>
            </div>
            <div className="table-container">
              <div className="overflow-table">
                <table className="table table-striped table-class table-bordered" id="guessesTable">
                  <thead>
                    <tr>
                      <th>N⁰</th>
                      <th>Nickname</th>
                      <th>Price</th>
                    </tr>
                    <tr>
                      <th>N⁰</th>
                      <th>Nickname</th>
                      <th>Price</th>
                    </tr>
                    <tr>
                      <th>N⁰</th>
                      <th>Nickname</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody></tbody>

                </table>
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


          <div className="w-full flex justify-center">
            <button className="btn btn-transparency">Transparency</button>
          </div>

        </div>



      </main>

      <script src="/utils.js" />
      <script src="/main.js" />
      <script src="/head.js" />

    </Layout>

  )
}
