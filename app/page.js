'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/photo_2025-12-06_14-27-57.jpg',
    '/images/photo_2025-12-06_14-28-01.jpg',
    '/images/photo_2025-12-06_14-28-04.jpg',
    '/images/photo_2025-12-06_14-28-07.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleFeatureClick = () => {
    router.push('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5F5 20%, #6C4AB6 40%, #FF4FA3 60%, #FCE4EC 80%, #FFFFFF 100%)',
      fontFamily: "'Quicksand', 'Arial', sans-serif"
    }}>
      {/* Header Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '40px',
            color: '#6C4AB6',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
          }}>🐾</div>
          <span style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>PetPal</span>
        </div>

        {/* Login Button */}
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(108, 74, 182, 0.3)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 79, 163, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(108, 74, 182, 0.3)';
          }}
        >
          Login
        </button>
      </nav>

      {/* Full Width Image Slider Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        overflow: 'hidden',
        marginTop: '-20px'
      }}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: currentImageIndex === index ? 0 : '-100%',
              width: '100%',
              height: '100%',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'left 1s ease-in-out, opacity 1s ease-in-out',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        

      </div>

      {/* Choose Your Pets Section */}
      <div style={{
        padding: '80px 50px',
        background: 'rgba(255, 255, 255, 0.95)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '42px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Choose Your Pets
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
          marginBottom: '50px'
        }}>
          Select from our adorable collection of pets
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto 80px auto'
        }}>
          {/* Pet Cards with Local Images */}
          {[
            { image: '/images/cat.jpg', name: 'Cats' },
            { image: '/images/dog.jpg', name: 'Dogs' },
            { image: '/images/bird.jpg', name: 'Birds' },
            { image: '/images/rabbit.jpg', name: 'Rabbits' }
          ].map((pet, index) => (
            <div
              key={index}
              onClick={handleFeatureClick}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: 'white'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                width: '100%',
                height: '320px',
                backgroundImage: `url(${pet.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{
                padding: '20px',
                textAlign: 'center',
                background: 'white'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: 0
                }}>
                  {pet.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{
          textAlign: 'center',
          fontSize: '42px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '60px'
        }}>
          Amazing Features for Your Pets
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Feature Cards */}
          {[
            { 
              title: 'Health Records', 
              desc: 'Track all medical history, vaccinations & vet visits',
              image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
            },
            { 
              title: 'Nutrition Tracking', 
              desc: 'Monitor meals, portions & calories for balanced diet',
              image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=250&fit=crop'
            },
            { 
              title: 'Activity Log', 
              desc: 'Log walks, playtime & exercises with detailed stats',
              image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop'
            },
            { 
              title: 'Smart Reminders', 
              desc: 'Never miss vaccinations, medication or grooming',
              image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=250&fit=crop'
            },
            { 
              title: 'Beautiful Charts', 
              desc: 'Visualize health trends & activity with graphs',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
            },
            { 
              title: 'Multiple Pets', 
              desc: 'Manage all your cats, dogs & other pets easily',
              image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=250&fit=crop'
            }
          ].map((feature, index) => (
            <div
              key={index}
              onClick={handleFeatureClick}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid rgba(108, 74, 182, 0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(108, 74, 182, 0.3)';
                e.currentTarget.style.borderColor = '#6C4AB6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'rgba(108, 74, 182, 0.2)';
              }}
            >
              {/* Feature Image */}
              <div style={{
                position: 'relative',
                height: '180px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${feature.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Feature Content */}
              <div style={{ padding: '25px', textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#6C4AB6',
                  marginBottom: '10px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #6C4AB6 0%, #8B5FD6 50%, #FF4FA3 100%)',
        padding: '40px 50px',
        textAlign: 'center',
        borderTop: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '30px' }}>🐾</span>
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            PetPal
          </span>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', marginBottom: '10px' }}>
          Your trusted companion for pet health and wellness management
        </p>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          © 2025 PetPal. All rights reserved. Made with ❤️ for pet lovers.
        </p>
      </footer>
    </div>
  );
}
