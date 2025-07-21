import Image from 'next/image'

const CsDashboard = () => {
  return (
    <div className="flex 1 w-full h-screen justify-center items-center gap-4">
      <header className="absolute top-0 left-0 right-0 flex">
        <div className="bg-red-500 flex-1/12 flex pl-2">
          <Image
            src='/DashboardLogo.png'
            width={53}
            height={53}
            alt='American Bubble Boy Logo'
            className='w-10 h-10'
          />
        </div>
        <div className="bg-blue-500 flex-1/2 flex items-center justify-center font-semibold text-2xl">Good Morning #name#</div>
        <div className="bg-green-500 flex-1/12 flex items-center justify-center">right</div>
      </header>
    </div>
  )
}

export default CsDashboard;