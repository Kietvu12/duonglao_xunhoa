import { useState } from 'react';
import AmenitySession1 from '../components/AmenitySession1';
import AmenitySession2 from '../components/AmenitySession2';
import AmenitySession3 from '../components/AmenitySession3';
import AmenitySession4 from '../components/AmenitySession4';
import AmenitySession5 from '../components/AmenitySession5';
import RoomDetail from '../components/RoomDetail';

const Amenity = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen">
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
