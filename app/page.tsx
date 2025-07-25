'use client'

import Image from 'next/image'
import Form from 'next/form'

export default function LoginPage() {
  const now = new Date();

  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const getTimeZone = () => {
    const date = new Date()
    const timeZoneString = date.toLocaleString('en-US', {
      timeZoneName: 'short'
    })
    console.log(timeZoneString)
    return timeZoneString.split(' ').pop()
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="px-10 py-5 rounded-3xl bg-container flex flex-col items-center justify-center">
        <Image
          src='/abbLogo.png'
          width={256}
          height={256}
          alt='American Bubble Boy Logo'
          className='mb-8 w-64 h-64'
        />

        <div className='flex flex-col gap-2 mb-6 w-full'>
          <div>
            <p className='text-lg mb-1'>EMAIL</p>
            <input className='bg-white rounded-sm h-7 text-black text-sm pl-2 w-full mb-2' />
          </div>

          <div>
            <p className='text-lg mb-1'>PASSWORD</p>
            <input className='bg-white rounded-sm h-7 text-black text-sm p-2 w-full mb-2' type='password'/>
          </div>
        </div>

        <button className='bg-[#73B3F2] px-4 py-2 min-w-25 rounded-sm cursor-pointer'>
          <h1 className='font-semibold text-black text-lg'>LOGIN</h1>
        </button>

        <p className='text-sm mt-5'>{dayOfWeek}, {month} {day} {year}</p>
        <p className='text-sm'>
          {time} {getTimeZone()}
        </p>

      </div>
    </div>
  )
}