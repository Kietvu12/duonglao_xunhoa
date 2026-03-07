import session7Img1 from '../assets/session7_1.png';
import session7Img2 from '../assets/session7_2.png';
import session7Img3 from '../assets/session7_3.png';

const Session7 = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-stretch">
          
          {/* Left Side - Image 1 */}
          <div className="w-full relative">
            <img
              src={session7Img1}
              alt="Cảm nhận từ gia đình"
              className="w-full h-full object-cover rounded-[40px]"
            />
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-[40px] bg-[#FDE7F2]/90 p-6 md:p-8">
              <p className="text-[#A90046] text-sm md:text-base font-serif mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Cảm nhận</p>
              <h3 className="text-black text-xl md:text-2xl lg:text-3xl font-serif font-semibold mb-3 md:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Sự an tâm tuyệt đối</h3>
              <p className="text-black text-sm md:text-base lg:text-lg font-serif leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nhờ đội ngũ nhân viên tận tâm, mẹ tôi luôn được chăm sóc chu đáo mỗi ngày. Chúng tôi hoàn toàn yên tâm khi bà ở đây và luôn cảm thấy được yêu thương.
              </p>
            </div>
          </div>

          {/* Right Side - Images 2 and 3 stacked */}
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            
            {/* Image 2 */}
            <div className="flex-1 w-full min-h-0 relative">
              <img
                src={session7Img2}
                alt="Cảm nhận từ gia đình"
                className="w-full h-full object-cover rounded-[40px]"
              />
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-[40px] bg-[#FDE7F2]/90 p-4 md:p-6">
                <p className="text-[#A90046] text-xs md:text-sm font-serif mb-1 md:mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Cảm nhận</p>
                <h3 className="text-black text-lg md:text-xl lg:text-2xl font-serif font-semibold mb-2 md:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Tận hưởng niềm vui mỗi ngày</h3>
                <p className="text-black text-xs md:text-sm lg:text-base font-serif leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Mẹ tôi luôn rạng rỡ khi tham gia các hoạt động tại viện. Chúng tôi thật sự ấn tượng với sự quan tâm và chăm sóc đầy tình cảm của nhân viên.
                </p>
              </div>
            </div>
            
            {/* Image 3 */}
            <div className="flex-1 w-full min-h-0 relative">
              <img
                src={session7Img3}
                alt="Cảm nhận từ gia đình"
                className="w-full h-full object-cover rounded-[40px]"
              />
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-[40px] bg-[#FDE7F2]/90 p-4 md:p-6">
                <p className="text-[#A90046] text-xs md:text-sm font-serif mb-1 md:mb-2">Cảm nhận</p>
                <h3 className="text-black text-lg md:text-xl lg:text-2xl font-serif font-semibold mb-2 md:mb-3">Mái ấm trọn yêu thương</h3>
                <p className="text-black text-xs md:text-sm lg:text-base font-serif leading-relaxed">
                  Chúng tôi thật may mắn khi mẹ được chăm sóc trong một môi trường ấm áp và thân thiện. Nhân viên luôn tận tâm, nhẹ nhàng và chu đáo từng chi tiết nhỏ.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Session7;
