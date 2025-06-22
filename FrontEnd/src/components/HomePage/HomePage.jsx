import React from 'react'
import Advertisement from './Advertisement'
import TopCategory from './TopCategory'
import BestSellingCourse from './BestSellingCourse'
import RecentlyAddedCourse from './RecentlyAddedCourse'
import TrustedCompanies from './TrustedCompanies'
import StartLearning from './StartLearning'
import {useSelector} from 'react-redux'

function HomePage() {
  const { token, currentUser } = useSelector((state) => state.auth);
  console.log(token);
  console.log(currentUser);
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