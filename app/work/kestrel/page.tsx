import type { Metadata } from "next";
import { Bars } from "@/components/case/Bars";
import { CaseHero, CaseSection, Limits, Metrics, NextProject, Prose, Terminal } from "@/components/case/Case";
import { Flow } from "@/components/case/Flow";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "kestrel")!;

export const metadata: Metadata = {
  title: "Kestrel: LLM inference in C++20",
  description:
    "Kestrel is a native Llama-family inference runtime in C++20 with CPU and Metal backends, validated layer by layer against Hugging Face.",
};

const layer = [
  { name: "RMSNorm", note: "pre-attention" },
  { name: "Attention", note: "split-half RoPE · grouped-query · causal", kv: true },
  { name: "Residual add", note: "" },
  { name: "RMSNorm", note: "pre-MLP" },
  { name: "SwiGLU MLP", note: "gate · up · down" },
  { name: "Residual add", note: "" },
];

const correctness = [
  { backend: "CPU", max: "3.70e-5", mean: "4.12e-6", cos: "0.999999999999775" },
  { backend: "Metal", max: "4.12e-5", mean: "4.93e-6", cos: "0.999999999999685" },
];

export default function KestrelPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "0", label: "inference frameworks used", note: "no PyTorch, llama.cpp, MLX or ONNX" },
          { value: "4.1e-5", label: "worst logit error vs. HF FP32" },
          { value: "53 tok/s", label: "CPU decode", note: "Apple M2 Pro, batch 1" },
          { value: "311 ms", label: "time to first token", note: "16-token prompt, CPU" },
        ]}
      />

      <CaseSection
        eyebrow="Why"
        title={
          <>
            I wanted to see every step <span className="serif-accent">between a prompt and a token.</span>
          </>
        }
      >
        <Prose>
          <p>
            Libraries make inference look like one function call. I wanted to know what the call does, so Kestrel
            implements the whole transformer forward pass in C++20. It loads Safetensors weights with{" "}
            <strong>memory mapping</strong>, runs the model on a <strong>CPU or Metal backend</strong>, and samples
            the next token. PyTorch, llama.cpp, MLX and ONNX Runtime are not involved.
          </p>
          <p>
            Tokenization runs in a small separate helper. Everything after token IDs is native: the model, the KV
            cache, the kernels and the sampler.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection
        eyebrow="Architecture"
        title="One decode step, end to end."
        aside="Session::prefill runs the prompt through the model. Session::decode then reuses the cached keys and values, so each new token only computes its own row of attention."
      >
        <Flow
          steps={[
            { title: "Tokenizer helper", detail: "text → token IDs" },
            { title: "Session", detail: "prefill, then decode" },
            { title: "Transformer", detail: "native forward pass", tone: "accent" },
            { title: "CPU / Metal", detail: "backend operations" },
            { title: "Logits", detail: "vocab-sized vector" },
            { title: "Sampler", detail: "greedy · temp · top-k/p", tone: "ok" },
          ]}
          loopLabel="Each sampled token goes back into the session. Mapped Safetensors weights and the KV cache feed the transformer."
        />

        <Reveal className="card mt-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">Inside one transformer layer</p>
            <p className="font-mono text-xs text-faint">× n_layers, then final RMSNorm → LM head</p>
          </div>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {layer.map((l, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  l.kv ? "border-accent/40 bg-accent/10" : "border-line bg-white/[0.02]"
                }`}
              >
                <span>
                  <span className="block text-[0.95rem] text-fg">{l.name}</span>
                  {l.note && <span className="block text-xs text-faint">{l.note}</span>}
                </span>
                {l.kv && (
                  <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] tracking-wider text-accent-hi">
                    ↔ KV CACHE
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-faint">
            Weights are stored as F32, F16 or BF16 and loaded with shape checks and shard support. Activations stay
            FP32. The KV cache is contiguous host memory.
          </p>
        </Reveal>
      </CaseSection>

      <CaseSection
        eyebrow="Correctness"
        title={
          <>
            Checked against Hugging Face <span className="serif-accent">at every layer.</span>
          </>
        }
        aside="Pinned TinyStories checkpoint (15.19M params) and six token IDs, compared with Hugging Face eager FP32 inference."
      >
        <Prose>
          <p>
            Fast and wrong is still wrong, so correctness came first. A reference harness compares Kestrel against
            Hugging Face at the <strong>embeddings, every transformer layer, the final hidden state and the logits</strong>,
            for all six positions. Each stage has its own tolerance, so a bug shows up at the layer where it happens,
            not three layers later.
          </p>
        </Prose>

        <Reveal className="mt-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              <tr>
                <th className="px-5 py-3.5 font-normal">Backend</th>
                <th className="px-5 py-3.5 font-normal">Max logit error</th>
                <th className="px-5 py-3.5 font-normal">Mean logit error</th>
                <th className="px-5 py-3.5 font-normal">Cosine similarity</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {correctness.map((r) => (
                <tr key={r.backend} className="border-t border-line">
                  <td className="px-5 py-4 font-sans text-fg">{r.backend}</td>
                  <td className="px-5 py-4 text-ok">{r.max}</td>
                  <td className="px-5 py-4 text-muted">{r.mean}</td>
                  <td className="px-5 py-4 text-muted">{r.cos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal className="mt-4 text-sm text-faint">
          The suite also includes native, malformed-input, CLI and tokenizer tests, run under UBSan.
        </Reveal>
      </CaseSection>

      <CaseSection
        eyebrow="Performance"
        title={
          <>
            Measured, <span className="serif-accent">including where it&apos;s slow.</span>
          </>
        }
        aside="Release build, batch 1, 16 prompt tokens, 32 generated tokens. Two warm-up runs, five measured runs. Loading and tokenization excluded."
      >
        <Bars
          groups={[
            {
              label: "Decode throughput",
              unit: "tok/s",
              better: "higher",
              values: [
                { name: "CPU", value: 53.05, color: "linear-gradient(90deg,#3570e6,#6a98f5)" },
                { name: "Metal", value: 38.61, color: "linear-gradient(90deg,#c27a5a,#f0b45c)" },
              ],
            },
            {
              label: "Prefill throughput",
              unit: "tok/s",
              better: "higher",
              values: [
                { name: "CPU", value: 51.47, color: "linear-gradient(90deg,#3570e6,#6a98f5)" },
                { name: "Metal", value: 38.49, color: "linear-gradient(90deg,#c27a5a,#f0b45c)" },
              ],
            },
            {
              label: "Time to first token",
              unit: "ms",
              better: "lower",
              values: [
                { name: "CPU", value: 310.91, color: "linear-gradient(90deg,#3570e6,#6a98f5)" },
                { name: "Metal", value: 415.8, color: "linear-gradient(90deg,#c27a5a,#f0b45c)" },
              ],
            },
          ]}
          caption="Apple M2 Pro · pinned 15.19M-parameter FP32 TinyStories model. Local desktop measurements, not serving benchmarks."
        />

        <Prose>
          <p className="mt-10">
            <strong>Metal is slower than the CPU here, and I left that in.</strong> With a 15M-parameter model at
            batch 1, each GPU kernel has very little work. The Metal backend also uses a synchronous FP32 host
            interface with per-operation buffers. My working hypothesis is that allocation and synchronization cost
            more than the math itself. Profiling that, fusing kernels and keeping buffers on the device are next.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection eyebrow="Run it" title="One command to generate text.">
        <Terminal title="kestrel — zsh">
          <span className="text-faint"># build with Metal + reference tests</span>
          {"\n"}
          <span className="text-fg">cmake</span> -S . -B build-audit -G Ninja -DCMAKE_BUILD_TYPE=Release -DKESTREL_METAL=ON
          {"\n"}
          <span className="text-fg">cmake</span> --build build-audit -j 4
          {"\n\n"}
          <span className="text-faint"># greedy decode on CPU (or --backend metal)</span>
          {"\n"}
          <span className="text-fg">./build-audit/kestrel</span> --model models/tinystories-15m --backend cpu \{"\n"}
          {"  "}--prompt <span className="text-ok">&quot;Once upon a time&quot;</span> --max-tokens 32 --temperature 0
        </Terminal>
      </CaseSection>

      <CaseSection
        eyebrow="Limits"
        title={
          <>
            What it doesn&apos;t do <span className="serif-accent">(yet).</span>
          </>
        }
        aside="Each limit is written down, so nothing in the results above is overstated."
      >
        <Limits
          items={[
            "Prefill runs one token at a time: no fused prompt GEMMs and no FlashAttention.",
            "The KV cache is contiguous host memory: no paged allocation and no continuous batching.",
            "F16/BF16 are storage formats only. Activations and GPU buffers are FP32.",
            "Only selected bias-free Llama configs. Scaled RoPE and quantization are rejected.",
            "The CUDA source exists but hasn't been checked on NVIDIA hardware.",
            "Single-user only: no serving, no thread safety, no production-scale claims.",
          ]}
        />
      </CaseSection>

      <NextProject current="kestrel" />
    </article>
  );
}
