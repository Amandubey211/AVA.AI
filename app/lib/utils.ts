// lib/utils.ts
import * as THREE from "three";

// This utility function takes an array of animations and renames the bone tracks
// from the Mixamo naming convention to the Ready Player Me convention.
export function remapMixamoAnimation(animations: THREE.AnimationClip[]) {
  animations.forEach((clip) => {
    clip.tracks.forEach((track) => {
      // Remove the "mixamorig" prefix and adjust the property name.
      // e.g., "mixamorigHips.position" -> "Hips.position"
      track.name = track.name.replace(/^mixamorig/, "");
    });
  });
  return animations;
}
