import { useQuery } from '@tanstack/react-query';
import { DEFAULT_CLOSE_DAY } from 'core/constants';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import API from 'services/api';
import Button from './Button'
import CountdownViewer from './CountdownViewer';

const CLOSE_DAY = Number(process.env.NEXT_PUBLIC_CLOSE_DAY || DEFAULT_CLOSE_DAY);

export interface NavbarOption {
  name: string;
  href: string;
}

export interface NavbarProps {
  option?: NavbarOption;
}

export default function Navbar({ option }: NavbarProps) {

  const deadline = new Date(new Date().setUTCDate(CLOSE_DAY)).setUTCHours(23, 59, 59, 999);

  const { data: price, error: priceError, isLoading } = useQuery(['price'], () => API.get('/price'));

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
          {
            option ? (
              <Link href={option.href}>
                <a>
                  <Button style={{
                    width: '130px',
                  }}>
                    {option.name}
                  </Button>
                </a>
              </Link>
            ) : (
              <div />
            )
          }
        </div>
      </div>

      <div className='w-full bg-alt-gray flex justify-center'>
        <div className="w-full max-w-7xl flex justify-between items-center px-2">
          <div id="info-section" className='w-full flex flex-wrap justify-between sm:items-center py-2 bg-alt-gray'>
            {
              (isLoading || priceError) ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-pulse' />
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-pulse' />
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-pulse' />
                </div>
              ) : (
                <div className='text-xs sm:text-sm flex flex-col sm:flex-row space-x-2 sm:items-center'>
                  <div>Nano Price:</div>
                  <div className="text-base font-bold text-green-400" id="nano-price">${price?.price.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]}</div>
                </div>
              )
            }
          </div>
          <CountdownViewer date={deadline} />
        </div>
      </div>

    </nav >
  )
}