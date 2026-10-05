"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { teas } from "@/components/leaves/teas";

type Three = typeof import("three");
type RoomEnv =
  typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;

const TAU = Math.PI * 2;

async function build(
  THREE: Three,
  RoomEnvironment: RoomEnv,
  host: HTMLElement,
  label: HTMLElement,
): Promise<() => void> {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.5 : 2),
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.6;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.4;

  const key = new THREE.DirectionalLight(0xfff2dc, 1.9);
  key.position.set(4, 8, 3.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4.2;
  key.shadow.camera.right = 4.2;
  key.shadow.camera.top = 4.2;
  key.shadow.camera.bottom = -4.2;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 4;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xbfe3c0, 0x14291c, 0.55));
  const rim = new THREE.DirectionalLight(0x9fd3c7, 0.9);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 0.25, 0);

  // --- materials -----------------------------------------------------------
  // Celadon glaze, painted on canvases. One shared set of crackle lines drives the colour, bump and roughness maps so
  // they line up. What makes it read as fired clay rather than plastic: a faint orange-peel texture, tea-stained
  // crackle, glaze pooling dark near the foot, glaze thin and brown at the lip, and bare clay on the foot.
  const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  type Band = {
    v: number;
    h: number;
    rep: number;
    amp: number;
    leaf: number;
    flowers?: boolean;
  };
  type GlazeOpts = {
    base: string;
    W?: number;
    band?: Band;
    clayV?: number;
    lipV?: number;
    lipH?: number;
  };
  const texList: import("three").Texture[] = [];
  const crackLines = (n: number) =>
    Array.from({ length: n }, () => {
      let u = rnd();
      let v = rnd();
      let ang = rnd() * TAU;
      const pts: [number, number][] = [[u, v]];
      const steps = 6 + Math.floor(rnd() * 10);
      for (let k = 0; k < steps; k++) {
        ang += (rnd() - 0.5) * 1.3;
        u += Math.cos(ang) * (0.003 + rnd() * 0.01);
        v += Math.sin(ang) * (0.006 + rnd() * 0.02);
        pts.push([u, v]);
      }
      return pts;
    });
  const makeCanvas = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const makeGlaze = (o: GlazeOpts) => {
    const W = o.W ?? 1024;
    const H = W / 2;
    const sc = W / 1024;
    const lines = crackLines(200);
    const edge = (px: number, w: number, h: number, v: number) =>
      (1 - v) * h +
      Math.sin((px / w) * TAU * 7 + 1.3) * h * 0.007 +
      Math.sin((px / w) * TAU * 17) * h * 0.003;
    const drawLines = (
      x: CanvasRenderingContext2D,
      w: number,
      h: number,
      style: string,
      lw: number,
      dy = 0,
    ) => {
      x.strokeStyle = style;
      x.lineWidth = lw;
      x.lineCap = "round";
      x.lineJoin = "round";
      for (const pts of lines) {
        x.beginPath();
        pts.forEach(([u, v], i) => {
          if (i === 0) x.moveTo(u * w, v * h + dy);
          else x.lineTo(u * w, v * h + dy);
        });
        x.stroke();
      }
    };
    const clayPath = (
      x: CanvasRenderingContext2D,
      w: number,
      h: number,
      v: number,
    ) => {
      x.beginPath();
      x.moveTo(0, h);
      for (let px = 0; px <= w; px += 8) x.lineTo(px, edge(px, w, h, v));
      x.lineTo(w, h);
      x.closePath();
    };

    // --- colour
    const c = makeCanvas(W, H);
    const x = c.getContext("2d")!;
    x.fillStyle = o.base;
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < 110; i++) {
      const px = rnd() * W;
      const py = rnd() * H;
      const r = (30 + rnd() * 90) * sc;
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(
        0,
        rnd() > 0.5 ? "rgba(235,250,235,.07)" : "rgba(20,60,40,.08)",
      );
      g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g;
      x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    if (o.clayV !== undefined) {
      const y0 = (1 - o.clayV) * H;
      const g = x.createLinearGradient(0, y0, 0, y0 - 0.22 * H);
      g.addColorStop(0, "rgba(34,66,18,.36)");
      g.addColorStop(1, "rgba(34,66,18,0)");
      x.fillStyle = g;
      x.fillRect(0, y0 - 0.22 * H, W, 0.22 * H);
    }
    drawLines(x, W, H, "rgba(125,98,52,.22)", 1.7 * sc);
    drawLines(x, W, H, "rgba(40,66,24,.32)", 0.8 * sc);
    drawLines(x, W, H, "rgba(235,250,238,.1)", 0.7 * sc, 1.2 * sc);
    for (let i = 0; i < 900 * sc; i++) {
      x.fillStyle = rnd() > 0.9 ? "rgba(95,62,32,.4)" : "rgba(20,60,40,.22)";
      x.beginPath();
      x.arc(rnd() * W, rnd() * H, (0.5 + rnd() * 1.1) * sc, 0, TAU);
      x.fill();
    }
    if (o.band) {
      const band = o.band;
      const cy = (1 - band.v) * H;
      const bh = band.h * H;
      x.fillStyle = "rgba(25,70,48,.16)";
      x.fillRect(0, cy - bh * 1.05, W, 2 * sc);
      x.fillRect(0, cy + bh * 1.05, W, 2 * sc);
      const seg = W / band.rep;
      for (let r = 0; r < band.rep; r++) {
        const x0 = r * seg;
        x.beginPath();
        for (let t = 0; t <= 1.001; t += 0.02) {
          const px = x0 + t * seg;
          const py = cy + Math.sin(t * TAU) * band.amp * H;
          if (t === 0) x.moveTo(px, py);
          else x.lineTo(px, py);
        }
        x.strokeStyle = "rgba(52,100,44,.9)";
        x.lineWidth = 2.4 * sc;
        x.stroke();
        for (let k = 0; k < 7; k++) {
          const t = (k + 0.5) / 7;
          const px = x0 + t * seg;
          const py = cy + Math.sin(t * TAU) * band.amp * H;
          const dir = k % 2 ? 1 : -1;
          const ang = dir * (0.9 + Math.cos(t * TAU) * 0.25) - 0.1;
          const L = band.leaf * sc * (0.8 + rnd() * 0.4);
          x.save();
          x.translate(px, py);
          x.rotate(ang);
          x.beginPath();
          x.moveTo(0, 0);
          x.quadraticCurveTo(L * 0.5, -L * 0.34, L, 0);
          x.quadraticCurveTo(L * 0.5, L * 0.34, 0, 0);
          x.fillStyle = "rgba(48,96,42,.92)";
          x.fill();
          x.beginPath();
          x.moveTo(0, 0);
          x.lineTo(L * 0.92, 0);
          x.strokeStyle = "rgba(225,240,185,.55)";
          x.lineWidth = 1.2 * sc;
          x.stroke();
          x.restore();
        }
        if (band.flowers) {
          for (const t of [0.15, 0.62]) {
            const px = x0 + t * seg;
            const py =
              cy + Math.sin(t * TAU) * band.amp * H - band.leaf * sc * 0.5;
            for (let k = 0; k < 5; k++) {
              const a2 = (k / 5) * TAU;
              x.beginPath();
              x.arc(
                px + Math.cos(a2) * 5 * sc,
                py + Math.sin(a2) * 5 * sc,
                4.2 * sc,
                0,
                TAU,
              );
              x.fillStyle = "rgba(244,240,214,.95)";
              x.fill();
            }
            x.beginPath();
            x.arc(px, py, 3 * sc, 0, TAU);
            x.fillStyle = "rgba(217,162,74,1)";
            x.fill();
          }
        }
      }
    }
    if (o.lipV !== undefined) {
      const y = (1 - o.lipV) * H;
      const h = (o.lipH ?? 0.05) * H;
      const g = x.createLinearGradient(0, y - h, 0, y + h);
      g.addColorStop(0, "rgba(140,104,56,0)");
      g.addColorStop(0.5, "rgba(140,104,56,.75)");
      g.addColorStop(1, "rgba(140,104,56,0)");
      x.fillStyle = g;
      x.fillRect(0, y - h, W, 2 * h);
    }
    if (o.clayV !== undefined) {
      clayPath(x, W, H, o.clayV);
      x.fillStyle = "#a67a5e";
      x.fill();
      const top = (1 - o.clayV) * H;
      for (let i = 0; i < 1200 * sc; i++) {
        x.fillStyle =
          rnd() > 0.5 ? "rgba(90,60,40,.35)" : "rgba(214,176,144,.28)";
        const px = rnd() * W;
        x.fillRect(
          px,
          top + rnd() * (H - top),
          (1 + rnd() * 2.4) * sc,
          (1 + rnd() * 2.4) * sc,
        );
      }
    }
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;

    // --- bump: orange-peel grain, crackle as shallow grooves, rough bare clay
    const BW = 512;
    const BH = 256;
    const bc = makeCanvas(BW, BH);
    const bx = bc.getContext("2d")!;
    bx.fillStyle = "#808080";
    bx.fillRect(0, 0, BW, BH);
    for (let i = 0; i < 300; i++) {
      bx.fillStyle =
        rnd() > 0.5 ? "rgba(150,150,150,.22)" : "rgba(100,100,100,.22)";
      bx.beginPath();
      bx.arc(rnd() * BW, rnd() * BH, 1 + rnd() * 5, 0, TAU);
      bx.fill();
    }
    drawLines(bx, BW, BH, "#585858", 0.9);
    if (o.clayV !== undefined) {
      clayPath(bx, BW, BH, o.clayV);
      bx.fillStyle = "#808080";
      bx.fill();
      const top = (1 - o.clayV) * BH;
      for (let i = 0; i < 1500; i++) {
        bx.fillStyle = rnd() > 0.5 ? "#6c6c6c" : "#9a9a9a";
        bx.fillRect(
          rnd() * BW,
          top + rnd() * (BH - top),
          1 + rnd() * 2.5,
          1 + rnd() * 2.5,
        );
      }
    }
    const bump = new THREE.CanvasTexture(bc);

    // --- roughness: slightly varied glaze, glossier pools, matte crackle, very matte bare clay
    const rc = makeCanvas(BW, BH);
    const rx = rc.getContext("2d")!;
    rx.fillStyle = "rgb(84,84,84)";
    rx.fillRect(0, 0, BW, BH);
    for (let i = 0; i < 120; i++) {
      rx.fillStyle = rnd() > 0.5 ? "rgba(120,120,120,.2)" : "rgba(50,50,50,.2)";
      rx.beginPath();
      rx.arc(rnd() * BW, rnd() * BH, 4 + rnd() * 20, 0, TAU);
      rx.fill();
    }
    drawLines(rx, BW, BH, "rgb(150,150,150)", 1.0);
    if (o.clayV !== undefined) {
      clayPath(rx, BW, BH, o.clayV);
      rx.fillStyle = "rgb(228,228,228)";
      rx.fill();
    }
    const rough = new THREE.CanvasTexture(rc);

    for (const t of [map, bump, rough]) {
      t.anisotropy = 4;
      t.wrapS = THREE.RepeatWrapping;
      texList.push(t);
    }
    return { map, bump, rough };
  };
  const potG = makeGlaze({
    base: "#9bb673",
    W: 1536,
    band: { v: 0.69, h: 0.1, rep: 3, amp: 0.045, leaf: 62, flowers: true },
    clayV: 0.3,
  });
  await yieldToMain();
  const cupG = makeGlaze({
    base: "#a7c17d",
    band: { v: 0.455, h: 0.07, rep: 4, amp: 0.03, leaf: 34 },
    clayV: 0.3,
    lipV: 0.625,
    lipH: 0.06,
  });
  await yieldToMain();
  const saucerG = makeGlaze({
    base: "#a0ba79",
    clayV: 0.33,
    lipV: 0.67,
    lipH: 0.05,
  });
  await yieldToMain();
  const plainG = makeGlaze({ base: "#a0ba79" });
  const glazeMat = (g: {
    map: import("three").Texture;
    bump: import("three").Texture;
    rough: import("three").Texture;
  }) =>
    new THREE.MeshPhysicalMaterial({
      map: g.map,
      bumpMap: g.bump,
      bumpScale: 1.8,
      roughnessMap: g.rough,
      roughness: 1,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.32,
      side: THREE.DoubleSide,
    });
  const glazePot = glazeMat(potG);
  const glazeCup = glazeMat(cupG);
  const glazeSaucer = glazeMat(saucerG);
  const glaze = glazeMat(plainG);
  const lacquer = new THREE.MeshPhysicalMaterial({
    color: 0x1f4630,
    roughness: 0.42,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xd9a24a,
    metalness: 0.85,
    roughness: 0.3,
  });

  const lathe = (pts: [number, number][], segs = 72) =>
    new THREE.LatheGeometry(
      pts.map(([r, y]) => new THREE.Vector2(r, y)),
      segs,
    );
  const mesh = (
    g: import("three").BufferGeometry,
    m: import("three").Material,
  ) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = true;
    o.receiveShadow = true;
    return o;
  };

  // Nothing thrown by hand is perfectly round: nudge the radius by a few low, whole-number waves so the outline wanders.
  const wobble = (
    g: import("three").BufferGeometry,
    amp: number,
    ph: number,
  ) => {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      const th = Math.atan2(pz, px);
      const f =
        1 +
        amp *
          (Math.sin(3 * th + py * 2.3 + ph) * 0.6 +
            Math.sin(5 * th - py * 3.1 + ph * 2) * 0.4);
      pos.setXYZ(i, px * f, py, pz * f);
    }
    pos.needsUpdate = true;
    return g;
  };
  // A tube that is fatter at one end than the other, like a real spout or handle.
  const taperedTube = (
    curve: import("three").Curve<import("three").Vector3>,
    segs: number,
    radius: number,
    radial: number,
    f: (t: number) => number,
    flat = 1,
  ) => {
    const g = new THREE.TubeGeometry(curve, segs, radius, radial);
    const pos = g.attributes.position;
    for (let i = 0; i <= segs; i++) {
      const c = curve.getPointAt(i / segs);
      const k = f(i / segs);
      for (let j = 0; j <= radial; j++) {
        const idx = i * (radial + 1) + j;
        pos.setXYZ(
          idx,
          c.x + (pos.getX(idx) - c.x) * k,
          c.y + (pos.getY(idx) - c.y) * k,
          c.z + (pos.getZ(idx) - c.z) * k * flat,
        );
      }
    }
    pos.needsUpdate = true;
    return g;
  };

  const table = new THREE.Group();
  scene.add(table);

  // --- tray ------------------------------------------------------------------
  const FLOOR = 0.08;
  const tray = mesh(
    lathe([
      [0.001, 0],
      [2.9, 0],
      [3.06, 0.12],
      [3.06, 0.26],
      [2.99, 0.26],
      [2.99, 0.15],
      [2.84, FLOOR],
      [0.001, FLOOR],
    ]),
    lacquer,
  );
  tray.castShadow = false;
  table.add(tray);
  const trim = new THREE.Mesh(
    new THREE.TorusGeometry(3.025, 0.04, 12, 120),
    gold,
  );
  trim.rotation.x = Math.PI / 2;
  trim.position.y = 0.27;
  table.add(trim);
  const inlay = new THREE.Mesh(
    new THREE.TorusGeometry(2.62, 0.012, 8, 120),
    gold,
  );
  inlay.rotation.x = Math.PI / 2;
  inlay.position.y = FLOOR + 0.004;
  table.add(inlay);

  // --- teapot ----------------------------------------------------------------
  const pot = new THREE.Group();
  pot.position.y = FLOOR;
  pot.rotation.y = -0.55;
  const ringAt = (
    r: number,
    y: number,
    tube: number,
    mat: import("three").Material,
  ) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 96), mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    return ring;
  };
  const body = mesh(
    wobble(
      lathe([
        [0.001, 0.06],
        [0.42, 0.06],
        [0.44, 0],
        [0.54, 0],
        [0.58, 0.05],
        [0.84, 0.1],
        [1.04, 0.32],
        [1.12, 0.64],
        [1.05, 0.95],
        [0.84, 1.14],
        [0.6, 1.22],
        [0.5, 1.26],
      ]),
      0.012,
      1.3,
    ),
    glazePot,
  );
  pot.add(body);
  // the lid sits a hair off true, as lids do
  const lidG = new THREE.Group();
  lidG.rotation.z = 0.012;
  lidG.position.x = 0.01;
  lidG.add(
    mesh(
      wobble(
        lathe([
          [0.56, 1.2],
          [0.56, 1.24],
          [0.5, 1.27],
          [0.4, 1.33],
          [0.28, 1.39],
          [0.16, 1.42],
          [0.001, 1.43],
        ]),
        0.01,
        4.1,
      ),
      glaze,
    ),
  );
  lidG.add(
    mesh(
      lathe(
        [
          [0.001, 1.42],
          [0.07, 1.42],
          [0.1, 1.46],
          [0.11, 1.52],
          [0.08, 1.58],
          [0.035, 1.64],
          [0.001, 1.66],
        ],
        32,
      ),
      glaze,
    ),
  );
  const vent = new THREE.Mesh(
    new THREE.CircleGeometry(0.026, 16),
    new THREE.MeshBasicMaterial({ color: 0x2f5a44 }),
  );
  vent.rotation.x = -Math.PI / 2;
  vent.position.set(0.22, 1.421, 0.04);
  lidG.add(vent);
  lidG.add(ringAt(0.565, 1.235, 0.012, gold));
  pot.add(lidG);
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.9, 0.42, 0),
    new THREE.Vector3(1.4, 0.62, 0),
    new THREE.Vector3(1.78, 0.98, 0),
    new THREE.Vector3(1.92, 1.28, 0),
  ]);
  pot.add(
    mesh(
      taperedTube(spoutCurve, 28, 0.105, 14, (t) => 1.35 - 0.55 * t),
      glaze,
    ),
  );
  const spoutBase = mesh(new THREE.SphereGeometry(0.17, 20, 14), glaze);
  spoutBase.position.set(0.98, 0.45, 0);
  spoutBase.scale.set(1.15, 0.9, 1);
  pot.add(spoutBase);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 8, 24), glaze);
  lip.castShadow = true;
  lip.position.copy(spoutCurve.getPoint(1));
  lip.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    spoutCurve.getTangent(1),
  );
  pot.add(lip);
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.98, 0.98, 0),
    new THREE.Vector3(-1.55, 1.04, 0),
    new THREE.Vector3(-1.72, 0.62, 0),
    new THREE.Vector3(-1.08, 0.34, 0),
  ]);
  pot.add(
    mesh(
      taperedTube(
        handleCurve,
        32,
        0.075,
        12,
        (t) => 1.2 - 0.32 * Math.sin(Math.PI * t),
        0.8,
      ),
      glaze,
    ),
  );
  for (const [x, y] of [
    [-1.0, 0.98],
    [-1.1, 0.34],
  ]) {
    const joint = mesh(new THREE.SphereGeometry(0.108, 18, 12), glaze);
    joint.position.set(x, y, 0);
    joint.scale.set(1, 1, 0.85);
    pot.add(joint);
  }
  const rest = mesh(new THREE.SphereGeometry(0.058, 14, 10), glaze);
  rest.position.copy(handleCurve.getPoint(0.2));
  rest.scale.set(1, 0.7, 1);
  pot.add(rest);
  table.add(pot);

  // --- seven cups, one for each tea -----------------------------------------
  const cupProfile: [number, number][] = [
    [0.001, 0.03],
    [0.13, 0.03],
    [0.14, 0],
    [0.19, 0],
    [0.2, 0.03],
    [0.33, 0.16],
    [0.41, 0.36],
    [0.42, 0.4],
    [0.39, 0.4],
    [0.37, 0.37],
    [0.3, 0.16],
    [0.15, 0.08],
    [0.001, 0.08],
  ];
  const cupGeo = wobble(lathe(cupProfile, 48), 0.014, 2.2);
  const saucerGeo = wobble(
    lathe(
      [
        [0.001, 0.015],
        [0.44, 0.015],
        [0.46, 0],
        [0.5, 0],
        [0.62, 0.05],
        [0.64, 0.07],
        [0.6, 0.06],
        [0.44, 0.035],
        [0.001, 0.035],
      ],
      48,
    ),
    0.01,
    5.5,
  );
  const meniscusGeo = new THREE.TorusGeometry(0.34, 0.012, 6, 48);
  const meniscusMat = new THREE.MeshStandardMaterial({
    color: 0xe8efdc,
    roughness: 0.2,
    transparent: true,
    opacity: 0.35,
  });
  const liquidGeo = new THREE.CircleGeometry(0.335, 40);
  liquidGeo.rotateX(-Math.PI / 2);
  // Tea is deep in the middle and thin at the edge, where the cup wall shows through, and its surface is a mirror that
  // catches the room. The flat matte disc read as plastic; a radial depth gradient plus a glossy, faintly rippled
  // surface reads as liquid.
  const liquidMap = (() => {
    const S = 128;
    const c = makeCanvas(S, S);
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgb(138,138,138)");
    g.addColorStop(0.55, "rgb(168,168,168)");
    g.addColorStop(0.88, "rgb(214,214,214)");
    g.addColorStop(1, "rgb(255,255,255)");
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const liquidRipple = (() => {
    const S = 128;
    const c = makeCanvas(S, S);
    const x = c.getContext("2d")!;
    x.fillStyle = "#808080";
    x.fillRect(0, 0, S, S);
    x.lineWidth = 1.4;
    for (let r = 6; r < S / 2; r += 7 + rnd() * 5) {
      x.strokeStyle = rnd() > 0.5 ? "rgba(150,150,150,.35)" : "rgba(110,110,110,.35)";
      x.beginPath();
      x.arc(S / 2 + (rnd() - 0.5) * 6, S / 2 + (rnd() - 0.5) * 6, r, 0, TAU);
      x.stroke();
    }
    return new THREE.CanvasTexture(c);
  })();
  texList.push(liquidMap, liquidRipple);

  const RING = 2.12;
  const cups: {
    group: import("three").Group;
    hit: import("three").Object3D[];
    lift: number;
    id: string;
    vi: string;
    en: string;
  }[] = [];
  const liquidMats: import("three").Material[] = [];
  teas.forEach((t, i) => {
    const g = new THREE.Group();
    const a = (i / teas.length) * TAU + Math.PI / 2 + 0.25;
    g.position.set(Math.cos(a) * RING, FLOOR, Math.sin(a) * RING);
    const saucer = mesh(saucerGeo, glazeSaucer);
    saucer.rotation.y = i * 1.7;
    const cup = mesh(cupGeo, glazeCup);
    cup.position.y = 0.035;
    cup.rotation.y = -a + i * 0.9;
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(t.liquor).multiplyScalar(0.8),
      map: liquidMap,
      bumpMap: liquidRipple,
      bumpScale: 0.25,
      roughness: 0.06,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      ior: 1.33,
      specularIntensity: 0.9,
      emissive: new THREE.Color(t.liquor),
      emissiveIntensity: 0.025,
    });
    liquidMats.push(liquidMat);
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = 0.3 + 0.035;
    const meniscus = new THREE.Mesh(meniscusGeo, meniscusMat);
    meniscus.rotation.x = Math.PI / 2;
    meniscus.position.y = 0.3 + 0.037;
    g.add(saucer, cup, liquid, meniscus);
    g.userData.index = i;
    table.add(g);
    cups.push({
      group: g,
      hit: [saucer, cup, liquid],
      lift: 0,
      id: t.id,
      vi: t.vi,
      en: t.en,
    });
  });

  // --- contact shadows: a soft dark pool under everything that sits on the tray ---------------------------
  const contactTex = (() => {
    const c = makeCanvas(128, 128);
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,.62)");
    g.addColorStop(0.55, "rgba(0,0,0,.28)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const contactGeo = new THREE.CircleGeometry(1, 40);
  contactGeo.rotateX(-Math.PI / 2);
  const contactMat = new THREE.MeshBasicMaterial({
    map: contactTex,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const addContact = (px: number, pz: number, r: number) => {
    const m = new THREE.Mesh(contactGeo, contactMat);
    m.position.set(px, FLOOR + 0.004, pz);
    m.scale.set(r, 1, r);
    m.renderOrder = 1;
    table.add(m);
  };
  addContact(0, 0, 1.55);
  cups.forEach((c) => addContact(c.group.position.x, c.group.position.z, 0.84));

  // --- steam -----------------------------------------------------------------
  const tipLocal = new THREE.Vector3(1.92, 1.36, 0);
  pot.updateMatrixWorld(true);
  const tip = table.worldToLocal(pot.localToWorld(tipLocal.clone()));
  // Steam is a column of soft, ragged wisps rather than identical round dots: each puff is a lumpy cloud texture, spun at
  // random, that starts small and tight at its source, swells and slows as it climbs, and thins to nothing. Sizes are in
  // world units (hence the custom shader), the spout breathes more than the cups, and a faint draught leans it all one way.
  const steamTex = (() => {
    const S = 128;
    const c = makeCanvas(S, S);
    const x = c.getContext("2d")!;
    for (let i = 0; i < 16; i++) {
      const a = rnd() * TAU;
      const d = rnd() * S * 0.2;
      const px = S / 2 + Math.cos(a) * d;
      const py = S / 2 + Math.sin(a) * d;
      const r = S * (0.14 + rnd() * 0.16);
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, "rgba(255,255,255,.5)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, S, S);
    }
    // knock the edge to zero so no square corner or hard rim can ever show
    x.globalCompositeOperation = "destination-in";
    const m = x.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S / 2);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = m;
    x.fillRect(0, 0, S, S);
    return new THREE.CanvasTexture(c);
  })();
  const SOURCES = [
    tip,
    ...cups.map(
      (c) =>
        new THREE.Vector3(
          c.group.position.x,
          c.group.position.y + 0.4,
          c.group.position.z,
        ),
    ),
  ];
  const N = reduce ? 0 : 90;
  const pos = new Float32Array(N * 3);
  const size = new Float32Array(N);
  const alpha = new Float32Array(N);
  const rot = new Float32Array(N);
  type P = {
    src: number;
    age: number;
    life: number;
    height: number;
    ox: number;
    oz: number;
    base: number;
    phase: number;
    sway: number;
    spin: number;
  };
  const spawn = (p: P, age: number) => {
    const spout = p.src === 0;
    const a = Math.random() * TAU;
    const d = Math.sqrt(Math.random()) * (spout ? 0.03 : 0.16);
    p.age = age;
    p.life = (spout ? 3.4 : 3.8) + Math.random() * 2.2;
    p.height = (spout ? 1.3 : 0.95) + Math.random() * 0.5;
    p.ox = Math.cos(a) * d;
    p.oz = Math.sin(a) * d;
    p.base = (spout ? 0.22 : 0.18) + Math.random() * 0.1;
    p.phase = Math.random() * TAU;
    p.sway = 0.04 + Math.random() * 0.08;
    p.spin = (Math.random() - 0.5) * 0.7;
  };
  const parts: P[] = Array.from({ length: N }, (_, i) => {
    const p = { src: i % 3 === 0 ? 0 : 1 + ((i * 5) % cups.length) } as P;
    spawn(p, 0);
    p.age = Math.random() * p.life;
    return p;
  });
  const steamGeo = new THREE.BufferGeometry();
  steamGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  steamGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  steamGeo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
  steamGeo.setAttribute("aRot", new THREE.BufferAttribute(rot, 1));
  const steamMat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: steamTex }, uScale: { value: 1 } },
    vertexShader: `
      attribute float aSize;
      attribute float aAlpha;
      attribute float aRot;
      uniform float uScale;
      varying float vAlpha;
      varying float vRot;
      void main() {
        vAlpha = aAlpha;
        vRot = aRot;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D uMap;
      varying float vAlpha;
      varying float vRot;
      void main() {
        vec2 q = gl_PointCoord - 0.5;
        float s = sin(vRot);
        float c = cos(vRot);
        vec2 uv = vec2(c * q.x - s * q.y, s * q.x + c * q.y) + 0.5;
        float a = texture2D(uMap, uv).a * vAlpha;
        gl_FragColor = vec4(vec3(0.92, 1.0, 0.9) * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  });
  const steam = new THREE.Points(steamGeo, steamMat);
  steam.frustumCulled = false;
  steam.renderOrder = 2;
  table.add(steam);
  const stepSteam = (dt: number) => {
    for (let i = 0; i < N; i++) {
      const p = parts[i];
      p.age += dt;
      if (p.age > p.life) spawn(p, 0);
      const s = SOURCES[p.src];
      const k = p.age / p.life;
      const t = p.age;
      const rise = 1 - (1 - k) * (1 - k); // fast off the surface, easing as it cools
      const open = 0.15 + k * 2.4;
      const draught = k * k * (p.src === 0 ? 0.32 : 0.2);
      pos[i * 3] =
        s.x +
        p.ox +
        draught +
        (Math.sin(t * 0.9 + p.phase) + 0.5 * Math.sin(t * 2.1 + p.phase * 1.7)) *
          p.sway *
          open;
      pos[i * 3 + 1] = s.y + rise * p.height;
      pos[i * 3 + 2] =
        s.z +
        p.oz +
        Math.cos(t * 0.7 + p.phase * 1.3) * p.sway * open * 0.8;
      size[i] = p.base * (1 + k * 3.2);
      rot[i] = p.phase + t * p.spin;
      alpha[i] =
        Math.min(1, k * 7) * Math.pow(1 - k, 1.6) * (p.src === 0 ? 0.5 : 0.3);
    }
    steamGeo.attributes.position.needsUpdate = true;
    steamGeo.attributes.aSize.needsUpdate = true;
    steamGeo.attributes.aAlpha.needsUpdate = true;
    steamGeo.attributes.aRot.needsUpdate = true;
  };
  stepSteam(0.0001);

  // --- camera and interaction ----------------------------------------------
  let yaw = 0.2;
  let yawVel = 0;
  let spin = 1; // 1 = full auto-rotation speed; eases down a little while a cup is under the pointer
  let pitch = 1.13; // about 65 degrees above the table: mostly from above, tilted just enough to show depth
  let width = 1;
  let height = 1;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  let hovered = -1;
  let inside = false;
  const pointer = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const hitMeshes = cups.flatMap((c) => c.hit);

  const placeCamera = () => {
    const aspect = width / height;
    const fovHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    // the tray is round, so seen from above it must fit its diameter in the smaller of width and height
    const dist = 3.95 / (Math.tan(fovHalf) * Math.min(1, aspect));
    camera.position.set(
      0,
      target.y + dist * Math.sin(pitch),
      dist * Math.cos(pitch),
    );
    camera.lookAt(target);
  };
  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    steamMat.uniforms.uScale.value =
      (height * renderer.getPixelRatio()) /
      (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    placeCamera();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const setPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1,
    );
  };
  const pick = () => {
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(hitMeshes, false)[0];
    if (!hit) return -1;
    let o: import("three").Object3D | null = hit.object;
    while (o && o.userData.index === undefined) o = o.parent;
    return o ? (o.userData.index as number) : -1;
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    yawVel = 0;
    host.setPointerCapture(e.pointerId);
    host.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    setPointer(e);
    inside = true;
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.008;
      yawVel = THREE.MathUtils.clamp(dx * 0.008 * 60, -4, 4);
      pitch = THREE.MathUtils.clamp(pitch + dy * 0.004, 0.7, 1.5);
      placeCamera();
    } else if (e.pointerType === "mouse") {
      hovered = pick();
      host.style.cursor = hovered >= 0 ? "pointer" : "grab";
    }
  };
  const jumpTo = (id: string) => {
    const a = document.querySelector<HTMLElement>(`a[data-jump="tab-${id}"]`);
    if (a) a.click();
    else location.hash = "#leaves";
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    host.releasePointerCapture(e.pointerId);
    host.style.cursor = hovered >= 0 ? "pointer" : "grab";
    if (moved < 6) {
      setPointer(e);
      const i = pick();
      if (i >= 0) jumpTo(cups[i].id);
    }
  };
  const onLeave = () => {
    hovered = -1;
    inside = false;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") yawVel -= 1.4;
    else if (e.key === "ArrowRight") yawVel += 1.4;
    else return;
    e.preventDefault();
  };
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("keydown", onKey);

  // --- loop ------------------------------------------------------------------
  let last = performance.now();
  const delta = () => {
    const now = performance.now();
    const d = (now - last) / 1000;
    last = now;
    return d;
  };
  let raf = 0;
  let visible = true;
  const v3 = new THREE.Vector3();
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(delta(), 0.05);
    if (!dragging) {
      yaw += yawVel * dt;
      yawVel *= Math.exp(-3.4 * dt);
      spin += ((hovered >= 0 ? 0.45 : 1) - spin) * Math.min(1, dt * 6);
      if (!reduce && Math.abs(yawVel) < 0.05) yaw += dt * 0.1 * spin;
    }
    table.rotation.y = yaw;
    if (inside && !dragging) {
      hovered = pick();
      host.style.cursor = hovered >= 0 ? "pointer" : "grab";
    }
    if (N) stepSteam(dt);

    cups.forEach((c, i) => {
      const goal = i === hovered ? 0.2 : 0;
      c.lift += (goal - c.lift) * Math.min(1, dt * 9);
      c.group.position.y = FLOOR + c.lift;
    });
    if (hovered >= 0) {
      const c = cups[hovered];
      c.group.getWorldPosition(v3);
      v3.y += 0.95;
      v3.project(camera);
      label.style.opacity = "1";
      label.style.transform = `translate(${((v3.x * 0.5 + 0.5) * width).toFixed(1)}px, ${((-v3.y * 0.5 + 0.5) * height).toFixed(1)}px) translate(-50%, -100%)`;
      if (label.dataset.id !== c.id) {
        label.dataset.id = c.id;
        label.querySelector("[data-vi]")!.textContent = c.vi;
        label.querySelector("[data-en]")!.textContent = c.en;
      }
    } else {
      label.style.opacity = "0";
    }
    renderer.render(scene, camera);
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    cancelAnimationFrame(raf);
    if (visible && !document.hidden) {
      delta();
      tick();
    }
  });
  io.observe(host);
  const onVis = () => {
    cancelAnimationFrame(raf);
    if (visible && !document.hidden) {
      delta();
      tick();
    }
  };
  document.addEventListener("visibilitychange", onVis);
  tick();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    host.removeEventListener("pointerdown", onDown);
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerup", onUp);
    host.removeEventListener("pointercancel", onUp);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("keydown", onKey);
    scene.traverse((o) => {
      const m = o as import("three").Mesh;
      if (m.geometry) m.geometry.dispose();
    });
    [
      glaze,
      glazePot,
      glazeCup,
      glazeSaucer,
      lacquer,
      gold,
      meniscusMat,
      contactMat,
      ...liquidMats,
      steam.material,
    ].forEach((m) => (m as import("three").Material).dispose());
    [...texList, steamTex, contactTex].forEach((t) => t.dispose());
    envTexture.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export default function TeaScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    const label = labelRef.current;
    if (!stage || !host || !label) return;
    let disposed = false;
    let cleanup = () => {};
    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        try {
          const [THREE, { RoomEnvironment }] = await Promise.all([
            import("three"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
          ]);
          if (disposed) return;
          const dispose = await build(THREE, RoomEnvironment, host, label);
          if (disposed) {
            dispose();
            return;
          }
          cleanup = dispose;
          setReady(true);
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(stage);
    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div className="feast__stage" ref={stageRef}>
      <Image
        className="feast__poster"
        data-ready={ready}
        src="/art/tray-top.svg"
        alt=""
        width={600}
        height={600}
        aria-hidden="true"
        unoptimized
      />
      <div
        className="feast__canvas"
        ref={hostRef}
        data-ready={ready}
        tabIndex={failed ? -1 : 0}
        role="img"
        aria-label="An interactive 3D tea tray: a celadon-green teapot and seven cups, one for each tea, with steam rising. Drag or use the left and right arrow keys to turn it; click a cup to read about that tea."
      />
      <div className="feast__label" ref={labelRef} aria-hidden="true">
        <span lang="vi" data-vi />
        <span data-en />
      </div>
      {!failed && (
        <p className="feast__hint">Drag to turn · tap a cup to meet its tea</p>
      )}
    </div>
  );
}
