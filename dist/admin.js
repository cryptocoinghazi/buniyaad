(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const changedForms = new Set();
  function guardForm(id) {
    if ([...changedForms].some((key) => key !== id))
      throw new Error(
        "Save or discard changes in the other form first. Each section saves separately.",
      );
  }
  let state,
    editing = null,
    images = [],
    dirty = false,
    pending = false;
  const field = (key, label, value = "", type = "text") =>
    `<div class="field"><label for="${key}">${label}</label><input id="${key}" name="${key}" type="${type}" value="${esc(value)}" maxlength="300"></div>`;
  const message = (text, error = false) => {
    const el = $("#status");
    if (el) {
      el.textContent = text;
      el.setAttribute("role", error ? "alert" : "status");
    }
  };
  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
    });
    if (!response.headers.get("content-type")?.includes("application/json"))
      throw new Error(
        "Owner sign-in expired or the server is not configured. Reload the dashboard and sign in.",
      );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }
  const slug = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);
  function download(value, name) {
    const blob = new Blob([JSON.stringify(value, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function save() {
    const snapshot = structuredClone(state);
    state = await api("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot),
    });
    dirty = false;
    changedForms.clear();
    message(
      `Saved revision ${state.revision}. Published pages and sitemap update immediately.`,
    );
  }
  function settingsUI() {
    const labels = {
      businessName: "Business name",
      phone: "Phone (country code recommended)",
      whatsapp: "WhatsApp",
      city: "City",
      address: "Public address (optional)",
      email: "Email",
      workingHours: "Working hours",
      serviceAreas: "Actual service and delivery areas",
      mapUrl: "HTTPS Maps link",
      profileUrl: "HTTPS Business Profile link",
      searchConsoleVerification: "Search Console verification code (optional)",
    };
    return `<section class="panel"><h2>Business details</h2><form id="settingsForm"><div class="form-grid">${Object.entries(
      labels,
    )
      .map(([k, l]) => field(k, l, state.settings[k]))
      .join(
        "",
      )}</div><button class="button button-primary">Save business details</button></form></section>`;
  }
  function render() {
    $("#dashboard").innerHTML =
      `<header class="admin-header"><strong>${esc(state.settings.businessName)} · Owner dashboard</strong><a href="/">View website ↗</a><a href="/cdn-cgi/access/logout">Sign out</a></header><main class="admin-main"><h1>Publish your work</h1><p>Shared storage · Revision ${state.revision}. Drafts are private. Saving published content updates the public website immediately.</p><p id="status" role="status" aria-live="polite"></p><nav class="section-nav"><a href="#editor">Project editor</a><a href="#projects">Projects</a><a href="#business">Business</a><a href="#backup">Backups</a></nav><section class="panel" id="editor"><h2>${editing ? "Edit project" : "Add a project"}</h2><form id="projectForm"><div class="form-grid">${field("title", "Project title")}${field("slug", "URL slug (lowercase words with hyphens)")}${field("location", "Location", "Yavatmal")}${field("area", "Area (optional; use confirmed information)")}<div class="field"><label for="mode">Agreed scope</label><select name="mode" id="mode"><option value="">Not specified</option><option value="with-materials">With materials</option><option value="without-materials">Labour only</option></select></div><div class="field"><label for="projectStatus">Construction status</label><select name="status" id="projectStatus"><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div><div class="field field-full"><label for="description">Project description</label><textarea name="description" id="description" maxlength="2500"></textarea></div>${field("stage", "Construction stage", "foundation")}${field("seoTitle", "Search title override (optional)")}${field("seoDescription", "Search description override (optional)")}</div><details><summary>Optional reviewed project translations</summary>${["hi", "mr"].map((l) => `<fieldset><legend>${l === "hi" ? "Hindi" : "Marathi"} (both fields required for a translated URL)</legend>${field(l + "Title", "Translated title")}<label for="${l}Description">Translated description</label><textarea id="${l}Description" name="${l}Description" maxlength="2500"></textarea></fieldset>`).join("")}</details><h3>Photos</h3><p>The first photo is the cover. Original files are retained privately. Videos are not supported.</p><label for="photoKind">Label for new uploads</label><select id="photoKind"><option value="original">Original photo</option><option value="enhanced">AI-enhanced photo</option><option value="design">Design visualisation</option></select><input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple><p id="uploadProgress" role="status"></p><div id="photoList" class="card-list"></div><div class="actions"><button class="button button-secondary" name="intent" value="draft">Save as draft</button><button class="button button-primary" name="intent" value="published">Publish project</button><button type="button" class="button button-secondary" data-action="clear">New project</button></div></form></section><section class="panel" id="projects"><h2>Projects (${state.projects.length})</h2><div class="card-list">${state.projects.map((p, i) => `<article class="tool-card"><h3>${esc(p.title)}</h3><p>${esc(p.publication)} · ${esc(p.status)} · ${p.images.length} photos</p><p>/projects/${esc(p.slug)}/</p><div class="actions"><button data-action="edit" data-id="${p.id}">Edit</button><button data-action="preview" data-id="${p.id}">Preview saved version</button><button data-action="archive" data-id="${p.id}">Archive</button><button data-action="up" data-id="${p.id}" ${i === 0 ? "disabled" : ""}>Move up</button><button data-action="down" data-id="${p.id}" ${i === state.projects.length - 1 ? "disabled" : ""}>Move down</button><button data-action="delete" data-id="${p.id}">Delete project</button></div></article>`).join("")}</div></section><div id="business">${settingsUI()}</div><section class="panel"><h2>Materials</h2><form id="materialsForm">${["sand", "bricks", "cement"].map((k) => `<fieldset><legend>${k}</legend><label><input type="checkbox" name="${k}Available" ${state.materials[k].available ? "checked" : ""}> Open for enquiries (not a stock guarantee)</label>${field(k + "Note", "Availability note", state.materials[k].note)}</fieldset>`).join("")}<button class="button button-primary">Save materials</button></form></section><section class="panel"><h2>Permission-approved testimonials</h2>${state.testimonials.map((t) => `<p>${esc(t.name)}: ${esc(t.quote)} <button data-action="remove-testimonial" data-id="${esc(t.id)}">Remove</button></p>`).join("")}<form id="testimonialForm">${field("customer", "Customer name")}${field("customerLocation", "Location (optional)")}<label for="quote">Customer's words</label><textarea id="quote" name="quote" maxlength="700" required></textarea><label><input type="checkbox" name="permission" required> Customer gave permission to publish</label><button class="button button-primary">Add approved feedback</button></form></section><section class="panel" id="backup"><h2>Backups and migration</h2><p>Export before editing or importing. Content exports contain photo references; download original images separately or back up the R2 bucket. Existing browser-local data is never cleared.</p><div class="actions"><button data-action="health">Check SEO readiness</button><button data-action="export">Download saved content and media manifest</button><button data-action="export-local">Export old data from this browser</button><button data-action="export-edits">Export current unsaved edits</button></div><p>To migrate from another origin/device, export the JSON from the old dashboard first. Import merges by project ID and stages imported projects as drafts. Review them, then publish individually.</p><label for="importBackup">Import backup (maximum 25 MB)</label><input type="file" id="importBackup" accept="application/json,.json"><div id="originals"></div></section></main>`;
    $("#projectForm").addEventListener("submit", (e) => {
      e.preventDefault();
      run(async () => {
        guardForm(e.target.id);
        const form = new FormData(e.target);
        const current = state.projects.find((p) => p.id === editing);
        const p = {
          ...(current || {}),
          id: editing || crypto.randomUUID(),
          slug: form.get("slug") || slug(form.get("title")),
          title: form.get("title"),
          location: form.get("location"),
          area: form.get("area"),
          description: form.get("description"),
          mode: form.get("mode"),
          status: form.get("status"),
          stage: form.get("stage"),
          publication: e.submitter.value,
          order: current?.order ?? state.projects.length,
          seoTitle: form.get("seoTitle"),
          seoDescription: form.get("seoDescription"),
          images: structuredClone(images),
          translations: {},
        };
        for (const l of ["hi", "mr"]) {
          if (form.get(l + "Title") && form.get(l + "Description"))
            p.translations[l] = {
              title: form.get(l + "Title"),
              description: form.get(l + "Description"),
            };
        }
        if (current) state.projects[state.projects.indexOf(current)] = p;
        else state.projects.push(p);
        dirty = true;
        await save();
        editing = p.id;
        render();
        loadEditor(p.id);
        message(
          `${p.publication === "published" ? "Published" : "Saved draft"}. Public content and sitemap reflect the saved version.`,
        );
      });
    });
    $("#settingsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      run(async () => {
        guardForm(e.target.id);
        for (const [k, v] of new FormData(e.target)) state.settings[k] = v;
        dirty = true;
        await save();
      });
    });
    $("#materialsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      run(async () => {
        guardForm(e.target.id);
        const form = new FormData(e.target);
        for (const k of ["sand", "bricks", "cement"])
          state.materials[k] = {
            available: form.has(k + "Available"),
            note: form.get(k + "Note"),
          };
        dirty = true;
        await save();
      });
    });
    $("#testimonialForm").addEventListener("submit", (e) => {
      e.preventDefault();
      run(async () => {
        guardForm(e.target.id);
        const f = new FormData(e.target);
        state.testimonials.push({
          id: crypto.randomUUID(),
          name: f.get("customer"),
          location: f.get("customerLocation"),
          quote: f.get("quote"),
          permission: f.has("permission"),
        });
        dirty = true;
        await save();
        render();
      });
    });
    $("#photos").addEventListener("change", (e) =>
      run(async () => {
        for (const file of e.target.files) {
          $("#uploadProgress").textContent = `Processing ${file.name}…`;
          images.push({
            ...(await upload(file)),
            kind: $("#photoKind").value,
            stage: $("#stage").value,
            alt: "",
            caption: "",
          });
          dirty = true;
        }
        renderPhotos();
        $("#uploadProgress").textContent =
          "Uploaded. Add accurate descriptions, then save or publish the project.";
      }),
    );
    $("#importBackup").addEventListener("change", (e) =>
      run(async () => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 25_000_000) throw new Error("Backup exceeds 25 MB");
        await importBackup(JSON.parse(await file.text()));
      }),
    );
    $("#dashboard").oninput = (event) => {
      const form = event.target.closest("form");
      if (form) {
        dirty = true;
        changedForms.add(form.id);
      }
    };
    renderPhotos();
  }
  function loadEditor(id) {
    const p = state.projects.find((p) => p.id === id);
    if (!p) return;
    editing = id;
    images = structuredClone(p.images);
    const f = $("#projectForm");
    for (const k of [
      "title",
      "slug",
      "location",
      "area",
      "description",
      "mode",
      "status",
      "stage",
      "seoTitle",
      "seoDescription",
    ])
      f.elements[k].value = p[k] || "";
    for (const l of ["hi", "mr"]) {
      f.elements[l + "Title"].value = p.translations?.[l]?.title || "";
      f.elements[l + "Description"].value =
        p.translations?.[l]?.description || "";
    }
    renderPhotos();
    $("#editor").scrollIntoView();
  }
  function renderPhotos() {
    $("#photoList").innerHTML = images
      .map(
        (im, i) =>
          `<article class="tool-card"><img src="${esc(im.src.replace(/^\/media\//, "/api/admin/media/"))}" alt="" width="160" height="110" style="object-fit:cover"><strong>${i === 0 ? "Cover photo" : "Photo " + (i + 1)}</strong><label>Image description<input data-photo="${i}" data-key="alt" value="${esc(im.alt)}" maxlength="250"></label><label>Caption<input data-photo="${i}" data-key="caption" value="${esc(im.caption)}" maxlength="300"></label><label>Stage<input data-photo="${i}" data-key="stage" value="${esc(im.stage)}" maxlength="40"></label><label>Image label<select data-photo="${i}" data-key="kind">${["original", "enhanced", "design"].map((k) => `<option value="${k}" ${im.kind === k ? "selected" : ""}>${{ original: "Original photo", enhanced: "AI-enhanced photo", design: "Design visualisation" }[k]}</option>`).join("")}</select></label><button type="button" data-action="cover" data-index="${i}">Make cover</button><button type="button" data-action="remove-photo" data-index="${i}">Remove from project</button>${im.src.startsWith("/media/") ? `<a href="${im.src.replace("/media/", "/api/admin/media/").replace("/display", "/original")}">Download original</a>` : ""}</article>`,
      )
      .join("");
    $("#photoList").oninput = (e) => {
      if (e.target.dataset.photo !== undefined) {
        images[Number(e.target.dataset.photo)][e.target.dataset.key] =
          e.target.value;
        dirty = true;
      }
    };
  }
  async function upload(file) {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 12_000_000
    )
      throw new Error(
        "Use JPEG, PNG or WebP images up to 12 MB. Video files are not supported.",
      );
    const bitmap = await createImageBitmap(file);
    if (bitmap.width * bitmap.height > 50_000_000) {
      bitmap.close();
      throw new Error("Image exceeds 50 megapixels");
    }
    async function variant(max) {
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height)),
        canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas
        .getContext("2d")
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.84),
      );
      if (!blob || blob.type !== "image/webp")
        throw new Error("This browser cannot create WebP images");
      return { blob, width: canvas.width, height: canvas.height };
    }
    try {
      const display = await variant(1600),
        thumb = await variant(640),
        form = new FormData();
      form.append("original", file);
      form.append("display", display.blob, "display.webp");
      form.append("thumb", thumb.blob, "thumb.webp");
      form.append("width", display.width);
      form.append("height", display.height);
      return await api("/api/admin/media", { method: "POST", body: form });
    } finally {
      bitmap.close();
    }
  }
  async function importBackup(payload) {
    if (
      !confirm(
        "Merge this backup into shared content? Export your existing data first. Imported projects will be drafts.",
      )
    )
      return;
    const incoming = payload.content || {
      projects: payload["buniyaad.projects"],
      settings: payload["buniyaad.settings"],
    };
    if (!Array.isArray(incoming.projects) || incoming.projects.length > 150)
      throw new Error("Not a supported Buniyaad backup");
    if (dirty)
      throw new Error("Save or export your current edits before importing");
    const merged = structuredClone(state);
    let count = 0;
    for (const old of incoming.projects) {
      if (old.demo) continue;
      const p = structuredClone(old);
      p.id = p.id || crypto.randomUUID();
      p.title = typeof p.title === "object" ? p.title.en : p.title;
      p.slug = p.slug || slug(p.title) + "-" + crypto.randomUUID().slice(0, 8);
      p.images = [];
      for (const image of old.images || []) {
        let im = { ...image };
        if (im.src?.startsWith("data:image/")) {
          const blob = await (await fetch(im.src)).blob();
          im = {
            ...im,
            ...(await upload(
              new File([blob], "imported-photo", { type: blob.type }),
            )),
          };
        } else {
          im.src = im.src?.replace(/^assets\//, "/assets/");
          if (!/^\/(assets|media)\//.test(im.src))
            throw new Error(
              "Backup contains unsupported external media. Add the original image through the upload field.",
            );
        }
        im.kind = im.kind || (im.stage === "design" ? "design" : "original");
        im.alt =
          typeof im.alt === "string"
            ? im.alt
            : im.alt?.en || im.caption || p.title;
        im.caption =
          typeof im.caption === "string" ? im.caption : im.caption?.en || "";
        p.images.push(im);
      }
      p.location =
        typeof p.location === "object"
          ? p.location.en
          : p.location || "Yavatmal";
      p.area = typeof p.area === "string" ? p.area : "";
      p.description = typeof p.description === "string" ? p.description : "";
      p.publication = "draft";
      p.status = p.status === "completed" ? "completed" : "ongoing";
      p.order = merged.projects.length;
      p.translations = p.translations || {};
      const index = merged.projects.findIndex((x) => x.id === p.id);
      if (index >= 0) merged.projects[index] = p;
      else merged.projects.push(p);
      count++;
    }
    state = merged;
    dirty = true;
    download(
      { format: "buniyaad-import-review", content: state },
      "buniyaad-import-review.json",
    );
    if (
      confirm(
        `Review prepared: ${count} projects staged as drafts. A review copy was downloaded. Save the merge now?`,
      )
    ) {
      await save();
      render();
      message(
        "Imported as drafts. Review labels and descriptions, then publish projects individually.",
      );
    } else
      message(
        "Import staged in memory only. Export current edits before leaving.",
      );
  }
  async function run(fn) {
    if (pending) return;
    pending = true;
    document.body.setAttribute("aria-busy", "true");
    try {
      const job = fn();
      document.querySelectorAll("button,input,textarea,select").forEach((b) => {
        if (!b.disabled) {
          b.dataset.busyDisabled = "true";
          b.disabled = true;
        }
      });
      await job;
    } catch (e) {
      message(e.message, true);
    } finally {
      pending = false;
      document.body.removeAttribute("aria-busy");
      document.querySelectorAll("[data-busy-disabled]").forEach((b) => {
        b.disabled = false;
        delete b.dataset.busyDisabled;
      });
    }
  }
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;
    e.preventDefault();
    run(async () => {
      const action = button.dataset.action,
        id = button.dataset.id,
        index = Number(button.dataset.index),
        p = state.projects.find((p) => p.id === id);
      if (action === "edit") {
        if (
          dirty &&
          !confirm(
            "Discard all unsaved changes and reload saved content? Export first if needed.",
          )
        )
          return;
        if (dirty) {
          state = await api("/api/admin/content");
          dirty = false;
          changedForms.clear();
          render();
        }
        loadEditor(id);
        return;
      }
      if (action === "clear") {
        if (
          dirty &&
          !confirm(
            "Discard all unsaved changes and start a new project? Export first if needed.",
          )
        )
          return;
        if (dirty) {
          state = await api("/api/admin/content");
          dirty = false;
          changedForms.clear();
        }
        editing = null;
        images = [];
        render();
        return;
      }
      if (action === "cover") {
        images.unshift(...images.splice(index, 1));
        dirty = true;
        changedForms.add("projectForm");
        renderPhotos();
        return;
      }
      if (action === "remove-photo") {
        images.splice(index, 1);
        dirty = true;
        changedForms.add("projectForm");
        renderPhotos();
        return;
      }
      if (action === "preview") {
        window.open(
          `/api/admin/preview/${encodeURIComponent(id)}`,
          "_blank",
          "noopener",
        );
        return;
      }
      if (action === "health") {
        const report = await api("/api/admin/health");
        message(
          report.issues.length
            ? report.issues.join(" ")
            : "Published project metadata checks passed. Google indexing and ranking are not verified.",
        );
        return;
      }
      if (action === "export") {
        const backup = await api("/api/admin/backup");
        download(backup, "buniyaad-content-backup.json");
        $("#originals").innerHTML =
          `<h3>Original upload downloads</h3>${backup.mediaManifest.map((m) => `<p><a href="/api/admin/media/${m.id}/original">${esc(m.original_name)}</a></p>`).join("")}`;
        return;
      }
      if (action === "export-edits") {
        download(
          {
            content: state,
            editor: $("#projectForm")
              ? Object.fromEntries(new FormData($("#projectForm")))
              : null,
            editorImages: images,
            unsavedForms: Object.fromEntries(
              [...document.querySelectorAll("form")].map((f) => [
                f.id,
                Object.fromEntries(new FormData(f)),
              ]),
            ),
          },
          "buniyaad-unsaved-edits.json",
        );
        return;
      }
      if (action === "export-local") {
        const backup = { schemaVersion: 1 };
        for (const k of ["settings", "projects", "materials", "testimonials"]) {
          const value = localStorage.getItem(`buniyaad.${k}`);
          if (value) backup[`buniyaad.${k}`] = JSON.parse(value);
        }
        download(backup, "buniyaad-old-browser-backup.json");
        return;
      }
      if (dirty)
        throw new Error(
          "Save or export your current edits before changing another item.",
        );
      if (action === "archive") {
        p.publication = "archived";
      } else if (action === "delete") {
        if (
          !confirm(
            "Delete this project? Export a backup first. Uploaded originals remain stored privately.",
          )
        )
          return;
        state.projects = state.projects.filter((x) => x.id !== id);
      } else if (action === "up" || action === "down") {
        const i = state.projects.indexOf(p),
          j = i + (action === "up" ? -1 : 1);
        [state.projects[i], state.projects[j]] = [
          state.projects[j],
          state.projects[i],
        ];
        state.projects.forEach((p, n) => (p.order = n));
      } else if (action === "remove-testimonial") {
        state.testimonials = state.testimonials.filter((t) => t.id !== id);
      } else return;
      dirty = true;
      await save();
      render();
      message("Shared content updated.");
    });
  });
  window.addEventListener("beforeunload", (e) => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  api("/api/admin/content")
    .then((data) => {
      state = data;
      render();
    })
    .catch((e) => {
      $("#loading").textContent = e.message;
    });
})();
