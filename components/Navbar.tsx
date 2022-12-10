import Link from 'next/link'

export default function Navbar() {
  return (

    <nav className="w-full h-20 p-2 flex justify-center border-b border-alt-gray">
      <div className="w-full max-w-7xl flex justify-between items-center h-full">
        <div className="flex space-x-2 h-full">
          <img src="/icons/logo.png" className="logo-img h-full" />
          <div className='flex flex-col justify-center'>
            <div>
              <span className='text-xs'>NANOCAFE</span>
            </div>
            <div className='flex space-x-2 text-xl font-bold -mt-1'>
              <span>E</span>
              <span>O</span>
              <span>M</span>
            </div>
          </div>
        </div>
        <div>
          <Link href="/enter">
            <button className="enter-competition bg-gold text-sm x-4 py-1 rounded-sm w-36 leading-4">
              Enter October Competition
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}