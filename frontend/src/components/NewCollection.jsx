import React from 'react';
import { Link } from 'react-router-dom';

const NewCollection = () => {
  return (
    <section className="bg-white py-6 sm:py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-gray-50 to-transparent"></div>
      
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Grid Layout */}
        <div className="flex flex-col gap-10 lg:gap-12">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Big Image */}
            <div className="w-full lg:w-[45%]">
               <div className="relative group p-1 bg-gray-50">
                 <Link to="/ring" className="block overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-700 h-[280px] sm:h-[320px] lg:h-[380px]">
                   <img 
                     src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/Shop_High-Quality_Fine_Jewelry_for_Sale_in_the_USA_ermptm.jpg" 
                     className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 object-top"
                     alt="Gift a ring" 
                     loading="lazy"
                   />
                 </Link>
                 <div className="absolute -bottom-4 lg:bottom-6 lg:-right-4 bg-white p-4 shadow-md max-w-[220px] z-20 mx-4 lg:mx-0 group-hover:-translate-y-1 transition-transform duration-500">
                   <h3 className="text-sm font-semibold mb-1.5 text-gray-900 uppercase tracking-widest border-b border-[#ebd9c8] inline-block pb-0.5">Gift a Ring</h3>
                   <p className="text-gray-600 text-[15px] italic mb-2 leading-relaxed">Let your love shine. Gift a timeless ring to your lover.</p>
                   <Link to="/ring" className="inline-block text-[13px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">Discover more →</Link>
                 </div>
               </div>
            </div>

            {/* Right Small Image + Text */}
            <div className="w-full lg:w-[55%] flex flex-col sm:flex-row items-center gap-5 lg:gap-8 lg:pt-8">
               <div className="w-full sm:w-1/2 group">
                 <Link to="/bangles-bracelets" className="block overflow-hidden bg-gray-200 h-[180px] sm:h-[220px] lg:h-[260px] shadow-sm group-hover:shadow-md transition-shadow duration-700">
                    <img 
                      src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/t243d032hwaleawzbcxm.jpg" 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 object-center"
                      alt="Beaded Bracelet" 
                      loading="lazy"
                    />
                 </Link>
               </div>
               <div className="w-full sm:w-1/2 text-center sm:text-left flex flex-col justify-center px-2 sm:px-0">
                  <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-2 leading-relaxed">
                    Affordable &<br /> Beautiful Bracelets
                  </h3>
                  <div className="w-8 h-[1px] bg-[#ebd9c8] mx-auto sm:mx-0 mb-2"></div>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] mb-4 leading-relaxed line-clamp-3">Explore our stunning beaded bracelets. Perfect for gifting or treating yourself with affordable luxury.</p>
                  <Link to="/bangles-bracelets" className="inline-block border border-gray-300 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-gray-800 hover:bg-black hover:border-black hover:text-white transition-all duration-300 w-max mx-auto sm:mx-0">
                    Discover more
                  </Link>
               </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
            {/* Left Small Image + Text */}
            <div className="w-full lg:w-[55%] flex flex-col-reverse sm:flex-row items-center gap-5 lg:gap-8 lg:pb-8">
               <div className="w-full sm:w-1/2 text-center sm:text-right flex flex-col justify-center px-2 sm:px-0 items-center sm:items-end">
                  <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-2 leading-relaxed">
                    Jewelry Tells<br /> A Great Story
                  </h3>
                  <div className="w-8 h-[1px] bg-[#ebd9c8] mb-2"></div>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] mb-4 leading-relaxed line-clamp-3">Adorn yourself with stunning pendants that capture the essence of your style and eternal grace.</p>
                  <Link to="/pendants" className="inline-block border border-gray-300 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] text-gray-800 hover:bg-black hover:border-black hover:text-white transition-all duration-300">
                    Discover more
                  </Link>
               </div>
               <div className="w-full sm:w-1/2 group">
                 <Link to="/pendants" className="block overflow-hidden bg-gray-200 h-[180px] sm:h-[220px] lg:h-[260px] shadow-sm group-hover:shadow-md transition-shadow duration-700">
                    <img 
                      src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/download_18_j4ggfd.jpg" 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 object-center"
                      alt="Pendants" 
                      loading="lazy"
                    />
                 </Link>
               </div>
            </div>

            {/* Right Big Image */}
            <div className="w-full lg:w-[45%] mt-8 sm:mt-0">
               <div className="relative group p-1 bg-gray-50">
                 <Link to="/bridal-jewellery" className="block overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-700 h-[280px] sm:h-[320px] lg:h-[380px]">
                   <img 
                     src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/download_19_jo3szm.jpg" 
                     className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 object-top"
                     alt="Bridal Jewellery" 
                     loading="lazy"
                   />
                 </Link>
                 <div className="absolute -top-4 lg:top-6 lg:-left-4 bg-white p-4 shadow-md max-w-[220px] z-20 mx-4 lg:mx-0 group-hover:-translate-y-1 transition-transform duration-500">
                   <h3 className="text-[11px] font-semibold mb-1.5 text-gray-900 uppercase tracking-widest border-b border-[#ebd9c8] inline-block pb-0.5">Bridal Elegance</h3>
                   <p className="text-gray-600 text-[10px] italic mb-2 leading-relaxed">Celebrate your big day with exquisite bridal jewelry. Joyous memories.</p>
                   <Link to="/bridal-jewellery" className="inline-block text-[9px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">Discover more →</Link>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewCollection;
