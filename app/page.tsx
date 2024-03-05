import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/auth';

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main>
     

    </main>

  )
}