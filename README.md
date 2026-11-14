# Buniyaad Builders & Suppliers

A mobile-first website prototype for house construction and building-material enquiries in Yavatmal.

## Included

- Construction with materials
- Construction without materials / labour-focused work
- Sand, bricks and cement quote enquiries
- English, Hindi and Marathi language switching
- Stage-based project gallery and accessible image viewer
- Separate construction and material enquiry forms with WhatsApp handoff
- Mobile preview dashboard for projects, materials, testimonials and contact settings

## Important launch notes

1. **Buniyaad Builders & Suppliers is a working name.** Check legal, domain and local-name availability before public launch.
2. **The neoclassical residence is a real ongoing project, shown through design visualisations.** The interface identifies those images as design intent rather than completed work. The separate stage-journey images are generated demos and remain clearly labelled.
3. **No customer testimonial is invented.** Feedback appears only after it is added with the permission checkbox in the dashboard.
4. **Add the final phone and WhatsApp numbers** in the preview dashboard before public launch.
5. The current dashboard is a front-end prototype. Its changes are stored in the current browser only. A production admin needs authenticated server storage for multi-device publishing and durable photo/video uploads.

## Local preview

Run from this project directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\serve.ps1
```

Then open `http://127.0.0.1:4173/`.

The deployable static files are in `dist/`. The Sites configuration is in `.openai/hosting.json`.

## Generated image prompts

Three owner-supplied design views are used for the ongoing neoclassical residence:

- `ongoing-neoclassical-front.webp`
- `ongoing-neoclassical-angle.webp`
- `ongoing-neoclassical-elevation.webp`

They are shown as exterior design visualisations for work currently under construction, not as completed-house photography.

Four additional original WebP assets were generated with the built-in image generation workflow for this project:

- `hero.webp`: a wide, documentary-style Yavatmal-region house moving from brickwork to a finished facade, with negative space for copy.
- `foundation.webp`: an organised residential foundation stage with reinforcement and footing geometry.
- `brickwork.webp`: a modest Indian home at the brickwork stage with concrete columns and tidy material stacks.
- `completed.webp`: an attainable contemporary Indian family home with a practical facade and native planting.

All prompts prohibited logos, readable signage, watermarks, unsafe practices and identifiable people.
