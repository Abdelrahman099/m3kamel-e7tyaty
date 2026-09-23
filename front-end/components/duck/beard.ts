import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { fbm, noise3 } from "./noise";

/**
 * الدقن — كرة بتتشوّه بالـ noise لحد ما تبقى كتلة شعر.
 *
 *  - بتضيق وبتطول من تحت عشان تاخد شكل دقن مش كورة
 *  - noise بتردد واطي بيعمل تكتلات (خصل كبيرة)
 *  - noise ممطوط رأسيًا بيعمل خطوط الشعر النازلة
 *  - ألوان vertex بتتدرج بين أسود وبني عشان الشعر ميبقاش لون واحد مسطّح
 *
 * mergeVertices مهم: من غيره خط اللحام بتاع الكرة بيبان في الإضاءة.
 */
export function makeBeardGeometry(seed = 0): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry = new THREE.SphereGeometry(1, 110, 80);
  geo.deleteAttribute("uv");
  geo.deleteAttribute("normal");
  geo = mergeVertices(geo);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);

  const dark = new THREE.Color("#120D09");
  const mid = new THREE.Color("#2A1F16");
  const tip = new THREE.Color("#46362A");
  const c = new THREE.Color();
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // الشكل: بتضيق كل ما تنزل، وبتتمط لتحت
    const taper = v.y < 0 ? 1 + v.y * 0.4 : 1;

    // خصل كبيرة
    const clumps = fbm(v.x * 2.3 + seed, v.y * 2.3, v.z * 2.3);
    // خطوط شعر نازلة — تردد عالي أفقيًا وواطي رأسيًا
    const strands = noise3(v.x * 15 + seed, v.y * 3.2, v.z * 15);
    // نتوءات صغيرة جدًا — بتكسر النعومة
    const frizz = noise3(v.x * 34, v.y * 34 + seed, v.z * 34);

    const d =
      1 +
      (clumps - 0.5) * 0.3 +
      (strands - 0.5) * 0.14 +
      (frizz - 0.5) * 0.05;

    const stretchY = v.y < 0 ? 1.14 : 0.96;
    pos.setXYZ(i, v.x * taper * d, v.y * d * stretchY, v.z * taper * d);

    // اللون: الأطراف البارزة أفتح شوية، العمق أغمق
    c.copy(dark)
      .lerp(mid, strands)
      .lerp(tip, Math.max(0, clumps - 0.52) * 1.6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}
