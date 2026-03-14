const DEFAULT_MESSAGE =
  "Eid Mubarak! May this beautiful occasion bring prosperity, happiness, and endless blessings to you and your family. Wishing you joy, peace, and success in everything you do.";

const DEFAULT_MESSAGE_BN =
  "ঈদ মোবারক। এই পবিত্র উৎসব আপনার ও আপনার পরিবারের জীবনে সুখ, শান্তি, সমৃদ্ধি এবং অফুরন্ত বরকত বয়ে আনুক।";

const DESIGNS = ["classic", "letter", "long"];
const DESIGN_MESSAGE_LIMITS = {
  classic: 170,
  letter: 180,
  long: 260
};

const startBtn = document.getElementById("startBtn");
const landing = document.getElementById("landing");
const formSection = document.getElementById("formSection");
const previewSection = document.getElementById("previewSection");

const form = document.getElementById("cardForm");
const toNameInput = document.getElementById("toName");
const fromNameInput = document.getElementById("fromName");
const designInput = document.getElementById("design");
const languageInput = document.getElementById("language");
const messageInput = document.getElementById("message");
const messageCounter = document.getElementById("messageCounter");
const messageLimitHint = document.getElementById("messageLimitHint");

const card = document.getElementById("card");
const cardTitle = document.getElementById("cardTitle");
const cardSubtitle = document.getElementById("cardSubtitle");
const cardGreeting = document.getElementById("cardGreeting");
const cardMessage = document.getElementById("cardMessage");
const cardSignoff = document.querySelector(".card-signoff");
const cardSender = document.getElementById("cardSender");

const downloadBtn = document.getElementById("downloadBtn");
const editBtn = document.getElementById("editBtn");
const newBtn = document.getElementById("newBtn");

function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function normalizeName(value, fallback) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function getSelectedDesign(selectedValue) {
  return DESIGNS.includes(selectedValue) ? selectedValue : "classic";
}

function getDesignMessageLimit(design) {
  return DESIGN_MESSAGE_LIMITS[design] || DESIGN_MESSAGE_LIMITS.classic;
}

function applyDesignMessageLimit(design) {
  const limit = getDesignMessageLimit(design);
  messageInput.maxLength = limit;

  if (messageInput.value.length > limit) {
    messageInput.value = messageInput.value.slice(0, limit);
  }

  messageLimitHint.textContent =
    `Leave message empty to use the default blessing text automatically. Max ${limit} characters.`;
  updateMessageCounter();
}

function applyDesign(design) {
  card.classList.remove("design-classic", "design-letter", "design-long");
  card.classList.add(`design-${design}`);
}

function buildCardContent(receiver, sender, customMessage, language) {
  const isBangla = language === "bn";
  const safeReceiver = normalizeName(receiver, isBangla ? "বন্ধু" : "Friend");
  const safeSender = normalizeName(sender, isBangla ? "আপনার বন্ধু" : "Your Friend");
  const finalMessage =
    customMessage.trim().length > 0
      ? customMessage.trim()
      : isBangla
        ? DEFAULT_MESSAGE_BN
        : DEFAULT_MESSAGE;

  card.classList.toggle("lang-bn", isBangla);
  cardTitle.textContent = isBangla ? "ঈদ মোবারক" : "Eid Mubarak";
  cardSubtitle.textContent = isBangla ? "আপনার ও আপনার পরিবারের জন্য" : "To you and your family";
  cardGreeting.textContent = isBangla ? `প্রিয় ${safeReceiver},` : `Dear ${safeReceiver},`;
  cardMessage.textContent = finalMessage;
  cardSignoff.textContent = isBangla ? "শুভেচ্ছান্তে," : "Warm wishes,";
  cardSender.textContent = safeSender;

  return { safeReceiver, safeSender };
}

function updateMessageCounter() {
  const max = Number(messageInput.maxLength) || 0;
  messageCounter.textContent = `${messageInput.value.length} / ${max}`;
}

function createExportStage() {
  const rect = card.getBoundingClientRect();
  const exportWidth = Math.max(1, Math.round(rect.width));
  const exportHeight = Math.max(1, Math.round(rect.height));
  const stage = document.createElement("div");
  const clone = card.cloneNode(true);

  stage.className = "export-stage";
  stage.style.width = `${exportWidth}px`;
  stage.style.height = `${exportHeight}px`;

  clone.removeAttribute("id");
  clone.classList.add("export-mode");
  clone.style.width = `${exportWidth}px`;
  clone.style.height = `${exportHeight}px`;
  clone.style.maxWidth = "none";
  clone.style.aspectRatio = "auto";
  clone.style.margin = "0";
  clone.style.display = "block";

  stage.appendChild(clone);
  document.body.appendChild(stage);

  return { stage, clone, exportWidth, exportHeight };
}

startBtn.addEventListener("click", () => {
  hideElement(landing);
  showElement(formSection);
  toNameInput.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const receiver = toNameInput.value;
  const sender = fromNameInput.value;
  const message = messageInput.value;
  const design = getSelectedDesign(designInput.value);
  const language = languageInput.value;

  buildCardContent(receiver, sender, message, language);
  applyDesign(design);

  showElement(previewSection);
  previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

messageInput.addEventListener("input", updateMessageCounter);
designInput.addEventListener("change", () => {
  applyDesignMessageLimit(getSelectedDesign(designInput.value));
});

editBtn.addEventListener("click", () => {
  hideElement(previewSection);
  showElement(formSection);
  formSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

newBtn.addEventListener("click", () => {
  form.reset();
  applyDesign("classic");
  card.classList.remove("lang-bn");
  cardTitle.textContent = "Eid Mubarak";
  cardSubtitle.textContent = "To you and your family";
  cardGreeting.textContent = "Dear Friend,";
  cardMessage.textContent = "";
  cardSignoff.textContent = "Warm wishes,";
  cardSender.textContent = "Your Name";
  applyDesignMessageLimit("classic");
  updateMessageCounter();
  hideElement(previewSection);
  showElement(formSection);
  toNameInput.focus();
});

applyDesignMessageLimit("classic");
updateMessageCounter();

downloadBtn.addEventListener("click", async () => {
  const previousLabel = downloadBtn.textContent;
  let exportStage;

  try {
    downloadBtn.disabled = true;
    downloadBtn.textContent = "Preparing image...";

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const exportSetup = createExportStage();
    exportStage = exportSetup.stage;

    const canvas = await html2canvas(exportSetup.clone, {
      scale: Math.max(2, window.devicePixelRatio || 1),
      useCORS: true,
      backgroundColor: "#ffffff",
      width: exportSetup.exportWidth,
      height: exportSetup.exportHeight,
      windowWidth: exportSetup.exportWidth,
      windowHeight: exportSetup.exportHeight,
      scrollX: 0,
      scrollY: 0
    });

    const link = document.createElement("a");
    const receiverName = normalizeName(toNameInput.value, languageInput.value === "bn" ? "bondhu" : "friend")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const safeFileReceiver = receiverName || (languageInput.value === "bn" ? "bangla" : "friend");

    link.href = canvas.toDataURL("image/png");
    link.download = `eid-card-${safeFileReceiver}.png`;
    link.click();
  } catch (error) {
    // Keep alert simple so users understand why download failed.
    window.alert("Could not generate the image. Please try again.");
    console.error("Download failed", error);
  } finally {
    if (exportStage) {
      exportStage.remove();
    }

    downloadBtn.disabled = false;
    downloadBtn.textContent = previousLabel;
  }
});
