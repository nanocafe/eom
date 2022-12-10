import { XCircleIcon } from '@heroicons/react/20/solid'

interface ErrorAlertProps {
    title: string;
    messages?: string[];
}

export default function ErrorAlert({ title, messages }: ErrorAlertProps) {
    return (
        <div className="rounded-md bg-rose-500 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-gray-50" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-white">{title}</h3>
                    <div className="mt-2 text-sm text-gray-50">
                        {
                            messages?.length && (
                                <ul role="list" className="list-disc space-y-1 pl-5">
                                    {
                                        messages.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}