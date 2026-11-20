"use client";

import { useEffect, useRef, useState } from "react";
import { likes } from "@/lib/likes";

const DEG = Math.PI / 180;
const FOV = 34;
const CAM_Z = 6;

type Api = { setRunning: (on: boolean) => void; dispose: () => void };

/**
 * Every model in one scene, arranged as a cluster and turning slowly.
 * No controls and no chrome: it reads as artwork, not a viewer.
 *
 * three, the GLTF loader and the meshopt decoder are imported inside here, so
 * none of them lands in the initial bundle.
 */
async function createCluster(host: HTMLDivElement, reduce: boolean): Promise<Api> {
  const [THREE, { GLTFLoader }, { RoomEnvironment }, { MeshoptDecoder }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/environments/RoomEnvironment.js"),
    import("three/examples/jsm/libs/meshopt_decoder.module.js"),
  ]);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  // 1.5 is indistinguishable from 2 at this size and noticeably cheaper.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const el = renderer.domElement;
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.display = "block";
  host.appendChild(el);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(2.5, 4, 3.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6a98f5, 1.4);
  rim.position.set(-3, 1, -2.5);
  scene.add(rim);

  type Item = {
    holder: import("three").Group;
    inner: import("three").Group;
    norm: number;
    r: number;
    pos: [number, number];
    spin: number;
    axis: import("three").Vector3;
    base: import("three").Quaternion;
    bob: number;
  };

  const loader = new GLTFLoader();
  // The models in /public/models are meshopt-compressed (see
  // scripts/optimize-models.sh); without this they will not parse. The decoder
  // is wasm and runs off the parse path, so it is cheaper than the float32 it
  // replaces, not more expensive.
  loader.setMeshoptDecoder(MeshoptDecoder);
  const items: Item[] = [];

  let unit = 1;

  /** Re-places and re-scales the cluster for the current canvas size. */
  const layout = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const visH = 2 * CAM_Z * Math.tan((FOV / 2) * DEG);
    const visW = visH * camera.aspect;
    unit = Math.min(visW, visH);

    rectStale = true;

    for (const it of items) {
      if (!it) continue;
      it.holder.position.x = it.pos[0] * unit;
      it.inner.scale.setScalar(it.r * 2 * unit * it.norm);
    }
  };

  let raf = 0;
  let running = false;
  let t = 0;
  const aim = { x: 0, y: 0 };
  const pan = { x: 0, y: 0 };
  const spinQ = new THREE.Quaternion();

  // Where the pointer last was, in page coordinates, and whether the cached
  // rect still describes the host. Reading the rect inside the pointer handler
  // would force a layout on every mouse move anywhere on the page; resolving it
  // here means at most one layout read per rendered frame, and only when
  // something has actually moved the host.
  let rect = host.getBoundingClientRect();
  let rectStale = true;
  const staleRect = () => {
    rectStale = true;
  };
  const point = { x: 0, y: 0 };
  let hasPoint = false;

  const render = () => {
    if (hasPoint) {
      if (rectStale) {
        rect = host.getBoundingClientRect();
        rectStale = false;
      }
      aim.x = ((point.x - rect.left) / rect.width - 0.5) * 0.16;
      aim.y = ((point.y - rect.top) / rect.height - 0.5) * 0.1;
    }
    pan.x += (aim.x - pan.x) * 0.05;
    pan.y += (aim.y - pan.y) * 0.05;
    scene.rotation.y = pan.x;
    scene.rotation.x = pan.y;

    for (const it of items) {
      if (!it) continue;
      spinQ.setFromAxisAngle(it.axis, reduce ? 0 : t * it.spin);
      it.inner.quaternion.copy(spinQ).multiply(it.base);
      // a slow drift, so the cluster breathes rather than sitting still
      it.holder.position.y = it.pos[1] * unit + (reduce ? 0 : Math.sin(t * 0.5 + it.bob) * unit * 0.012);
    }
    renderer.render(scene, camera);
  };

  // 30fps. The spin is slow, so this is invisible and halves the GPU work.
  const FRAME = 1000 / 30;
  let last = 0;

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME) return;
    t += Math.min((now - last) / 1000, 0.1);
    last = now;
    render();
  };

  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    cancelAnimationFrame(raf);
    bind(on);
    if (on && !reduce) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
    else render();
  };

  const onMove = (e: PointerEvent) => {
    point.x = e.clientX;
    point.y = e.clientY;
    hasPoint = true;
  };
  const onLeave = () => {
    hasPoint = false;
    aim.x = 0;
    aim.y = 0;
  };

  // Nothing is listened for while the cluster is off screen or the tab is
  // hidden: a window-level pointermove handler is a cost every other section
  // of the page pays too.
  function bind(on: boolean) {
    if (reduce) return;
    if (on) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", staleRect, { passive: true });
      window.addEventListener("resize", staleRect);
    } else {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", staleRect);
      window.removeEventListener("resize", staleRect);
      onLeave();
    }
  }

  // Each model is placed the moment it arrives, so one slow file doesn't
  // hold up the rest and the cluster fills in instead of popping.
  let onFirst: (() => void) | null = null;
  const ready = new Promise<void>((res) => (onFirst = res));

  const loadModels = () =>
    Promise.all(
      likes.map(async (like, i) => {
        const gltf = await loader.loadAsync(like.model);
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(box.getCenter(new THREE.Vector3()));

        // A ball keeps its silhouette as it turns; anything else sweeps its x/z
        // diagonal, so fit by that or corners clip into their neighbours.
        const sweep = like.sphere ? Math.max(size.x, size.z) : Math.hypot(size.x, size.z);
        const fitDim = Math.max(sweep, size.y) || 1;

        // inner spins, holder is positioned, so spinning never moves the anchor
        const inner = new THREE.Group();
        inner.add(model);
        const holder = new THREE.Group();
        holder.add(inner);
        scene.add(holder);

        // Each model turns about its own leaning axis, like a top, rather than
        // flat about world Y. Keep the lean modest: a big tilt swings a tall
        // model sideways and it starts crowding its neighbours.
        const tilt = (like.tilt ?? 16) * DEG;
        const lean = (like.lean ?? 0) * DEG;
        const axis = new THREE.Vector3(
          Math.sin(tilt) * Math.cos(lean),
          Math.cos(tilt),
          Math.sin(tilt) * Math.sin(lean),
        ).normalize();

        items[i] = {
          holder,
          inner,
          norm: 1 / fitDim,
          r: like.r,
          pos: like.pos,
          spin: (like.spin ?? 0.05) * Math.PI * 2,
          axis,
          base: new THREE.Quaternion().setFromEuler(
            new THREE.Euler((like.pitch ?? 0) * DEG, (like.yaw ?? 0) * DEG, 0),
          ),
          bob: Math.random() * Math.PI * 2,
        };

        // Compiling 40-odd PBR programs during a rendered frame is the single
        // worst stall in the whole scene. compileAsync does it off the frame,
        // in parallel where the driver supports it, before this model is ever
        // drawn, so the cluster fills in without dropping frames.
        try {
          await renderer.compileAsync(holder, camera, scene);
        } catch {
          /* older driver with no parallel compile: fall through and render */
        }

        layout();
        render();
        onFirst?.();
        onFirst = null;
      }),
    );

  layout();
  render();
  // One bad file shouldn't take the cluster down with it.
  const loading = loadModels().catch(() => {});
  await Promise.race([ready, loading]);

  const ro = new ResizeObserver(layout);
  ro.observe(host);

  const dispose = () => {
    cancelAnimationFrame(raf);
    bind(false);
    ro.disconnect();
    scene.traverse((o) => {
      const mesh = o as import("three").Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if (!m) continue;
        for (const v of Object.values(m)) {
          if (v && typeof v === "object" && "isTexture" in v) (v as import("three").Texture).dispose();
        }
        m.dispose();
      }
    });
    envRT.dispose();
    pmrem.dispose();
    renderer.dispose();
    el.remove();
  };

  return { setRunning, dispose };
}

/**
 * Fills its positioned parent. Renders nothing until the models are ready, so
 * it never reserves visible space of its own.
 */
export function Likes() {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    const boot = async () => {
      try {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const api = await createCluster(host, reduce);
        if (cancelled) {
          api.dispose();
          return;
        }
        apiRef.current = api;
        setShown(true);
        api.setRunning(true);
      } catch {
        /* no WebGL, or a model failed to load: the space just stays empty */
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void boot();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  // Only run the loop while it is on screen and the tab is visible.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !shown) return;
    let onScreen = true;
    const update = () => apiRef.current?.setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      update();
    });
    io.observe(host);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [shown]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}
    />
  );
}
