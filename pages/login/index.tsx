'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`
      }
    })
    router.refresh()
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <label htmlFor="email">Email</label>
      <input
        name='email'
        onChange={e => setEmail(e.target.value)}
        value={email}
        className='border border-zinc-400 rounded-md p-2'
      />
      <label htmlFor="password">Senha</label>
      <input
        type='password'
        name='password'
        className='border border-zinc-400 rounded-md p-2'
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button className="py-2 px-4 bg-primary2 rounded-md my-1 text-white" onClick={handleSignUp}>Sign up</button>
      <button className="py-2 px-4 bg-primary2 rounded-md my-1 text-white" onClick={handleSignIn}>Sign in</button>
      <button className="py-2 px-4 bg-primary2 rounded-md my-1 text-white" onClick={handleSignOut}>Sign out</button>
    </div>
  )
}
