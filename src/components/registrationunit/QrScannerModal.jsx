import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CameraOff, RefreshCw, ScanLine, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGION_ID = 'dlw-qr-scan-region';

// Make the camera video fill the frame nicely on phones + desktops.
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  #${REGION_ID} video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
  #${REGION_ID} {
    width: 100%;
  }
`;
document.head.appendChild(styleSheet);

/**
 * In-page QR scanner — opens the device camera (phone camera, or a plugged-in
 * USB camera) and decodes check-in QR passes right inside the web page.
 *
 * No hardware is wired in: the browser's camera API does the capture, so the
 * first target (phones) works out of the box. When you plug an external
 * camera into the machine, it simply shows up in the camera list below.
 */
export default function QrScannerModal({ open, onClose, onScan }) {
  const [status, setStatus] = useState('idle'); // idle | loading | scanning | result | error
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [activeCamera, setActiveCamera] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const scannerRef = useRef(null);
  const startTokenRef = useRef(0);

  const ensureScanner = useCallback(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(REGION_ID);
    }
    return scannerRef.current;
  }, []);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isRunning()) await scanner.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  const startCamera = useCallback(
    async (cameraIdOrConstraint) => {
      const token = ++startTokenRef.current;
      await stopScanner();
      if (token !== startTokenRef.current) return; // superseded

      setStatus('loading');
      setError('');
      try {
        await ensureScanner().start(
          cameraIdOrConstraint,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const dim = Math.floor(Math.min(viewfinderWidth, viewfinderHeight));
              return { width: Math.floor(dim * 0.72), height: Math.floor(dim * 0.72) };
            },
          },
          (decodedText) => {
            // Decode success — freeze the camera and hand the code up.
            startTokenRef.current++; // cancel any in-flight restart
            stopScanner();
            setStatus('result');
            setLastResult(decodedText);
            onScan?.(decodedText);
          },
          () => {
            /* per-frame decode misses are normal — ignore */
          }
        );
        if (token === startTokenRef.current) setStatus('scanning');
      } catch (err) {
        if (token !== startTokenRef.current) return;
        const name = err?.name || err?.message || String(err);
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setError(
            'Camera permission was blocked. Allow camera access for this site, then try again.'
          );
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setError('No camera found on this device. Connect a camera and press "Start camera".');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          setError('The camera is busy in another app. Close it, then press "Start camera".');
        } else {
          setError(`Could not start the camera (${name}).`);
        }
        setStatus('error');
      }
    },
    [ensureScanner, onScan, stopScanner]
  );

  // Open: discover cameras + start with the best default (back camera on phones).
  useEffect(() => {
    if (!open) {
      startTokenRef.current++;
      stopScanner();
      setStatus('idle');
      setError('');
      setLastResult(null);
      setCameras([]);
      setActiveCamera('');
      return;
    }

    const init = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'This browser cannot access the camera here. Phone cameras need a secure ' +
            'HTTPS connection — open the portal over HTTPS (or use a computer with a ' +
            'plugged-in USB camera on localhost/HTTPS).'
        );
        setStatus('error');
        return;
      }

      setStatus('loading');
      setError('');
      let list = [];
      try {
        list = (await Html5Qrcode.getCameras()) || [];
      } catch {
        list = [];
      }

      let chosen;
      if (list.length > 0) {
        setCameras(list);
        const back = list.find((c) => /back|rear|environment/i.test(c.label || ''));
        chosen = (back || list[list.length - 1]).deviceId;
      } else {
        // No device list (some browsers) — ask for the back camera directly.
        chosen = { facingMode: 'environment' };
      }
      setActiveCamera(typeof chosen === 'string' ? chosen : '');
      await startCamera(chosen);
    };

    init();

    return () => {
      startTokenRef.current++;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Hard cleanup if the component unmounts mid-scan.
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner.stop().catch(() => {});
        try {
          scanner.clear();
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  if (!open) return null;

  const handleSwitchCamera = (value) => {
    if (!value) return;
    setActiveCamera(value);
    setLastResult(null);
    startCamera(value);
  };

  const handleScanNext = () => {
    setLastResult(null);
    const target =
      activeCamera && cameras.some((c) => c.deviceId === activeCamera)
        ? activeCamera
        : { facingMode: 'environment' };
    startCamera(target);
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 rounded-lg p-1.5">
              <ScanLine className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Scan Check-In QR</h3>
              <p className="text-xs text-gray-500">Point the camera at the attendee's QR pass</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera frame */}
        <div className="relative bg-black h-64 sm:h-80">
          <div id={REGION_ID} className="w-full h-full" />
          {status === 'scanning' && (
            <div className="absolute inset-x-0 top-2 text-center pointer-events-none">
              <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                Scanning…
              </span>
            </div>
          )}
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
              <RefreshCw className="w-7 h-7 animate-spin" />
              <p className="text-xs">Starting camera…</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Result banner */}
          {status === 'result' && lastResult && (
            <div className="border border-green-200 bg-green-50 rounded-lg px-3 py-2">
              <p className="text-xs text-green-800 font-medium">QR code captured:</p>
              <p className="text-[11px] font-mono text-green-900 break-all mt-0.5">{lastResult}</p>
            </div>
          )}

          {/* Error banner */}
          {status === 'error' && (
            <div className="border border-red-200 bg-red-50 rounded-lg px-3 py-2">
              <p className="text-xs text-red-700 flex items-start gap-2">
                <CameraOff className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </p>
            </div>
          )}

          {/* Camera picker — phones show front/back; a plugged-in USB camera
              appears here automatically (the "extra camera device" path). */}
          {cameras.length > 1 && (
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={activeCamera}
                onChange={(e) => handleSwitchCamera(e.target.value)}
                className="flex-1 px-2 py-1.5 text-xs border rounded-lg bg-white"
              >
                {cameras.map((c, i) => (
                  <option key={c.deviceId} value={c.deviceId}>
                    {c.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {status === 'result' ? (
              <Button onClick={handleScanNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <ScanLine className="w-4 h-4 mr-1.5" />
                Scan next
              </Button>
            ) : (
              <Button
                onClick={handleScanNext}
                disabled={status === 'loading' || status === 'scanning'}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
                {status === 'scanning' ? 'Camera is on…' : 'Start camera'}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            The camera runs entirely on this device — nothing is uploaded. On phones, allow the
            camera prompt once. For a station setup, plug a USB camera into this computer and
            select it from the list.
          </p>
        </div>
      </div>
    </div>
  );
}
