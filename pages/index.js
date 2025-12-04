import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>بيت الريف - تطبيق المنصة الذكية</title>
        <meta name="description" content="تطبيق بيت الريف - منصة البناء والتصميم الذكية في الإمارات" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Logo and Header */}
          <div className={styles.header}>
            <h1 className={styles.logo}>🏗️ بيت الريف</h1>
            <p className={styles.subtitle}>منصة البناء والتصميم الذكية</p>
          </div>

          {/* Welcome Message */}
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>أهلاً بك في بيت الريف</h2>
            <p className={styles.welcomeText}>
              منصة متكاملة تجمع بين التصميم المعماري، إدارة المشاريع، والتواصل الفوري مع أفضل المقاولين والمصممين في الإمارات.
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className={styles.comingSoonSection}>
            <div className={styles.comingSoonBox}>
              <h3 className={styles.comingSoonTitle}>🚀 قريباً سيكون متاح</h3>
              <p className={styles.comingSoonText}>
                نحن نعمل بجد على تطوير تطبيق بيت الريف ليوفر لك أفضل تجربة في إدارة مشاريعك.
              </p>
              <p className={styles.comingSoonSubtext}>
                سيتم إطلاق التطبيق قريباً جداً. ترقب الأخبار!
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>ما الذي ستحصل عليه:</h3>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>ربط مباشر مع أفضل المقاولين والمصممين</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>إدارة ذكية للمشاريع والميزانيات</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>مساعد ذكاء اصطناعي "وياك" للاستشارات الفورية</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>سوق متكامل للمواد والأثاث والديكور</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>متابعة شاملة وتقارير مفصلة</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>دعم 24/7 من فريق متخصص</span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className={styles.downloadSection}>
            <h3 className={styles.downloadTitle}>سيكون التطبيق متاحاً على:</h3>
            <div className={styles.downloadButtons}>
              <button className={styles.downloadBtn} disabled>
                <span className={styles.downloadIcon}>🍎</span>
                <span>App Store</span>
              </button>
              <button className={styles.downloadBtn} disabled>
                <span className={styles.downloadIcon}>🤖</span>
                <span>Google Play</span>
              </button>
            </div>
            <p className={styles.downloadNote}>
              سيتم تفعيل أزرار التحميل عند إطلاق التطبيق
            </p>
          </div>

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              في الوقت الحالي، يمكنك استكشاف خدماتنا من خلال
            </p>
            <a href="https://bietalreef.ae" className={styles.ctaButton}>
              موقع بيت الريف الرئيسي
            </a>
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>© 2024 بيت الريف - جميع الحقوق محفوظة</p>
            <p className={styles.footerText}>
              منصة البناء والتصميم الذكية في الإمارات
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
