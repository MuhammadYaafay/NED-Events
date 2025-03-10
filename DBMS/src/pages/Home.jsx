import React from 'react'
import Login from './Login'
import Signup from './Signup'

export default function Home() {
  return (
    <div className='text-white'>
      Home
      <div className=' flex gap-5'>

      <a href="/login">Login</a>
      <a href="/signup">Signup</a>
      </div>
    </div>
  )
}
