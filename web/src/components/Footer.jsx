import "./Footer.scss";
import Logo from "../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__signature">
        <span>&gt; CREATED BY</span>
        <a href="https://thecodeofsp.fr" target="_blank" rel="noreferrer" aria-label="Site The Code of SP">
          <img src={Logo} alt="" className="footer__logo" />
        </a>
      </div>

      <p className="footer__about">Un quiz personnel conçu pour découvrir les univers qui inspirent SP.</p>

      <div className="footer__links">
        <a
          href="https://github.com/TheCodeofSP"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB
        </a>
        <span className="footer__separator">•</span>
        <a
          href="https://www.instagram.com/thecodeofsp/"
          target="_blank"
          rel="noreferrer"
        >
          INSTAGRAM
        </a>
        <span className="footer__separator">•</span>
        <a
          href="https://www.linkedin.com/in/sandrinepham69132b145/"
          target="_blank"
          rel="noreferrer"
        >
          LINKEDIN
        </a>
      </div>
    </footer>
  );
}
