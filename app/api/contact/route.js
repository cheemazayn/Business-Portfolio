import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { name, email, service, message, website } = await req.json();
    if (website) return Response.json({ ok: true }); // honeypot
    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
    }
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return Response.json({ ok: false, error: "Email is not configured yet." }, { status: 500 });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    await transporter.sendMail({
      from: `"Website Inquiry" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New inquiry from ${name}${service ? " – " + service : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service || "-"}\n\n${message}`,
      html: `<h3>New website inquiry</h3><p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Service:</b> ${esc(service || "-")}</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: "Could not send message. Please try again." }, { status: 500 });
  }
}
