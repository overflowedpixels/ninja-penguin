import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
        ctx.fill();
      }
    }

    // Create particles
    const particles = [];
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.5),
                        0 0 40px rgba(14, 165, 233, 0.3),
                        0 0 60px rgba(14, 165, 233, 0.2);
          }
          50% { 
            box-shadow: 0 0 30px rgba(14, 165, 233, 0.7),
                        0 0 60px rgba(14, 165, 233, 0.5),
                        0 0 90px rgba(14, 165, 233, 0.3);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .glow-effect {
          animation: glow 3s ease-in-out infinite;
        }

        .fade-up {
          animation: fadeUp 1s ease-out forwards;
        }

        .float-slow {
          animation: float 6s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #7dd3fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .neon-border {
          border: 2px solid transparent;
          background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)) padding-box,
                      linear-gradient(135deg, #38bdf8, #0ea5e9) border-box;
        }
      `}</style>

      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-sky-500 rounded-full opacity-20 blur-3xl float-slow"
          style={{
            top: '20%',
            left: '10%',
            transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`
          }}
        />
        <div
          className="absolute w-96 h-96 bg-cyan-500 rounded-full opacity-20 blur-3xl float-slow"
          style={{
            bottom: '20%',
            right: '10%',
            animationDelay: '2s',
            transform: `translate(${-mousePos.x * 0.03}px, ${-mousePos.y * 0.03}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="fade-up mb-8 inline-block">
            {/* <div className="glass-card px-6 py-3 rounded-full inline-block">
              
            </div> */}
          </div>

          {/* Main Heading */}
          <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Innovation</span>
              <br />
              <span className="text-white">Meets Future</span>
            </h1>
            {/* <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of cutting-edge technology and stunning aesthetics
            </p> */}
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 fade-up"
            style={{ animationDelay: '0.2s' }}
          >
          </div>
          <div className="fade-up max-w-5xl mx-auto mb-20" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="gradient-text">How to Use</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Follow these simple steps to get started with our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Click Get Started',
                  desc: 'Click the "Get Started" button to access the dashboard',
                 
                },
                {
                  step: '02',
                  title: 'Check the Request cards',
                  desc: 'Check the Request cards by clicking the top left arrow icon',
                  
                },
                {
                  step: '03',
                  title: 'Edit the Request cards',
                  desc: 'Edit the request by clicking on the edit button',
                  
                },
                {
                  step: '04',
                  title: 'Accept or Reject the Request',
                  desc: 'Accept or Reject the request by clicking the respective buttons',
                 
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-105 relative overflow-hidden"
                >
                  {/* Step number badge */}
                  <div className="absolute top-4 right-4 text-sky-500/20 text-6xl font-bold">
                    {item.step}
                  </div>

                  <div className="relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="glass-card rounded-2xl p-8 mt-8">
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">▸</span>
                  <span>Use the navigation menu at the top to switch between different pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">▸</span>
                  <span>All data is saved automatically when the user submit the form</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">▸</span>
                  <span>You can edit or delete entries directly from the Dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">▸</span>
                  <span>Accepting the request leads to the generation of certificates and automatic mailing to the authority and EPC</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-400 mt-1">▸</span>
                  <span>Rejecting the request leads to the automatic mailing to the authority and EPC</span>
                </li>
              </ul>
            </div>
          </div>
              <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-10 py-5 bg-sky-500 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 glow-effect"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          {/* Feature Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Blazing fast performance', delay: '0.3s' },
              { icon: '🎯', title: 'Precision', desc: 'Pixel-perfect design', delay: '0.4s' },
              { icon: '🚀', title: 'Scalable', desc: 'Built for growth', delay: '0.5s' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 fade-up group hover:scale-105"
                style={{ animationDelay: item.delay }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div> */}

          {/* Stats */}
          {/* <div
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            {[
              { number: '99%', label: 'Satisfaction' },
              { number: '50K+', label: 'Users' },
              { number: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-transparent py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          {/* <p className="text-gray-400 text-sm">
            © 2026 Your Brand. Crafted with precision.
          </p> */}
        </div>
      </footer>
    </div>
  );
}