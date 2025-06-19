'use client';

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { session, status, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isClient && status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router, isClient])

  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Chargement...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenue, {session?.user?.name || 'Utilisateur'} !</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email : {session?.user?.email}</p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 