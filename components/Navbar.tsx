import Link from 'next/link'

export default function Navbar () {
    return (

        <nav className="nav">
        <div className="content">
          <div className="logo-field">
            <img src="/icons/logo.png" className="logo-img h-full" />
            <div className="logo-text">
              <span style={{ fontSize: 12 }}>NANOCAFE</span>
              <span>E</span>
              <span>O</span>
              <span>M</span>
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