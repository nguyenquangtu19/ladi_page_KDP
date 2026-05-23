import { NextRequest, NextResponse } from "next/server";

const phoneRegex = /^(0|\+84)[0-9]{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Tên không hợp lệ" }, { status: 400 });
    }
    if (!phone || !phoneRegex.test(phone.trim())) {
      return NextResponse.json({ error: "Số điện thoại không hợp lệ (VD: 0901234567)" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }

    const lead = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      source: "landing-page",
      created_at: new Date().toISOString(),
    };

    console.log("[LEAD]", lead);

    // TODO: wire biz-email-setup (SMTP auto-responder) + biz-setup-sepay-payment

    return NextResponse.json({ success: true, message: "Đăng ký thành công! Em sẽ liên hệ anh/chị sớm." });
  } catch {
    return NextResponse.json({ error: "Lỗi server, vui lòng thử lại" }, { status: 500 });
  }
}
