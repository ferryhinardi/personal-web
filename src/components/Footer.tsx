import type { MainData } from '@/types/resume.types';

interface FooterProps {
  data?: MainData;
}

export default function Footer({ data }: FooterProps) {
  if (!data) return null;

  const { social } = data;

  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            {social.map((network) => (
              <li key={network.name}>
                <a href={network.url} aria-label={network.name}>
                  <i className={network.className}></i>
                </a>
              </li>
            ))}
          </ul>

          <ul className="copyright">
            <li>&copy; Copyright 2017 Tim Baker</li>
            <li>
              Design by{' '}
              <a title="Styleshout" href="http://www.styleshout.com/">
                Styleshout
              </a>
            </li>
          </ul>
        </div>
        <div id="go-top">
          <a className="smoothscroll" title="Back to Top" href="#home">
            <i className="icon-up-open"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
