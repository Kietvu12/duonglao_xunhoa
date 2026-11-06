import { Link } from 'react-router-dom';
import LegalPageLayout from '../components/LegalPageLayout';
import { CONTACT, SITE_NAME } from '../config/siteInfo';

const ContactLines = () => (
  <ul>
    <li>
      Hotline / Zalo: <a href={CONTACT.hotline.tel} className="font-semibold text-primary">{CONTACT.hotline.display}</a>
    </li>
    <li>
      Email: <a href={CONTACT.email.href} className="font-semibold text-primary break-all">{CONTACT.email.display}</a>
    </li>
    <li>Địa chỉ: {CONTACT.address.display}</li>
  </ul>
);

const sections = [
  {
    heading: 'Thông tin chúng tôi thu thập',
    content: (
      <>
        <p>Khi bạn gửi form đặt lịch tham quan / tư vấn trên website, chúng tôi thu thập:</p>
        <ul>
          <li>Họ và tên, số điện thoại (bắt buộc);</li>
          <li>Email (nếu bạn cung cấp);</li>
          <li>Gói dịch vụ quan tâm, ngày giờ mong muốn tham quan và ghi chú bạn tự nhập.</li>
        </ul>
        <p>
          Khi bạn liên hệ qua hotline, Zalo, Messenger hoặc email, chúng tôi lưu nội dung trao đổi cần thiết để
          phản hồi yêu cầu. Website có thể ghi nhận dữ liệu kỹ thuật cơ bản (loại trình duyệt, địa chỉ IP, thời điểm
          truy cập) phục vụ vận hành và bảo mật hệ thống.
        </p>
        <p>
          Vui lòng không nhập thông tin sức khỏe chi tiết vào phần ghi chú; các thông tin này sẽ được trao đổi trực
          tiếp với đội ngũ chuyên môn khi tư vấn.
        </p>
      </>
    ),
  },
  {
    heading: 'Mục đích sử dụng',
    content: (
      <ul>
        <li>Liên hệ xác nhận lịch tham quan và tư vấn gói chăm sóc phù hợp;</li>
        <li>Trả lời câu hỏi, gửi báo giá hoặc thông tin bạn yêu cầu;</li>
        <li>Cải thiện chất lượng dịch vụ và website.</li>
      </ul>
    ),
  },
  {
    heading: 'Chia sẻ thông tin',
    content: (
      <p>
        {SITE_NAME} không bán, cho thuê hay trao đổi thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương
        mại. Thông tin chỉ được cung cấp cho cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định pháp luật,
        hoặc cho đơn vị cung cấp hạ tầng kỹ thuật (máy chủ, email) trong phạm vi cần thiết để vận hành website.
      </p>
    ),
  },
  {
    heading: 'Lưu trữ và bảo vệ',
    content: (
      <p>
        Thông tin được lưu trên hệ thống quản lý nội bộ, chỉ nhân sự được phân quyền (tư vấn, quản lý) mới được truy
        cập. Chúng tôi lưu thông tin trong thời gian cần thiết cho mục đích nêu trên hoặc theo yêu cầu của pháp luật,
        sau đó sẽ xóa hoặc ẩn danh.
      </p>
    ),
  },
  {
    heading: 'Quyền của bạn',
    content: (
      <>
        <p>
          Bạn có quyền yêu cầu xem, chỉnh sửa, xóa thông tin cá nhân hoặc rút lại sự đồng ý liên hệ bất cứ lúc nào
          bằng cách liên hệ với chúng tôi theo thông tin dưới đây. Chúng tôi xử lý yêu cầu theo quy định pháp luật Việt
          Nam về bảo vệ dữ liệu cá nhân.
        </p>
        <ContactLines />
      </>
    ),
  },
  {
    heading: 'Liên kết bên ngoài',
    content: (
      <p>
        Website có liên kết tới Facebook, TikTok, Zalo, Google Maps. Các nền tảng này có chính sách bảo mật riêng mà
        chúng tôi không kiểm soát.
      </p>
    ),
  },
  {
    heading: 'Thay đổi chính sách',
    content: (
      <p>
        Chính sách có thể được cập nhật; phiên bản mới có hiệu lực kể từ khi đăng trên trang này. Xem thêm{' '}
        <Link to="/dieu-khoan-su-dung" className="font-semibold text-primary underline">Điều khoản sử dụng</Link>.
      </p>
    ),
  },
];

const ChinhSachBaoMat = () => (
  <LegalPageLayout
    title="Chính sách bảo mật"
    description={`Chính sách bảo mật thông tin cá nhân của ${SITE_NAME}: thông tin thu thập khi đặt lịch tham quan, mục đích sử dụng, lưu trữ và quyền của bạn.`}
    canonicalPath="/chinh-sach-bao-mat"
    updatedAt="04/11/2026"
    intro={
      <p>
        {SITE_NAME} tôn trọng và cam kết bảo vệ thông tin cá nhân của khách hàng, cư dân và gia đình. Chính sách này
        giải thích chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn như thế nào khi bạn sử dụng website.
      </p>
    }
    sections={sections}
  />
);

export default ChinhSachBaoMat;
