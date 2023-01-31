import Countdown from 'react-countdown';

export interface CountdownViewerProps {
    date: number;
    renderer?: (props: CountdownRenderProps) => React.ReactNode;
}

interface CountdownRenderProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}

function CountdownRender({ days, hours, minutes, seconds, completed }: CountdownRenderProps) {

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (completed) {
        return <div className='flex items-center text-red-400 font-bold text-lg'>Currently Locked!</div>
    } else {
        return (
            <div id="countdown" className='flex items-top space-x-1 sm:space-x-2 font-medium sm:font-semibold'>
                <span className='text-base'>Ending In:</span>
                <div className='flex space-x-1'>
                    <div className='text-center'>
                        <span className="text-xl text-red-400" id="ending-days">{pad(days)}</span>
                        <div className="text-xs">Days</div>
                    </div>
                    <span className='leading-7'>-</span>
                    <div className='text-center'>
                        <span className="text-xl text-red-400" id="ending-hours">{pad(hours)}</span>
                        <div className="text-xs">Hours</div>
                    </div>
                    <span className='leading-7'>:</span>
                    <div className='text-center'>
                        <span className="text-xl text-red-400" id="ending-minutes">{pad(minutes)}</span>
                        <div className="text-xs">Mins</div>
                    </div>
                    <span className='leading-7'>:</span>
                    <div className='text-center'>
                        <span className="text-xl text-red-400" id="ending-seconds">{pad(seconds)}</span>
                        <div className="text-xs">Secs</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default function CountdownViewer({ date, renderer }: CountdownViewerProps) {
    return <Countdown date={date} renderer={renderer || CountdownRender} />
}