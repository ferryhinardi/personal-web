import parser from 'html-react-parser';
import type { MainData } from '@/types/resume.types';

interface AboutProps {
  data?: MainData;
}

export default function About({ data }: AboutProps) {
  if (!data) return null;

  const { name, image, bio, address, phone, email, resumedownload } = data;
  const profilepic = `images/${image}`;

  return (
    <section id="about">
      <div className="row">
        <div className="three columns">
          <img
            className="profile-pic"
            src={profilepic}
            alt="Ferry Hinardi Profile Pic"
          />
        </div>
        <div className="nine columns main-col">
          <h2>About Me</h2>

          {bio && <p>{parser(bio)}</p>}
          <div className="row">
            <div className="columns contact-details">
              <h2>Contact Details</h2>
              <p className="address">
                <span>{name}</span>
                <br />
                <span>
                  {address.street}
                  <br />
                  {address.city} {address.state}, {address.zip}
                </span>
                <br />
                <span>{phone}</span>
                <br />
                <span>{email}</span>
              </p>
            </div>
            <div className="columns download">
              <p>
                <a href={resumedownload} className="button">
                  <i className="fa fa-download"></i>Download Resume
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
