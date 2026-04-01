import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Session1 from "../components/Session1";
import Session2 from "../components/Session2";
import Session3 from "../components/Session3";
import Session4 from "../components/Session4";
import Session5 from "../components/Session5";
import Session6 from "../components/Session6";
import Session7 from "../components/Session7";
import ExpertTeamSection from "../components/ExpertTeamSection";
import AnimatedSection from "../components/AnimatedSection";
import HealthAlertsCard from "../components/HealthAlertsCard";
import { baiVietAPI } from "../services/api";

// Lấy mô tả ngắn từ nội dung HTML
const getShortExcerpt = (noiDung, maxLength = 160) => {
  if (!noiDung) return "";
  const text = noiDung.replace(/<[^>]*>/g, "").trim();
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getCategoryDisplayName = (category) => {
  if (!category || category.trim() === "") return "Khác";
  const categoryMap = {
    Activities: "Hoạt động",
    Health: "Sức khỏe",
    Guides: "Hướng dẫn",
    "Medical News": "Tin tức y tế",
    "Dịch vụ": "Dịch vụ",
    "Đời sống": "Đời sống",
    "Du lịch": "Du lịch",
    "Khác": "Khác",
  };
  return categoryMap[category] || category;
};

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await baiVietAPI.getAll({
          trang_thai: "xuat_ban",
          limit: 3,
        });
        const data = response.data || [];
        setFeaturedPosts(data);
      } catch (err) {
        console.error("Error loading featured posts:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);
  return (
    <div className="min-h-screen font-raleway">
      {/* Session1 không cần animation vì đã có typing effect */}
      <Session1 />
      <AnimatedSection delay={0}>
        <Session2 />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <ExpertTeamSection />
      </AnimatedSection>
      
      {/* Card Cảnh báo chỉ số sức khỏe */}
      <div className="container mx-auto px-4 py-8">
        <HealthAlertsCard />
      </div>

      {/* Bài viết tiêu biểu - dữ liệu từ API (cùng nguồn với trang Blog) */}
      <AnimatedSection delay={100}>
        <section className="bg-slate-50/60 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-rose-700 uppercase mb-2">
                  Bài viết tiêu biểu
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  Góc nhìn chuyên gia & câu chuyện tại Xuân Hoa
                </h2>
              </div>
              <div>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Xem thêm bài viết
                  <span className="ml-2 text-lg leading-none">↗</span>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Đang tải bài viết...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-rose-600">{error}</p>
              </div>
            ) : featuredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Chưa có bài viết nào.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {featuredPosts.map((post) => {
                  const excerpt =
                    post.mo_ta_ngan ||
                    getShortExcerpt(post.noi_dung);
                  const categoryLabel = getCategoryDisplayName(
                    post.category || "Khác"
                  );
                  const postDate = formatDate(
                    post.ngay_dang || post.ngay_tao
                  );
                  const postUrl = `/blog?tab=bai-viet&post=${post.id}`;
                  return (
                    <article
                      key={post.id}
                      className="group h-full rounded-2xl bg-white shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 pt-5 pb-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold">
                            {categoryLabel}
                          </span>
                          <span>{postDate}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 group-hover:text-rose-800 transition-colors duration-200">
                          {post.tieu_de}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                          {excerpt}
                        </p>
                      </div>
                      <div className="px-5 pb-5 pt-2">
                        <Link
                          to={postUrl}
                          className="inline-flex items-center text-sm font-semibold text-rose-800 group-hover:text-rose-900"
                        >
                          Đọc tiếp
                          <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200">
                            →
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>
      
      <AnimatedSection delay={50}>
        <Session3 />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Session4 />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <Session5 />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <Session6 />
      </AnimatedSection>
      <AnimatedSection delay={250}>
        <Session7 />
      </AnimatedSection>

    </div>
  );
};

export default HomePage;
