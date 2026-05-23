"use client";
import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVG, no emoji) ────────────────────────────────────────────
function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconArrow({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconStar({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconChevron({ className = "w-5 h-5", open = false }: { className?: string; open?: boolean }) {
  return (
    <svg className={`${className} transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ id, dark = false }: { id: string; dark?: boolean }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg(data.message);
      } else {
        setStatus("error");
        setMsg(data.error || "Có lỗi xảy ra");
      }
    } catch {
      setStatus("error");
      setMsg("Không thể kết nối, vui lòng thử lại");
    }
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border text-base outline-none transition-colors duration-200 focus:ring-2 ${
    dark
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30 focus:border-white/40"
      : "bg-white border-[#CCFBF1] text-[#134E4A] placeholder:text-gray-400 focus:ring-[#0D9488]/30 focus:border-[#0D9488]"
  }`;

  if (status === "success") {
    return (
      <div className={`rounded-2xl p-6 text-center ${dark ? "bg-white/10" : "bg-[#F0FDFA] border border-[#CCFBF1]"}`}>
        <div className="w-14 h-14 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-3">
          <IconCheck className="w-7 h-7 text-white" />
        </div>
        <p className={`font-semibold text-lg ${dark ? "text-white" : "text-[#134E4A]"}`}>{msg}</p>
        <p className={`text-sm mt-1 ${dark ? "text-white/70" : "text-[#6B7280]"}`}>Kiểm tra email để nhận tài liệu hướng dẫn từ em nhé.</p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-3">
      <input
        className={inputCls}
        placeholder="Họ và tên của anh/chị"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
        aria-label="Họ và tên"
      />
      <input
        className={inputCls}
        placeholder="Số điện thoại (VD: 0901234567)"
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        required
        type="tel"
        aria-label="Số điện thoại"
      />
      <input
        className={inputCls}
        placeholder="Email nhận tài liệu"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        required
        type="email"
        aria-label="Email"
      />
      {status === "error" && (
        <p className="text-red-400 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{msg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-[#F97316] hover:bg-[#EA6C0A] disabled:opacity-60 text-white font-bold text-lg rounded-xl transition-colors duration-200 cursor-pointer shadow-lg shadow-orange-200"
      >
        {status === "loading" ? "Đang gửi..." : "ĐĂNG KÝ NGAY — GIỮ SUẤT HỌC"}
      </button>
      <p className={`text-xs text-center ${dark ? "text-white/60" : "text-[#6B7280]"}`}>
        Hoàn 100% trong 60 ngày nếu không ra kết quả — anh/chị giữ lại toàn bộ tài liệu
      </p>
    </form>
  );
}

// ─── Sticky Mobile CTA ────────────────────────────────────────────────────────
function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}>
      <a
        href="#dang-ky"
        className="flex items-center justify-center gap-2 w-full py-4 bg-[#F97316] text-white font-bold text-base cursor-pointer shadow-2xl"
        onClick={e => {
          e.preventDefault();
          document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        ĐĂNG KÝ NGAY — GIỮ SUẤT HỌC
        <IconArrow className="w-4 h-4" />
      </a>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
const faqs = [
  { q: "Amazon KDP là gì? Tôi chưa biết gì về nó.", a: "Amazon KDP (Kindle Direct Publishing) là nền tảng xuất bản sách của Amazon — hoàn toàn miễn phí. Anh/chị upload sách lên, Amazon bán cho hàng triệu khách hàng toàn cầu và trả royalty 35-70% về cho anh/chị mỗi tháng. Hệ thống BOOK FLOW AI hướng dẫn từng bước từ đầu — kể cả khi anh/chị chưa biết gì về KDP." },
  { q: "Tôi không biết viết văn có làm được không?", a: "Đây chính xác là vấn đề hệ thống này giải quyết. AI Agent (ChatGPT/Claude) viết 90% nội dung sách theo bộ prompt đã được tối ưu sẵn — anh/chị chỉ cần chọn ngách, review và upload. Không cần kỹ năng viết lách." },
  { q: "Thực sự không cần vốn gì không?", a: "Đúng — KDP publish 100% miễn phí. Chi phí duy nhất là thời gian của anh/chị. ChatGPT có bản free đủ dùng. Không cần vốn nhập hàng, không cần chạy quảng cáo, không cần thuê người." },
  { q: "Tôi bận con nhỏ, không có nhiều thời gian. Có làm được không?", a: "Hệ thống được thiết kế cho người bận. Module ngắn 15-30 phút, học được khi con ngủ trưa hoặc buổi tối. Sau khi setup xong (1-2 tuần), sách tự bán không cần chăm sóc." },
  { q: "Mất bao lâu để có thu nhập đầu tiên?", a: "Amazon duyệt sách trong 24-72 giờ sau khi upload. Thu nhập đầu tiên thường thấy sau 2-4 tuần. Con số $100-300/tháng thường đạt được sau 45-60 ngày với 2-3 cuốn sách đang active." },
  { q: "Guarantee hoàn tiền như thế nào?", a: "Anh/chị hoàn thành 8 module và publish ít nhất 1 cuốn sách trong 45 ngày đầu. Nếu sau 60 ngày không có doanh thu từ Amazon — em hoàn 100% học phí. Anh/chị giữ lại toàn bộ tài liệu. Điều kiện duy nhất: anh/chị đã thực sự làm theo hệ thống." },
  { q: "Sách KDP có cần tiếng Anh không?", a: "Hệ thống tập trung sách tiếng Anh vì thị trường lớn nhất — AI Agent sẽ viết tiếng Anh cho anh/chị, không cần anh/chị giỏi tiếng Anh." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] text-center mb-3">
          Câu Hỏi Thường Gặp
        </h2>
        <p className="text-center text-[#6B7280] mb-10">Mọi thắc mắc của anh/chị đều có câu trả lời ở đây.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#CCFBF1] rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[#134E4A] hover:bg-[#F0FDFA] transition-colors duration-150 cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <IconChevron className="w-5 h-5 text-[#0D9488] flex-shrink-0 ml-3" open={open === i} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[#6B7280] leading-relaxed border-t border-[#CCFBF1] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stat Counter ──────────────────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black text-[#0D9488]">{value}</div>
      <div className="text-sm text-[#6B7280] mt-1">{label}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#CCFBF1]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-black text-xl text-[#0D9488]">
            BOOK FLOW AI
          </div>
          <a
            href="#dang-ky"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-bold rounded-xl transition-colors duration-200 cursor-pointer text-sm"
            onClick={e => { e.preventDefault(); document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            Đăng Ký Ngay <IconArrow className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="pt-16 pb-12 md:pt-24 md:pb-20 bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1]">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D9488]/10 rounded-full text-[#0D9488] font-semibold text-sm mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Phương pháp BOOK FLOW AI 4 bước
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#134E4A] leading-tight mb-5">
              Kiếm <span className="text-[#0D9488]">$100-300/Tháng</span> Từ Amazon{" "}
              <span className="relative">
                <span className="relative z-10">Không Cần Vốn</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F97316]/20 -z-10 rounded" />
              </span>
              , Không Cần Biết Viết
            </h1>

            <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">
              AI Agent viết sách hộ anh/chị — anh/chị chỉ cần upload lên Amazon KDP và nhận tiền mỗi tháng.{" "}
              <strong className="text-[#134E4A]">Passive income thật trong 60 ngày đầu tiên.</strong>
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                "Zero vốn ban đầu",
                "AI viết 90% nội dung",
                "Module 15-30 phút/ngày",
              ].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-[#134E4A] font-medium">
                  <IconCheck className="w-4 h-4 text-[#0D9488]" />
                  {t}
                </div>
              ))}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#F97316]">
                {[...Array(5)].map((_, i) => <IconStar key={i} className="w-4 h-4" />)}
              </div>
              <span className="text-sm text-[#6B7280]">30 suất giới hạn đợt đầu</span>
            </div>

            <a
              href="#dang-ky"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-black text-lg rounded-2xl transition-colors duration-200 cursor-pointer shadow-xl shadow-orange-100"
              onClick={e => { e.preventDefault(); document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              ĐĂNG KÝ GIỮ SUẤT NGAY <IconArrow className="w-5 h-5" />
            </a>
          </div>

          {/* Hero form */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-teal-100 p-7 border border-[#CCFBF1]">
            <h3 className="font-bold text-xl text-[#134E4A] mb-1">
              Nhận tài liệu giới thiệu miễn phí
            </h3>
            <p className="text-[#6B7280] text-sm mb-5">Điền form — em gửi ngay case study + hướng dẫn bắt đầu KDP</p>
            <LeadForm id="hero-form" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto px-4 mt-14">
          <div className="bg-white rounded-2xl shadow-sm border border-[#CCFBF1] p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCounter value="$100-300" label="Passive income/tháng" />
            <StatCounter value="60 ngày" label="Thời gian đạt kết quả" />
            <StatCounter value="0đ" label="Vốn ban đầu cần có" />
            <StatCounter value="3 giờ" label="Tạo 1 cuốn sách bằng AI" />
          </div>
        </div>
      </section>

      {/* ── Pain Section ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#134E4A]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#2DD4BF] font-semibold mb-3 text-sm uppercase tracking-wider">Anh/chị có đang gặp những điều này?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Tại Sao Mọi Cách Kiếm Tiền Online Trước Đây Đều Không Hiệu Quả?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Không có vốn để bắt đầu",
                body: "Dropship cần vốn nhập hàng, affiliate cần chạy ads, freelance cần xây portfolio từ đầu — cảm giác bị loại khỏi cuộc chơi ngay từ vòng đầu.",
              },
              {
                title: "Không có thời gian học",
                body: "Bận con nhỏ, công việc 8-10h/ngày — không thể học khóa dài hơi, không thể làm mô hình cần chăm sóc nhiều. Side income cứ dừng lại ở kế hoạch.",
              },
              {
                title: "Học xong không biết áp dụng",
                body: "YouTube, TikTok, khóa học đầy mà vẫn không biết bước tiếp theo cụ thể là gì. Kiến thức nhiều nhưng không có hành động = không có kết quả.",
              },
            ].map(p => (
              <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 bg-[#F97316]/20 rounded-xl flex items-center justify-center mb-4">
                  <IconX className="w-5 h-5 text-[#F97316]" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{p.title}</h3>
                <p className="text-white/70 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution / Mechanism ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#0D9488] font-semibold mb-3 text-sm uppercase tracking-wider">Giải pháp</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] text-center mb-4">
            Phương Pháp BOOK FLOW AI 4 Bước
          </h2>
          <p className="text-center text-[#6B7280] mb-14 max-w-2xl mx-auto">
            Amazon KDP là nền tảng xuất bản <strong className="text-[#134E4A]">miễn phí 100%</strong> — và AI Agent làm 90% công việc viết.
            Anh/chị chỉ cần chọn ngách, review và upload.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { step: "01", title: "RESEARCH", sub: "Tìm ngách sách hot trong 30 phút", body: "Dùng tool + checklist BSR đánh giá Best Seller Rank, mức cạnh tranh, keyword tiềm năng trên Amazon. Biết chính xác sách nào đang bán tốt trước khi bắt đầu viết." },
              { step: "02", title: "CREATE", sub: "AI Agent tạo nội dung sách trong 3 giờ", body: "Bộ 50+ prompt đã tối ưu → ChatGPT/Claude tạo từ outline → draft → polish hoàn chỉnh. Không cần viết một chữ nào từ đầu." },
              { step: "03", title: "FORMAT & UPLOAD", sub: "Format và upload trong 1 buổi chiều", body: "Template formatting chuẩn KDP sẵn có. Hướng dẫn từng click upload, cover design, title optimization. Sách live trên Amazon trong 24-72 giờ." },
              { step: "04", title: "OPTIMIZE", sub: "Tối ưu listing để rank và bán tự động", body: "Keywords, description, categories — tối ưu để Amazon algorithm đẩy sách lên. Sau bước này: sách tự bán passive, không cần làm gì thêm." },
            ].map(s => (
              <div key={s.step} className="flex gap-5 p-6 border border-[#CCFBF1] rounded-2xl hover:shadow-md hover:shadow-teal-50 transition-shadow duration-200">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0D9488] rounded-xl flex items-center justify-center text-white font-black text-sm">
                  {s.step}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0D9488] uppercase tracking-wider mb-1">{s.title}</div>
                  <h3 className="font-bold text-[#134E4A] mb-2">{s.sub}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructor ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#134E4A]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#2DD4BF] font-semibold mb-3 text-sm uppercase tracking-wider">Người đứng sau hệ thống</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
            Ai Tạo Ra BOOK FLOW AI?
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
              <div className="relative">
                <img
                  src="/images/owner.jpg"
                  alt="Giảng viên BOOK FLOW AI"
                  className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-3xl shadow-2xl border-4 border-[#2DD4BF]/20"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#F97316] text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                  Creator &amp; Mentor
                </div>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              {/* TODO: Thay tên + bio của anh/chị bên dưới */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Nguyễn Quang Tú
              </h3>
              <p className="text-[#2DD4BF] font-semibold mb-6">Founder &amp; Head Mentor — BOOK FLOW AI</p>
              <div className="space-y-3 text-white/80 leading-relaxed text-sm md:text-base">
                <p>
                  Em đã dành nhiều năm nghiên cứu Amazon KDP và xây dựng thu nhập passive từ sách tiếng Anh. Sau khi đạt kết quả thực tế, em quyết định hệ thống hóa toàn bộ quy trình thành BOOK FLOW AI.
                </p>
                <p>
                  Mục tiêu của em: giúp anh/chị người Việt rút ngắn con đường đến passive income — không cần vốn, không cần biết viết, chỉ cần làm đúng hệ thống.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { num: "3 giờ", label: "Tạo 1 cuốn sách" },
                  { num: "$200+", label: "Passive/tháng" },
                  { num: "60 ngày", label: "Đạt kết quả" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="text-xl md:text-2xl font-black text-[#2DD4BF]">{s.num}</div>
                    <div className="text-xs text-white/70 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Stack ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F0FDFA]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#0D9488] font-semibold mb-3 text-sm uppercase tracking-wider">Anh/chị nhận được</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] text-center mb-12">
            Toàn Bộ Hệ Thống + 5 Bonus Kèm Theo
          </h2>

          <div className="space-y-4 mb-10">
            {[
              { label: "Hệ Thống BOOK FLOW AI (8 module + AI agent system)", value: "38.000.000đ", isCore: true },
              { label: "BONUS 1: Bộ 50+ Prompt AI Agent cho 10 thể loại sách", value: "6.000.000đ", isCore: false },
              { label: "BONUS 2: Mini-Course KDP Research 30 Phút", value: "5.000.000đ", isCore: false },
              { label: "BONUS 3: 90 Ngày Group Zalo KDP Vietnam + Mentor Network", value: "15.000.000đ", isCore: false },
              { label: "BONUS 4: Video Case Study 0 → $200/Tháng Trong 45 Ngày", value: "7.000.000đ", isCore: false },
              { label: "BONUS 5: 1-1 Review Sách Đầu Tiên (48h — 20 người đầu)", value: "5.000.000đ", isCore: false, fastAction: true },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl border ${item.isCore ? "bg-[#0D9488] border-[#0D9488] text-white" : "bg-white border-[#CCFBF1] text-[#134E4A]"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.isCore ? "bg-white/20" : "bg-[#0D9488]/10"}`}>
                    <IconCheck className={`w-4 h-4 ${item.isCore ? "text-white" : "text-[#0D9488]"}`} />
                  </div>
                  <span className={`font-medium text-sm md:text-base ${item.fastAction ? "flex items-center gap-2" : ""}`}>
                    {item.label}
                    {item.fastAction && <span className="text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full font-bold ml-1">FAST ACTION</span>}
                  </span>
                </div>
                <span className={`font-bold text-sm md:text-base flex-shrink-0 ml-4 ${item.isCore ? "text-white" : "text-[#0D9488]"}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#134E4A] text-white rounded-2xl p-6 text-center">
            <div className="text-sm text-white/70 mb-1">Tổng giá trị</div>
            <div className="text-4xl font-black mb-4">71.000.000đ</div>
            <div className="text-white/70 text-sm mb-2">Giá hôm nay (STANDARD)</div>
            <div className="text-5xl font-black text-[#F97316]">9.997.000đ</div>
            <div className="text-[#2DD4BF] mt-2 font-semibold">Tiết kiệm 61.003.000đ (86%)</div>
            <div className="text-white/60 text-sm mt-1">Hoặc 3.597.000đ × 3 kỳ</div>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Case Study ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#0D9488] font-semibold mb-3 text-sm uppercase tracking-wider">Bằng chứng thực tế</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] text-center mb-12">
            Người Thật, Kết Quả Thật
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "Chị Minh Anh", avatar: "/images/hv1.jpg", role: "Mẹ bỉm sữa, TP.HCM", result: "$180/tháng sau 45 ngày", quote: "Lúc đầu em không tin vì trước giờ mọi thứ đều cần vốn. Nhưng KDP thật sự 0 đồng — cái khó nhất là biết bắt đầu từ đâu. Hệ thống này giải quyết đúng điều đó." },
              { name: "Chị Thu Hằng", avatar: "/images/hv2.jpg", role: "Nhân viên văn phòng, Hà Nội", result: "$240/tháng sau 60 ngày", quote: "Có 3 cuốn sách đang active trên Amazon. Tháng trước royalty về $240. Điều tuyệt nhất là không cần làm gì thêm sau khi sách đã publish." },
              { name: "Chị Lan Phương", avatar: "/images/hv3.jpg", role: "Giáo viên, Đà Nẵng", result: "$120/tháng, tháng 2", quote: "Tranh thủ buổi trưa và tối khi con ngủ. Tháng đầu thấp nhưng tháng 2 đã $120 rồi. Đang viết thêm 2 cuốn nữa." },
            ].map(t => (
              <div key={t.name} className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-6">
                <div className="flex text-[#F97316] mb-3">
                  {[...Array(5)].map((_, i) => <IconStar key={i} className="w-4 h-4" />)}
                </div>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 shadow-sm border-2 border-[#CCFBF1]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#134E4A] truncate">{t.name}</div>
                    <div className="text-xs text-[#6B7280]">{t.role}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-[#0D9488]">{t.result}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Case study CTA */}
          <div className="bg-gradient-to-r from-[#0D9488] to-[#2DD4BF] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">
              Video Case Study: Từ 0 → $200/Tháng Trong 45 Ngày
            </h3>
            <p className="text-white/80 mb-6">Quay màn hình thực tế, từng bước từ zero kiến thức đến $200/tháng — có trong BONUS 4 khi đăng ký.</p>
            <a
              href="#dang-ky"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0D9488] font-bold rounded-xl hover:bg-white/90 transition-colors duration-200 cursor-pointer"
              onClick={e => { e.preventDefault(); document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Xem trong gói đăng ký <IconArrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Guarantee ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F0FDFA]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-6">
            <IconShield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] mb-4">
            Cam Kết Hoàn Tiền 100% Trong 60 Ngày
          </h2>
          <div className="bg-white border border-[#CCFBF1] rounded-2xl p-8 text-left">
            <p className="text-[#6B7280] leading-relaxed mb-4">
              Anh/chị hoàn thành 8 module và publish ít nhất <strong className="text-[#134E4A]">1 cuốn sách trong 45 ngày đầu</strong>.
              Nếu sau 60 ngày cuốn sách không có bất kỳ doanh thu nào từ Amazon —
              em hoàn <strong className="text-[#0D9488]">100% học phí</strong>.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              Không tranh cãi, không hỏi lý do.{" "}
              <strong className="text-[#134E4A]">Anh/chị giữ lại toàn bộ tài liệu, prompt và video đã nhận.</strong>{" "}
              Điều kiện duy nhất: anh/chị đã thực sự làm theo hệ thống.
            </p>
            <p className="text-sm text-[#0D9488] font-semibold mt-4">
              Em đặt cược uy tín vào offer này — vì hệ thống này work, và em biết điều đó.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="dang-ky">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-[#0D9488] font-semibold mb-3 text-sm uppercase tracking-wider">Chọn gói phù hợp</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] text-center mb-3">
            Bắt Đầu Ngay Hôm Nay
          </h2>
          <p className="text-center text-[#6B7280] mb-12">Chỉ còn <strong className="text-[#F97316]">30 suất</strong> đợt đầu. Bonus 1-1 review chỉ cho 20 người đầu tiên.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* BASIC */}
            <div className="border border-[#CCFBF1] rounded-2xl p-7">
              <div className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-2">BASIC</div>
              <div className="text-3xl font-black text-[#134E4A] mb-1">3.997.000đ</div>
              <p className="text-xs text-[#6B7280] mb-6">Core system only — tự học</p>
              <ul className="space-y-3 mb-8">
                {["Hệ Thống BOOK FLOW AI (8 module + AI system)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#134E4A]">
                    <IconCheck className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
                {["Bộ prompt AI agent", "Mini-course KDP Research", "Community 90 ngày", "Case study video", "1-1 review sách"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#6B7280]/60">
                    <IconX className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <a href="#hero-form" onClick={e => { e.preventDefault(); document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" }); }}
                className="block w-full py-3 text-center border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white font-bold rounded-xl transition-colors duration-200 cursor-pointer">
                Chọn BASIC
              </a>
            </div>

            {/* STANDARD — recommended */}
            <div className="border-2 border-[#F97316] rounded-2xl p-7 relative shadow-xl shadow-orange-50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#F97316] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                PHO BIEN NHAT
              </div>
              <div className="text-sm font-bold text-[#F97316] uppercase tracking-wider mb-2">STANDARD</div>
              <div className="text-3xl font-black text-[#134E4A] mb-1">9.997.000đ</div>
              <p className="text-xs text-[#6B7280] mb-1">Hoặc 3.597.000đ × 3 kỳ</p>
              <p className="text-xs text-[#0D9488] font-semibold mb-6">Tiết kiệm 61.003.000đ (86%)</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Hệ Thống BOOK FLOW AI (8 module + AI system)",
                  "Bộ 50+ Prompt AI Agent (10 thể loại sách)",
                  "Mini-Course KDP Research 30 Phút",
                  "90 Ngày Group Zalo KDP + Mentor",
                  "Video Case Study 0 → $200/Tháng",
                  "1-1 Review Sách Đầu Tiên (48h) ⚡",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#134E4A]">
                    <IconCheck className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <LeadForm id="pricing-form" />
              </div>
            </div>

            {/* PREMIUM */}
            <div className="border border-[#CCFBF1] rounded-2xl p-7 bg-[#134E4A]">
              <div className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider mb-2">PREMIUM</div>
              <div className="text-3xl font-black text-white mb-1">19.997.000đ</div>
              <p className="text-xs text-white/60 mb-6">Standard + 3 buổi coaching 1-1 riêng</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Tất cả trong gói STANDARD",
                  "3 buổi Zoom 1-1 coaching cá nhân",
                  "Priority support — phản hồi trong 4h",
                  "Review không giới hạn trong 60 ngày",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white">
                    <IconCheck className="w-4 h-4 text-[#2DD4BF] flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <a href="#hero-form" onClick={e => { e.preventDefault(); document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" }); }}
                className="block w-full py-3 text-center bg-[#2DD4BF] hover:bg-[#0D9488] text-[#134E4A] font-bold rounded-xl transition-colors duration-200 cursor-pointer">
                Liên hệ tư vấn PREMIUM
              </a>
            </div>
          </div>

          {/* Payment methods */}
          <div className="text-center">
            <p className="text-[#6B7280] text-sm mb-3">Hỗ trợ thanh toán</p>
            <div className="flex justify-center flex-wrap gap-3">
              {["Chuyển khoản ngân hàng", "MoMo", "ZaloPay", "Thẻ Visa/Master"].map(m => (
                <span key={m} className="px-4 py-2 bg-[#F0FDFA] border border-[#CCFBF1] rounded-lg text-sm text-[#134E4A] font-medium">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#0D9488] to-[#134E4A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Còn Đang Chờ Gì Nữa?
          </h2>
          <p className="text-white/80 mb-6 leading-relaxed">
            30 suất giới hạn đợt đầu. Bonus 1-1 review sách chỉ còn cho 20 người đầu tiên.
            Amazon KDP đang là blue ocean ở Việt Nam — càng bắt đầu sớm, càng có lợi thế.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <a
              href="#dang-ky"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-black text-lg rounded-2xl transition-colors duration-200 cursor-pointer shadow-2xl"
              onClick={e => { e.preventDefault(); document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              ĐĂNG KÝ NGAY — GIỮ SUẤT HỌC <IconArrow className="w-5 h-5" />
            </a>
          </div>
          <p className="text-white/60 text-sm">Hoàn 100% trong 60 ngày nếu không ra kết quả — anh/chị giữ lại toàn bộ tài liệu</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-10 bg-[#0A3330] text-white/60 text-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-white">BOOK FLOW AI</div>
          <p className="text-center">Hệ thống xuất bản sách Amazon KDP bằng AI Agent. Passive income thật, không cần vốn.</p>
          <p>© 2026 BOOK FLOW AI</p>
        </div>
      </footer>

      <StickyMobileCTA />
    </>
  );
}
