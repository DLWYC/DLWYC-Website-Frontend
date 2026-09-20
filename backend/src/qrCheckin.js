/**
 * QR check-in payload parsing + attendee resolution (pure helpers, no I/O).
 *
 * Current QR format (the uniqueId is no longer encoded in the QR):
 *
 *   DLWYC-CHKIN|<fullName>|<eventId>
 *
 * The attendee is resolved by full name WITHIN that event (case- and
 * whitespace-insensitive). If two attendees in the same event share that
 * name the scan must be rejected as `ambiguous` — never guess.
 *
 * Legacy formats are still accepted and resolve by uniqueId (a uniqueId in
 * the payload always wins over the name):
 *
 *   DLWYC-CHKIN|<eventId>|<uniqueId>
 *   DLWYC-CHKIN|<fullName>|<eventId>|<uniqueId>
 *   DLWYC-CHKIN|<uniqueId>
 *
 * A JSON payload { "fullName", "eventId" } (or legacy
 * { "eventId", "uniqueId" }) is accepted too.
 */

export const QR_PREFIX = 'DLWYC-CHKIN';

/** Case/whitespace-insensitive name key: trim + collapse inner spaces + lowercase. */
export function normalizeName(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse a raw payload into a descriptor (no DB access):
 *   { format: 'name',     fullName, eventId }           — current format
 *   { format: 'uniqueId', uniqueId, eventId, fullName } — legacy formats
 *   { format: 'pipe3',    a, b }  — 3-part pipe payload. Text alone cannot
 *     tell legacy `eventId|uniqueId` from current `fullName|eventId`; the
 *     resolver disambiguates against the DB (a matching uniqueId wins).
 * Returns null when the text is not a DLWYC check-in code.
 */
export function parseCheckinPayload(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;

  // JSON form: {"fullName":"...","eventId":"..."} or legacy {"eventId":"...","uniqueId":"..."}
  if (text.startsWith('{')) {
    try {
      const obj = JSON.parse(text);
      const uniqueId = String(
        obj.uniqueId || obj.uid || obj.userId || '',
      ).trim();
      const fullName = String(obj.fullName || obj.name || '').trim();
      const eventId = String(
        obj.eventId || obj.event_id || obj.event || '',
      ).trim();
      if (uniqueId)
        return {
          format: 'uniqueId',
          uniqueId: uniqueId.toUpperCase(),
          eventId,
          fullName,
        };
      if (fullName) return { format: 'name', fullName, eventId };
      return null;
    } catch {
      return null;
    }
  }

  const parts = text.split('|').map((s) => s.trim());
  if ((parts[0] || '').toUpperCase() !== QR_PREFIX) return null;

  // Legacy lenient form: prefix + uniqueId only (no event).
  if (parts.length === 2 && parts[1]) {
    return {
      format: 'uniqueId',
      uniqueId: parts[1].toUpperCase(),
      eventId: '',
      fullName: '',
    };
  }
  // Legacy: prefix + fullName + eventId + uniqueId (uniqueId wins).
  if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
    return {
      format: 'uniqueId',
      uniqueId: parts[3].toUpperCase(),
      eventId: parts[2],
      fullName: parts[1],
    };
  }
  // Ambiguous at the text level — resolver disambiguates with the DB.
  // Field b keeps its original case: it may be an eventId (current format).
  if (parts.length === 3 && parts[1] && parts[2]) {
    return { format: 'pipe3', a: parts[1], b: parts[2] };
  }
  return null;
}

