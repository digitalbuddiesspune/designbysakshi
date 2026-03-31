import React from 'react';
import { Link } from 'react-router-dom';

const NewCollection = () => {
  return (
    <section className="py-4 sm:py-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[40px] bg-gradient-to-b from-gray-50 to-transparent"></div>
      
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="flex flex-col gap-4 md:gap-5 lg:gap-8">
          
          {/* Top Row */}
          <div className="grid grid-cols-2 lg:flex items-center gap-2 md:gap-3">
            
            {/* Left Big Image */}
            {/* On phone we want 2 images per row, so don't let this span both columns */}
            <div className="w-full lg:w-[45%] col-span-1">
               <div className="relative group p-1 bg-gray-50">
                 
                 <Link to="/ring" className="block overflow-hidden bg-gray-200 h-[120px] sm:h-[140px] md:h-[190px] lg:h-[240px]">
                   <img 
                     src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/Shop_High-Quality_Fine_Jewelry_for_Sale_in_the_USA_ermptm.jpg" 
                     className="w-full h-full object-cover"
                     alt="Gift a ring" 
                   />
                 </Link>

                 {/* ✅ MOBILE OVERLAY */}
                 <div className="lg:hidden absolute bottom-0 left-0 w-full bg-black/40 text-white p-2 text-[11px]">
                   <h3 className="uppercase tracking-widest">Gift a Ring</h3>
                   <p className="text-[10px] italic">Timeless love</p>
                 </div>

                 {/* DESKTOP TEXT (UNCHANGED) */}
                 <div className="hidden lg:block absolute -bottom-3 lg:bottom-4 lg:-right-3 bg-white p-3 shadow-md max-w-[200px] z-20 mx-2 lg:mx-0">
                   <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-1.5">
                     Gift a Ring
                   </h3>
                   <p className="text-gray-600 text-[14px] italic mb-2 leading-relaxed">
                     Let your love shine. Gift a timeless ring to your lover.
                   </p>
                   <Link to="/ring" className="inline-block text-[12px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">
                     Discover more →
                   </Link>
                 </div>
               </div>
            </div>

            {/* Right Small Image + Text */}
            <div className="col-span-1 lg:w-[55%] grid grid-cols-1 lg:flex items-center gap-2 md:gap-3">              
               {/* Image */}
               <div className="w-full group relative">                 <Link to="/bangles-bracelets" className="block overflow-hidden bg-gray-200 h-[120px] sm:h-[140px] md:h-[190px] lg:h-[180px]">
                    <img 
                      src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/t243d032hwaleawzbcxm.jpg" 
                      className="w-full h-full object-cover"
                      alt="Beaded Bracelet" 
                    />
                 </Link>

                 {/* MOBILE OVERLAY */}
                 <div className="lg:hidden absolute bottom-0 left-0 w-full bg-black/40 text-white p-2 text-[11px]">
                   <h3 className="uppercase tracking-widest">Bracelets</h3>
                   <p className="text-[10px] italic">Elegant daily wear</p>
                 </div>
               </div>

               {/* DESKTOP TEXT */}
               <div className="hidden lg:flex w-full sm:w-1/2 text-center sm:text-left px-2 flex-col justify-center">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-1.5">
                    Affordable &<br /> Beautiful Bracelets
                  </h3>
                  <div className="w-8 h-[1px] bg-[#ebd9c8] mx-auto sm:mx-0 mb-2"></div>
                  <p className="text-gray-600 text-[14px] italic mb-2 leading-relaxed">
                    Explore our stunning beaded bracelets. Perfect for gifting or treating yourself.
                  </p>
                  <Link to="/bangles-bracelets" className="inline-block text-[12px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">
                    Discover more →
                  </Link>
               </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 lg:flex items-center gap-2 md:gap-3">
            
            {/* Left Small Image + Text */}
            <div className="col-span-1 lg:w-[55%] grid grid-cols-1 lg:flex items-center gap-2 md:gap-3">              
               {/* DESKTOP TEXT */}
               <div className="hidden lg:flex w-full sm:w-1/2 text-center sm:text-right px-2 flex-col justify-center items-center sm:items-end">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-1.5">
                    Jewelry Tells<br /> A Great Story
                  </h3>
                  <div className="w-8 h-[1px] bg-[#ebd9c8] mb-2"></div>
                  <p className="text-gray-600 text-[14px] italic mb-2 leading-relaxed">
                    Adorn yourself with stunning pendants that capture your style.
                  </p>
                  <Link to="/pendants" className="inline-block text-[12px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">
                    Discover more →
                  </Link>
               </div>

               {/* Image */}
               <div className="w-full sm:w-1/2 group relative">
                 <Link to="/pendants" className="block overflow-hidden bg-gray-200 h-[120px] sm:h-[140px] md:h-[190px] lg:h-[180px]">
                    <img 
                      src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/download_18_j4ggfd.jpg" 
                      className="w-full h-full object-cover"
                      alt="Pendants" 
                    />
                 </Link>

                 {/* MOBILE OVERLAY */}
                 <div className="lg:hidden absolute bottom-0 left-0 w-full bg-black/40 text-white p-2 text-[11px]">
                   <h3 className="uppercase tracking-widest">Pendants</h3>
                   <p className="text-[10px] italic">Grace & style</p>
                 </div>
               </div>
            </div>

            {/* Right Big Image */}
            {/* On phone we want 2 images per row, so don't let this span both columns */}
            <div className="w-full lg:w-[45%] col-span-1">
               <div className="relative group p-1 bg-gray-50">
                 
                 <Link to="/bridal-jewellery" className="block overflow-hidden bg-gray-200 h-[120px] sm:h-[140px] md:h-[190px] lg:h-[240px]">
                   <img 
                     src="https://res.cloudinary.com/dbfooaz44/image/upload/v1774359279/download_19_jo3szm.jpg" 
                     className="w-full h-full object-cover"
                     alt="Bridal Jewellery" 
                   />
                 </Link>

                 {/* MOBILE OVERLAY */}
                 <div className="lg:hidden absolute bottom-0 left-0 w-full bg-black/40 text-white p-2 text-[11px]">
                   <h3 className="uppercase tracking-widest">Bridal</h3>
                   <p className="text-[10px] italic">Wedding elegance</p>
                 </div>

                 {/* DESKTOP TEXT */}
                 <div className="hidden lg:block absolute -top-3 lg:top-4 lg:-left-3 bg-white p-3 shadow-md max-w-[200px] z-20 mx-2 lg:mx-0">
                   <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-1.5">
                     Bridal Elegance
                   </h3>
                   <p className="text-gray-600 text-[14px] italic mb-2 leading-relaxed">
                     Celebrate your big day with exquisite bridal jewelry.
                   </p>
                   <Link to="/bridal-jewellery" className="inline-block text-[12px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black transition-colors">
                     Discover more →
                   </Link>
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