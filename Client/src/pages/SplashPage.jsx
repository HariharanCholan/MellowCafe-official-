
    import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Coffee } from 'lucide-react';

    const SplashPage = () => {
      const navigate = useNavigate();

      useEffect(() => {
        const timer = setTimeout(() => {
          navigate('/login');
        }, 3000);
        return () => clearTimeout(timer);
      }, [navigate]);

      return (
        <div className="min-h-screen flex items-center justify-center bg-mellow-gradient">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 120 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' } }}
            >
              <Coffee className="h-32 w-32 mx-auto text-red-500 drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              className="text-6xl font-bold mt-4 drop-shadow-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Mellow Café
            </motion.h1>
            <motion.p 
              className="text-xl mt-2 drop-shadow-sm"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Brewing happiness, one cup at a time.
            </motion.p>
          </motion.div>
        </div>
      );
    };

    export default SplashPage;
  