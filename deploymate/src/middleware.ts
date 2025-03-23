import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './app/lib/auth/auth'

// List of paths that require authentication
const protectedPaths = ['/dashboard', '/api/tasks']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login page if no token is present
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Verify token
    const payload = await decrypt(token)
    if (!payload) {
      // Redirect to login page if token is invalid
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(url)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/tasks/:path*',
    '/api/notifications/:path*',
  ],
} 