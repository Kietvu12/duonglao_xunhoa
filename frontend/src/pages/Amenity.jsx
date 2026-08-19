import { useState } from 'react';
import AmenitySession1 from '../components/AmenitySession1';
import AmenitySession2 from '../components/AmenitySession2';
import AmenitySession3 from '../components/AmenitySession3';
import AmenitySession4 from '../components/AmenitySession4';
import AmenitySession5 from '../components/AmenitySession5';
import RoomDetail from '../components/RoomDetail';
import SeoHead from '../components/SeoHead';

const Amenity = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const roomTitle = selectedRoom?.ten ? `${selectedRoom.ten} – Phòng nội trú` : null;

  return (
    <div className="min-h-screen">
      <SeoHead
        title={roomTitle || 'Tiện ích & phòng nghỉ'}
        description={
          selectedRoom?.mo_ta
            ? String(selectedRoom.mo_ta).replace(/\s+/g, ' ').trim().slice(0, 320)
            : 'Khám phá không gian nội trú, tiện ích sinh hoạt và dịch vụ đồng hành cùng người thân tại Trung tâm trường thọ Xuân Hoa.'
        }
        canonicalPath="/tien-ich"
      />
      <AmenitySession1 />
      {selectedRoom ? (
        <RoomDetail room={selectedRoom} onBack={handleBack} />
      ) : (
        <AmenitySession2 onRoomClick={handleRoomClick} />
      )}
      <AmenitySession3 />
      <AmenitySession4 />
      <AmenitySession5 />
    </div>
  );
};

export default Amenity;
