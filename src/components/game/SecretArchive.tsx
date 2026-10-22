import React, { useEffect, useRef, useState } from 'react';
import { useSecretGame } from './SecretGame';
import { usePrefersReducedMotion } from '@/hooks';
import { ARCHIVE_PASSPHRASE_HASHES } from '@/constants/secret';
import { ContactTuner } from '@/components/sections/ContactTuner';

export const SecretArchive: React.FC = () => {
  const {
    fragments,
    found,
    openResident,
    openResidentWithPassphrase,
    residentOpen,
    showHint,
    unlockRadar,
  } = useSecretGame();
  const [input, setInput] = useState('');
  const [signalLocked, setSignalLocked] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'decrypting' | 'revealing' | 'open'>('idle');
  const [overrideAccepted, setOverrideAccepted] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const accepted = fragments.filter((fragment) => found.includes(fragment.id));
  const ready = accepted.length === 5 && signalLocked;
  useEffect(() => {
    if (phase !== 'idle' || !input.trim()) return;
    let live = true;
    const timer = window.setTimeout(() => {
      const normalized = input
        .normalize('NFKC')
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, '');
      void crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(normalized))
        .then((buffer) => {
          const hash = [...new Uint8Array(buffer)]
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
          if (live && ARCHIVE_PASSPHRASE_HASHES.includes(hash)) {
            setOverrideAccepted(true);
            setPhase('decrypting');
          }
        })
        .catch(() => {
          /* The regular five-key route remains available. */
        });
    }, 180);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [input, phase]);
  useEffect(() => {
    if (phase !== 'decrypting') return;
    const timer = window.setTimeout(
      () => {
        setPhase('revealing');
        if (overrideAccepted) openResidentWithPassphrase();
        else openResident();
      },
      reduced ? 0 : 2200
    );
    return () => window.clearTimeout(timer);
  }, [phase, reduced, openResident, openResidentWithPassphrase, overrideAccepted]);
  useEffect(() => {
    if (phase === 'revealing' && !residentOpen) setPhase('open');
  }, [phase, residentOpen]);
  useEffect(() => {
    if (phase === 'open') {
      title.current?.focus({ preventScroll: true });
    }
  }, [phase, openResident]);
  return (
    <section
      id="whos-there"
      className={`secret-archive archive-${phase}`}
      aria-labelledby="secret-archive-title"
      data-secret-ui
    >
      <div className="secret-archive-heading">
        <h3 id="secret-archive-title">WHO’S THERE?</h3>
        <span>{phase === 'open' ? 'RESIDENT FOUND' : `${found.length} / 5 FOUND`}</span>
      </div>
      {phase === 'open' ? (
        <div className="secret-room resident-result">
          <div className="resident-result-copy">
            <span className="secret-eyebrow">OUR LITTLE SECRET</span>
            <h4 ref={title} tabIndex={-1}>
              {overrideAccepted ? 'You knew the words.' : 'You found me.'}
            </h4>
            <p>
              {overrideAccepted
                ? 'A familiar voice on a private channel.'
                : 'You followed every trace. I wasn’t expecting that.'}
              <br />
              You can visit. Just keep it between us.
            </p>
            <div className="resident-return-passphrase">
              <span>YOUR WAY BACK</span>
              <code>who’s there?</code>
              <p>Use this passphrase in Alternate access next time.</p>
            </div>
            <button type="button" className="secret-action hoverable" onClick={openResident}>
              SAY HELLO AGAIN <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="secret-receiver-layout">
          <div className="secret-receiver-intro">
            <span className="secret-eyebrow">PRIVATE CHANNEL / 005</span>
            <h4>
              Who’s there<span className="accent">?</span>
            </h4>
            <p>Five fragments. One clean signal.</p>
            <button type="button" className="secret-receiver-help hoverable" onClick={showHint}>
              Where do I start? <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="receiver-instrument">
            <ContactTuner
              reduced={reduced}
              onLock={(locked) => {
                setSignalLocked(locked);
                if (locked) unlockRadar();
              }}
            />
            <div className="secret-channel-state" data-locked={signalLocked}>
              <i aria-hidden="true" /> {signalLocked ? 'SIGNAL CONNECTED' : 'AWAITING SIGNAL'}
            </div>
          </div>
          <div className="secret-receiver-console">
            <div className="secret-key-field">
              RECOVERED SIGNALS <span>{accepted.length.toString().padStart(2, '0')} / 05</span>
            </div>
            <ol
              className="secret-auto-keys"
              aria-label="Automatically collected keys"
              aria-live="polite"
              aria-relevant="text additions"
            >
              {fragments.map((fragment) => (
                <li key={fragment.id} className={found.includes(fragment.id) ? 'is-received' : ''}>
                  <span>0{fragment.id}</span>
                  {found.includes(fragment.id) ? (
                    <code data-key-cursor="true">{fragment.key}</code>
                  ) : (
                    <span className="secret-key-waiting">Undiscovered</span>
                  )}
                  <span aria-hidden="true">{found.includes(fragment.id) ? '✓' : '—'}</span>
                </li>
              ))}
            </ol>
            <p className="secret-auto-note">Found fragments arrive here automatically.</p>
            <div className="secret-receiver-bottom">
              <span id="secret-receiver-status" role="status">
                {phase === 'decrypting'
                  ? overrideAccepted
                    ? 'LOCAL OVERRIDE ACCEPTED / DECRYPTING…'
                    : 'DECRYPTING LOCAL ARCHIVE…'
                  : !signalLocked
                    ? 'SIGNAL REQUIRED · TUNE THE RECEIVER'
                    : accepted.length < 5
                      ? `${accepted.length} / 5 KEYS VERIFIED`
                      : 'SIGNAL LOCKED / READY'}
              </span>
              <button
                type="button"
                className="secret-action hoverable"
                disabled={!ready || phase !== 'idle'}
                onClick={() => {
                  if (ready) setPhase('decrypting');
                }}
              >
                {phase === 'decrypting' ? 'DECRYPTING…' : 'DECRYPT ↗'}
              </button>
            </div>
            {phase === 'decrypting' && (
              <div className="secret-decrypt-progress" aria-hidden="true">
                <span />
              </div>
            )}
            <details className="secret-override">
              <summary>Alternate access</summary>
              <label htmlFor="secret-override-input">Passphrase</label>
              <input
                id="secret-override-input"
                type="password"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                disabled={phase !== 'idle'}
              />
            </details>
          </div>
        </div>
      )}
    </section>
  );
};
