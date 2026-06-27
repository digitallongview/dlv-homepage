/*
 * Zeitpyramide funnel — production script.
 *
 * No in-browser Babel: this is plain ES (React.createElement, no JSX). React and
 * ReactDOM are loaded as local UMD globals from ./vendor/ (see index.html), so the
 * page is fully self-contained and ships verbatim via the normal Vite build
 * (public/funnel/ -> dist/funnel/ -> served at /funnel/).
 *
 * The submission POSTs JSON to the same-origin mail endpoint /api/contact.php.
 */
(function () {
  "use strict";

  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var h = React.createElement;

  var ink = "#07070d";
  var cream = "#f7eced";
  var lavender = "#8c74aa";
  var lavenderLight = "#b29bd0";
  var gradientLavender = "linear-gradient(120deg, #a991c7 0%, #8c74aa 55%, #6a4f8e 100%)";

  // The mail endpoint lives at the same origin, so a root-relative path works
  // behind any domain/path and needs no CORS.
  var ENDPOINT = "/api/contact.php";
  var MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB, kept in sync with contact.php

  var ADDITIONS = [
    "What would you want them to know about us?",
    "What are we building today that will last?",
    "What should we stop before they inherit it?",
    "If you could send one object to 3183, what would it be?",
    "What do you think they will have forgotten about us?",
  ];

  var CARDS = [
    { id: "hook", type: "hook" },
    { id: "reveal", type: "reveal" },
    { id: "q1", type: "question", index: 0 },
    { id: "q2", type: "question", index: 1 },
    { id: "q3", type: "question", index: 2 },
    { id: "submit", type: "submit" },
  ];

  var QUESTIONS = [
    { eyebrow: "For those who finish what we started", headline: "The people who place the last stone in 3183 will know what we were thinking right now.", body: "Every decision made today, what to build, what to question, what to leave unfinished, becomes the foundation for generations we will never meet. This record is theirs too." },
    { eyebrow: "On responsibility", headline: "What should we stop before they inherit it?", body: "A community that thinks 1,200 years ahead thinks differently about next year too. The pyramid is not just a monument to patience. It is a quiet challenge to act as if the future is already watching." },
    { eyebrow: "A wish for the future", headline: "What do you wish for those generations and what would you preserve?", body: "The pyramid will outlast every argument about whether it was worth building. What you think about this today is as much part of the pyramid as the stones themselves." },
  ];

  function Eyebrow(props) {
    return h('span', { style: { fontSize: 11, letterSpacing: "0.42em", textTransform: "uppercase", color: lavender, display: "block" } }, props.children);
  }

  function Divider() {
    return h('div', { style: { height: 1, background: "linear-gradient(90deg, rgba(140,116,170,0.4) 0%, rgba(140,116,170,0.05) 100%)", borderRadius: 1 } });
  }

  // Privacy- and performance-friendly YouTube embed: shows only a poster image
  // with a lavender play overlay. The actual iframe (youtube-nocookie, autoplay)
  // is mounted lazily, ONLY after the user clicks.
  function YouTubeFacade(props) {
    var id = props.id;
    var label = props.label;
    var caption = props.caption;
    var onActivate = props.onActivate;
    var activatedState = useState(false);
    var activated = activatedState[0];
    var setActivated = activatedState[1];

    function activate() {
      if (activated) return;
      setActivated(true);
      if (typeof onActivate === "function") onActivate();
    }

    function onKey(e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    }

    var container = {
      position: "relative",
      width: "100%",
      aspectRatio: "16/9",
      borderRadius: 10,
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(90,65,120,0.35) 0%, rgba(7,7,13,0.8) 100%)",
      border: "1px solid rgba(247,236,237,0.1)",
    };

    if (activated) {
      return h('div', { style: container },
        h('iframe', {
          src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0",
          title: label || "YouTube video",
          style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 },
          allow: "accelerated-decoding; autoplay; encrypted-media; picture-in-picture; web-share; fullscreen",
          allowFullScreen: true,
          loading: "lazy"
        })
      );
    }

    var poster = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";

    return h('div', {
        onClick: activate,
        onKeyDown: onKey,
        role: "button",
        tabIndex: 0,
        "aria-label": label ? ("Play video: " + label) : "Play video",
        style: Object.assign({}, container, { cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" })
      },
      // Poster
      h('img', { src: poster, alt: "", loading: "lazy", style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 } }),
      // Dark wash so the lavender controls stay readable
      h('div', { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(90,65,120,0.35) 0%, rgba(7,7,13,0.78) 100%)" } }),
      // Decorative pyramid silhouette (matches the original mock)
      h('div', { style: { position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "80px solid transparent", borderRight: "80px solid transparent", borderBottom: "60px solid rgba(140,116,170,0.18)" } }),
      h('div', { style: { position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } },
        // Lavender play button
        h('div', { style: { width: 56, height: 56, borderRadius: "50%", background: "rgba(140,116,170,0.28)", border: "1px solid " + lavender, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px -6px rgba(140,116,170,0.6)" } },
          h('span', { style: { color: lavenderLight, fontSize: 20, marginLeft: 4 } }, "▶")
        ),
        label && h('span', { style: { fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(247,236,237,0.7)" } }, label)
      ),
      caption && h('div', { style: { position: "absolute", bottom: 10, left: 12, zIndex: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(247,236,237,0.35)" } }, caption)
    );
  }

  function PyramidSVG(props) {
    var width = props.width || 280;
    var height = props.height || 200;
    var sw = props.sw || 14;
    var sh = props.sh || 21;
    var gap = props.gap == null ? 2 : props.gap;
    var showGhost = props.showGhost == null ? true : props.showGhost;
    var opacity = props.opacity == null ? 1 : props.opacity;
    var unit = sw + gap;
    var svgW = width, svgH = height;
    var cx = props.cxProp || svgW / 2;
    var baseY = props.baseYProp || svgH - 16;
    var tiers = [{ count: 8, placed: 4 }, { count: 6, placed: 0 }, { count: 4, placed: 0 }, { count: 2, placed: 0 }];

    var stones = [];
    tiers.forEach(function (tier, ti) {
      var tierWidth = tier.count * unit - gap;
      var startX = cx - tierWidth / 2;
      var y = baseY - ti * (sh + gap);
      for (var si = 0; si < tier.count; si++) {
        var x = startX + si * unit;
        var isPlaced = ti === 0 && si < tier.placed;
        stones.push(
          h('g', { key: ti + "-" + si },
            h('rect', { x: x, y: y, width: sw, height: sh, rx: 1.5, fill: isPlaced ? "url(#pg)" : "rgba(140,116,170,0.07)", stroke: isPlaced ? "rgba(176,155,208,0.65)" : "rgba(140,116,170,0.2)", strokeWidth: isPlaced ? 0.8 : 0.5, strokeDasharray: isPlaced ? "none" : "2,1.5" }),
            isPlaced && h('text', { x: x + sw / 2, y: y + sh / 2 + 3, textAnchor: "middle", fontSize: 4, fill: "rgba(247,236,237,0.55)", fontFamily: "Inter, sans-serif" }, 1993 + si * 10)
          )
        );
      }
    });

    var ghostY = baseY - 4 * (sh + gap);
    var ghostX = cx - sw / 2;

    return h('svg', { viewBox: "0 0 " + svgW + " " + svgH, width: "100%", height: "100%", style: { display: "block", opacity: opacity } },
      h('defs', null,
        h('linearGradient', { id: "pg", x1: 0, y1: 0, x2: 0, y2: 1 },
          h('stop', { offset: "0%", stopColor: "rgba(210,195,230,0.95)" }),
          h('stop', { offset: "100%", stopColor: "rgba(130,110,160,0.75)" })
        ),
        h('linearGradient', { id: "gg", x1: 0, y1: 0, x2: 0, y2: 1 },
          h('stop', { offset: "0%", stopColor: "rgba(176,155,208,0.4)" }),
          h('stop', { offset: "100%", stopColor: "rgba(106,79,142,0.1)" })
        ),
        h('filter', { id: "glow2" },
          h('feGaussianBlur', { stdDeviation: 3, result: "blur" }),
          h('feMerge', null, h('feMergeNode', { in: "blur" }), h('feMergeNode', { in: "SourceGraphic" }))
        ),
        h('clipPath', { id: "svgclip" }, h('rect', { x: 0, y: 0, width: svgW, height: svgH }))
      ),
      h('g', { clipPath: "url(#svgclip)" },
        h('rect', { x: 10, y: baseY + sh + 2, width: svgW - 20, height: 1.5, rx: 1, fill: "rgba(247,236,237,0.06)" }),
        stones,
        showGhost && h('g', null,
          h('rect', { x: ghostX - 3, y: ghostY - 3, width: sw + 6, height: sh + 6, rx: 3, fill: "none", stroke: "rgba(176,155,208,0.15)", strokeWidth: 6, filter: "url(#glow2)" }),
          h('rect', { x: ghostX, y: ghostY, width: sw, height: sh, rx: 1.5, fill: "url(#gg)", stroke: "rgba(176,155,208,0.85)", strokeWidth: 1, strokeDasharray: "3,2", filter: "url(#glow2)" }),
          h('text', { x: cx, y: ghostY + sh / 2 + 3, textAnchor: "middle", fontSize: 4, fill: "rgba(176,155,208,0.9)", fontFamily: "Inter, sans-serif", fontStyle: "italic" }, "121?")
        )
      )
    );
  }

  function HookCard(props) {
    var videoStarted = props.videoStarted;
    return h('div', { style: { display: "flex", flexDirection: "column", gap: 22 } },
      h(Eyebrow, null, "Wemding, Germany · 1993 – 3183"),
      h('h1', { style: { fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 700, color: cream, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 } },
        "Some things are worth building ",
        h('span', { style: { backgroundImage: gradientLavender, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "even if you'll never see them finished.")
      ),
      h('p', { style: { fontSize: 15, color: "rgba(247,236,237,0.6)", lineHeight: 1.65, margin: 0, fontStyle: "italic" } },
        "The Zeitpyramide will be complete in the year 3183, long after everyone alive today is gone. One stone every ten years. A monument not to the past, but to the future."
      ),
      h(YouTubeFacade, { id: "vdRXwNII6xw", label: "Watch the pyramid", caption: "Luftbildphotogrammetrie · Wemding", onActivate: props.onVideoStart }),
      !videoStarted && h('p', { style: { fontSize: 12, color: "rgba(247,236,237,0.3)", margin: 0, fontStyle: "italic" } }, "Start the video to continue")
    );
  }

  function RevealCard() {
    return h('div', { style: { position: "relative", overflow: "hidden", borderRadius: 12, minHeight: 380 } },
      h('div', { style: { position: "absolute", top: 0, right: "-10%", width: "100%", height: "100%", overflow: "hidden" } },
        h('div', { style: { position: "absolute", top: 0, left: 0, width: "70%", height: "100%", background: "linear-gradient(90deg, rgba(7,7,13,1) 0%, rgba(7,7,13,0.92) 50%, transparent 100%)", zIndex: 2 } }),
        h(PyramidSVG, { width: 320, height: 280, cxProp: 320 * 0.6, baseYProp: 260, sw: 22, sh: 33, gap: 4 })
      ),
      h('div', { style: { position: "relative", zIndex: 3, display: "flex", flexDirection: "column", gap: 22, padding: "4px 0" } },
        h(Eyebrow, null, "The +1 Problem"),
        h('h2', { style: { fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: cream, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 } }, "1,190 years. Not 1,200."),
        h('p', { style: { fontSize: 13, color: "rgba(247,236,237,0.6)", lineHeight: 1.75, margin: 0, fontStyle: "italic" } },
          "In the film you just watched, the pyramid looks complete, all 120 stones, perfectly stacked. But there is a number hidden in the geometry. The project was conceived to span 1,200 years. Yet when the first stone was placed on 23 October 1993, the clock started immediately, not at the end of the first decade, but at the beginning. One stone every ten years, 120 stones: that is 1,190 years. Ten years short. A single miscalculation, built into the foundation."
        ),
        h(Divider),
        h('p', { style: { fontSize: 15, color: cream, lineHeight: 1.5, margin: 0, fontWeight: 600, letterSpacing: "-0.01em" } }, "Would you place the 121st stone to make the 1,200 years complete?"),
        h(YouTubeFacade, { id: "FAdmpAZTH_M", label: "The pyramid, up close", caption: "Zeitpyramide · Wemding" })
      )
    );
  }

  function QuestionCard(props) {
    var q = props.q;
    var video = props.video;
    var adState = useState(0);
    var adIndex = adState[0];
    var setAdIndex = adState[1];
    var fadeState = useState(false);
    var fading = fadeState[0];
    var setFading = fadeState[1];
    useEffect(function () {
      var interval = setInterval(function () {
        setFading(true);
        setTimeout(function () { setAdIndex(function (i) { return (i + 1) % ADDITIONS.length; }); setFading(false); }, 600);
      }, 3500);
      return function () { clearInterval(interval); };
    }, []);
    return h('div', { style: { display: "flex", flexDirection: "column", gap: 24 } },
      h(Eyebrow, null, q.eyebrow),
      h('h2', { style: { fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 700, color: cream, lineHeight: 1.12, letterSpacing: "-0.02em", margin: 0 } }, q.headline),
      h('p', { style: { fontSize: 14, color: "rgba(247,236,237,0.5)", lineHeight: 1.75, margin: 0, fontStyle: "italic" } }, q.body),
      video && h(YouTubeFacade, { id: video.id, label: video.label, caption: video.caption }),
      h(Divider),
      h('div', { style: { display: "flex", flexDirection: "column", gap: 12 } },
        h('span', { style: { fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(247,236,237,0.2)" } }, "Also consider"),
        h('div', { style: { minHeight: 52, display: "flex", alignItems: "center" } },
          h('p', { style: { fontSize: 16, color: lavenderLight, lineHeight: 1.5, margin: 0, fontStyle: "italic", fontWeight: 500, opacity: fading ? 0 : 0.75, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.6s ease, transform 0.6s ease" } }, ADDITIONS[adIndex])
        ),
        h('div', { style: { display: "flex", gap: 6 } },
          ADDITIONS.map(function (_, i) { return h('div', { key: i, onClick: function () { setFading(true); setTimeout(function () { setAdIndex(i); setFading(false); }, 300); }, style: { width: i === adIndex ? 16 : 4, height: 4, borderRadius: 2, background: i === adIndex ? lavender : "rgba(247,236,237,0.12)", transition: "width 0.4s ease", cursor: "pointer" } }); })
        )
      )
    );
  }

  function errorText(code) {
    switch (code) {
      case "invalid_email": return "That email address looks off. Leave it blank or correct it to continue.";
      case "image_too_large": return "That image is too large. Please choose one under 5 MB.";
      case "invalid_image": return "That file could not be used. Please choose an image.";
      case "message_required": return "Add a few words or an image before sending.";
      case "server_not_configured": return "The mailbox is not reachable right now. Please try again later.";
      default: return "We could not send your message. Please try again.";
    }
  }

  function SubmitCard(props) {
    var onSubmit = props.onSubmit;
    var textState = useState(""); var text = textState[0]; var setText = textState[1];
    var previewState = useState(null); var imagePreview = previewState[0]; var setImagePreview = previewState[1];
    var imageDataState = useState(null); var imageData = imageDataState[0]; var setImageData = imageDataState[1];
    var emailState = useState(""); var email = emailState[0]; var setEmail = emailState[1];
    var companyState = useState(""); var company = companyState[0]; var setCompany = companyState[1]; // honeypot
    var sendingState = useState(false); var sending = sendingState[0]; var setSending = sendingState[1];
    var errorState = useState(null); var errorMsg = errorState[0]; var setErrorMsg = errorState[1];
    var imgErrState = useState(null); var imgError = imgErrState[0]; var setImgError = imgErrState[1];
    var fileRef = useRef();

    var charCount = text.length;
    var overLimit = charCount > 500;
    var canSubmit = !overLimit && (text.trim().length > 0 || !!imagePreview);

    function handleImage(e) {
      var f = e.target.files[0];
      setImgError(null);
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        setImgError("Please choose an image file.");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        setImgError("That image is too large. Please choose one under 5 MB.");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var comma = result.indexOf(",");
        var base64 = comma >= 0 ? result.slice(comma + 1) : "";
        setImagePreview(result);
        setImageData({ filename: f.name, mime: f.type, dataBase64: base64 });
      };
      reader.onerror = function () { setImgError("Could not read that image. Please try another file."); };
      reader.readAsDataURL(f);
    }

    function removeImage() {
      if (fileRef.current) fileRef.current.value = "";
      setImagePreview(null);
      setImageData(null);
      setImgError(null);
    }

    function handleSend() {
      if (!canSubmit || sending) return;
      setSending(true);
      setErrorMsg(null);
      var payload = {
        type: "funnel",
        lang: "en",
        email: email.trim(),
        message: text.trim(),
        company: company,
        image: imageData ? { filename: imageData.filename, mime: imageData.mime, dataBase64: imageData.dataBase64 } : null,
      };
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (data) {
          if (res.ok && data && data.ok) {
            onSubmit(); // advance to ThankYouPage (this card unmounts)
            return;
          }
          setErrorMsg(errorText(data && data.error));
          setSending(false);
        });
      }).catch(function () {
        setErrorMsg("Something went wrong. Please check your connection and try again.");
        setSending(false);
      });
    }

    var buttonActive = canSubmit && !sending;

    return h('div', { style: { display: "flex", flexDirection: "column", gap: 22 } },
      h(Eyebrow, null, "Your words. Your future."),
      h('h2', { style: { fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: cream, lineHeight: 1.12, letterSpacing: "-0.02em", margin: 0 } }, "Tell us. What does your future look like?"),
      h('p', { style: { fontSize: 14, color: "rgba(247,236,237,0.4)", lineHeight: 1.7, margin: 0, fontStyle: "italic" } }, "Share your thoughts, your images, or both. A glimpse into what you imagine, wish for, or fear. Your words become part of the record that future generations in Wemding will inherit."),
      h(Divider),
      h('div', { style: { display: "flex", flexDirection: "column", gap: 6 } },
        h('textarea', { value: text, onChange: function (e) { setText(e.target.value); }, placeholder: "Write something for the future, a thought, a wish, a question...", rows: 4, style: { width: "100%", background: "rgba(247,236,237,0.04)", border: "1px solid " + (overLimit ? "#c0392b" : "rgba(247,236,237,0.1)"), borderRadius: 10, color: cream, fontSize: 14, lineHeight: 1.65, padding: "14px 16px", resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }, onFocus: function (e) { e.target.style.borderColor = lavender; }, onBlur: function (e) { e.target.style.borderColor = overLimit ? "#c0392b" : "rgba(247,236,237,0.1)"; } }),
        h('div', { style: { textAlign: "right", fontSize: 11, color: overLimit ? "#e74c3c" : "rgba(247,236,237,0.2)" } }, charCount + " / 500")
      ),
      // Visually-hidden honeypot. Real users never see or fill this.
      h('input', { type: "text", name: "company", value: company, onChange: function (e) { setCompany(e.target.value); }, tabIndex: -1, autoComplete: "off", "aria-hidden": "true", style: { position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" } }),
      h('div', null,
        h('input', { ref: fileRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleImage }),
        imagePreview
          ? h('div', { style: { position: "relative" } },
              h('img', { src: imagePreview, alt: "Preview", style: { width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(247,236,237,0.1)", display: "block" } }),
              h('button', { type: "button", onClick: removeImage, "aria-label": "Remove image", style: { position: "absolute", top: 8, right: 8, background: "rgba(7,7,13,0.85)", border: "none", color: cream, borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" } }, "x")
            )
          : h('button', { type: "button", onClick: function () { fileRef.current.click(); }, style: { width: "100%", background: "transparent", border: "1px dashed rgba(247,236,237,0.12)", color: "rgba(247,236,237,0.35)", borderRadius: 10, padding: "18px", fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxSizing: "border-box" } },
              h('span', null, "Add an image, optional")
            )
      ),
      imgError && h('div', { style: { fontSize: 12, color: "#e6a4a4", margin: "-8px 0 0" } }, imgError),
      h('input', { type: "email", value: email, onChange: function (e) { setEmail(e.target.value); }, placeholder: "Your email, optional, if you would like us to be in touch", style: { width: "100%", background: "rgba(247,236,237,0.04)", border: "1px solid rgba(247,236,237,0.1)", borderRadius: 10, color: cream, fontSize: 13, padding: "12px 16px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }, onFocus: function (e) { e.target.style.borderColor = lavender; }, onBlur: function (e) { e.target.style.borderColor = "rgba(247,236,237,0.1)"; } }),
      errorMsg && h('div', { role: "alert", style: { fontSize: 13, color: "#f0b4b4", background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.4)", borderRadius: 10, padding: "12px 14px", lineHeight: 1.5 } }, errorMsg),
      h('button', { type: "button", disabled: !buttonActive, onClick: handleSend, style: { background: buttonActive ? gradientLavender : "rgba(140,116,170,0.12)", border: "none", color: buttonActive ? cream : "rgba(247,236,237,0.2)", borderRadius: 40, padding: "14px 32px", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", cursor: buttonActive ? "pointer" : "default", alignSelf: "flex-start" } }, sending ? "Sending…" : "Send to the future")
    );
  }

  function ThankYouPage() {
    return h('div', { style: { minHeight: "100vh", background: ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', 'Helvetica Neue', sans-serif", padding: "32px 16px", boxSizing: "border-box", textAlign: "center" } },
      h('div', { style: { maxWidth: 480, width: "100%", display: "flex", flexDirection: "column", gap: 24, alignItems: "center" } },
        h('div', { style: { width: "100%", background: "rgba(247,236,237,0.02)", border: "1px solid rgba(247,236,237,0.06)", borderRadius: 14, padding: "24px 16px 12px" } },
          h(PyramidSVG, { width: 280, height: 160, sw: 14, sh: 21, gap: 2 }),
          h('p', { style: { fontSize: 9, color: "rgba(247,236,237,0.2)", margin: "8px 0 0", letterSpacing: "0.15em", textTransform: "uppercase" } }, "4 placed · 116 remaining · 1 unaccounted")
        ),
        h(Eyebrow, null, "Stone placed"),
        h('h1', { style: { fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 700, color: cream, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 } }, "Your contribution is part of the record now."),
        h('p', { style: { fontSize: 14, color: "rgba(247,236,237,0.5)", lineHeight: 1.7, margin: 0, fontStyle: "italic" } }, "Somewhere between 1993 and 3183, your words are here. The people who place the last stone will know what you were thinking today."),
        h('p', { style: { fontSize: 11, color: "rgba(247,236,237,0.22)", lineHeight: 1.9, margin: 0, letterSpacing: "0.08em" } }, "Next stone · 2033   ·   Last stone · 3183"),
        h('div', { style: { height: 1, background: "linear-gradient(90deg, rgba(140,116,170,0.4) 0%, rgba(140,116,170,0.05) 100%)", borderRadius: 1, width: "100%" } }),
        h('div', { style: { display: "flex", flexDirection: "column", gap: 12, width: "100%", alignItems: "center" } },
          h('a', { href: "https://zeitpyramide.de", target: "_blank", rel: "noreferrer", style: { background: "transparent", border: "1px solid rgba(140,116,170,0.35)", color: lavenderLight, borderRadius: 40, padding: "12px 28px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", width: "100%", boxSizing: "border-box" } }, "Learn more about the Zeitpyramide"),
          h('a', { href: "https://digitallongview.com", target: "_blank", rel: "noreferrer", style: { textDecoration: "none" } },
            h('div', { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1px solid rgba(247,236,237,0.1)", borderRadius: 8 } },
              h('svg', { width: 18, height: 18, viewBox: "0 0 20 20" },
                h('defs', null,
                  h('linearGradient', { id: "dlvG", x1: 0, y1: 0, x2: 1, y2: 1 },
                    h('stop', { offset: "0%", stopColor: "#a991c7" }),
                    h('stop', { offset: "100%", stopColor: "#6a4f8e" })
                  )
                ),
                h('polygon', { points: "10,2 18,18 2,18", fill: "none", stroke: "url(#dlvG)", strokeWidth: 1.5, strokeLinejoin: "round" }),
                h('polygon', { points: "10,7 15,18 5,18", fill: "url(#dlvG)", opacity: 0.3 })
              ),
              h('span', { style: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(247,236,237,0.5)" } }, "Digital Long View")
            )
          )
        )
      )
    );
  }

  function App() {
    var currentState = useState(0); var current = currentState[0]; var setCurrent = currentState[1];
    var videoState = useState(false); var videoStarted = videoState[0]; var setVideoStarted = videoState[1];
    var submittedState = useState(false); var submitted = submittedState[0]; var setSubmitted = submittedState[1];
    var animState = useState(false); var animating = animState[0]; var setAnimating = animState[1];
    var dirState = useState("right"); var direction = dirState[0]; var setDirection = dirState[1];
    var total = CARDS.length;

    function navigate(dir) {
      if (animating) return;
      setDirection(dir > 0 ? "right" : "left");
      setAnimating(true);
      setTimeout(function () { setCurrent(function (c) { return Math.min(Math.max(c + dir, 0), total - 1); }); setAnimating(false); }, 280);
    }

    function goTo(i) {
      if (animating) return;
      setDirection(i > current ? "right" : "left");
      setAnimating(true);
      setTimeout(function () { setCurrent(i); setAnimating(false); }, 280);
    }

    var progress = current / (total - 1);
    var nextLocked = current === 0 && !videoStarted;

    function renderCard() {
      var card = CARDS[current];
      if (card.type === "hook") return h(HookCard, { onVideoStart: function () { setVideoStarted(true); }, videoStarted: videoStarted });
      if (card.type === "reveal") return h(RevealCard);
      if (card.type === "question") {
        var video = card.index === 1 ? { id: "9X-IgEtx_iM", label: "Why build for the year 3183?", caption: "Zeitpyramide · Wemding" } : null;
        return h(QuestionCard, { q: QUESTIONS[card.index], video: video });
      }
      if (card.type === "submit") return h(SubmitCard, { onSubmit: function () { setSubmitted(true); } });
    }

    if (submitted) return h(ThankYouPage);

    return h('div', { style: { minHeight: "100vh", background: ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', 'Helvetica Neue', sans-serif", padding: "24px 16px", boxSizing: "border-box" } },
      h('div', { style: { width: "100%", maxWidth: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 } },
        h('div', { style: { flex: 1, height: 2, background: "rgba(247,236,237,0.08)", borderRadius: 2, overflow: "hidden" } },
          h('div', { style: { height: "100%", width: (progress * 100) + "%", background: gradientLavender, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius: 2 } })
        ),
        h('span', { style: { fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: lavender, minWidth: 40, textAlign: "right" } }, (current + 1) + " / " + total)
      ),
      h('div', { style: { width: "100%", maxWidth: 600, background: "rgba(247,236,237,0.04)", border: "1px solid rgba(247,236,237,0.09)", borderRadius: 16, padding: "40px 36px", boxSizing: "border-box", opacity: animating ? 0 : 1, transform: animating ? ("translateX(" + (direction === "right" ? "-20px" : "20px") + ")") : "translateX(0)", transition: "opacity 0.28s ease, transform 0.28s ease" } },
        renderCard()
      ),
      h('div', { style: { width: "100%", maxWidth: 600, display: "flex", justifyContent: "space-between", marginTop: 20 } },
        h('button', { type: "button", onClick: function () { navigate(-1); }, disabled: current === 0, style: { background: "transparent", border: "1px solid rgba(247,236,237," + (current === 0 ? "0.06" : "0.18") + ")", color: current === 0 ? "rgba(247,236,237,0.15)" : cream, borderRadius: 40, padding: "10px 24px", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", cursor: current === 0 ? "default" : "pointer" } }, "Back"),
        current < total - 1 && h('button', { type: "button", onClick: function () { if (!nextLocked) navigate(1); }, style: { background: nextLocked ? "rgba(140,116,170,0.12)" : gradientLavender, border: "none", color: nextLocked ? "rgba(247,236,237,0.2)" : cream, borderRadius: 40, padding: "10px 28px", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", cursor: nextLocked ? "default" : "pointer" } }, "Next")
      ),
      h('div', { style: { display: "flex", gap: 8, marginTop: 20 } },
        CARDS.map(function (_, i) { return h('div', { key: i, onClick: function () { goTo(i); }, style: { width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? lavender : "rgba(247,236,237,0.12)", transition: "width 0.3s ease", cursor: "pointer" } }); })
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
