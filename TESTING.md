# Local browser check

Serve this directory over HTTP with XAMPP and start Chrome with DevTools remote debugging on port `9224`. Then run:

```powershell
node tests/browser-final.cjs
```

The focused test checks the two added sections, draft typing and backspacing, screen-reader announcement, the breathing orb's phases, stop control and 30-second completion, reduced-motion behavior, and horizontal overflow at 390 px. It does not activate the entry gate or any notification-triggering visitor actions. Results are recorded in `tests/browser-results.json`.

Touch behavior on a physical device and actual printer output have not been tested.
