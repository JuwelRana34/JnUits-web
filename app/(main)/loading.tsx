export default function Loading() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');

        @keyframes bar-grow {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes progress-fill {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 58%; }
          75%  { width: 76%; }
          90%  { width: 89%; }
          100% { width: 96%; }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(28px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.15); opacity: 0.15; }
          100% { transform: scale(0.85); opacity: 0.6; }
        }

        .bar { animation: bar-grow 1.1s ease-in-out infinite; }
        .bar:nth-child(1) { animation-delay: 0s; }
        .bar:nth-child(2) { animation-delay: 0.13s; }
        .bar:nth-child(3) { animation-delay: 0.26s; }
        .bar:nth-child(4) { animation-delay: 0.39s; }
        .bar:nth-child(5) { animation-delay: 0.52s; }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #94a3b8 0%,
            #f8fafc 40%,
            #94a3b8 60%,
            #64748b 100%
          );
          background-size: 600px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.4s linear infinite;
        }

        .fade-up { animation: fade-up 0.6s ease forwards; }
        .fade-up-delay { animation: fade-up 0.6s ease 0.2s forwards; opacity: 0; }

        .progress-bar { animation: progress-fill 3.5s cubic-bezier(0.4,0,0.2,1) forwards; }

        .orbit-dot { animation: orbit 1.8s linear infinite; }
        .pulse-ring { animation: pulse-ring 1.8s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070910',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '480px',
            height: '480px',
            background:
              'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Center piece */}
        <div
          className="fade-up"
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            marginBottom: 40,
          }}
        >
          {/* Pulse ring */}
          <div
            className="pulse-ring"
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              border: '1px solid rgba(56,189,248,0.35)',
            }}
          />

          {/* Static outer ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />

          {/* Orbiting dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -3,
              marginLeft: -3,
            }}
          >
            <div
              className="orbit-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 8px 2px rgba(56,189,248,0.8)',
              }}
            />
          </div>

          {/* Center logo mark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand text */}
        <div
          className="fade-up"
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <p
            className="shimmer-text"
            style={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Initializing
          </p>
          <p
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.15)',
              letterSpacing: '0.12em',
            }}
          >
            Please wait a moment
          </p>
        </div>

        {/* Audio-bar visualizer */}
        <div
          className="fade-up-delay"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 32,
            height: 28,
          }}
        >
          {[16, 22, 28, 22, 16].map((h, i) => (
            <div
              key={i}
              className="bar"
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: 'linear-gradient(to top, #38bdf8, #818cf8)',
                transformOrigin: 'bottom',
                boxShadow: '0 0 6px rgba(56,189,248,0.4)',
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="fade-up-delay" style={{ width: 200, marginBottom: 14 }}>
          <div
            style={{
              width: '100%',
              height: 2,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              className="progress-bar"
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                borderRadius: 999,
                boxShadow: '0 0 10px rgba(56,189,248,0.6)',
                width: 0,
              }}
            />
          </div>
        </div>

        {/* Status label */}
        <div
          className="fade-up-delay"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 6px #38bdf8',
              animation: 'pulse-ring 1.4s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            System Loading
          </span>
        </div>
      </div>
    </>
  )
}
