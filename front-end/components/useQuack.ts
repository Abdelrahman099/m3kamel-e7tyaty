"use client";

import { useEffect, useRef } from "react";

/**
 * كواكة متولّدة بالـ Web Audio — من غير أي ملف صوت.
 *
 * اللي بيخلي الصوت يتقري كبطة مش كصفّارة:
 *  ١ — كنتور التردد بيطلع بسرعة وبعدين بينزل. الطلعة دي هي حرف الـ«كـ».
 *  ٢ — الفلتر Q واطي (١.١) عشان الأساس ميتاكلش — Q عالي بيطلّع صفّارة.
 *  ٣ — فورمانت أنفي مرفوع حوالين ٢.٤ك، ده مصدر «الطرطشة».
 *  ٤ — LFO سريع على مستوى الصوت بيدي الخشونة بتاعة الحبال الصوتية.
 */
export function useQuack() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastQuack = useRef(0);

  useEffect(() => () => {
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  }, []);

  return async () => {
    try {
      const now = performance.now();
      if (now - lastQuack.current < 180) return;
      lastQuack.current = now;
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;

      const ctx = (ctxRef.current ??= new Ctx());
      if (ctx.state === "suspended") await ctx.resume();
      if (ctx.state !== "running") return;

      const t0 = ctx.currentTime;
      const DUR = 0.22;

      // كنتور الكواكة — نفس المنحنى للأوسيلاتورين
      const contour = (param: AudioParam) => {
        param.setValueAtTime(285, t0);
        param.exponentialRampToValueAtTime(480, t0 + 0.018);
        param.exponentialRampToValueAtTime(260, t0 + 0.11);
        param.exponentialRampToValueAtTime(175, t0 + DUR);
      };

      // المصدر الأساسي — منشار، توافقيات غنية
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      contour(osc.frequency);

      // أوسيلاتور تاني مزاح — بيدي جسم وخشونة
      const osc2 = ctx.createOscillator();
      osc2.type = "square";
      osc2.detune.value = -19;
      contour(osc2.frequency);
      const g2 = ctx.createGain();
      g2.gain.value = 0.28;

      // الفورمانت — القناة الصوتية للبطة، بتنزل مع الصوت
      const formant = ctx.createBiquadFilter();
      formant.type = "bandpass";
      formant.frequency.setValueAtTime(1450, t0);
      formant.frequency.exponentialRampToValueAtTime(780, t0 + DUR);
      formant.Q.value = 1.1;

      // الرنين الأنفي
      const nasal = ctx.createBiquadFilter();
      nasal.type = "peaking";
      nasal.frequency.value = 2400;
      nasal.Q.value = 1.6;
      nasal.gain.value = 7;

      // نقص الحدة العالية عشان الصوت ميبقاش حاد
      const tame = ctx.createBiquadFilter();
      tame.type = "lowpass";
      tame.frequency.value = 5400;

      // الظرف: هجوم سريع، جسم قصير، نهاية حاسمة.
      // القيم واطية عن كده عشان فلتر الـpeaking بيزوّد ١١dB فوقها —
      // من غير كده الذروة بتوصل ٠.٨٩ وبتبوظ لو الزرار اتدَس كذا مرة ورا بعض.
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t0);
      out.gain.exponentialRampToValueAtTime(0.3, t0 + 0.014);
      out.gain.exponentialRampToValueAtTime(0.145, t0 + 0.085);
      out.gain.exponentialRampToValueAtTime(0.0008, t0 + DUR);
      // الرامب الأسّي مابيوصلش صفر أبدًا، والفلاتر بترنّ بعد النغمة.
      // السطر ده بيقفل الصوت خالص بدل ما يفضل ذيل مسموع.
      out.gain.linearRampToValueAtTime(0, t0 + DUR + 0.03);

      // الخشونة
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 64;
      const lfoAmount = ctx.createGain();
      lfoAmount.gain.value = 0.22;
      // Modulate a separate stage so the final envelope always fades to silence.
      const roughness = ctx.createGain();
      roughness.gain.value = 0.78;
      lfo.connect(lfoAmount).connect(roughness.gain);

      // A short breathy attack avoids the pure electronic buzzer quality.
      const breath = ctx.createBufferSource();
      const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * DUR), ctx.sampleRate);
      const samples = noise.getChannelData(0);
      let seed = 137;
      for (let i = 0; i < samples.length; i++) {
        seed = (seed * 16807) % 2147483647;
        samples[i] = (seed / 1073741823.5 - 1) * 0.18 * Math.exp(-i / (ctx.sampleRate * 0.035));
      }
      breath.buffer = noise;
      breath.connect(formant);

      osc.connect(formant);
      osc2.connect(g2).connect(formant);
      formant.connect(nasal).connect(tame).connect(roughness).connect(out).connect(ctx.destination);

      const stopAt = t0 + DUR + 0.04;
      osc.start(t0);
      osc.stop(stopAt);
      osc2.start(t0);
      osc2.stop(stopAt);
      lfo.start(t0);
      lfo.stop(stopAt);
      breath.start(t0);
      osc.onended = () => {
        [osc, osc2, g2, formant, nasal, tame, roughness, out, lfo, lfoAmount, breath].forEach((node) => node.disconnect());
      };
    } catch {
      /* الصوت مش ضروري — لو اتمنع مفيش مشكلة */
    }
  };
}
