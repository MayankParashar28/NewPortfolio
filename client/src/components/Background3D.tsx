export default function Background3D() {
  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateZ(0) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateZ(100px) rotateX(5deg) rotateY(5deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateZ(0) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateZ(-80px) rotateX(-5deg) rotateY(-5deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translateZ(0) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateZ(60px) rotateX(3deg) rotateY(-3deg); }
        }

        @keyframes tilt {
          0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
          25% { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg); }
          50% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
          75% { transform: perspective(1000px) rotateX(-2deg) rotateY(2deg); }
        }

        .background-3d-container {
          position: fixed;
          inset: 0;
          perspective: 1200px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .background-3d-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.02) 100%);
          pointer-events: none;
        }

        .cube-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .cube-bg.cube-1 {
          top: -150px;
          left: 10%;
          animation: float1 8s ease-in-out infinite;
        }

        .cube-bg.cube-2 {
          bottom: -100px;
          right: 15%;
          animation: float2 10s ease-in-out infinite;
        }

        .cube-bg.cube-3 {
          top: 50%;
          left: 50%;
          animation: float3 12s ease-in-out infinite;
        }

        .cube-face {
          position: absolute;
          width: 300px;
          height: 300px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          backface-visibility: hidden;
        }

        .cube-face.front {
          transform: translateZ(150px);
          background: linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 100%);
        }

        .cube-face.back {
          transform: rotateY(180deg) translateZ(150px);
          background: linear-gradient(-135deg, rgba(0,0,0,0.02) 0%, transparent 100%);
        }

        .cube-face.right {
          transform: rotateY(90deg) translateZ(150px);
          background: linear-gradient(90deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%);
        }

        .cube-face.left {
          transform: rotateY(-90deg) translateZ(150px);
          background: linear-gradient(-90deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%);
        }

        .cube-face.top {
          transform: rotateX(90deg) translateZ(150px);
          background: linear-gradient(180deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.02) 100%);
        }

        .cube-face.bottom {
          transform: rotateX(-90deg) translateZ(150px);
          background: linear-gradient(0deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.02) 100%);
        }

        .depth-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .depth-layer.layer-1 {
          background: radial-gradient(circle at 30% 50%, rgba(0,0,0,0.01) 0%, transparent 50%);
          animation: tilt 15s ease-in-out infinite;
          transform: translateZ(10px);
        }

        .depth-layer.layer-2 {
          background: radial-gradient(circle at 70% 50%, rgba(0,0,0,0.005) 0%, transparent 50%);
          animation: tilt 20s ease-in-out infinite reverse;
          transform: translateZ(-10px);
        }

        .depth-layer.layer-3 {
          background: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.008) 0%, transparent 60%);
          animation: tilt 25s ease-in-out infinite;
          transform: translateZ(5px);
        }

        .light-ray {
          position: absolute;
          width: 2px;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          pointer-events: none;
        }

        .light-ray.ray-1 {
          left: 20%;
          top: -50px;
          height: 300px;
          animation: float1 10s ease-in-out infinite;
          transform-origin: center;
        }

        .light-ray.ray-2 {
          right: 25%;
          top: 100px;
          height: 250px;
          animation: float2 12s ease-in-out infinite;
        }

        .light-ray.ray-3 {
          left: 50%;
          top: 0;
          height: 200px;
          animation: float3 15s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .cube-bg,
          .depth-layer,
          .light-ray {
            animation: none !important;
          }
        }
      `}</style>

      <div className="background-3d-container">
        <div className="depth-layer layer-1"></div>
        <div className="depth-layer layer-2"></div>
        <div className="depth-layer layer-3"></div>

        <div className="light-ray ray-1"></div>
        <div className="light-ray ray-2"></div>
        <div className="light-ray ray-3"></div>

        <div className="cube-bg cube-1">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>

        <div className="cube-bg cube-2">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>

        <div className="cube-bg cube-3">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>
      </div>
    </>
  );
}
