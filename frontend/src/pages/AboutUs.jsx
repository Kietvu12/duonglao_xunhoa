import AboutUsSession1 from '../components/AboutUsSession1';
import AboutUsSession2 from '../components/AboutUsSession2';
import AboutUsSession3 from '../components/AboutUsSession3';
import AboutUsSession4 from '../components/AboutUsSession4';
import AboutUsSession5 from '../components/AboutUsSession5';
import SeoHead from '../components/SeoHead';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <SeoHead
        title="Về chúng tôi"
        description="Giới thiệu Trung tâm trường thọ Xuân Hoa: sứ mệnh chăm sóc người cao tuổi, đội ngũ chuyên môn, không gian sống và giá trị cốt lõi của chúng tôi."
        canonicalPath="/ve-chung-toi"
      />
      <AboutUsSession1 />
      <AboutUsSession2 />
      <AboutUsSession3 />
      <AboutUsSession5 />
      {/* <AboutUsSession4 /> */}
    </div>
  );
};

export default AboutUs;
