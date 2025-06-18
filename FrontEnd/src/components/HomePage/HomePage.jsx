import React from 'react'
import Advertisement from './Advertisement'
import TopCategory from './TopCategory'
import BestSellingCourse from './BestSellingCourse'
import RecentlyAddedCourse from './RecentlyAddedCourse'
import TrustedCompanies from './TrustedCompanies'
import StartLearning from './StartLearning'

function HomePage() {
  return (
    <>
        <Advertisement/>
        <TopCategory/>
        <BestSellingCourse/>
        <RecentlyAddedCourse/>
        <TrustedCompanies/>
        <StartLearning/>
    </>
  )
}

export default HomePage