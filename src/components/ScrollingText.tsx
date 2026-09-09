function ScrollingText() {
  const text = "TOO LOADED TO BE STRANDED • RAISING KINGDOM LEADERS • DIOCESAN YOUTH CHAPLANCY • "

  return (
    <div className="py-8 bg-black border-y border-yellow-600/10 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-6xl sm:text-8xl lg:text-9xl font-bold text-transparent mx-4" style={{
            WebkitTextStroke: '1px rgba(202, 168, 76, 0.3)',
            fontFamily: '"Playfair Display", serif',
          }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ScrollingText
