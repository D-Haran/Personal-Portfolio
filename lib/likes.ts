export type Like = {
  id: string;
  /** Accessible name only; nothing is rendered as text. */
  label: string;
  /** glTF file under /public/models. */
  model: string;
  /**
   * Position in the cluster, as a fraction of the shorter side of the area.
   * (0,0) is the centre; +y is up. Kept collision-free by hand.
   */
  pos: [number, number];
  /** Radius the model is fitted into, same units as `pos`. */
  r: number;
  /** Degrees of initial turn, so each model presents its good side. */
  yaw?: number;
  pitch?: number;
  /** Turns per second, signed. Small, so the cluster reads as calm. */
  spin?: number;
  /** A ball's silhouette never grows as it turns, so fit it by diameter. */
  sphere?: boolean;
  /** Degrees the spin axis leans away from vertical. Keep modest (≤25). */
  tilt?: number;
  /** Degrees the lean is rotated around, so they don't all tip the same way. */
  lean?: number;
};

/**
 * The cluster that sits beside the About copy.
 *
 * To swap in a different model: drop the .glb into /public/models and change
 * `model` below. The scene auto-centres and auto-scales whatever it is fitted
 * to `r`, so usually only `yaw`/`pitch` want a nudge afterwards.
 */
export const likes: Like[] = [
  { id: "cube", label: "Rubik's cube", model: "/models/rubiks.glb", pos: [-0.3, 0.3], r: 0.145, yaw: -28, pitch: 10, spin: 0.055, tilt: 18, lean: 20 },
  { id: "guitar", label: "Guitar", model: "/models/eguitar.glb", pos: [0.34, 0.36], r: 0.105, yaw: -20, pitch: 6, spin: -0.04, tilt: 10, lean: 200 },
  { id: "car", label: "Car", model: "/models/car.glb", pos: [0.15, 0.03], r: 0.225, yaw: -35, pitch: 10, spin: 0.045, tilt: 14, lean: 110 },
  { id: "music", label: "Music", model: "/models/headphones.glb", pos: [-0.37, -0.05], r: 0.085, yaw: -30, pitch: 8, spin: -0.06, tilt: 20, lean: 300 },
  { id: "baseball", label: "Baseball", model: "/models/baseball.glb", pos: [-0.12, -0.22], r: 0.07, yaw: 0, pitch: 0, spin: 0.07, tilt: 24, lean: 60, sphere: true },
  { id: "film", label: "Film", model: "/models/videocamera.glb", pos: [-0.3, -0.35], r: 0.12, yaw: -24, pitch: 8, spin: 0.05, tilt: 16, lean: 150 },
  { id: "basketball", label: "Basketball", model: "/models/basketball.glb", pos: [0.22, -0.32], r: 0.105, yaw: 0, pitch: 0, spin: -0.065, tilt: 24, lean: 250, sphere: true },
];

/**
 * CC BY requires credit. Rendered once, quietly, under the About section.
 * Keep this in step with whatever is in /public/models.
 */
export const modelCredits = {
  text: "3D models by Poly by Google, dook & Quaternius (CC BY / CC0) via Poly Pizza",
  href: "https://poly.pizza",
};
