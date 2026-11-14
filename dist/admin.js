(() => {
  "use strict";

  const STORAGE_KEYS = Object.freeze({
    settings: "buniyaad.settings",
    projects: "buniyaad.projects",
    materials: "buniyaad.materials",
    testimonials: "buniyaad.testimonials",
  });

  const DEFAULTS = Object.freeze({
    settings: {
      businessName: "Buniyaad Builders & Suppliers",
      phone: "",
      whatsapp: "",
    },
    projects: [],
    materials: {
      sand: { available: false, note: "", updatedAt: null },
      bricks: { available: false, note: "", updatedAt: null },
      cement: { available: false, note: "", updatedAt: null },
    },
    testimonials: [],
  });

  const STAGE_LABELS = Object.freeze({
    foundation: "Foundation",
    structure: "Structure",
    brickwork: "Brickwork",
    plastering: "Plastering",
    completed: "Completed house",
  });

  const MODE_LABELS = Object.freeze({
    "with-materials": "With materials",
    "without-materials": "Without materials",
  });

  const elements = {
    statusMessage: document.querySelector("#statusMessage"),
    headerBusinessName: document.querySelector("#headerBusinessName"),
    settingsForm: document.querySelector("#settingsForm"),
    businessName: document.querySelector("#businessName"),
    businessPhone: document.querySelector("#businessPhone"),
    businessWhatsapp: document.querySelector("#businessWhatsapp"),
    projectForm: document.querySelector("#projectForm"),
    projectMedia: document.querySelector("#projectMedia"),
    mediaSelection: document.querySelector("#mediaSelection"),
    saveProjectButton: document.querySelector("#saveProjectButton"),
    projectList: document.querySelector("#projectList"),
    projectCount: document.querySelector("#projectCount"),
    materialsForm: document.querySelector("#materialsForm"),
    testimonialForm: document.querySelector("#testimonialForm"),
    testimonialList: document.querySelector("#testimonialList"),
    testimonialCount: document.querySelector("#testimonialCount"),
    exportButton: document.querySelector("#exportButton"),
    importFile: document.querySelector("#importFile"),
    resetButton: document.querySelector("#resetButton"),
  };

  let state = loadState();
  let messageTimer;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanText(value, maxLength = 600) {
    return String(value ?? "").trim().slice(0, maxLength);
  }

  function makeId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readStored(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return clone(fallback);
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Could not read ${key}`, error);
      return clone(fallback);
    }
  }

  function writeStored(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedMissingStorage() {
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
      if (localStorage.getItem(key) === null) writeStored(key, clone(DEFAULTS[name]));
    }
  }

  function normalizeSettings(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return clone(DEFAULTS.settings);
    return {
      businessName: cleanText(value.businessName, 80) || DEFAULTS.settings.businessName,
      phone: cleanText(value.phone, 20),
      whatsapp: cleanText(value.whatsapp, 20),
    };
  }

  function normalizeMaterialEntry(value) {
    const item = value && typeof value === "object" ? value : {};
    return {
      available: Boolean(item.available),
      note: cleanText(item.note, 180),
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null,
    };
  }

  function normalizeMaterials(value) {
    let source = value;
    if (Array.isArray(value)) {
      source = {};
      value.forEach((item) => {
        const key = cleanText(item?.id || item?.key || item?.name, 30).toLowerCase();
        if (key.includes("sand")) source.sand = item;
        if (key.includes("brick")) source.bricks = item;
        if (key.includes("cement")) source.cement = item;
      });
    }
    if (!source || typeof source !== "object") source = {};
    return {
      sand: normalizeMaterialEntry(source.sand),
      bricks: normalizeMaterialEntry(source.bricks),
      cement: normalizeMaterialEntry(source.cement),
    };
  }

  function normalizeImages(value, fallbackStage) {
    if (!Array.isArray(value)) return [];
    return value
      .map((image) => {
        if (!image || typeof image !== "object") return null;
        const src = cleanText(image.src, 3_500_000);
        if (!src) return null;
        return {
          src,
          stage: STAGE_LABELS[image.stage] ? image.stage : fallbackStage,
          caption: cleanText(image.caption, 180),
        };
      })
      .filter(Boolean);
  }

  function normalizeVideos(value, fallbackStage) {
    if (!Array.isArray(value)) return [];
    return value
      .map((video) => {
        if (!video || typeof video !== "object") return null;
        const name = cleanText(video.name, 180);
        if (!name) return null;
        return {
          name,
          type: cleanText(video.type, 100),
          size: Number.isFinite(Number(video.size)) ? Math.max(0, Number(video.size)) : 0,
          lastModified: Number.isFinite(Number(video.lastModified)) ? Number(video.lastModified) : 0,
          stage: STAGE_LABELS[video.stage] ? video.stage : fallbackStage,
          caption: cleanText(video.caption, 180),
        };
      })
      .filter(Boolean);
  }

  function normalizeProject(project) {
    if (!project || typeof project !== "object") return null;
    const title = cleanText(project.title, 90);
    const location = cleanText(project.location, 90);
    const area = cleanText(project.area, 50);
    const description = cleanText(project.description, 600);
    const mode = MODE_LABELS[project.mode] ? project.mode : "with-materials";
    const status = project.status === "completed" ? "completed" : "ongoing";
    const stage = STAGE_LABELS[project.stage] ? project.stage : status === "completed" ? "completed" : "foundation";
    if (!title || !location || !area || !description) return null;
    return {
      id: cleanText(project.id, 120) || makeId("project"),
      title,
      location,
      area,
      mode,
      status,
      stage,
      description,
      images: normalizeImages(project.images, stage),
      updatedAt: typeof project.updatedAt === "string" ? project.updatedAt : new Date().toISOString(),
      demo: Boolean(project.demo),
      ...(Array.isArray(project.videos) && project.videos.length
        ? { videos: normalizeVideos(project.videos, stage) }
        : {}),
    };
  }

  function normalizeProjects(value) {
    if (!Array.isArray(value)) return [];
    return value.map(normalizeProject).filter(Boolean);
  }

  function normalizeTestimonial(item) {
    if (!item || typeof item !== "object" || item.permission !== true) return null;
    const name = cleanText(item.name, 80);
    const quote = cleanText(item.quote, 500);
    if (!name || !quote) return null;
    return {
      id: cleanText(item.id, 120) || makeId("testimonial"),
      name,
      location: cleanText(item.location, 90),
      quote,
      permission: true,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    };
  }

  function normalizeTestimonials(value) {
    if (!Array.isArray(value)) return [];
    return value.map(normalizeTestimonial).filter(Boolean);
  }

  function loadState() {
    try {
      seedMissingStorage();
    } catch (error) {
      console.warn("Browser storage is unavailable", error);
    }
    return {
      settings: normalizeSettings(readStored(STORAGE_KEYS.settings, DEFAULTS.settings)),
      projects: normalizeProjects(readStored(STORAGE_KEYS.projects, DEFAULTS.projects)),
      materials: normalizeMaterials(readStored(STORAGE_KEYS.materials, DEFAULTS.materials)),
      testimonials: normalizeTestimonials(readStored(STORAGE_KEYS.testimonials, DEFAULTS.testimonials)),
    };
  }

  function persist(name) {
    writeStored(STORAGE_KEYS[name], state[name]);
  }

  function persistAll(nextState) {
    const previous = {};
    Object.values(STORAGE_KEYS).forEach((key) => {
      previous[key] = localStorage.getItem(key);
    });
    try {
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => writeStored(key, nextState[name]));
    } catch (error) {
      Object.entries(previous).forEach(([key, value]) => {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      });
      throw error;
    }
  }

  function showMessage(message, kind = "success") {
    window.clearTimeout(messageTimer);
    elements.statusMessage.textContent = message;
    elements.statusMessage.dataset.kind = kind;
    messageTimer = window.setTimeout(() => {
      elements.statusMessage.textContent = "";
      delete elements.statusMessage.dataset.kind;
    }, kind === "error" ? 7000 : 4200);
  }

  function saveErrorMessage(error) {
    if (error?.name === "QuotaExceededError") {
      return "This browser is out of preview storage. Export a backup, then remove older photo-heavy projects.";
    }
    return "This device could not save the change. Check browser storage permissions and try again.";
  }

  function hydrateForms() {
    elements.businessName.value = state.settings.businessName;
    elements.businessPhone.value = state.settings.phone;
    elements.businessWhatsapp.value = state.settings.whatsapp;
    elements.headerBusinessName.textContent = state.settings.businessName;

    ["sand", "bricks", "cement"].forEach((key) => {
      const prefix = key === "bricks" ? "bricks" : key;
      const available = document.querySelector(`#${prefix}Available`);
      const note = document.querySelector(`#${prefix}Note`);
      available.checked = state.materials[key].available;
      note.value = state.materials[key].note;
    });
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently updated";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function isSafeImageSource(value) {
    if (typeof value !== "string") return false;
    if (/^data:image\/(?:avif|gif|jpe?g|png|webp);base64,/i.test(value)) return true;
    if (/^(?:\.\/|\/)?assets\/[a-z0-9_./-]+$/i.test(value)) return true;
    return /^https:\/\//i.test(value);
  }

  function createButton(label, action, id, ariaLabel) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-danger button-small";
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = id;
    button.setAttribute("aria-label", ariaLabel);
    return button;
  }

  function renderProjects() {
    elements.projectList.replaceChildren();
    elements.projectCount.textContent = String(state.projects.length);
    elements.projectCount.setAttribute(
      "aria-label",
      `${state.projects.length} saved project${state.projects.length === 1 ? "" : "s"}`,
    );

    if (!state.projects.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No projects saved on this device yet.";
      elements.projectList.append(empty);
      return;
    }

    [...state.projects]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .forEach((project) => {
        const card = document.createElement("article");
        card.className = "saved-card";
        const firstImage = project.images.find((image) => isSafeImageSource(image.src));
        if (firstImage) {
          const image = document.createElement("img");
          image.src = firstImage.src;
          image.alt = "";
          image.loading = "lazy";
          card.append(image);
        } else {
          card.classList.add("no-image");
        }

        const body = document.createElement("div");
        const title = document.createElement("p");
        title.className = "card-title";
        title.textContent = project.title;
        const location = document.createElement("p");
        location.className = "card-meta";
        location.textContent = `${project.location} · ${project.area}`;
        const details = document.createElement("p");
        details.className = "card-meta";
        const photoCount = project.images.length;
        const videoCount = Array.isArray(project.videos) ? project.videos.length : 0;
        const mediaText = [
          photoCount ? `${photoCount} photo${photoCount === 1 ? "" : "s"}` : "",
          videoCount ? `${videoCount} video record${videoCount === 1 ? "" : "s"}` : "",
        ]
          .filter(Boolean)
          .join(", ");
        details.textContent = `${MODE_LABELS[project.mode]} · ${formatDate(project.updatedAt)}${mediaText ? ` · ${mediaText}` : ""}`;
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `${project.status === "completed" ? "Completed" : "Ongoing"} · ${STAGE_LABELS[project.stage]}`;
        body.append(title, location, details, tag);

        card.append(
          body,
          createButton("Delete", "delete-project", project.id, `Delete ${project.title}`),
        );
        elements.projectList.append(card);
      });
  }

  function renderTestimonials() {
    elements.testimonialList.replaceChildren();
    elements.testimonialCount.textContent = String(state.testimonials.length);
    elements.testimonialCount.setAttribute(
      "aria-label",
      `${state.testimonials.length} approved testimonial${state.testimonials.length === 1 ? "" : "s"}`,
    );

    if (!state.testimonials.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No approved testimonials saved on this device.";
      elements.testimonialList.append(empty);
      return;
    }

    [...state.testimonials]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((testimonial) => {
        const card = document.createElement("article");
        card.className = "saved-card no-image";
        const body = document.createElement("div");
        const quote = document.createElement("p");
        quote.className = "card-title";
        quote.textContent = `“${testimonial.quote}”`;
        const source = document.createElement("p");
        source.className = "card-meta";
        source.textContent = testimonial.location
          ? `${testimonial.name} · ${testimonial.location}`
          : testimonial.name;
        body.append(quote, source);
        card.append(
          body,
          createButton("Delete", "delete-testimonial", testimonial.id, `Delete testimonial from ${testimonial.name}`),
        );
        elements.testimonialList.append(card);
      });
  }

  function renderAll() {
    hydrateForms();
    renderProjects();
    renderTestimonials();
  }

  function fileSelectionSummary() {
    const files = Array.from(elements.projectMedia.files || []);
    if (!files.length) {
      elements.mediaSelection.textContent = "No files selected.";
      return;
    }
    const imageCount = files.filter((file) => file.type.startsWith("image/")).length;
    const videoCount = files.filter((file) => file.type.startsWith("video/")).length;
    const unsupported = files.length - imageCount - videoCount;
    const parts = [];
    if (imageCount) parts.push(`${imageCount} photo${imageCount === 1 ? "" : "s"}`);
    if (videoCount) parts.push(`${videoCount} video${videoCount === 1 ? "" : "s"} (details only)`);
    if (unsupported) parts.push(`${unsupported} unsupported file${unsupported === 1 ? "" : "s"}`);
    elements.mediaSelection.textContent = `Selected: ${parts.join(", ")}.`;
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        try {
          const maxDimension = 1280;
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const width = Math.max(1, Math.round(image.naturalWidth * scale));
          const height = Math.max(1, Math.round(image.naturalHeight * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d", { alpha: false });
          if (!context) throw new Error("Canvas is unavailable");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          const src = canvas.toDataURL("image/webp", 0.72);
          resolve(src);
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Could not read ${file.name}`));
      };
      image.src = objectUrl;
    });
  }

  async function collectProjectMedia(files, stage, title) {
    const images = [];
    const videos = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const src = await compressImage(file);
        images.push({
          src,
          stage,
          caption: `${title} — ${STAGE_LABELS[stage]}`,
        });
      } else if (file.type.startsWith("video/")) {
        videos.push({
          name: cleanText(file.name, 180),
          type: cleanText(file.type, 100),
          size: file.size,
          lastModified: file.lastModified,
          stage,
          caption: `${title} — ${STAGE_LABELS[stage]} video`,
        });
      }
    }
    return { images, videos };
  }

  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!elements.settingsForm.reportValidity()) return;
    const formData = new FormData(elements.settingsForm);
    const nextSettings = normalizeSettings(Object.fromEntries(formData));
    try {
      state.settings = nextSettings;
      persist("settings");
      elements.headerBusinessName.textContent = state.settings.businessName;
      showMessage("Business settings saved on this device.");
    } catch (error) {
      showMessage(saveErrorMessage(error), "error");
    }
  });

  elements.projectMedia.addEventListener("change", fileSelectionSummary);

  elements.projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!elements.projectForm.reportValidity()) return;

    const formData = new FormData(elements.projectForm);
    const title = cleanText(formData.get("title"), 90);
    const stage = cleanText(formData.get("stage"), 30);
    const files = Array.from(elements.projectMedia.files || []);
    const originalButtonText = elements.saveProjectButton.textContent;
    elements.saveProjectButton.disabled = true;
    elements.saveProjectButton.textContent = files.some((file) => file.type.startsWith("image/"))
      ? "Preparing photos…"
      : "Saving…";

    try {
      const media = await collectProjectMedia(files, stage, title);
      const project = normalizeProject({
        id: makeId("project"),
        title,
        location: formData.get("location"),
        area: formData.get("area"),
        mode: formData.get("mode"),
        status: formData.get("status"),
        stage,
        description: formData.get("description"),
        images: media.images,
        videos: media.videos,
        updatedAt: new Date().toISOString(),
        demo: false,
      });
      if (!project) throw new Error("Project validation failed");
      state.projects.unshift(project);
      try {
        persist("projects");
      } catch (error) {
        state.projects.shift();
        throw error;
      }
      elements.projectForm.reset();
      fileSelectionSummary();
      renderProjects();
      showMessage(
        media.videos.length
          ? "Project saved. Video details were recorded; the video files stayed on your device."
          : "Project saved on this device.",
      );
    } catch (error) {
      console.error(error);
      const message = error?.name === "QuotaExceededError"
        ? saveErrorMessage(error)
        : "The project could not be saved. Check the selected photos and try again.";
      showMessage(message, "error");
    } finally {
      elements.saveProjectButton.disabled = false;
      elements.saveProjectButton.textContent = originalButtonText;
    }
  });

  elements.projectList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='delete-project']");
    if (!button) return;
    const project = state.projects.find((item) => item.id === button.dataset.id);
    if (!project || !window.confirm(`Delete “${project.title}” from this device?`)) return;
    const previous = state.projects;
    state.projects = state.projects.filter((item) => item.id !== project.id);
    try {
      persist("projects");
      renderProjects();
      showMessage("Project deleted from this device.");
    } catch (error) {
      state.projects = previous;
      showMessage(saveErrorMessage(error), "error");
    }
  });

  elements.materialsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const nextMaterials = {
      sand: {
        available: document.querySelector("#sandAvailable").checked,
        note: cleanText(document.querySelector("#sandNote").value, 180),
        updatedAt: now,
      },
      bricks: {
        available: document.querySelector("#bricksAvailable").checked,
        note: cleanText(document.querySelector("#bricksNote").value, 180),
        updatedAt: now,
      },
      cement: {
        available: document.querySelector("#cementAvailable").checked,
        note: cleanText(document.querySelector("#cementNote").value, 180),
        updatedAt: now,
      },
    };
    const previous = state.materials;
    state.materials = nextMaterials;
    try {
      persist("materials");
      showMessage("Material availability saved on this device.");
    } catch (error) {
      state.materials = previous;
      showMessage(saveErrorMessage(error), "error");
    }
  });

  elements.testimonialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!elements.testimonialForm.reportValidity()) return;
    const formData = new FormData(elements.testimonialForm);
    const testimonial = normalizeTestimonial({
      id: makeId("testimonial"),
      name: formData.get("name"),
      location: formData.get("location"),
      quote: formData.get("quote"),
      permission: formData.get("permission") === "on",
      createdAt: new Date().toISOString(),
    });
    if (!testimonial) {
      showMessage("Confirm customer permission before saving this testimonial.", "error");
      return;
    }
    state.testimonials.unshift(testimonial);
    try {
      persist("testimonials");
      elements.testimonialForm.reset();
      renderTestimonials();
      showMessage("Approved testimonial saved on this device.");
    } catch (error) {
      state.testimonials.shift();
      showMessage(saveErrorMessage(error), "error");
    }
  });

  elements.testimonialList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='delete-testimonial']");
    if (!button) return;
    const testimonial = state.testimonials.find((item) => item.id === button.dataset.id);
    if (!testimonial || !window.confirm(`Delete the testimonial from ${testimonial.name}?`)) return;
    const previous = state.testimonials;
    state.testimonials = state.testimonials.filter((item) => item.id !== testimonial.id);
    try {
      persist("testimonials");
      renderTestimonials();
      showMessage("Testimonial deleted from this device.");
    } catch (error) {
      state.testimonials = previous;
      showMessage(saveErrorMessage(error), "error");
    }
  });

  elements.exportButton.addEventListener("click", () => {
    const backup = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      [STORAGE_KEYS.settings]: state.settings,
      [STORAGE_KEYS.projects]: state.projects,
      [STORAGE_KEYS.materials]: state.materials,
      [STORAGE_KEYS.testimonials]: state.testimonials,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buniyaad-preview-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showMessage("Backup downloaded.");
  });

  elements.importFile.addEventListener("change", async () => {
    const file = elements.importFile.files?.[0];
    if (!file) return;
    if (!window.confirm("Import this backup and replace the current device preview data?")) {
      elements.importFile.value = "";
      return;
    }
    try {
      const payload = JSON.parse(await file.text());
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("Backup must be a JSON object");
      }
      const pick = (name) => payload[STORAGE_KEYS[name]] ?? payload[name];
      const imported = {
        settings: normalizeSettings(pick("settings")),
        projects: normalizeProjects(pick("projects")),
        materials: normalizeMaterials(pick("materials")),
        testimonials: normalizeTestimonials(pick("testimonials")),
      };
      const hasRecognizedKey = Object.entries(STORAGE_KEYS).some(
        ([name, key]) => Object.hasOwn(payload, key) || Object.hasOwn(payload, name),
      );
      if (!hasRecognizedKey) throw new Error("This is not a Buniyaad dashboard backup");
      persistAll(imported);
      state = imported;
      renderAll();
      showMessage("Backup imported. The device preview has been updated.");
    } catch (error) {
      console.error(error);
      showMessage("That backup could not be imported. Choose a valid dashboard JSON file.", "error");
    } finally {
      elements.importFile.value = "";
    }
  });

  elements.resetButton.addEventListener("click", () => {
    if (
      !window.confirm(
        "Reset all Buniyaad preview data on this device? This removes saved projects and testimonials and cannot be undone unless you exported a backup.",
      )
    ) {
      return;
    }
    const nextState = clone(DEFAULTS);
    try {
      persistAll(nextState);
      state = nextState;
      elements.projectForm.reset();
      elements.testimonialForm.reset();
      fileSelectionSummary();
      renderAll();
      showMessage("Device preview data reset.");
    } catch (error) {
      showMessage(saveErrorMessage(error), "error");
    }
  });

  window.addEventListener("storage", (event) => {
    if (!Object.values(STORAGE_KEYS).includes(event.key)) return;
    state = loadState();
    renderAll();
    showMessage("Preview data changed in another tab and was refreshed.");
  });

  renderAll();
})();
