Zaid and Rama archive

This is a static HTML, CSS, and JavaScript site with no build step. Serve the directory over HTTP (for example with XAMPP or GitHub Pages); opening index.html directly as a file may prevent media and data requests from working. Keep CNAME at the site root for the custom domain.

Before uploading to any public repository, remove and rotate the Discord webhook in script.js. The webhook is a credential embedded in a client-side file, so visitors can copy it. The page currently sends notifications for multiple visitor actions. Do not publish that credential; use a server-side endpoint if notifications need to continue.

Run the focused section checks described in TESTING.md before publishing. Publishing to GitHub Pages is a separate step from uploading the source.
