# Aaron Formilleza — Portfolio

Static portfolio prepared for GitHub Pages. The deployable website is in `site/`; no build step or application dependencies are required.

## Files

- `site/index.html`: page structure
- `site/projects.js`: project records and media paths
- `site/script.js`: interactions and navigation
- `site/style.css`: typography, layout, and motion
- `site/images/`, `site/intro-images/`, `site/fonts/`: assets

## First deployment

1. Create a GitHub repository and push this folder to its `main` branch.
2. In repository Settings → Pages, set the publishing source to GitHub Actions.
3. Run the Publish portfolio workflow, or push a commit to `main`.
4. Open the Pages URL and verify the introduction, project navigation, images, and links.

GitHub Free requires a public repository for Pages. An eligible paid plan is required to publish Pages from a private repository. Repository visibility should be chosen before uploading.

## Custom domain migration

Keep the existing Sites hosting and DNS records until the GitHub Pages deployment has been verified.

Then verify domain ownership in the GitHub account's Pages settings, add `aaronformilleza.com` as the repository's custom domain, and use GitHub's current DNS instructions to update the records at Spaceship. Configure `www` for the actual GitHub account hostname. Wait for the DNS check and certificate issuance, then enable Enforce HTTPS and test both addresses.

Do not point DNS at a placeholder account or remove the existing hosting during preparation.

## Updating content

Edit the files under `site/` and push to `main`. Keep project IDs stable; they are used in the URL fragments. Project-specific media layouts are intentional. New animated PNGs can replace image paths in `site/projects.js` once ready.

This export contains the website and assets only. It excludes the previous host's configuration, Git history, and credentials.
