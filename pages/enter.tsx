import Layout from 'components/Layout'
import Navbar from 'components/Navbar'
import Link from 'next/link'
import Counter from 'components/Counter'
import api from 'services/api'

export default function Home() {

    const postGuess = () => {
        api.post('saveGuess', {
            data: 1
        })
        .then(alert)
        .catch(alert)
    }


    return (
        <Layout>

            <script src="/js/dist/html5-qrcode.min.js"></script>

            <Navbar />

            <main className="my-8">

                <div className="py-6">
                    <Link href="/">
                        <a>
                            <button
                                className="text-base bg-gold px-8 py-1 rounded-sm"
                            >Back</button>
                        </a>
                    </Link>
                </div>

                <div className="grid justify-center">

                    <div className="mt-5 md:mt-0">

                        <form action="#" method="POST">

                            <div className="shadow overflow-hidden sm:rounded-md">
                                <div className="px-4 py-5 sm:p-6" style={{
                                    backgroundColor: "#3e3e3e"
                                }}>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-1">
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-100">
                                                Price Guess (USDT)
                                            </label>

                                            <Counter />

                                        </div>

                                        <div className="col-span-2">
                                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-100">
                                                Nickname
                                            </label>
                                            <input
                                                type="text"
                                                name="last-name"
                                                id="last-name"
                                                autoComplete="family-name"
                                                placeholder='Your nickname'
                                                className="h-8 mt-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-dim-gray"
                                            />
                                        </div>

                                        <div className="col-span-3 mt-4">
                                            <label htmlFor="nano-address" className="block text-sm font-medium text-gray-100">
                                                Nano address
                                            </label>
                                            <input
                                                type="text"
                                                name="nano-address"
                                                id="nano-address"
                                                autoComplete="off"
                                                placeholder="Your nano address nano_3tsd..."
                                                className="h-8 mt-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-dim-gray"
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="w-full flex justify-end align-center px-4 py-3 bg-gray-50 text-right sm:px-6" style={{
                                    backgroundColor: "#3e3e3e"
                                }}>

                                    <div className="py-6">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-1 px-8 border border-transparent shadow-sm text-base font-medium rounded-sm text-white bg-emerald-500 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={postGuess}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <div className="qr-modal">
                <div className="qr-content">
                    <div id="qr-reader" style={{ width: 500, maxWidth: "100%" }}></div>
                    <div className="close">X</div>
                </div>
            </div>

            <script src="http://localhost:3000/api.js"></script>
            <script src="/js/scanner.js"></script>
            <script type="text/javascript" src="/js/dist/bignumber.min.js"></script>
            <script src="/utils.js"></script>
            <script src="/main.js"></script>
            <script src="/enter.js"></script>


        </Layout >

    )

}