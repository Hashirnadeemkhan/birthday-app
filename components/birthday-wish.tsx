'use client';

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaBirthdayCake, FaGift } from 'react-icons/fa';
import { GiBalloons } from 'react-icons/gi';

type ConfettiProps = {
  width: number;
  height: number;
};

const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false }); // Dynamic import of the confetti component

const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

const MyBirthdayComponent = () => {
  const [candlesLit, setCandlesLit] = useState<number>(0);
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 });
  const [celebrating, setCelebrating] = useState<boolean>(false);

  const totalCandles: number = 5;
  const totalBalloons: number = 5;

  // useEffect for window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set the initial size
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true);
    }
  }, [candlesLit, balloonsPoppedCount]);

  const lightCandle = (index: number) => {
    if (index === candlesLit) {
      setCandlesLit(prev => prev + 1); // Increment candles lit
    }
  };

  const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount) {
      setBalloonsPoppedCount(prev => prev + 1); // Increment balloons popped count
    }
  };

  const celebrate = () => {
    setCelebrating(true);
    setShowConfetti(true);
    const interval = setInterval(() => {
      setCandlesLit(prev => {
        if (prev < totalCandles) return prev + 1;
        clearInterval(interval); // Stop the interval when all candles are lit
        return prev;
      });
    }, 500); // Time interval for lighting candles
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border-2 border-black'>
          <CardHeader className='text-center'>
            <CardTitle className='text-4xl font-bold text-black'>Happy 20th Birthday!</CardTitle>
            <CardDescription className='text-2xl font-semibold text-gray-600'>Hashir Khan</CardDescription>
            <p className='text-lg text-gray-500'>August 7th</p>
          </CardHeader>

          <CardContent className='space-y-6 text-center'>
            <div>
              <h3 className='text-lg font-semibold text-black mb-2'>Light the candles:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through candles */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>
                    {/* Render lit or unlit candle based on state */}
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ scale: 0 }} // The candle starts at scale 0 (invisible)
                        animate={{ scale: 1 }} // Animates to full size (scale 1)
                        exit={{ scale: 0 }} // When the candle is removed, it scales down to 0
                        transition={{ duration: 0.5, delay: celebrating ? index * 0.5 : 0 }} // Animation duration of 0.5 seconds. If celebrating, each candle appears with a delay based on its index
                      >
                        <FaBirthdayCake
                          className='w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110'
                          style={{ color: candleColors[index % candleColors.length] }} // Dynamic color for the candle
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      <FaBirthdayCake
                        className='w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110'
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
                        {/* Balloons section */}
                        <div>
              <h3 className="text-lg font-semibold text-black mb-2">Pop the balloons:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through balloons */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                      {/* Balloon icon */}
                      <GiBalloons
                      className={`w-8 h-8 cursor-pointer hover:scale-110`}
                      style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                      onClick={() => popBalloon(index)}
                    />
                     </motion.div>
                ))}
                </div>
                </div>
          </CardContent>
          {/* Card footer with celebrate button */}
          <CardFooter className="flex justify-center">
            <Button className='bg-black text-white hover:bg-gray-800 transition-all duration-300'
              onClick={celebrate}
              disabled={celebrating}
              >
              Celebrate! <FaGift className="ml-2 h-4 w-4" />
              </Button>
              
          </CardFooter>
        </Card>
      </motion.div>
      {/* Confetti component */}
      {showConfetti &&(
        <DynamicConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        colors={confettiColors}

        />
      )}
    </div>
  );
};

export default MyBirthdayComponent;
