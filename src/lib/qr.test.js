import { describe, it, expect } from 'vitest';
import { QR_PREFIX, buildQrPayload, parseQrPayload } from './qr';

describe('buildQrPayload (current format: fullName + eventId)', () => {
  it('builds DLWYC-CHKIN|<fullName>|<eventId>', () => {
    expect(buildQrPayload('Grace Osei', 'evt-camp')).toBe(
      'DLWYC-CHKIN|Grace Osei|evt-camp',
    );
  });

  it('trims both fields', () => {
    expect(buildQrPayload('  Grace Osei ', ' evt-camp ')).toBe(
      'DLWYC-CHKIN|Grace Osei|evt-camp',
    );
  });

  it('strips pipe characters from the name so the payload structure stays intact', () => {
    expect(buildQrPayload('O|Brien', 'evt-camp')).toBe(
      'DLWYC-CHKIN|O Brien|evt-camp',
    );
  });
});

describe('parseQrPayload — current format', () => {
  it('parses DLWYC-CHKIN|<fullName>|<eventId>', () => {
    expect(parseQrPayload('DLWYC-CHKIN|Grace Osei|evt-camp')).toEqual({
      format: 'name',
      fullName: 'Grace Osei',
      eventId: 'evt-camp',
      uniqueId: '',
    });
  });

  it('parses the JSON form {"fullName","eventId"}', () => {
    expect(
      parseQrPayload('{"fullName":"Grace Osei","eventId":"evt-camp"}'),
    ).toEqual({
      format: 'name',
      fullName: 'Grace Osei',
      eventId: 'evt-camp',
      uniqueId: '',
    });
  });
});

describe('parseQrPayload — legacy formats still accepted', () => {
  it('parses legacy DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId> by uniqueId', () => {
    expect(
      parseQrPayload('DLWYC-CHKIN|Grace Osei|evt-camp|DLW/04/2026/0015'),
    ).toEqual({
      format: 'uniqueId',
      uniqueId: 'DLW/04/2026/0015',
      eventId: 'evt-camp',
      fullName: 'Grace Osei',
    });
  });

  it('parses legacy lenient DLWYC-CHKIN|<uniqueId>', () => {
    expect(parseQrPayload('DLWYC-CHKIN|DLW/04/2026/0015')).toEqual({
      format: 'uniqueId',
      uniqueId: 'DLW/04/2026/0015',
      eventId: '',
      fullName: '',
    });
  });

  it('parses the legacy JSON form {"eventId","uniqueId"}', () => {
    expect(
      parseQrPayload('{"eventId":"evt-camp","uniqueId":"DLW/04/2026/0015"}'),
    ).toEqual({
      format: 'uniqueId',
      uniqueId: 'DLW/04/2026/0015',
      eventId: 'evt-camp',
      fullName: '',
    });
  });

  it('treats a legacy 3-part payload as a valid code (the backend disambiguates it)', () => {
    // `DLWYC-CHKIN|<eventId>|<uniqueId>` is textually indistinguishable from
    // the current name format — the frontend only gates on it being a DLWYC
    // code and forwards the raw text; the backend resolves it data-driven.
    const parsed = parseQrPayload('DLWYC-CHKIN|evt-camp|DLW/04/2026/0015');
    expect(parsed).not.toBeNull();
    expect(parsed.fullName || parsed.uniqueId).toBeTruthy();
  });
});

describe('parseQrPayload — rejections', () => {
  it('rejects non-DLWYC text', () => {
    expect(parseQrPayload('hello world')).toBeNull();
    expect(parseQrPayload('SOME-OTHER|1|2')).toBeNull();
  });

  it('rejects empty and malformed payloads', () => {
    expect(parseQrPayload('')).toBeNull();
    expect(parseQrPayload(null)).toBeNull();
    expect(parseQrPayload('DLWYC-CHKIN')).toBeNull();
    expect(parseQrPayload('DLWYC-CHKIN|')).toBeNull();
    expect(parseQrPayload('{not json}')).toBeNull();
    expect(parseQrPayload('{"unrelated":true}')).toBeNull();
  });
});

describe('round trip', () => {
  it('parse(build(x)) keeps the name + event', () => {
    const raw = buildQrPayload('Timilehin Adebayo', 'evt-camp');
    expect(raw.startsWith(`${QR_PREFIX}|`)).toBe(true);
    const parsed = parseQrPayload(raw);
    expect(parsed.format).toBe('name');
    expect(parsed.fullName).toBe('Timilehin Adebayo');
    expect(parsed.eventId).toBe('evt-camp');
  });
});
