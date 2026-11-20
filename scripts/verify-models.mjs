// Parses the original and optimized GLBs with the same three.js + MeshoptDecoder
// the site uses, then compares what the cluster actually cares about: the
// fitted silhouette dimensions and the triangle count.
import fs from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

// Node has no image decode, and the geometry fit does not depend on texels:
// hand every texture back as an empty one so parsing reaches the meshes.


const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.register((parser) => ({
  name: "stub_textures",
  // The built-in EXT_texture_webp plugin is consulted first and wants a real
  // image decoder; drop it so the stub below answers instead.
  beforeRoot() {
    delete parser.plugins["EXT_texture_webp"];
  },
  loadTexture: () => Promise.resolve(new THREE.Texture()),
}));

const parse = (file) =>
  new Promise((res, rej) => {
    const buf = fs.readFileSync(file);
    loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "", res, rej);
  });

const stats = async (file) => {
  const gltf = await parse(file);
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  let tris = 0, meshes = 0, mats = new Set();
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    mats.add(o.material?.uuid);
    const g = o.geometry;
    tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
  });
  return { size, tris, meshes, mats: mats.size, sweep: Math.hypot(size.x, size.z) };
};

const args = process.argv.slice(2);
if (args.length === 2) {
  for (const f of args) {
    const s = await stats(f);
    console.log(f, " size", s.size.toArray().map((v) => v.toFixed(3)).join(" x "), " tris", Math.round(s.tris), " draws", s.meshes);
  }
  process.exit(0);
}
const names = ["car", "eguitar", "rubiks", "videocamera", "headphones", "basketball", "baseball"];
let worst = 0;
for (const n of names) {
  const a = await stats(`assets/models-src/${n}.glb`);
  const b = await stats(`public/models/${n}.glb`);
  // The cluster fits by max(xz-sweep, height), so that ratio is what matters.
  const fitA = Math.max(a.sweep, a.size.y), fitB = Math.max(b.sweep, b.size.y);
  const aspA = a.size.y / a.sweep, aspB = b.size.y / b.sweep;
  const drift = Math.abs(aspB / aspA - 1) * 100;
  worst = Math.max(worst, drift);
  console.log(
    `${n.padEnd(12)} tris ${String(Math.round(a.tris)).padStart(7)} -> ${String(Math.round(b.tris)).padStart(6)}` +
    `  draws ${String(a.meshes).padStart(3)} -> ${String(b.meshes).padStart(3)}` +
    `  fit ${fitA.toFixed(3)} -> ${fitB.toFixed(3)}` +
    `  shape drift ${drift.toFixed(3)}%`,
  );
}
console.log(`\nworst silhouette aspect drift: ${worst.toFixed(3)}%`);
