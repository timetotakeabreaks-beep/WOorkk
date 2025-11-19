// app/contact/page.tsx
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* SIMPLE NAV */}
        <header className="nav">
          <div className="logo-text">
            <span className="logo-title">SixtyScan</span>
          </div>

          <nav className="nav-links">
            <Link href="/">หน้าแรก</Link>
            <Link href="/about">เกี่ยวกับเรา</Link>
          </nav>
        </header>

        <section className="section section-alt contact-page">
          <h1 className="section-title large">ติดต่อเรา</h1>

          <div className="contact-grid contact-grid-large">
            <div className="contact-card">
              <p className="contact-label big">ที่อยู่</p>
              <p className="contact-text bigger strong">
                121/11 อาคารอีคิวสแควร์ ถนนเชียงใหม่–ฮอด ตำบลป่าแดด
                อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50100
              </p>
            </div>

            <div className="contact-card">
              <p className="contact-label big">โทรศัพท์</p>
              <p className="contact-phone contact-phone-big">064-9506228</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SixtyScan.life</p>
        </footer>
      </div>
    </main>
  );
}
