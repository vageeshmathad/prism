export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large ambient blobs */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #B6F36B 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #9B8CFF 0%, transparent 70%)', animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'radial-gradient(circle, #53D9E8 0%, transparent 70%)' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(182,243,107,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(182,243,107,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Geometric shapes */}
        <svg
          className="absolute top-16 right-24 opacity-10 animate-spin-slow"
          width="120" height="120" viewBox="0 0 120 120"
        >
          <polygon
            points="60,10 110,95 10,95"
            fill="none"
            stroke="#B6F36B"
            strokeWidth="1.5"
          />
        </svg>
        <svg
          className="absolute bottom-20 left-20 opacity-10 animate-float"
          width="80" height="80" viewBox="0 0 80 80"
          style={{ animationDelay: '2s' }}
        >
          <rect
            x="10" y="10" width="60" height="60"
            fill="none"
            stroke="#9B8CFF"
            strokeWidth="1.5"
            transform="rotate(45 40 40)"
          />
        </svg>
        <svg
          className="absolute top-1/3 left-10 opacity-10 animate-float"
          width="60" height="60" viewBox="0 0 60 60"
          style={{ animationDelay: '1s' }}
        >
          <circle cx="30" cy="30" r="25" fill="none" stroke="#53D9E8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {children}
      </div>
    </div>
  )
}
