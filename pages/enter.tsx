import Layout from 'components/Layout';
import Link from 'next/link';
import Counter from 'components/Counter';
import api from 'services/api';
import React, { useEffect, useState } from 'react';
import { button } from "@nanobyte-crypto/checkout";
import { useMutation } from '@tanstack/react-query';
import ErrorAlert from 'components/Alert';
import { Controller, useForm } from 'react-hook-form';
import Input from 'components/Input';
import Button from 'components/Button';
import { ArrowLeftCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { DEFAULT_PRICE_GUESS_NANO, MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from 'core/constants';
import { convert, Unit, checkAddress } from 'nanocurrency';

interface IFormData {
    nickname: string;
    address: string;
    price: number;
}

const PRICE_GUESS_NANO = convert(process.env.NEXT_PUBLIC_PRICE_GUESS_NANO || DEFAULT_PRICE_GUESS_NANO, { from: Unit.NANO, to: Unit.raw });

export default function Home() {

    const [paymentId, setPaymentId] = useState<string>('');

    const paymentButtonRef = React.useRef<HTMLButtonElement>(null);

    const { mutate: postGuess, error, isLoading: isPosting, isSuccess, isError } = useMutation({
        mutationFn: (paymentId: string) => api.post('/guesses', {
            paymentId
        })
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IFormData>({
        mode: 'onChange',
        defaultValues: {
            nickname: '',
            address: '',
            price: 1.01,
        }
    });

    const onSubmit = async (data: IFormData) => {

        button.setInterceptClick(
            async () => {
                return {
                    amount: PRICE_GUESS_NANO,
                    label: "End Of Month Guess",
                    message: "Thank you!",
                    orderNumber: "order#1234",
                    userNickname: data.nickname,
                    userNanoAddress: data.address,
                    userGuessPrice: data.price
                };
            },
        );

        paymentButtonRef.current?.click();

    }

    useEffect(() => {

        // call this once, when the page has loaded:
        button.init(
            process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '',
            async ({ paymentStatus, paymentId }) => {
                // this callback will be called when a payment has been completed
                if (paymentStatus === 'confirmed') {
                    setPaymentId(paymentId);
                    postGuess(paymentId);
                }
            }
        );

        button.setRequiredFields(
            // You can set any required fields for a payment as an array of strings
            ['userNickname', 'userNanoAddress', 'userGuessPrice'],
            (data) => {
                // This callback will be called if the user clicks trys to make a payment without the required fields
                alert(data)
            }
        );
    }, [])

    console.log('errors', errors)

    return (
        <Layout navbarOption={{
            name: 'Home',
            href: '/'
        }}>
            <main className="w-full mt-2 px-2">
                <div className="pb-4">
                    <Link href="/">
                        <a className="text-base py-1 rounded-sm text-gold flex items-center space-x-1">
                            <ArrowLeftCircleIcon className="h-5 w-5" />
                            <span>Back</span>
                        </a>
                    </Link>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-2xl shadow overflow-hidden rounded-md p-4" style={{
                        backgroundColor: "#3e3e3e"
                    }}>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="grid grid-cols-3 gap-3 py-2 mb-4">

                                <div className="col-span-3 sm:col-span-1">
                                    <Controller
                                        name='price'
                                        control={control}
                                        render={({ field }) => (
                                            <Counter
                                                label="Price Guess (USDT)"
                                                min={0.01}
                                                max={9.99}
                                                step={0.01}
                                                defaultValue={1.01}
                                                disabled={isSuccess || isError || isPosting}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="col-span-3 sm:col-span-2">
                                    <Controller
                                        name='nickname'
                                        control={control}
                                        rules={{
                                            required: 'Nickname is required',
                                            minLength: {
                                                value: MIN_NICKNAME_LENGTH,
                                                message: `Nickname must be at least ${MIN_NICKNAME_LENGTH} characters`
                                            },
                                            maxLength: {
                                                value: MAX_NICKNAME_LENGTH,
                                                message: `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`
                                            },
                                            pattern: {
                                                value: /^[a-z0-9_]*$/,
                                                message: 'Nickname must be alphanumeric (a-z, 0-9) and lowercase'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Nickname"
                                                id="nickname"
                                                className='w-full'
                                                errorMessage={errors.nickname?.message}
                                                disabled={isSuccess || isError || isPosting}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="col-span-3 mt-4">
                                    <Controller
                                        name='address'
                                        control={control}
                                        rules={{
                                            required: 'Nano address is required',
                                            validate: {
                                                isNanoAddress: (value) => {
                                                    if (checkAddress(value)) {
                                                        return true;
                                                    }
                                                    return 'Invalid Nano address';
                                                }
                                            }
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                label="Nano address"
                                                id="nano-address"
                                                autoComplete="off"
                                                placeholder="nano_3tsd..."
                                                className='w-full'
                                                disabled={isSuccess || isError || isPosting}
                                                {...field}
                                                errorMessage={errors.address?.message}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <button id="nanobytepay" ref={paymentButtonRef} className="sr-only" />

                            <div className="w-full flex flex-col justify-center pb-2 space-y-4">

                                {
                                    isSuccess
                                        ? (
                                            <div className="flex flex-col items-center space-y-2">
                                                <CheckCircleIcon className="h-10 w-10 text-green-500" />
                                                <h2 className="text-lg text-center">Thank you for your guess!</h2>
                                                <p className="text-center text-sm">Your PaymentId: {paymentId}</p>
                                            </div>
                                        ) : error
                                            ? (
                                                <>
                                                    <ErrorAlert title={`Payment Error: ${error}`} messages={[
                                                        'Save your payment id and contact support if you think this is a mistake'
                                                    ]} />
                                                    {
                                                        paymentId && (
                                                            <Button
                                                                type='button'
                                                                onClick={() => postGuess(paymentId)}
                                                            >
                                                                Try Again
                                                            </Button>
                                                        )
                                                    }
                                                </>
                                            ) : (

                                                <Button
                                                    type='submit'
                                                    loading={isSubmitting || isPosting}
                                                    disabled={!isValid || isSubmitting || isSuccess || isError || isPosting}
                                                >
                                                    {
                                                        isPosting ? 'Submiting...' : 'Submit'
                                                    }
                                                </Button>
                                            )
                                }
                            </div>

                        </form>

                    </div>
                </div>
            </main>
        </Layout >
    )

}