(() => {
  "use strict";

  const DEMO_TRACKS = [
    {
      id: "switchback",
      title: "Switchback",
      artist: "Field Manual",
      album: "Terrain Studies",
      bpm: 172,
      modes: ["run", "cycle"],
      scenes: ["mountain", "forest"],
      color: "#e36b2d",
      src: "https://mdn.github.io/webaudio-examples/audio-analyser/viper.mp3"
    },
    {
      id: "night-drive",
      title: "Night Drive",
      artist: "Aerial Static",
      album: "City After Rain",
      bpm: 124,
      modes: ["drive", "cycle"],
      scenes: ["city", "mountain"],
      color: "#a5b0a2",
      src: "https://mdn.github.io/webaudio-examples/audio-basics/outfoxing.mp3"
    },
    {
      id: "sea-glass",
      title: "Sea Glass",
      artist: "Low Tide Radio",
      album: "Coastline Studies",
      bpm: 106,
      modes: ["walk", "cycle", "drive"],
      scenes: ["coast"],
      color: "#6e9fa0",
      src: "https://mdn.github.io/webaudio-examples/multi-track/bassguitar.mp3"
    },
    {
      id: "pine-line",
      title: "Pine Line",
      artist: "Northbound",
      album: "Green Distance",
      bpm: 148,
      modes: ["run", "cycle", "walk"],
      scenes: ["forest", "mountain"],
      color: "#6f8f68",
      src: "https://mdn.github.io/webaudio-examples/multi-track/clav.mp3"
    },
    {
      id: "concrete-bloom",
      title: "Concrete Bloom",
      artist: "Metric Park",
      album: "City After Rain",
      bpm: 132,
      modes: ["cycle", "drive", "run"],
      scenes: ["city"],
      color: "#bd8770",
      src: "https://mdn.github.io/webaudio-examples/multi-track/drums.mp3"
    },
    {
      id: "red-dirt",
      title: "Red Dirt",
      artist: "Open Road Unit",
      album: "Terrain Studies",
      bpm: 118,
      modes: ["drive", "cycle"],
      scenes: ["mountain", "city"],
      color: "#b55e48",
      src: "https://mdn.github.io/webaudio-examples/multi-track/leadguitar.mp3"
    },
    {
      id: "canopy",
      title: "Canopy",
      artist: "Quiet Weather",
      album: "Green Distance",
      bpm: 96,
      modes: ["walk", "cycle"],
      scenes: ["forest", "coast"],
      color: "#8c9b6b",
      src: "https://mdn.github.io/webaudio-examples/multi-track/horns.mp3"
    },
    {
      id: "late-checkout",
      title: "Late Checkout",
      artist: "Soft Signal",
      album: "Small Hours",
      bpm: 88,
      modes: ["walk", "drive"],
      scenes: ["city", "coast"],
      color: "#baa483",
      src: "https://mdn.github.io/webaudio-examples/audio-buffer-source-node/loop/rnb-lofi-melody-loop.wav"
    }
  ];

  const SCENES = {
    mountain: { label: "山路", eqLabel: "山路", gains: [2.5, 1.5, -0.5, 1.5, 3], accent: "#e36b2d" },
    city: { label: "城市公路", eqLabel: "城市公路", gains: [1.5, 1, -1.5, 1.5, 1], accent: "#bd8770" },
    coast: { label: "海边", eqLabel: "海边", gains: [-1.5, 0, 1, 2, 3], accent: "#6e9fa0" },
    forest: { label: "森林", eqLabel: "森林", gains: [2, 1.5, 0, -1, 1.5], accent: "#6f8f68" },
    neutral: { label: "中性", eqLabel: "中性", gains: [0, 0, 0, 0, 0], accent: "#f06b2d" }
  };

  const BANDS = [
    { label: "60", hz: 60, type: "lowshelf" },
    { label: "250", hz: 250, type: "peaking" },
    { label: "1k", hz: 1000, type: "peaking" },
    { label: "4k", hz: 4000, type: "peaking" },
    { label: "12k", hz: 12000, type: "highshelf" }
  ];

  const ACTIVITY_LABELS = {
    idle: "静止",
    walk: "步行",
    run: "跑步",
    cycle: "骑行",
    drive: "驾车"
  };

  const ACTIVITY_DETAILS = {
    idle: "等待移动",
    walk: "低速移动",
    run: "步频驱动",
    cycle: "速度驱动",
    drive: "速度驱动"
  };

  const refs = {
    app: document.querySelector("#appShell"),
    connectionState: document.querySelector("#connectionState"),
    connectionText: document.querySelector("#connectionText"),
    playerObject: document.querySelector("#playerObject"),
    playerModeNote: document.querySelector("#playerModeNote"),
    playerScreen: document.querySelector("#playerScreen"),
    screenActivity: document.querySelector("#screenActivity"),
    albumArt: document.querySelector("#albumArt"),
    albumArtIndex: document.querySelector("#albumArtIndex"),
    trackTitle: document.querySelector("#trackTitle"),
    trackArtist: document.querySelector("#trackArtist"),
    trackAlbum: document.querySelector("#trackAlbum"),
    screenProgressBar: document.querySelector("#screenProgressBar"),
    currentTime: document.querySelector("#currentTime"),
    duration: document.querySelector("#duration"),
    bottomCurrent: document.querySelector("#bottomCurrent"),
    bottomDuration: document.querySelector("#bottomDuration"),
    wheelCenterIcon: document.querySelector("#wheelCenterIcon"),
    wheelPlay: document.querySelector(".wheel-play"),
    clickWheel: document.querySelector("#clickWheel"),
    progressRange: document.querySelector("#progressRange"),
    volumeRange: document.querySelector("#volumeRange"),
    activityValue: document.querySelector("#activityValue"),
    activityDetail: document.querySelector("#activityDetail"),
    cadenceValue: document.querySelector("#cadenceValue"),
    cadenceDetail: document.querySelector("#cadenceDetail"),
    speedValue: document.querySelector("#speedValue"),
    speedDetail: document.querySelector("#speedDetail"),
    sensorStatus: document.querySelector("#sensorStatus"),
    activityMode: document.querySelector("#activityMode"),
    sceneMode: document.querySelector("#sceneMode"),
    locationButton: document.querySelector("#locationButton"),
    locationDetail: document.querySelector("#locationDetail"),
    recommendationReason: document.querySelector("#recommendationReason"),
    recommendationList: document.querySelector("#recommendationList"),
    eqPresetName: document.querySelector("#eqPresetName"),
    eqBypassButton: document.querySelector("#eqBypassButton"),
    eqCanvas: document.querySelector("#eqCanvas"),
    eqSliders: document.querySelector("#eqSliders"),
    audioInput: document.querySelector("#audioInput"),
    audio: document.querySelector("#audio"),
    toast: document.querySelector("#toast")
  };

  const state = {
    tracks: [...DEMO_TRACKS],
    activeIndex: 0,
    recommendations: [],
    isPlaying: false,
    shuffle: false,
    repeat: false,
    muted: false,
    volume: 0.78,
    activityMode: "auto",
    sceneMode: "auto",
    eqGains: [...SCENES.city.gains],
    eqPreset: "city",
    eqBypass: false,
    objectUrls: [],
    toastTimer: null,
    motion: {
      status: "idle",
      samples: [],
      peaks: [],
      baseline: 9.8,
      lastPeak: 0,
      cadence: null,
      lastRender: 0
    },
    location: {
      status: "idle",
      watchId: null,
      lastPosition: null,
      speedHistory: [],
      speedKmh: 0,
      autoActivity: "idle",
      scene: "city",
      sceneSource: "fallback",
      lastGeocode: 0,
      abortController: null
    },
    audioGraph: {
      context: null,
      source: null,
      filters: [],
      analyser: null,
      ready: false,
      failed: false,
      frame: 0
    }
  };

  refs.audio.volume = state.volume;
  refs.audio.crossOrigin = "anonymous";

  function activeTrack() {
    return state.tracks[state.activeIndex] || state.tracks[0];
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function average(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function showToast(message, duration = 3200) {
    refs.toast.textContent = message;
    refs.toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => refs.toast.classList.remove("is-visible"), duration);
  }

  function setConnection(text, mode = "") {
    refs.connectionText.textContent = text;
    refs.connectionState.classList.toggle("is-live", mode === "live");
    refs.connectionState.classList.toggle("is-alert", mode === "alert");
  }

  function currentActivity() {
    if (state.activityMode !== "auto") return state.activityMode;
    return state.location.autoActivity;
  }

  function currentScene() {
    return state.sceneMode === "auto" ? state.location.scene : state.sceneMode;
  }

  function sceneLabel(scene = currentScene()) {
    return SCENES[scene]?.label || SCENES.city.label;
  }

  function activityLabel(activity = currentActivity()) {
    return ACTIVITY_LABELS[activity] || ACTIVITY_LABELS.walk;
  }

  function targetBpm(activity) {
    if (activity === "run") return state.motion.cadence || 164;
    if (activity === "cycle") return 128;
    if (activity === "drive") return 116;
    if (activity === "walk") return 102;
    return 110;
  }

  function renderTrack() {
    const track = activeTrack();
    if (!track) return;
    const trackNumber = String(state.activeIndex + 1).padStart(2, "0");
    refs.albumArt.style.setProperty("--art-color", track.color || "#f06b2d");
    refs.albumArtIndex.textContent = trackNumber;
    refs.trackTitle.textContent = track.title;
    refs.trackArtist.textContent = `${track.artist} · ${track.bpm} BPM`;
    refs.trackAlbum.textContent = track.album;
    refs.playerModeNote.textContent = track.local ? "本地音乐 · 浏览器内播放" : "样本音乐 · 可离线导入";
    refs.screenActivity.textContent = state.isPlaying ? "正在播放" : "已暂停";
    refs.wheelCenterIcon.textContent = state.isPlaying ? "Ⅱ" : "▶";
    refs.wheelPlay.textContent = state.isPlaying ? "Ⅱ" : "▶";
    updateMediaSession(track);
  }

  function renderProgress() {
    const current = Number.isFinite(refs.audio.currentTime) ? refs.audio.currentTime : 0;
    const total = Number.isFinite(refs.audio.duration) ? refs.audio.duration : 0;
    const percent = total > 0 ? clamp((current / total) * 100, 0, 100) : 0;
    refs.progressRange.value = String(percent);
    refs.screenProgressBar.style.width = `${percent}%`;
    refs.currentTime.textContent = formatTime(current);
    refs.bottomCurrent.textContent = formatTime(current);
    refs.duration.textContent = formatTime(total);
    refs.bottomDuration.textContent = formatTime(total);
  }

  function renderSensors() {
    const activity = currentActivity();
    refs.activityValue.textContent = activityLabel(activity);
    refs.activityDetail.textContent = state.activityMode === "auto"
      ? (state.location.status === "live" || state.motion.status === "live" ? ACTIVITY_DETAILS[activity] : "等待传感器或手动选择")
      : "手动选择";
    refs.cadenceValue.textContent = state.motion.cadence ? String(state.motion.cadence) : "—";
    refs.cadenceDetail.textContent = state.motion.status === "live"
      ? (state.motion.cadence ? "动作估算" : "检测中")
      : state.motion.status === "denied" ? "权限未开启" : "未启用";
    refs.speedValue.textContent = state.location.speedKmh.toFixed(1);
    refs.speedDetail.textContent = state.location.status === "live" ? "GPS 平滑值" : state.location.status === "denied" ? "权限未开启" : "定位未开启";
    refs.sensorStatus.textContent = sensorStatusLabel();
    refs.locationButton.textContent = state.location.status === "live" ? "停止定位" : "使用定位";
    refs.locationDetail.textContent = state.location.status === "live"
      ? `${sceneLabel()} · ${state.location.sceneSource === "location" ? "位置推断" : "默认场景"}`
      : "仅在启用定位时用于场景推断";
    refs.activityMode.value = state.activityMode;
    refs.sceneMode.value = state.sceneMode;
    refs.recommendationReason.textContent = `${sceneLabel()} · ${state.activityMode === "auto" ? "自动" : "手动"}`;
  }

  function sensorStatusLabel() {
    if (state.motion.status === "live" || state.location.status === "live") return "监听中";
    if (state.motion.status === "denied" || state.location.status === "denied") return "部分关闭";
    return "待机";
  }

  function renderTransportState() {
    const shuffleButton = document.querySelector('[data-action="shuffle"]');
    const repeatButton = document.querySelector('[data-action="repeat"]');
    const muteButton = document.querySelector('[data-action="mute"]');
    shuffleButton?.setAttribute("aria-pressed", String(state.shuffle));
    repeatButton?.setAttribute("aria-pressed", String(state.repeat));
    muteButton?.setAttribute("aria-pressed", String(state.muted));
    refs.volumeRange.value = String(state.volume);
    refs.eqBypassButton.setAttribute("aria-pressed", String(state.eqBypass));
  }

  function renderRecommendations() {
    refs.recommendationList.replaceChildren();
    state.recommendations.forEach((track, index) => {
      const actualIndex = state.tracks.findIndex((candidate) => candidate.id === track.id);
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = `recommendation-item${actualIndex === state.activeIndex ? " is-active" : ""}`;
      button.dataset.trackIndex = String(actualIndex);
      button.setAttribute("aria-label", `播放 ${track.title}`);

      const number = document.createElement("span");
      number.className = "recommendation-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("span");
      copy.className = "recommendation-copy";
      const title = document.createElement("span");
      title.className = "recommendation-title";
      title.textContent = track.title;
      const meta = document.createElement("span");
      meta.className = "recommendation-meta";
      meta.textContent = `${track.artist} · ${track.bpm} BPM`;
      copy.append(title, meta);
      const play = document.createElement("span");
      play.className = "recommendation-play";
      play.textContent = actualIndex === state.activeIndex && state.isPlaying ? "Ⅱ" : "▶";
      button.append(number, copy, play);
      item.append(button);
      refs.recommendationList.append(item);
    });
  }

  function renderEqSliders() {
    refs.eqSliders.replaceChildren();
    state.eqGains.forEach((gain, index) => {
      const band = BANDS[index];
      const label = document.createElement("label");
      label.className = "eq-band";
      label.innerHTML = `<span>${band.label}</span><input type="range" min="-6" max="6" step="0.5" value="${gain}" data-eq-index="${index}" aria-label="${band.hz} Hz 增益"><output>${formatGain(gain)}</output>`;
      refs.eqSliders.append(label);
    });
    refs.eqPresetName.textContent = state.eqPreset === "manual" ? "手动曲线" : (SCENES[state.eqPreset]?.eqLabel || SCENES.city.eqLabel);
  }

  function formatGain(value) {
    const numeric = Number(value);
    return `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}`;
  }

  function recommendTracks() {
    const activity = currentActivity();
    const scene = currentScene();
    const desiredBpm = targetBpm(activity);
    const scored = state.tracks.map((track) => {
      let score = 0;
      if (track.scenes.includes(scene)) score += 60;
      if (track.modes.includes(activity)) score += 42;
      if (activity === "run" || activity === "cycle") score += Math.max(0, 34 - Math.abs(track.bpm - desiredBpm) * 0.7);
      else score += Math.max(0, 20 - Math.abs(track.bpm - desiredBpm) * 0.35);
      if (track.id === activeTrack()?.id) score += 3;
      return { track, score };
    });
    scored.sort((a, b) => b.score - a.score || a.track.title.localeCompare(b.track.title));
    state.recommendations = scored.slice(0, 3).map((entry) => entry.track);
  }

  function renderAll() {
    renderTrack();
    renderProgress();
    renderSensors();
    renderTransportState();
    recommendTracks();
    renderRecommendations();
    renderEqSliders();
    drawEqCanvas();
  }

  function setTrack(index, { autoplay = false } = {}) {
    const nextIndex = clamp(Number(index), 0, state.tracks.length - 1);
    const track = state.tracks[nextIndex];
    if (!track) return;
    state.activeIndex = nextIndex;
    state.isPlaying = false;
    refs.audio.pause();
    refs.audio.src = track.src;
    refs.audio.load();
    refs.playerObject.style.setProperty("--active-art", track.color || "var(--orange)");
    renderAll();
    if (autoplay) playAudio();
  }

  function nextTrack({ forcePlay = false } = {}) {
    if (!state.tracks.length) return;
    const shouldPlay = forcePlay || state.isPlaying;
    if (state.shuffle && state.tracks.length > 1) {
      const candidates = state.tracks.map((_, index) => index).filter((index) => index !== state.activeIndex);
      setTrack(candidates[Math.floor(Math.random() * candidates.length)], { autoplay: shouldPlay });
      return;
    }
    setTrack((state.activeIndex + 1) % state.tracks.length, { autoplay: shouldPlay });
  }

  function previousTrack() {
    if (refs.audio.currentTime > 4) {
      refs.audio.currentTime = 0;
      renderProgress();
      return;
    }
    setTrack((state.activeIndex - 1 + state.tracks.length) % state.tracks.length, { autoplay: state.isPlaying });
  }

  async function playAudio() {
    if (!refs.audio.src) setTrack(state.activeIndex);
    await ensureAudioGraph();
    try {
      await refs.audio.play();
      if (state.audioGraph.context?.state === "suspended") await state.audioGraph.context.resume();
    } catch (error) {
      state.isPlaying = false;
      renderTrack();
      if (error?.name === "NotAllowedError") showToast("浏览器阻止了播放，请再点一次播放。", 4200);
      else showToast("样本音乐暂时无法播放，可以导入本地音乐。", 4200);
    }
  }

  function pauseAudio() {
    refs.audio.pause();
  }

  async function togglePlay() {
    if (state.isPlaying) pauseAudio();
    else await playAudio();
  }

  function seekToPercent(value) {
    const duration = refs.audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    refs.audio.currentTime = (Number(value) / 100) * duration;
    renderProgress();
  }

  function adjustVolume(nextValue) {
    state.volume = clamp(nextValue, 0, 1);
    state.muted = state.volume === 0;
    refs.audio.volume = state.muted ? 0 : state.volume;
    renderTransportState();
  }

  function toggleMute() {
    state.muted = !state.muted;
    refs.audio.muted = state.muted;
    renderTransportState();
  }

  function updateMediaSession(track) {
    if (!("mediaSession" in navigator) || !("MediaMetadata" in window)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album
    });
  }

  function setMediaActionHandlers() {
    if (!("mediaSession" in navigator)) return;
    const handlers = {
      play: playAudio,
      pause: pauseAudio,
      nexttrack: nextTrack,
      previoustrack: previousTrack
    };
    Object.entries(handlers).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch (_) { /* optional action */ }
    });
  }

  async function ensureAudioGraph() {
    if (state.audioGraph.ready) return true;
    if (state.audioGraph.failed) return false;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      state.audioGraph.failed = true;
      return false;
    }
    try {
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(refs.audio);
      const filters = BANDS.map((band) => {
        const filter = context.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.value = band.hz;
        filter.Q.value = band.type === "peaking" ? 0.8 : 0.7;
        return filter;
      });
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      let previous = source;
      filters.forEach((filter) => { previous.connect(filter); previous = filter; });
      previous.connect(analyser);
      analyser.connect(context.destination);
      state.audioGraph = { context, source, filters, analyser, ready: true, failed: false, frame: 0 };
      applyEqToAudio();
      setConnection("音频已连接", "live");
      return true;
    } catch (error) {
      state.audioGraph.failed = true;
      setConnection("基础播放", "");
      return false;
    }
  }

  function applyEqToAudio() {
    state.audioGraph.filters.forEach((filter, index) => {
      filter.gain.value = state.eqBypass ? 0 : state.eqGains[index];
    });
  }

  function setEqPreset(scene) {
    const preset = SCENES[scene] || SCENES.neutral;
    state.eqPreset = scene;
    state.eqGains = [...preset.gains];
    applyEqToAudio();
    renderEqSliders();
    drawEqCanvas();
  }

  function updateEqFromSlider(input) {
    const index = Number(input.dataset.eqIndex);
    if (!Number.isInteger(index) || index < 0 || index >= BANDS.length) return;
    state.eqPreset = "manual";
    state.eqGains[index] = Number(input.value);
    input.closest("label")?.querySelector("output")?.replaceChildren(document.createTextNode(formatGain(state.eqGains[index])));
    applyEqToAudio();
    refs.eqPresetName.textContent = "手动曲线";
    drawEqCanvas();
  }

  function drawEqCanvas() {
    const canvas = refs.eqCanvas;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.save();
    context.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    context.strokeStyle = "#cbc8be";
    context.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach((fraction) => {
      context.beginPath();
      context.moveTo(0, h * fraction);
      context.lineTo(w, h * fraction);
      context.stroke();
    });
    context.beginPath();
    context.moveTo(0, h / 2);
    context.lineTo(w, h / 2);
    context.strokeStyle = "#9e9d94";
    context.stroke();

    const points = state.eqGains.map((gain, index) => ({
      x: (index / (BANDS.length - 1)) * w,
      y: h / 2 - (gain / 6) * (h * 0.38)
    }));
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = state.eqBypass ? "#9e9d94" : (SCENES[state.eqPreset]?.accent || "#f06b2d");
    context.lineWidth = 2;
    context.stroke();
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, Math.PI * 2);
      context.fillStyle = state.eqBypass ? "#9e9d94" : "#171816";
      context.fill();
      context.strokeStyle = state.eqBypass ? "#9e9d94" : (SCENES[state.eqPreset]?.accent || "#f06b2d");
      context.stroke();
    });

    if (state.audioGraph.analyser && state.isPlaying) {
      const data = new Uint8Array(state.audioGraph.analyser.frequencyBinCount);
      state.audioGraph.analyser.getByteFrequencyData(data);
      const barWidth = Math.max(2, w / data.length - 1);
      context.globalAlpha = 0.23;
      context.fillStyle = "#5d8d72";
      data.forEach((value, index) => {
        const barHeight = (value / 255) * h * 0.35;
        context.fillRect(index * (barWidth + 1), h - barHeight, barWidth, barHeight);
      });
      context.globalAlpha = 1;
    }
    context.restore();
    if (state.isPlaying && state.audioGraph.analyser && !state.audioGraph.frame) {
      const animate = () => {
        state.audioGraph.frame = window.requestAnimationFrame(() => {
          state.audioGraph.frame = 0;
          drawEqCanvas();
        });
      };
      animate();
    }
  }

  async function requestMotionAccess() {
    if (!("DeviceMotionEvent" in window)) {
      state.motion.status = "denied";
      renderSensors();
      showToast("此浏览器不提供运动传感器，已保留手动模式。");
      return;
    }
    try {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== "granted") throw new Error("permission-denied");
      }
      window.removeEventListener("devicemotion", handleMotion);
      window.addEventListener("devicemotion", handleMotion, { passive: true });
      state.motion.status = "live";
      renderSensors();
      showToast("步频检测已开启，走动或跑步几秒即可完成估算。");
    } catch (_) {
      state.motion.status = "denied";
      renderSensors();
      showToast("未获得运动权限，可直接用手动活动模式。");
    }
  }

  function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity || event.acceleration;
    if (!acceleration) return;
    const x = Number(acceleration.x) || 0;
    const y = Number(acceleration.y) || 0;
    const z = Number(acceleration.z) || 0;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const now = performance.now();
    state.motion.baseline = state.motion.baseline * 0.94 + magnitude * 0.06;
    const energy = Math.abs(magnitude - state.motion.baseline);
    const isPeak = energy > 0.85 && now - state.motion.lastPeak > 260;
    if (isPeak) {
      state.motion.peaks.push(now);
      state.motion.lastPeak = now;
      state.motion.peaks = state.motion.peaks.filter((peak) => now - peak < 12000);
      const intervals = [];
      for (let index = 1; index < state.motion.peaks.length; index += 1) {
        const interval = state.motion.peaks[index] - state.motion.peaks[index - 1];
        if (interval > 280 && interval < 1200) intervals.push(interval);
      }
      if (intervals.length >= 2) {
        const cadence = clamp(Math.round(60000 / median(intervals)), 70, 220);
        state.motion.cadence = cadence;
        if (state.activityMode === "auto" && cadence >= 125 && state.location.speedKmh < 12) state.location.autoActivity = "run";
      }
    }
    if (now - state.motion.lastRender > 500) {
      state.motion.lastRender = now;
      renderSensors();
      recommendTracks();
      renderRecommendations();
    }
  }

  function startLocationWatch() {
    if (!("geolocation" in navigator)) {
      state.location.status = "denied";
      renderSensors();
      showToast("此浏览器不支持定位，已使用城市公路作为默认场景。");
      return;
    }
    if (state.location.watchId !== null) {
      stopLocationWatch();
      return;
    }
    state.location.status = "waiting";
    renderSensors();
    state.location.watchId = navigator.geolocation.watchPosition(handlePosition, handleLocationError, {
      enableHighAccuracy: true,
      maximumAge: 2500,
      timeout: 10000
    });
    showToast("正在等待定位；浏览器可能会再次询问权限。", 3600);
  }

  function stopLocationWatch() {
    if (state.location.watchId !== null) navigator.geolocation.clearWatch(state.location.watchId);
    state.location.watchId = null;
    state.location.status = "idle";
    state.location.speedKmh = 0;
    renderSensors();
    showToast("定位已停止，位置不会离开浏览器。");
  }

  function handlePosition(position) {
    const now = Date.now();
    const coords = position.coords;
    let metersPerSecond = Number.isFinite(coords.speed) && coords.speed >= 0 ? coords.speed : 0;
    if (!metersPerSecond && state.location.lastPosition) {
      const elapsed = (now - state.location.lastPosition.time) / 1000;
      if (elapsed > 0) metersPerSecond = distanceBetween(state.location.lastPosition.coords, coords) / elapsed;
    }
    const kmh = clamp(metersPerSecond * 3.6, 0, 160);
    state.location.speedHistory.push(kmh);
    state.location.speedHistory = state.location.speedHistory.slice(-7);
    state.location.speedKmh = average(state.location.speedHistory);
    state.location.lastPosition = { coords, time: now };
    state.location.status = "live";
    state.location.autoActivity = classifyMovement(state.location.speedKmh, state.motion.cadence);
    renderSensors();
    recommendTracks();
    renderRecommendations();
    if (state.sceneMode === "auto" && now - state.location.lastGeocode > 60000) resolveScene(coords.latitude, coords.longitude);
  }

  function distanceBetween(start, end) {
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const lat1 = toRadians(start.latitude);
    const lat2 = toRadians(end.latitude);
    const dLat = lat2 - lat1;
    const dLon = toRadians(end.longitude - start.longitude);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function classifyMovement(speedKmh, cadence) {
    if (cadence && cadence >= 125 && speedKmh < 14) return "run";
    if (speedKmh < 1.2) return "idle";
    if (speedKmh < 8) return "walk";
    if (speedKmh < 32) return "cycle";
    return "drive";
  }

  function handleLocationError(error) {
    state.location.status = "denied";
    state.location.watchId = null;
    renderSensors();
    const message = error.code === 1 ? "定位权限未开启，可手动选择场景。" : "暂时拿不到定位，可手动选择场景。";
    showToast(message, 4200);
  }

  async function resolveScene(latitude, longitude) {
    if (state.location.abortController) state.location.abortController.abort();
    const controller = new AbortController();
    state.location.abortController = controller;
    state.location.lastGeocode = Date.now();
    const timeout = window.setTimeout(() => controller.abort(), 5500);
    try {
      const params = new URLSearchParams({ format: "jsonv2", zoom: "14", addressdetails: "1", lat: latitude.toFixed(4), lon: longitude.toFixed(4) });
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("reverse-geocode-failed");
      const data = await response.json();
      const scene = inferScene(data);
      state.location.scene = scene;
      state.location.sceneSource = "location";
      if (state.sceneMode === "auto") setEqPreset(scene);
      renderSensors();
      recommendTracks();
      renderRecommendations();
      showToast(`已根据位置切换到「${SCENES[scene].label}」场景。`, 3600);
    } catch (_) {
      state.location.sceneSource = "fallback";
      renderSensors();
    } finally {
      window.clearTimeout(timeout);
      state.location.abortController = null;
    }
  }

  function inferScene(data) {
    const address = data?.address || {};
    const text = [data?.display_name, data?.type, data?.category, ...Object.values(address)].filter(Boolean).join(" ").toLowerCase();
    if (/海|海岸|海滩|海湾|beach|coast|sea|bay|shore|marina|harbour|harbor/.test(text)) return "coast";
    if (/森林|林地|湿地|公园|林场|forest|wood|park|nature|reserve|wetland/.test(text)) return "forest";
    if (/山|山地|高原|丘陵|山口|mountain|hill|valley|peak|ridge|pass/.test(text)) return "mountain";
    return "city";
  }

  function handleActivityChange(event) {
    state.activityMode = event.target.value;
    refreshEnvironment();
    showToast(state.activityMode === "auto" ? "活动检测已恢复自动。" : `活动设为「${activityLabel(state.activityMode)}」。`, 2600);
  }

  function handleSceneChange(event) {
    state.sceneMode = event.target.value;
    const scene = currentScene();
    setEqPreset(scene);
    refreshEnvironment();
    showToast(state.sceneMode === "auto" ? "场景检测已恢复自动。" : `场景设为「${sceneLabel(scene)}」。`, 2600);
  }

  function refreshEnvironment() {
    renderSensors();
    recommendTracks();
    renderRecommendations();
    if (state.sceneMode !== "auto") setEqPreset(state.sceneMode);
  }

  function importAudioFiles(event) {
    const files = [...(event.target.files || [])].filter((file) => file.type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name));
    if (!files.length) return;
    let firstIndex = state.activeIndex;
    files.forEach((file, fileIndex) => {
      const url = URL.createObjectURL(file);
      state.objectUrls.push(url);
      const track = {
        id: `local-${Date.now()}-${fileIndex}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: "本地文件",
        album: "设备音乐",
        bpm: 120,
        modes: ["walk", "run", "cycle", "drive"],
        scenes: ["mountain", "city", "coast", "forest"],
        color: "#8e8b7e",
        src: url,
        local: true
      };
      state.tracks.push(track);
      if (fileIndex === 0) firstIndex = state.tracks.length - 1;
    });
    setTrack(firstIndex, { autoplay: true });
    refs.audioInput.value = "";
    showToast(files.length > 1 ? `已加入 ${files.length} 首本地音乐。` : "已载入本地音乐。", 3200);
  }

  function handleWheelAction(action) {
    if (action === "next") nextTrack();
    if (action === "previous") previousTrack();
    if (action === "play" || action === "select") togglePlay();
    if (action === "menu") showToast("用右侧场景和活动，调整下一首歌。", 2800);
  }

  function handleAction(action) {
    if (action === "open-audio") refs.audioInput.click();
    if (action === "motion") requestMotionAccess();
    if (action === "location") startLocationWatch();
    if (action === "shuffle") {
      state.shuffle = !state.shuffle;
      renderTransportState();
      showToast(state.shuffle ? "随机播放已开启。" : "随机播放已关闭。", 2200);
    }
    if (action === "repeat") {
      state.repeat = !state.repeat;
      renderTransportState();
      showToast(state.repeat ? "单曲循环已开启。" : "循环已关闭。", 2200);
    }
    if (action === "mute") toggleMute();
    if (action === "eq-bypass") {
      state.eqBypass = !state.eqBypass;
      applyEqToAudio();
      renderTransportState();
      drawEqCanvas();
    }
  }

  function handleKeyboard(event) {
    const target = event.target;
    const isFormField = target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
    if (isFormField && event.key !== "Escape") return;
    if (event.key === " ") { event.preventDefault(); togglePlay(); }
    if (event.key === "ArrowRight") { event.preventDefault(); refs.audio.currentTime = clamp((refs.audio.currentTime || 0) + 5, 0, refs.audio.duration || Infinity); renderProgress(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); refs.audio.currentTime = clamp((refs.audio.currentTime || 0) - 5, 0, refs.audio.duration || Infinity); renderProgress(); }
    if (event.key === "ArrowUp") { event.preventDefault(); adjustVolume(state.volume + 0.05); }
    if (event.key === "ArrowDown") { event.preventDefault(); adjustVolume(state.volume - 0.05); }
    if (event.key.toLowerCase() === "m") toggleMute();
  }

  function setupWheelDrag() {
    let startX = 0;
    let startY = 0;
    let dragging = false;
    refs.clickWheel.addEventListener("pointerdown", (event) => {
      startX = event.clientX;
      startY = event.clientY;
      dragging = true;
      refs.clickWheel.setPointerCapture?.(event.pointerId);
    });
    refs.clickWheel.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 40 || Math.abs(dy) > 40) {
        if (Math.abs(dx) > Math.abs(dy)) handleWheelAction(dx > 0 ? "next" : "previous");
        else adjustVolume(state.volume + (dy < 0 ? 0.05 : -0.05));
      }
    });
    refs.clickWheel.addEventListener("pointercancel", () => { dragging = false; });
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");
      if (actionElement) handleAction(actionElement.dataset.action);
      const wheelElement = event.target.closest("[data-wheel-action]");
      if (wheelElement) handleWheelAction(wheelElement.dataset.wheelAction);
      const recommendation = event.target.closest("[data-track-index]");
      if (recommendation) setTrack(Number(recommendation.dataset.trackIndex), { autoplay: true });
    });
    refs.activityMode.addEventListener("change", handleActivityChange);
    refs.sceneMode.addEventListener("change", handleSceneChange);
    refs.audioInput.addEventListener("change", importAudioFiles);
    refs.progressRange.addEventListener("input", (event) => seekToPercent(event.target.value));
    refs.volumeRange.addEventListener("input", (event) => adjustVolume(Number(event.target.value)));
    refs.eqSliders.addEventListener("input", (event) => { if (event.target.matches("[data-eq-index]")) updateEqFromSlider(event.target); });
    refs.audio.addEventListener("play", () => { state.isPlaying = true; renderTrack(); renderRecommendations(); drawEqCanvas(); setConnection("播放中", "live"); });
    refs.audio.addEventListener("pause", () => { state.isPlaying = false; renderTrack(); renderRecommendations(); drawEqCanvas(); if (!state.audioGraph.ready) setConnection("本地模式", ""); });
    refs.audio.addEventListener("timeupdate", renderProgress);
    refs.audio.addEventListener("loadedmetadata", renderProgress);
    refs.audio.addEventListener("volumechange", () => { state.muted = refs.audio.muted; renderTransportState(); });
    refs.audio.addEventListener("ended", () => {
      if (state.repeat) {
        refs.audio.currentTime = 0;
        playAudio();
      } else nextTrack({ forcePlay: true });
    });
    refs.audio.addEventListener("error", () => {
      if (activeTrack()?.local) showToast("这个本地文件无法解码，请换一个音频格式。", 4200);
      else showToast("样本音乐加载失败，可以导入本地音乐继续使用。", 4200);
      setConnection("等待音乐", "alert");
    });
    window.addEventListener("resize", drawEqCanvas, { passive: true });
    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("online", () => setConnection(state.isPlaying ? "播放中" : "网络可用", "live"));
    window.addEventListener("offline", () => { if (!state.isPlaying) setConnection("离线模式", ""); });
    window.addEventListener("beforeunload", () => state.objectUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  function init() {
    setTrack(0);
    setEqPreset("city");
    setMediaActionHandlers();
    setupWheelDrag();
    bindEvents();
    renderAll();
    window.requestAnimationFrame(drawEqCanvas);
  }

  init();
})();
