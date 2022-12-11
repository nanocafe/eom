import Link from 'next/link'
import Button from './Button'

export default function Navbar() {
  return (
    <nav className="w-full flex flex-col items-center">

      <div className="w-full max-w-7xl flex justify-between items-center h-20 px-2 py-2 sm:py-0 sm:my-1">
        <div className="flex space-x-2 h-full">
          <img src="/icons/logo.png" className="logo-img h-full" />
          <div className='flex flex-col justify-center'>
            <div>
              <span className='text-base'>NANOCAFE</span>
            </div>
            <div className='flex space-x-2 justify-between text-3xl font-bold -mt-1 text-gold'>
              <span>E</span>
              <span>O</span>
              <span>M</span>
            </div>
          </div>
        </div>
        <div>
          <Link href="/enter">
            <a>
              <Button style={{
                width: '130px',
              }}>
                Enter Now
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className='w-full bg-alt-gray flex justify-center'>
        <div className="w-full max-w-7xl flex justify-between items-center px-2">
          <div id="info-section" className='w-full flex flex-wrap justify-between sm:items-center py-2 bg-alt-gray'>
            <div className='text-xs sm:text-sm flex flex-col sm:flex-row space-x-2 sm:items-center'>
              <div>Nano Price:</div>
              <div className="text-base font-bold text-green-400" id="nano-price">$0.74</div>
            </div>
            <div id="countdown" className='flex items-top space-x-1 sm:space-x-2 font-medium sm:font-semibold'>
              <span className='text-base'>Ending In:</span>
              <div className='flex space-x-1'>
                <div className='text-center'>
                  <span className="text-xl text-red-400" id="ending-days">XX</span>
                  <div className="text-xs">Days</div>
                </div>
                <span className='leading-7'>-</span>
                <div className='text-center'>
                  <span className="text-xl text-red-400" id="ending-hours">XX</span>
                  <div className="text-xs">Hours</div>
                </div>
                <span className='leading-7'>:</span>
                <div className='text-center'>
                  <span className="text-xl text-red-400" id="ending-minutes">XX</span>
                  <div className="text-xs">Mins</div>
                </div>
                <span className='leading-7'>:</span>
                <div className='text-center'>
                  <span className="text-xl text-red-400" id="ending-seconds">XX</span>
                  <div className="text-xs">Secs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  )
}