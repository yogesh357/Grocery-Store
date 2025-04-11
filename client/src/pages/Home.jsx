import React from 'react'
import MainBanner from '../components/MainBanner'
import Category from '../components/Category'
import BestSeller from '../components/BestSeller'
import SecondBanner from '../components/SecondBanner'
import NewsLetter from '../components/NewsLetter'

function Home() {
  return (
    <div className='mt-10'>
      <MainBanner />
      <Category />
      <BestSeller />
      <SecondBanner />
      <NewsLetter />
    </div>
  )
}

export default Home
