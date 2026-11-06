import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ServiceSession1 from '../components/ServiceSession1';
import ServiceSession2 from '../components/ServiceSession2';
import ServiceSession3 from '../components/ServiceSession3';
import ServiceSession4 from '../components/ServiceSession4';
import ServiceDetail from '../components/ServiceDetail';
import SeoHead from '../components/SeoHead';
import { dichVuAPI, loaiDichVuAPI } from '../services/api';
import {
  buildCategoryPath,
  buildServicePath,
  findCategoryByParam,
  groupServicesByCategory,
  parseIdParam,
} from '../utils/dichVuUtils';

const DEFAULT_DESCRIPTION =
  'Các gói dưỡng lão tại Hạ Long: chăm sóc hoàn toàn 24/7, bán tự lập, tự lập ngắn hạn và dài hạn tại Trung tâm trường thọ Xuân Hoa – bảng giá theo ngày, theo tháng.';

const NotFoundBlock = ({ message }) => (
  <section className="pt-32 pb-20 bg-white">
    <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2D2D2D' }}>
        {message}
      </h1>
      <p style={{ color: '#6B6B6B' }}>Gói có thể đã được đổi tên hoặc ngừng cung cấp.</p>
      <Link
        to="/dich-vu"
        className="inline-flex px-6 py-3 rounded-full text-white font-semibold"
        style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}
      >
        Xem tất cả gói dịch vụ
      </Link>
    </div>
  </section>
);

const Service = () => {
  const { loaiParam, dichVuParam } = useParams();
  const [loaiDichVus, setLoaiDichVus] = useState([]);
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const [loaiRes, dichVuRes] = await Promise.all([
          loaiDichVuAPI.getAll(),
          dichVuAPI.getAll({ limit: -1 }),
        ]);
        if (cancelled) return;
        setLoaiDichVus(loaiRes.data || []);
        setDichVus(dichVuRes.data || []);
      } catch (error) {
        console.error('Error loading services:', error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => groupServicesByCategory(loaiDichVus, dichVus),
    [loaiDichVus, dichVus]
  );

  const selectedCategory = useMemo(
    () => findCategoryByParam(categories, loaiParam),
    [categories, loaiParam]
  );

  const selectedService = useMemo(() => {
    if (!selectedCategory || !dichVuParam) return null;
    const id = parseIdParam(dichVuParam);
    return selectedCategory.dichVus.find((dv) => dv.id === id) || null;
  }, [selectedCategory, dichVuParam]);

  const isSubPage = Boolean(loaiParam);
  const ready = !loading && !loadError;

  // URL hợp lệ (đúng id) nhưng sai phần chữ (vd. đã đổi tên) → chuyển về URL chuẩn
  if (ready && selectedCategory) {
    const canonical = selectedService
      ? buildServicePath(selectedCategory, selectedService)
      : buildCategoryPath(selectedCategory);
    const current = `/dich-vu/${loaiParam}${dichVuParam ? `/${dichVuParam}` : ''}`;
    if ((selectedService || !dichVuParam) && decodeURIComponent(current) !== canonical) {
      return <Navigate to={canonical} replace />;
    }
  }

  let seoTitle = 'Gói dịch vụ dưỡng lão tại Hạ Long';
  let seoDescription = DEFAULT_DESCRIPTION;
  let canonicalPath = '/dich-vu';
  if (selectedService) {
    seoTitle = `${selectedService.ten_dich_vu?.trim()} – ${selectedCategory.ten}`;
    seoDescription = selectedService.mo_ta_ngan || selectedCategory.mo_ta || DEFAULT_DESCRIPTION;
    canonicalPath = buildServicePath(selectedCategory, selectedService);
  } else if (selectedCategory) {
    seoTitle = `${selectedCategory.ten} – Gói dịch vụ`;
    seoDescription = selectedCategory.mo_ta || DEFAULT_DESCRIPTION;
    canonicalPath = buildCategoryPath(selectedCategory);
  }

  let mainContent;
  if (isSubPage && ready && !selectedCategory) {
    mainContent = <NotFoundBlock message="Không tìm thấy loại dịch vụ" />;
  } else if (isSubPage && dichVuParam && ready && !selectedService) {
    mainContent = <NotFoundBlock message="Không tìm thấy gói dịch vụ" />;
  } else if (selectedService) {
    mainContent = (
      <div className="pt-20 md:pt-24 lg:pt-28">
        <ServiceDetail service={selectedService} category={selectedCategory} />
      </div>
    );
  } else {
    mainContent = (
      <div className={isSubPage ? 'pt-16 md:pt-20 lg:pt-24' : ''}>
        <ServiceSession2
          loading={loading}
          loadError={loadError}
          categories={categories}
          selectedCategory={selectedCategory}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={canonicalPath} />
      {!isSubPage && <ServiceSession1 />}
      {mainContent}
      <ServiceSession3 />
      <ServiceSession4 />
    </div>
  );
};

export default Service;