/**
 * Resolve an attendee for a POST /qr/scan body.
 *
 * @param {{ events: Array, attendees: Array }} db  the data store
 * @param {{ payload?: string, eventId?: string, uniqueId?: string, fullName?: string }} body
 * @returns one of:
 *   { status: 'resolved',  attendee, qrName, eventId }
 *   { status: 'notFound',  message, qrName, uid, eventTitle }
 *   { status: 'ambiguous', message, qrName, eventTitle, matches }
 *   { status: 'invalid' }
 *
 * `qrName` is the name encoded in the QR itself ('' for uniqueId-only
 * payloads) — recorded as `qrName` in the scan log for the audit trail.
 *
 * Resolution rules:
 *   - If the payload carries a uniqueId (any legacy format, or a structured
 *     body with both) the uniqueId wins: resolve by uniqueId, ignore the name.
 *   - Otherwise resolve the full name within the QR's event, case- and
 *     whitespace-insensitively. Zero matches → notFound; more than one →
 *     ambiguous (never guess).
 */
export function resolveQrScan(db, body = {}) {
  let parsed = null;
  if (body.payload) {
    parsed = parseCheckinPayload(body.payload);
  } else {
    // Structured body (no raw payload text).
    const uniqueId = String(body.uniqueId || '')
      .trim()
      .toUpperCase();
    const fullName = String(body.fullName || '').trim();
    const eventId = String(body.eventId || '').trim();
    if (uniqueId) parsed = { format: 'uniqueId', uniqueId, eventId, fullName };
    else if (fullName) parsed = { format: 'name', fullName, eventId };
  }

  if (!parsed) return { status: 'invalid' };

  const findEvent = (id) =>
    db.events.find((e) => e._id === id || e.eventTitle === id);

  // --- Legacy: resolve by uniqueId (uniqueId wins over any name in the QR). ---
  const resolveByUniqueId = () => {
    const attendee = db.attendees.find(
      (a) => (a.uniqueId || '').toUpperCase() === parsed.uniqueId,
    );
    if (!attendee) {
      return {
        status: 'notFound',
        message: 'No attendee found for this QR code',
        qrName: parsed.fullName || '',
        uid: parsed.uniqueId,
        eventTitle: parsed.eventId || '',
      };
    }
    return {
      status: 'resolved',
      attendee,
      qrName: parsed.fullName || '',
      eventId: parsed.eventId || '',
    };
  };

  if (parsed.format === 'uniqueId') return resolveByUniqueId();

  if (parsed.format === 'pipe3') {
    // Either legacy `DLWYC-CHKIN|<eventId>|<uniqueId>` or current
    // `DLWYC-CHKIN|<fullName>|<eventId>`. uniqueId wins: if the third field
    // matches an attendee's uniqueId, treat it as the legacy format.
    const isLegacy = db.attendees.some(
      (a) => (a.uniqueId || '').toUpperCase() === parsed.b.toUpperCase(),
    );
    if (isLegacy) {
      parsed = {
        format: 'uniqueId',
        uniqueId: parsed.b.toUpperCase(),
        eventId: parsed.a,
        fullName: '',
      };
      return resolveByUniqueId();
    }
    parsed = { format: 'name', fullName: parsed.a, eventId: parsed.b };
  }

  // --- Current: resolve by name within the QR's event. ---
  const qrName = parsed.fullName;
  const event = findEvent(parsed.eventId);
  if (!event) {
    return {
      status: 'notFound',
      message: 'No event found for this QR code',
      qrName,
      uid: '',
      eventTitle: parsed.eventId || '',
    };
  }

  const nameKey = normalizeName(qrName);
  const matches = db.attendees.filter(
    (a) =>
      a.eventDetails?.eventTitle === event.eventTitle &&
      normalizeName(a.fullName) === nameKey,
  );

  if (matches.length === 0) {
    return {
      status: 'notFound',
      message: `No attendee named "${qrName}" is registered for ${event.eventTitle}`,
      qrName,
      uid: '',
      eventTitle: event.eventTitle,
    };
  }
  if (matches.length > 1) {
    return {
      status: 'ambiguous',
      message:
        `The name "${qrName}" matches ${matches.length} attendees in ${event.eventTitle}. ` +
        'The scan was rejected — check this attendee in by their card or unique ID instead.',
      qrName,
      eventTitle: event.eventTitle,
      matches,
    };
  }
  return {
    status: 'resolved',
    attendee: matches[0],
    qrName,
    eventId: parsed.eventId,
  };
}
