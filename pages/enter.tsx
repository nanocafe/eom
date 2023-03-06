import Layout from 'components/Layout'
import Link from 'next/link'
import Counter from 'components/Counter'
import api from 'services/api'
import React, { useState } from 'react'
import { button as checkout } from '@nanobyte-crypto/checkout'
import { useMutation, useQuery } from '@tanstack/react-query'
import ErrorAlert from 'components/Alert'
import { Controller, useForm } from 'react-hook-form'
import Input from 'components/Input'
import Button from 'components/Button'
import {
  ArrowLeftCircleIcon,
  CheckCircleIcon,
  HomeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import {
  MAX_GUESS_PRICE,
  MAX_NICKNAME_LENGTH,
  MIN_GUESS_PRICE,
  MIN_NICKNAME_LENGTH,
  STEP_GUESS_PRICE,
} from 'core/constants'
import { checkAddress } from 'nanocurrency'
import { ENTRY_FEE, ENTRY_FEE_RAWS, isLocked } from 'config/config'


interface IFormData {
  nickname: string
  address: string
  price: number
}

export default function Enter() {
  const [paymentId, setPaymentId] = useState<string>('')
  const [paymentPending, setPaymentPending] = useState<boolean>(false)

  const paymentButtonRef = React.useRef<HTMLButtonElement>(null)

  const { data: guesses, isLoading: isGuessesLoading } = useQuery(
    ['guesses'],
    () => api.get('guesses'),
    {
      refetchInterval: 5000,
    },
  )
  const { data: price, isLoading: isPriceLoading } = useQuery(['price'], () =>
    api.get('/price'),
  )

  const {
    mutate: postGuess,
    error,
    isLoading: isPosting,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (paymentId: string) =>
      api.post('/guesses', {
        paymentId,
      }),
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<IFormData>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      address: '',
      price: 0,
    },
  })

  const {
    isInitialLoading: preCheckoutInitialLoading,
    isRefetching: preCheckoutRefetching,
    error: preCheckoutError,
    refetch: makePreCheckout,
  } = useQuery(['pre-checkout'], () => api.post('/pre-checkout'), {
    cacheTime: 0,
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: () => {
      if (paymentButtonRef.current) {
        setPaymentPending(true)
        paymentButtonRef.current.click()
      } else {
        alert('Something went wrong, please try again later.')
      }
    },
  })

  // Hack isLoading for react-query v4 with "enabled: false"
  // Read more: https://github.com/TanStack/query/issues/3584#issuecomment-1369491188
  const isPreCheckoutLoading =
    preCheckoutRefetching || preCheckoutInitialLoading

  const onSubmit = async (data: IFormData) => {
    await makePreCheckout()

    checkout.init(
      process.env.NEXT_PUBLIC_CHECKOUT_API_KEY || '',
      async ({ paymentStatus, paymentId }) => {
        // this callback will be called when a payment has been completed
        if (paymentStatus === 'confirmed') {
          setPaymentId(paymentId)
          postGuess(paymentId)
        } else if (paymentStatus === 'cancelled') {
          console.warn('Payment cancelled')
        } else {
          alert('Something went wrong, please try again later.')
        }
        setPaymentPending(false)
      },
    )

    checkout.setRequiredFields(
      ['userNickname', 'userNanoAddress', 'userGuessPrice'],
      (data) => {
        // This callback will be called if the user clicks trys to make a payment without the required fields
        alert(data)
      },
    )

    await checkout.setInterceptClick(async () => {
      return {
        amount: ENTRY_FEE_RAWS,
        label: 'End Of Month Guess',
        message: 'Thank you!',
        userNickname: data.nickname,
        userNanoAddress: data.address,
        userGuessPrice: data.price,
      }
    })
  }

  if (isGuessesLoading || isPriceLoading) {
    return <Skeleton />
  }

  return (
    <Layout
      navbarOption={
        <Link href="/">
          <a>
            <Button
              style={{
                width: '100px',
              }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </a>
        </Link>
      }
    >
      <main className="w-full mt-2 px-2">
        <div className="pb-4">
          <Link href="/">
            <a className="text-base py-1 rounded-sm text-gold flex items-center space-x-1">
              <ArrowLeftCircleIcon className="h-5 w-5" />
              <span>Back</span>
            </a>
          </Link>
        </div>

        {isLocked() ? (
          <ErrorAlert title="EOM is currently closed for entry!" messages={["This month's contest is locked.", "It ends on the last day of the month and it re-opens within the first few days of the next month."]} />
        ) : (
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-2xl shadow overflow-hidden rounded-md p-4"
              style={{
                backgroundColor: '#3e3e3e',
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 gap-3 py-2 mb-4">
                  <div className="col-span-3 sm:col-span-1">
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        required: 'A Price Guess is required!',
                        min: {
                          value: MIN_GUESS_PRICE,
                          message: `Price Guess must be at least ${MIN_GUESS_PRICE}`,
                        },
                        max: {
                          value: MAX_GUESS_PRICE,
                          message: `Price Guess must be at most ${MAX_GUESS_PRICE}`,
                        },
                        validate: {
                          isNumber: (value) => {
                            if (isNaN(value)) {
                              return 'Price Guess must be a number!'
                            }
                            return true
                          },
                          isUnique: (value) => {
                            if (
                              guesses?.values?.find(
                                (guess: any) => guess.price === value,
                              )
                            ) {
                              return 'Someone already guessed this Price Guess!'
                            }
                            return true
                          },
                        },
                      }}
                      render={({ field }) => (
                        <Counter
                          label="Price Guess (USD)"
                          min={MIN_GUESS_PRICE}
                          max={MAX_GUESS_PRICE}
                          step={STEP_GUESS_PRICE}
                          defaultValue={price.usd}
                          disabled={isSuccess || isError || isPosting}
                          {...field}
                          errorMessage={errors.price?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <Controller
                      name="nickname"
                      control={control}
                      rules={{
                        required: 'A Name is required',
                        minLength: {
                          value: MIN_NICKNAME_LENGTH,
                          message: `Name must be at least ${MIN_NICKNAME_LENGTH} characters`,
                        },
                        maxLength: {
                          value: MAX_NICKNAME_LENGTH,
                          message: `Name must be at most ${MAX_NICKNAME_LENGTH} characters`,
                        },
                        pattern: {
                          value: /^[a-z0-9_]*$/,
                          message:
                            'Name must be alphanumeric (a-z, 0-9) and lowercase',
                        },
                        validate: {
                          isUnique: (value) => {
                            if (!value) {
                              return true
                            }
                            if (
                              guesses?.values?.find(
                                (guess: any) => guess.nickname === value,
                              )
                            ) {
                              return 'This Name is already taken!'
                            }
                            return true
                          },
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          label="Name"
                          id="nickname"
                          className="w-full"
                          disabled={isSuccess || isError || isPosting}
                          {...field}
                          errorMessage={errors.nickname?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-3 mt-4">
                    <Controller
                      name="address"
                      control={control}
                      rules={{
                        required: 'An XNO address is required!',
                        validate: {
                          isNanoAddress: (value) => {
                            if (checkAddress(value)) {
                              return true
                            }
                            return 'Invalid XNO address'
                          },
                          isUnique: (value) => {
                            if (!value) {
                              return true
                            }
                            if (
                              guesses?.values?.find(
                                (guess: any) => guess.address === value,
                              )
                            ) {
                              return 'Address already exists in this round!'
                            }
                            return true
                          },
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          label="XNO Reward Deposit Address"
                          id="nano-address"
                          autoComplete="off"
                          placeholder="nano_3tseom3..."
                          className="w-full"
                          disabled={isSuccess || isError || isPosting}
                          {...field}
                          errorMessage={errors.address?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <button
                  id="nanobytepay"
                  ref={paymentButtonRef}
                  className="sr-only"
                />

                <div className="w-full flex flex-col justify-center pb-2 space-y-4">
                  {isSuccess ? (
                    <div className="flex flex-col items-center space-y-2">
                      <CheckCircleIcon className="h-10 w-10 text-green-500" />
                      <h2 className="text-lg text-center">
                        Thank you for your guess!
                      </h2>
                      <p className="text-center text-sm">
                        Your PaymentId: {paymentId}
                      </p>
                    </div>
                  ) : error ? (
                    <>
                      <ErrorAlert
                        title={`Payment Error: ${error}`}
                        messages={[
                          'Save your payment id and contact support if you think this is a mistake',
                        ]}
                      />
                      {paymentId && (
                        <Button
                          type="button"
                          onClick={() => postGuess(paymentId)}
                        >
                          Try Again
                        </Button>
                      )}
                    </>
                  ) : preCheckoutError ? (
                    <ErrorAlert title={`Checkout Error: ${preCheckoutError}`} />
                  ) : (
                    <Button
                      type="submit"
                      loading={
                        isSubmitting ||
                        isPosting ||
                        isPreCheckoutLoading ||
                        paymentPending
                      }
                      disabled={
                        !isValid ||
                        isSubmitting ||
                        isSuccess ||
                        isError ||
                        isPreCheckoutLoading ||
                        isPosting ||
                        paymentPending
                      }
                    >
                      {paymentPending
                        ? 'Waiting for payment...'
                        : isPosting
                        ? 'Submiting...'
                        : isPreCheckoutLoading
                        ? 'Processing...'
                        : 'Submit'}
                    </Button>
                  )}
                </div>
              </form>
              <div style={{textAlign:'center'}}>
                <ExclamationCircleIcon className="h-6 w-6"></ExclamationCircleIcon>
                <p>Entry Fee: {ENTRY_FEE} XNO | Currently only supports submissions through <a href="https://chrome.google.com/webstore/detail/nanobyte/ndkdijcnlhjhmakblkhmpjocfjjifhbo" className="text-gold hover:underline"> Nanobyte</a>.
                </p>
              </div>
            </div>
          </div>
          
        )}
      </main>
    </Layout>
  )
}

const Skeleton = () => {
  return (
    <Layout
      navbarOption={
        <Link href="/">
          <a>
            <Button
              style={{
                width: '100px',
              }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </a>
        </Link>
      }
    >
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
          <div
            className="w-full max-w-2xl flex flex-col space-y-6 shadow rounded-md p-4"
            style={{
              backgroundColor: '#3e3e3e',
            }}
          >
            <div className="w-full h-16 bg-dim-gray rounded loading" />
            <div className="w-full h-16 bg-dim-gray rounded loading" />
            <div className="w-full h-16 bg-dim-gray rounded loading" />
          </div>
        </div>
      </main>
    </Layout>
  )
}
