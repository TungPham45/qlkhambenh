import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";

const contentByPath = {
  "/admin/specialties": ["Quản lý Chuyên khoa", "Trang chuyên khoa đã có URL riêng và sẽ được kết nối dữ liệu sau."],
  "/admin/diseases": ["Danh mục Bệnh", "Trang danh mục bệnh đã có URL riêng và sẽ được kết nối dữ liệu sau."],
  "/admin/drug-suggestions": ["Gợi ý Thuốc", "Trang gợi ý thuốc đã có URL riêng và sẽ được kết nối dữ liệu sau."],
};

export function AdminPlaceholderPage() {
  const location = useLocation();
  const [title, description] = contentByPath[location.pathname] || ["Trang quản lý", "Chức năng đang được chuẩn bị."];

  return (
    <section className="admin-placeholder">
      <span><Construction size={30} /></span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
