import { useState } from 'react';
import ServiceSession1 from '../components/ServiceSession1';
import ServiceSession2 from '../components/ServiceSession2';
import ServiceSession3 from '../components/ServiceSession3';
import ServiceSession4 from '../components/ServiceSession4';
import ServiceDetail from '../components/ServiceDetail';
import SeoHead from '../components/SeoHead';

const Service = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleBackFromDetail = () => {
    setSelectedService(null);
  };

  const handleCategoryBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen">
      <SeoHead
        title={
          selectedService
            ? `${selectedService.ten_dich_vu || 'Dịch vụ'} – Dịch vụ`
            : selectedCategory
              ? `${selectedCategory.ten} – Dịch vụ`
              : 'Dịch vụ'
        }
        description={
          selectedService?.mo_ta_ngan ||
          selectedService?.mo_ta ||
          selectedCategory?.mo_ta ||
          'Các gói dịch vụ chăm sóc sức khỏe, vật lý trị liệu và hỗ trợ sinh hoạt tại Trung tâm trường thọ Xuân Hoa – thiết kế phù hợp nhu cầu từng cụ.'
        }
        canonicalPath="/dich-vu"
      />
      <ServiceSession1 />
      {selectedService ? (
        <ServiceDetail service={selectedService} onBack={handleBackFromDetail} />
      ) : (
        <ServiceSession2
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onCategoryBack={handleCategoryBack}
          onServiceClick={handleServiceClick}
        />
      )}
      <ServiceSession3 />
      <ServiceSession4 />
    </div>
  );
};

export default Service;
