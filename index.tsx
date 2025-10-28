
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Custom hook for animating numbers
// FIX: Add types to the useCountUp hook signature and implementation to resolve type inference issues.
const useCountUp = (end: number, duration = 2000): [number, React.RefObject<HTMLDivElement>] => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        start = Math.floor(progress * end);
                        setCount(start);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return [count, ref];
};


const App = () => {
    // Header scroll effect
    useEffect(() => {
        const header = document.querySelector('.header');
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cursor trail effect
    useEffect(() => {
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        const moveCursor = (e) => {
           cursorTrail.style.left = `${e.clientX}px`;
           cursorTrail.style.top = `${e.clientY}px`;
        };
        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeChild(cursorTrail);
        }
    }, []);

    // Animation on scroll for sections
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        const elements = document.querySelectorAll('.fade-in-section');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    const handleDownload = () => {
      // Placeholder for launcher download logic
      alert('Началась загрузка лаунчера Primer MC!');
    };

    return (
        <>
            <Header />
            <main>
                <HeroSection onDownload={handleDownload} />
                <AboutSection />
                <FeaturesSection />
                <StatsSection />
                <JoinSection onDownload={handleDownload} />
            </main>
            <Footer />
        </>
    );
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="header">
            <nav className="container">
                <a href="#hero" className="logo">Primer MC</a>
                <div className={`nav-links-wrapper ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        <li><a href="#about" onClick={() => setIsMenuOpen(false)}>О сервере</a></li>
                        <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Особенности</a></li>
                        <li><a href="#join" onClick={() => setIsMenuOpen(false)}>Как начать</a></li>
                    </ul>
                </div>
                 <button className={`burger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Открыть меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
};

const HeroSection = ({ onDownload }) => (
    <section id="hero" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
            <h1 className="main-title">
                <span>P</span><span>R</span><span>I</span><span>M</span><span>E</span><span>R</span><span>&nbsp;</span><span>M</span><span>C</span>
            </h1>
            <p className="subtitle">Создай свою легенду на поле боя.</p>
            <button onClick={onDownload} className="cta-button">
                СКАЧАТЬ ЛАУНЧЕР
            </button>
        </div>
    </section>
);

const AboutSection = () => (
     <section id="about" className="content-section fade-in-section">
        <div className="container">
            <h2 className="section-title">ПОГРУЗИСЬ В ЗОНУ БОЕВЫХ ДЕЙСТВИЙ</h2>
            <p className="section-text">
                Primer MC — это не просто сервер. Это уникальная вселенная, где стратегия, тактика и командная работа решают всё. Мы создали мир, наполненный современным оружием, военной техникой и захватывающими PVE и PVP режимами. Вступай в ряды лучших бойцов и докажи своё превосходство!
            </p>
        </div>
    </section>
);

const FeatureCard = ({ icon, title, children }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{children}</p>
    </div>
);


const FeaturesSection = () => (
    <section id="features" className="content-section features-bg fade-in-section">
        <div className="container">
            <h2 className="section-title">КЛЮЧЕВЫЕ ОСОБЕННОСТИ</h2>
            <div className="features-grid">
                <FeatureCard icon="🔫" title="Арсенал Оружия">
                    Огромный выбор реалистичного огнестрельного оружия с уникальными характеристиками и модулями.
                </FeatureCard>
                <FeatureCard icon="🚁" title="Военная Техника">
                    Управляй танками, вертолётами и другой техникой, чтобы получить тактическое преимущество.
                </FeatureCard>
                 <FeatureCard icon="🎖️" title="Система Рангов">
                    Проходи службу, получай звания и открывай доступ к новому снаряжению и возможностям.
                </FeatureCard>
                 <FeatureCard icon="🗺️" title="Уникальные Карты">
                    Сражайся на тщательно проработанных локациях, от городских руин до секретных военных баз.
                </FeatureCard>
                 <FeatureCard icon="👥" title="Кланы и Войны">
                    Создавай свой клан, объявляй войны, захватывай территории и доминируй на сервере.
                </FeatureCard>
                 <FeatureCard icon="🎯" title="Игровые Режимы">
                    Участвуй в разнообразных режимах: от классического Team Deathmatch до спецопераций.
                </FeatureCard>
            </div>
        </div>
    </section>
);

const StatItem = ({ value, label }) => {
    const [count, ref] = useCountUp(value);
    return (
        <div className="stat-item" ref={ref}>
            <span className="stat-number">{count}+</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

const StatsSection = () => (
    <section id="stats" className="content-section fade-in-section">
        <div className="container">
            <h2 className="section-title">СЕРВЕР В ЦИФРАХ</h2>
            <div className="stats-grid">
                <StatItem value={500} label="Игроков онлайн" />
                <StatItem value={15000} label="Уникальных бойцов" />
                <StatItem value={350} label="Активных кланов" />
                <StatItem value={50} label="Видов оружия" />
            </div>
        </div>
    </section>
);


const JoinSection = ({ onDownload }) => (
     <section id="join" className="content-section fade-in-section">
        <div className="container text-center">
            <h2 className="section-title">ПРИСОЕДИНЯЙСЯ К СРАЖЕНИЮ</h2>
             <p className="section-text">Готов начать свою военную карьеру? Скачай наш официальный лаунчер, чтобы получить максимум удовольствия от игры!</p>
            <button onClick={onDownload} className="cta-button large">
                ЗАГРУЗИТЬ ЛАУНЧЕР PRIMER MC
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <p>&copy; {new Date().getFullYear()} Primer MC. Все права защищены.</p>
            <p>Сервер Minecraft не связан с Mojang AB.</p>
        </div>
    </footer>
);


const styles = `
:root {
  --bg-color: #0d0c1d;
  --primary-color: #3d348b;
  --secondary-color: #7678ed;
  --accent-color: #9f5f80;
  --text-color: #f4f4f9;
  --glow-color: rgba(118, 120, 237, 0.7);
  --title-font: 'Staatliches', cursive;
  --body-font: 'Roboto', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--body-font);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Cursor */
.cursor-trail {
    width: 10px;
    height: 10px;
    background-color: var(--secondary-color);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s;
    box-shadow: 0 0 15px var(--secondary-color), 0 0 25px var(--secondary-color);
}
body:hover .cursor-trail {
    opacity: 1;
}

/* Header */
.header {
  background-color: rgba(13, 12, 29, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem 0;
  position: fixed;
  width: 100%;
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.header.scrolled {
    padding: 1rem 0;
    background-color: rgba(13, 12, 29, 0.95);
    border-bottom: 1px solid var(--primary-color);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-family: var(--title-font);
    font-size: 2rem;
    color: var(--secondary-color);
    text-decoration: none;
    letter-spacing: 2px;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
}

.nav-links a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
    position: relative;
    padding-bottom: 5px;
}
.nav-links a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--secondary-color);
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
}

.nav-links a:hover {
    color: var(--secondary-color);
}
.nav-links a:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}


/* Hero Section */
.hero-section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    background-image: url('https://images.unsplash.com/photo-1593431188448-a78a23a3f019?q=80&w=2670&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(13, 12, 29, 0.8), rgba(61, 52, 139, 0.7));
}

.hero-content {
    position: relative;
    z-index: 2;
}

.main-title {
    font-family: var(--title-font);
    font-size: 7rem;
    letter-spacing: 0.5rem;
    color: var(--text-color);
    text-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color);
}
.main-title span {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    animation: revealTitle 0.5s forwards;
}
.main-title span:nth-child(1) { animation-delay: 0.1s; }
.main-title span:nth-child(2) { animation-delay: 0.2s; }
.main-title span:nth-child(3) { animation-delay: 0.3s; }
.main-title span:nth-child(4) { animation-delay: 0.4s; }
.main-title span:nth-child(5) { animation-delay: 0.5s; }
.main-title span:nth-child(6) { animation-delay: 0.6s; }
.main-title span:nth-child(7) { animation-delay: 0.7s; }
.main-title span:nth-child(8) { animation-delay: 0.8s; }
.main-title span:nth-child(9) { animation-delay: 0.9s; }


@keyframes revealTitle {
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}


.subtitle {
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
    color: var(--secondary-color);
    opacity: 0;
    animation: fadeIn 1s 1s forwards;
}

.cta-button {
    background: var(--secondary-color);
    color: var(--text-color);
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px var(--glow-color);
    animation: pulse 2s infinite, fadeIn 1s 1.2s forwards;
    opacity: 0;
}

.cta-button.large {
    padding: 1.2rem 3rem;
    font-size: 1.4rem;
}

.cta-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px var(--glow-color), 0 0 40px var(--secondary-color);
}

/* Content Sections */
.content-section {
    padding: 6rem 0;
}

.section-title {
    font-family: var(--title-font);
    font-size: 3.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--secondary-color);
    letter-spacing: 3px;
}

.section-text {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.1rem;
    text-align: center;
    line-height: 1.8;
}

.features-bg {
    background-color: rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
}
.features-bg::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: linear-gradient(45deg, var(--primary-color) 25%, transparent 25%), linear-gradient(-45deg, var(--primary-color) 25%, transparent 25%);
    background-size: 20px 20px;
    opacity: 0.05;
}


.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 4rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    border: 1px solid var(--primary-color);
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
}

.feature-card::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, var(--glow-color) 0%, transparent 40%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
    opacity: 0;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 30px rgba(61, 52, 139, 0.5);
    border-color: var(--secondary-color);
}

.feature-card:hover::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
}


.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
}

.feature-card h3 {
    font-family: var(--title-font);
    font-size: 1.8rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
     position: relative;
    z-index: 2;
}
.feature-card p {
     position: relative;
    z-index: 2;
}

/* Stats Section */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 4rem;
    text-align: center;
}

.stat-item {
    padding: 2rem 1rem;
}

.stat-number {
    font-family: var(--title-font);
    font-size: 4rem;
    color: var(--secondary-color);
    display: block;
    text-shadow: 0 0 10px var(--glow-color);
}

.stat-label {
    font-size: 1.1rem;
    color: #aaa;
}


/* Join Section */
.text-center { text-align: center; }

/* Footer */
.footer {
    background-color: #06050e;
    text-align: center;
    padding: 2rem 0;
    font-size: 0.9rem;
    color: #888;
    border-top: 1px solid var(--primary-color);
}

/* Animations */
@keyframes fadeIn {
    to {
        opacity: 1;
    }
}


@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px var(--glow-color);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 25px var(--glow-color);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px var(--glow-color);
  }
}

.fade-in-section {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-section.visible {
    opacity: 1;
    transform: translateY(0);
}


/* Responsive Design */
.burger-menu {
    display: none;
    z-index: 1001;
}

@media (max-width: 768px) {
    .main-title { font-size: 4rem; }
    .subtitle { font-size: 1.2rem; }
    .section-title { font-size: 2.5rem; }
    
    .nav-links-wrapper {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100vh;
        background-color: rgba(13, 12, 29, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: right 0.4s ease-in-out;
    }
    
    .nav-links-wrapper.active {
        right: 0;
    }
    
    .nav-links {
        flex-direction: column;
        text-align: center;
        gap: 2.5rem;
    }
    .nav-links a {
        font-size: 2rem;
    }
    
    .burger-menu {
        display: block;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .burger-menu span {
        display: block;
        width: 25px;
        height: 3px;
        background-color: var(--text-color);
        border-radius: 3px;
        transition: all 0.3s ease-in-out;
    }
    
    .burger-menu.active span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    .burger-menu.active span:nth-child(2) {
        opacity: 0;
    }
     .burger-menu.active span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);