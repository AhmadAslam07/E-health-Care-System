import React, { useState } from 'react';
import HeroSection from '../components/homecomponents/HeroSection';
import Ourservices from '../components/homecomponents/Ourservices';
import OurBenefits from '../components/homecomponents/OurBenefits';
import OurDoctors from '../components/homecomponents/OurDoctors';
import HealthCare from '../components/homecomponents/HealthCare';
import Testimonial from '../components/testimonial/Testimonial';

function Home() {
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  const handleSpecialistClick = (specialty) => {
    setSelectedSpecialist(null); // force re-render
    setTimeout(() => setSelectedSpecialist(specialty), 0);
  };

  return (
    <div>
      <HeroSection />
      <Ourservices onSpecialistClick={handleSpecialistClick} />
      <OurBenefits />
      <OurDoctors specialization={selectedSpecialist} />
      <HealthCare />
      <Testimonial />
    </div>
  );
}

export default Home;
