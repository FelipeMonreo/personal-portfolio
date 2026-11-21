# Tanase Filip Andrei — Personal Portfolio

A personal portfolio built with HTML, CSS, vanilla JavaScript, and a PHP contact handler. The website content is in Romanian. Its existing dark theme, section structure, portrait, cards, and navigation are preserved.

## Contents

- Home, About, Hobbies, Projects, and Contact sections.
- Mobile navigation, section reveal effects, and an email copy button.
- A contact form with browser constraints and independent PHP validation.
- An email link that can be used without the form backend.

## Projects

- [SPHEREx-Sky](https://github.com/catagfx/SPHEREx_Sky): an interactive project exploring the infrared sky using NASA SPHEREx telescope data. This description follows the linked repository; it does not imply that this portfolio implements its features.
- **Solitaire**: included by name. No repository URL, technology stack, gameplay features, or completion status was supplied, so none is claimed.
- The three existing project cards are retained with their original descriptions.

## Files

```text
index.html                 Homepage and portfolio content
contact.php                Server-side contact form handler
assets/css/style.css       Theme, layout, and responsive rules
assets/js/main.js          Navigation, validation, copy, and animation behavior
assets/images/poza.jpg      Portfolio portrait
README.md                  Setup, limitations, and review notes
.gitignore                 Local files and sensitive artifacts to exclude
```

No package manager, build step, database, or JavaScript framework is required.

## Local preview

For a static preview, run from the project directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/index.html`. This is a local development preview only: Python's static server does not execute PHP and can serve PHP source as text. Do not use it as a public host or expect form submission to work.

To exercise the backend, install a currently supported PHP 8.x release and run:

```sh
php -l contact.php
php -S 127.0.0.1:8000
```

Open the same homepage URL. PHP's built-in server is for development only. A PHP runtime by itself does not provide a working mail transport.

## Contact form configuration

Set these variables in the PHP hosting environment before enabling the form:

| Variable | Purpose |
| --- | --- |
| `MAIL_FROM` | Required sender address owned by your hosting domain and authorized by the mail provider. |
| `MAIL_TO` | Optional recipient; defaults to the same public contact address used in `index.html`. |

The application reads the process environment with `getenv()`. It does **not** load `.env` files. Configure PHP's mail transport with your hosting provider; provider-specific SMTP credentials do not belong in source code. SPF, DKIM, and DMARC setup depends on that provider and domain.

The sender and subject are fixed by server configuration/code. Visitor names stay in the plain-text body; only a validated email address is used in `Reply-To`.

The handler enforces:

- POST requests only (`405` and `Allow: POST` otherwise).
- String fields, valid UTF-8, no null bytes, and bounded input size.
- A trimmed name of 2–100 characters, a valid email of at most 254 bytes, and a trimmed message of 10–5,000 characters.
- No line breaks in name or email, to prevent mail header injection.
- A honeypot field; filled submissions return `OK` without calling `mail()`.
- `400` for invalid input, `503` for unavailable/unconfigured mail, and `500` when the mail call fails.
- A `303` redirect to `index.html?contact=accepted#contact` only when `mail()` returns true.

The return message describes acceptance for sending, not inbox delivery. The URL status is a display hint, not proof of delivery. [PHP documents that a successful `mail()` call does not guarantee that the email reaches its destination](https://www.php.net/manual/en/function.mail.php).

The honeypot is basic spam filtering. There is no application rate limit or CAPTCHA. Before opening the endpoint to public traffic, apply host-level request limits/spam controls and test the actual mail configuration.

## Deployment limitations

**GitHub Pages cannot execute PHP.** It hosts static HTML, CSS, and JavaScript, as described in the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

For a future GitHub Pages deployment, publish only `index.html` and `assets/`. Before publishing, either remove/disable the form and direct visitors to the existing email link, or connect it to a separately hosted, tested form backend. The form currently posts to the local `contact.php` endpoint; it will not work on GitHub Pages unchanged.

For full form support, use an HTTPS host configured to execute PHP, serve `index.html` as the homepage, and supply the environment variables and mail transport described above. Upload the homepage, `assets/`, and `contact.php`; do not upload local configuration, logs, backups, or repository metadata. Confirm that PHP executes rather than exposing its source.

No deployment configuration or external form service is set up in this project.

## Public repository review

- The reviewed source files contain no detected passwords, API tokens, private keys, or database credentials. No hidden files, backups, mail logs, or database dumps were present in the original folder. This is a review of the current files, not a guarantee about future additions.
- The portfolio intentionally exposes the owner's name, contact email, education details, and portrait. These have been preserved; review them before publishing. Changing `MAIL_TO` does not change the public `mailto:` link in `index.html`.
- The portrait JPEG has no EXIF or XMP metadata. Its remaining metadata is a color profile and a Discord/jpegli encoder comment, with no detected location or contact details. The visible photograph remains personal data.
- `.gitignore` excludes common secrets, local settings, logs, caches, dependencies, and backup artifacts. It does not remove files already tracked by Git, and it does not control what a web server serves.
- No license was selected. Choose one explicitly before granting reuse rights; do not assume the portrait has the same reuse permissions as code.

## Verification status

The preparation review checked local navigation targets, referenced files, the form action, the public project link, JavaScript syntax/behavior in a simulated DOM, and responsive CSS rules. The successful form redirect was corrected from `index.php` to `index.html`.

**Limitations:** no PHP executable or browser automation was available in the preparation environment. PHP validation and response paths were reviewed in source but were not executed. Rendered desktop/mobile layouts and real clipboard permissions still require a browser check. Email sending and inbox delivery have **not** been tested.

Before publishing on a PHP host, check the menu and section links at desktop and mobile widths, keyboard navigation, reduced motion, clipboard fallback, invalid submissions with JavaScript disabled, oversized/array fields, the honeypot, and error responses. Then submit a real message on the intended host and verify both the `303` redirect and receipt in the destination inbox (including spam). Do not treat a simulated or accepted submission as proof of delivery.

Git has not been initialized, and no repository, commit, push, or deployment has been created as part of this preparation.
