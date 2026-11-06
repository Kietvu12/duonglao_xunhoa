import { Link } from 'react-router-dom';
import LegalPageLayout from '../components/LegalPageLayout';
import { CONTACT, SITE_NAME } from '../config/siteInfo';

const sections = [
  {
    heading: 'Phạm vi áp dụng',
    content: (
      <p>
        Điều khoản này áp dụng khi bạn truy cập và sử dụng website duonglaoxuanhoa.net của {SITE_NAME}. Bằng việc sử
        dụng website, bạn đồng ý với các điều khoản dưới đây.
      </p>
    ),
  },
  {
    heading: 'Thông tin trên website',
    content: (
      <>
        <p>
          Nội dung về dịch vụ, bảng giá, hình ảnh và bài viết mang tính giới thiệu, tham khảo. Giá và phạm vi dịch
          vụ có thể thay đổi; chi phí và quyền lợi chính thức được xác nhận khi tư vấn trực tiếp và ghi trong hợp đồng
          dịch vụ ký giữa hai bên.
        </p>
        <p>
          Bài viết về sức khỏe, dinh dưỡng chỉ nhằm cung cấp kiến thức chung, không thay thế chẩn đoán hay chỉ định
          của bác sĩ.
        </p>
      </>
    ),
  },
  {
    heading: 'Đặt lịch tham quan và tư vấn',
    content: (
      <ul>
        <li>Đặt lịch qua website là miễn phí và chưa phát sinh nghĩa vụ thanh toán hay ký hợp đồng.</li>
        <li>
          Lịch hẹn được xác nhận khi nhân viên của Trung tâm liên hệ lại với bạn. Trường hợp cần đổi lịch, vui lòng
          gọi hotline <a href={CONTACT.hotline.tel} className="font-semibold text-primary">{CONTACT.hotline.display}</a>.
        </li>
        <li>Bạn chịu trách nhiệm về tính chính xác của thông tin đã cung cấp.</li>
      </ul>
    ),
  },
  {
    heading: 'Quyền sở hữu nội dung',
    content: (
      <p>
        Logo, hình ảnh, bài viết trên website thuộc quyền sở hữu của {SITE_NAME} hoặc được sử dụng hợp pháp. Không sao
        chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của chúng tôi.
      </p>
    ),
  },
  {
    heading: 'Hành vi không được phép',
    content: (
      <ul>
        <li>Gửi thông tin giả mạo, spam hoặc đặt lịch thay người khác khi chưa được đồng ý;</li>
        <li>Can thiệp, tấn công hoặc làm gián đoạn hoạt động của website;</li>
        <li>Truy cập trái phép khu vực quản trị và dữ liệu nội bộ.</li>
      </ul>
    ),
  },
  {
    heading: 'Bảo mật thông tin',
    content: (
      <p>
        Việc thu thập và sử dụng thông tin cá nhân được thực hiện theo{' '}
        <Link to="/chinh-sach-bao-mat" className="font-semibold text-primary underline">Chính sách bảo mật</Link>.
      </p>
    ),
  },
  {
    heading: 'Thay đổi điều khoản và liên hệ',
    content: (
      <>
        <p>
          Điều khoản có thể được cập nhật và có hiệu lực kể từ khi đăng trên trang này. Mọi thắc mắc xin liên hệ:
        </p>
        <ul>
          <li>
            Hotline / Zalo: <a href={CONTACT.hotline.tel} className="font-semibold text-primary">{CONTACT.hotline.display}</a>
          </li>
          <li>
            Email: <a href={CONTACT.email.href} className="font-semibold text-primary break-all">{CONTACT.email.display}</a>
          </li>
          <li>Địa chỉ: {CONTACT.address.display}</li>
        </ul>
      </>
    ),
  },
];

const DieuKhoanSuDung = () => (
  <LegalPageLayout
    title="Điều khoản sử dụng"
    description={`Điều khoản sử dụng website của ${SITE_NAME}: thông tin dịch vụ, đặt lịch tham quan, quyền sở hữu nội dung và liên hệ.`}
    canonicalPath="/dieu-khoan-su-dung"
    updatedAt="04/11/2026"
    sections={sections}
  />
);

export default DieuKhoanSuDung;
