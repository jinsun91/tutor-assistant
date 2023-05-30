import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Tutor Assistant',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <header className="main-header">
            <div className="header-info">
              <Link href="/"><h1 className="main-logo">Tutor Assistant</h1></Link>
              <nav>
                <Link href="/lessons" className="nav-item">Lessons</Link>
                <Link href="/finances" className="nav-item">Finances</Link>
                <Link href="/students" className="nav-item">Students</Link>
              </nav>
            </div>
          </header>
          <main>
            {children}
          </main>
      </body>
    </html>
  )
}
