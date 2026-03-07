import { useState } from 'react';
import ServiceSession1 from '../components/ServiceSession1';
import ServiceSession2 from '../components/ServiceSession2';
import ServiceSession3 from '../components/ServiceSession3';
import ServiceSession4 from '../components/ServiceSession4';
import ServiceDetail from '../components/ServiceDetail';

const Service = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen">
      <ServiceSession1 />
      {selectedService ? (
        <ServiceDetail service={selectedService} onBack={handleBack} />
      ) : (
        <ServiceSession2 onServiceClick={handleServiceClick} />
      )}
      <ServiceSession3 />
      <ServiceSession4 />
    </div>
  );
};

export default Service;
