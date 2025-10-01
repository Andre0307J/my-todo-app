import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image
        src="/404.jpg"
        alt="404 Not Found Illustration"
        width={400}
        height={300}
        className="max-w-sm w-full"
      />
      <h1 className="text-4xl font-bold mt-8">Page Not Found</h1>
      <p className="text-muted-foreground mt-2 mb-6">Sorry, we couldn’t find the page you’re looking for.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}