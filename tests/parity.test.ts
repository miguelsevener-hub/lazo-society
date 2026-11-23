import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { clasificar, espejo } from "../lib/test";
import { estimarSolteros, packPara } from "../lib/precio";

const data = JSON.parse(readFileSync(new URL("./parity.json", import.meta.url), "utf8"));

test("el test web da el mismo animal que el simulador", () => {
  let iguales = 0, toques = 0;
  data.ans.forEach((r: number[], i: number) => {
    const res = clasificar(r);
    if (res.animal === data.animal[i]) iguales++;
    if (res.toque === data.toque[i]) toques++;
  });
  assert.equal(iguales, data.ans.length);
  assert.ok(toques / data.ans.length > 0.99, `toques coinciden: ${toques}`);
});

test("espejos simétricos", () => {
  for (const a of ["caballo", "halcon", "lobo", "lince", "ciervo", "cisne"] as const) assert.equal(espejo(espejo(a)), a);
  assert.equal(espejo("caballo"), "lince");
  assert.equal(espejo("lobo"), "cisne");
});

test("precio de los ejemplos", () => {
  assert.equal(estimarSolteros(150, 32, 0.6), 42);
  assert.equal(packPara(42).nombre, "Gran Club");
  assert.equal(packPara(15).nombre, "Íntimo");
  assert.equal(packPara(16).nombre, "Club");
  assert.equal(packPara(80).precio, 990);
});
