import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


function HeroSection3() {
  return (
    <div className="hero bg-white min-h-800">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <motion.img
      src="/images/support-img.png"
      className="max-w-2xl rounded-lg shadow-0xl"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
     <div className="text-right">
  <h1 className="text-5xl font-bold">Need a help!</h1>
  <h1 className="text-7xl font-bold">Raise a Ticket</h1>
  <p className="py-6">
    Leading automotive service centre situated in Hanwella.
  </p>
</div>

<div><Link to={"/customer/create"}>
          <a href=""
            title=""
            className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-red-600 border border-transparent rounded-md lg:inline-flex hover:bg-red-700 focus:bg-red-700"
            role="button">
          
            Raise a Ticket 
            </a>
            </Link>
          </div>

    </motion.div>
  </div>
</div>

  );
}

export default HeroSection3;
