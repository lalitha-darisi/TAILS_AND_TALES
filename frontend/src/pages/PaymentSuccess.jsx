import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Calendar, Home, Gift, Sparkles, X } from "lucide-react";
import api from "../api/api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [showGoodiesPopup, setShowGoodiesPopup] = useState(false);

  // Confetti for payment success (from top) - runs continuously
  useEffect(() => {
    if (!loading) {
      const confettiInterval = createPaymentSuccessConfetti();
      setTimeout(() => setShowGoodiesPopup(true), 4500);
      
      // Cleanup function to stop confetti when component unmounts
      return () => {
        if (confettiInterval) {
          clearInterval(confettiInterval);
        }
      };
    }
  }, [loading]);

  const createPaymentSuccessConfetti = () => {
    const colors = ['#ff69b4', '#ff1493', '#ffa500', '#9370db', '#87ceeb', '#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'];
    const shapes = ['circle', 'square', 'triangle', 'star'];

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    // Continuous confetti - no time limit
    const confettiInterval = setInterval(() => {
      // Much more confetti particles
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.className = `confetti-top confetti-${shape}`;
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = randomInRange(1.5, 3.5) + 's';
        confetti.style.animationDelay = randomInRange(0, 0.3) + 's';
        confetti.style.width = randomInRange(8, 15) + 'px';
        confetti.style.height = randomInRange(8, 15) + 'px';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }, 30);

    return confettiInterval;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get(
          `/payments/session-details?sessionId=${sessionId}`
        );
        setBooking(data.booking);
        localStorage.removeItem("paidBookingId");
      } catch (err) {
        console.error("Failed to load session details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) loadData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const freeGoodies = [
    { icon: "🍖", name: "Premium Food Pack", desc: "1 month supply" },
    { icon: "🎾", name: "Toy Bundle", desc: "5 interactive toys" },
    { icon: "🛁", name: "Grooming Kit", desc: "Shampoo, brush & more" },
    { icon: "🦴", name: "Treats Box", desc: "Healthy snacks" },
    { icon: "🏠", name: "Cozy Bed", desc: "Comfortable sleeping" },
    { icon: "🎀", name: "Accessories Set", desc: "Collar, leash & tags" }
  ];

  return (
    <>
      <style>{`
        /* Payment Success Confetti - Falls from top */
        @keyframes confettiFallTop {
          0% { 
            transform: translateY(-100vh) rotate(0deg) scale(1); 
            opacity: 1; 
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(1080deg) scale(0.5); 
            opacity: 0; 
          }
        }
        
        .confetti-top {
          position: fixed;
          top: -20px;
          z-index: 9999;
          animation: confettiFallTop linear forwards;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        /* Different shapes */
        .confetti-circle {
          border-radius: 50%;
        }

        .confetti-square {
          border-radius: 2px;
        }

        .confetti-triangle {
          width: 0 !important;
          height: 0 !important;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 16px solid;
          background: transparent !important;
        }

        .confetti-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8); }
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .slide-in-up {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-pink-300 opacity-40 float" style={{ animationDelay: '0s' }}>
          <Sparkles size={40} />
        </div>
        <div className="absolute top-20 right-20 text-purple-300 opacity-40 float" style={{ animationDelay: '1s' }}>
          <Gift size={35} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-orange-300 opacity-40 float" style={{ animationDelay: '0.5s' }}>
          <Sparkles size={30} />
        </div>
        <div className="absolute bottom-10 right-1/3 text-pink-300 opacity-40 float" style={{ animationDelay: '1.5s' }}>
          <Gift size={40} />
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-green-300 bounce-in relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl pulse-glow">
              <CheckCircle size={70} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent mb-3">
              Payment Successful!
            </h1>
            <div className="flex items-center justify-center gap-2 text-2xl text-yellow-500 mb-4">
              <Sparkles size={24} className="animate-pulse" />
              <span className="font-bold">Congratulations!</span>
              <Sparkles size={24} className="animate-pulse" />
            </div>
          </div>

          {booking ? (
            <>
              <p className="text-2xl text-gray-700 text-center mb-6">
                You have successfully adopted{" "}
                <span className="font-bold text-pink-600 text-3xl">
                  {booking.pet?.name}
                </span>
                ! 🎉
              </p>

              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-green-800 text-center flex items-center justify-center gap-2">
                  <CheckCircle size={28} />
                  Adoption Details
                </h2>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <strong className="text-gray-700">Pet Name:</strong>
                    <span className="text-pink-600 font-semibold">{booking.pet?.name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <strong className="text-gray-700">Breed:</strong>
                    <span className="text-purple-600 font-semibold">{booking.pet?.breed}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <strong className="text-gray-700">Status:</strong>
                    <span className="text-green-600 font-bold">✓ Completed</span>
                  </div>
                </div>
              </div>

              {/* Gift teaser - Now clickable */}
              <button
                onClick={() => setShowGoodiesPopup(true)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 rounded-2xl text-white text-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Gift size={32} className="animate-bounce" />
                  <h3 className="text-2xl font-bold">Surprise Gift Included!</h3>
                  <Gift size={32} className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <p className="text-lg opacity-90">
                  Click here to see your free goodies! 🎁
                </p>
              </button>
            </>
          ) : (
            <p className="text-lg text-gray-600 text-center">
              Payment completed successfully! 🎉
            </p>
          )}

          {/* Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/bookings")}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg flex items-center justify-center gap-2"
            >
              <Calendar size={24} />
              View My Bookings
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-white text-purple-600 border-2 border-purple-300 rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg flex items-center justify-center gap-2"
            >
              <Home size={24} />
              Go Home
            </button>
          </div>
        </div>

        {/* Goodies Popup */}
        {showGoodiesPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative slide-in-up border-4 border-pink-300">
              {/* Close button */}
              <button
                onClick={() => setShowGoodiesPopup(false)}
                className="sticky top-4 right-4 ml-auto mr-4 mt-4 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 pt-4">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full mb-4 shadow-xl animate-bounce">
                    <Gift size={56} className="text-white" />
                  </div>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-2xl text-gray-700 font-bold mb-2">
                    You've received FREE goodies!
                  </p>
                  <p className="text-lg text-purple-600 font-semibold">
                    Special welcome gift for {booking?.pet?.name} 💝
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl border-4 border-purple-200">
                  <h3 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🎁 Your Free Gift Package
                  </h3>
                  <p className="text-center text-gray-600 mb-6 text-lg font-semibold">
                    Everything your pet needs for the first month! 🐾
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {freeGoodies.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-3 border-pink-200 cursor-pointer"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="text-5xl text-center mb-3 animate-bounce" style={{ animationDelay: `${idx * 0.2}s` }}>
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-base text-gray-800 text-center mb-2">
                          {item.name}
                        </h4>
                        <p className="text-sm text-purple-600 text-center font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-3xl p-6 text-center shadow-xl border-4 border-green-300">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={24} />
                    <p className="text-2xl font-bold">
                      Delivered with Your New Pet!
                    </p>
                    <Sparkles size={24} />
                  </div>
                  <p className="text-base mt-2 opacity-95">
                    All goodies will arrive when you pick up {booking?.pet?.name}!
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    Everything your furry friend needs for a happy start! 🏡💕
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}