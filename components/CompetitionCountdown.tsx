import Countdown from 'react-countdown'

interface CountdownRenderProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

function CountdownRender({
  days,
  hours,
  minutes,
  seconds,
}: Omit<CountdownRenderProps, 'completed'>) {
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex space-x-1">
      <div className="text-center">
        <span className="text-xl text-red-400" id="ending-days">
          {pad(days)}
        </span>
        <div className="text-xs">Days</div>
      </div>
      <span className="leading-7">-</span>
      <div className="text-center">
        <span className="text-xl text-red-400" id="ending-hours">
          {pad(hours)}
        </span>
        <div className="text-xs">Hours</div>
      </div>
      <span className="leading-7">:</span>
      <div className="text-center">
        <span className="text-xl text-red-400" id="ending-minutes">
          {pad(minutes)}
        </span>
        <div className="text-xs">Mins</div>
      </div>
      <span className="leading-7">:</span>
      <div className="text-center">
        <span className="text-xl text-red-400" id="ending-seconds">
          {pad(seconds)}
        </span>
        <div className="text-xs">Secs</div>
      </div>
    </div>
  )
}

function OpeningCountdown({
  days,
  hours,
  minutes,
  seconds,
}: CountdownRenderProps) {
  return (
    <div
      id="countdown"
      className="flex items-top space-x-1 sm:space-x-2 font-medium sm:font-semibold"
    >
      <span className="text-base">Opens In:</span>
      <CountdownRender
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    </div>
  )
}

function ClosingCountdown({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: CountdownRenderProps) {
  if (completed) {
    return (
      <div className="flex items-center text-red-400 font-bold text-lg">
        Closed
      </div>
    )
  } else {
    return (
      <div
        id="countdown"
        className="flex items-top space-x-1 sm:space-x-2 font-medium sm:font-semibold"
      >
        <span className="text-base">Locked In:</span>
        <CountdownRender
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      </div>
    )
  }
}

interface CompetitionCountdown {
  opening: number
  deadline: number
}

export default function CompetitionCountdown({
  opening,
  deadline,
}: CompetitionCountdown) {
  const started = Date.now() >= opening
  return (
    <Countdown
      date={started ? deadline : opening}
      renderer={started ? ClosingCountdown : OpeningCountdown}
    />
  )
}
