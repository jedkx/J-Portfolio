import { ArrowUpRight } from 'lucide-react';
import { SecretWords } from '@/components/game/SecretGame';
import { EXPERIENCE, EDUCATION } from '@/constants/data';
import { CV_DRIVE_FILE_ID } from '@/constants/config';

export const BackgroundSection = () => (
  <section id="cv" className="experience-resume editorial-shell" aria-labelledby="resume-title">
    <div>
      <span className="micro-label muted">
        <SecretWords id="resume" text="EXPERIENCE & EDUCATION" />
      </span>
      <h2 id="resume-title">Background</h2>
    </div>
    <div className="resume-summary">
      <p>
        <strong>{EXPERIENCE[0].role}</strong>
        <span>
          {EXPERIENCE[0].company} · {EXPERIENCE[0].period}
        </span>
      </p>
      <p>
        <strong>{EDUCATION[0].degree}</strong>
        <span>
          {EDUCATION[0].school} · {EDUCATION[0].period}
        </span>
      </p>
    </div>
    <a
      href={`https://drive.google.com/file/d/${CV_DRIVE_FILE_ID}/view`}
      target="_blank"
      rel="noopener noreferrer"
      className="signal-link hoverable"
    >
      VIEW MY CV <ArrowUpRight size={25} />
    </a>
  </section>
);
