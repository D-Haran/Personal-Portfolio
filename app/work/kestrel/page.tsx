import type { Metadata } from "next";
import { CaseHero, Metrics, NextProject, Prose, Stack } from "@/components/case/Case";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "kestrel")!;

export const metadata: Metadata = {
  title: "Kestrel: LLM inference in C++20",
  description:
    "A native Llama-family inference engine in C++20 with CPU and Metal backends: 217 tok/s decode on an M2 Pro, checked token-for-token against Hugging Face.",
};

export default function KestrelPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "217 tok/s", label: "Metal decode, M2 Pro" },
          { value: "50 / 50", label: "outputs identical to Hugging Face" },
          { value: "10×", label: "faster after the GPU rewrite" },
          { value: "0", label: "inference frameworks used" },
        ]}
      />

      <Prose>
        <p>
          Libraries make inference look like one function call. I wanted to know what the call does, so I wrote the
          whole transformer forward pass in C++20 — memory-mapped Safetensors loading, RoPE, grouped-query attention,
          KV caching, SwiGLU and sampling. No PyTorch, no llama.cpp, no MLX.
        </p>
        <p>
          Correctness came first. Every layer is compared against Hugging Face, and <strong>50 prompts are decoded
          end to end and checked token-for-token</strong> before any change gets kept.
        </p>
        <p>
          The first version had an embarrassing result: Metal was <em>slower</em> than the CPU. Profiling found the
          reason — <strong>91.9% of GPU time was spent inside <code>waitUntilCompleted</code></strong>, because the
          backend encoded a command buffer per operation and blocked on each one. Fusing the whole step into a single
          command buffer with a GPU-resident KV cache took decode from <strong>21.8 to 217 tok/s</strong>. Batching
          prefill into matrix-matrix multiplies did the same for the CPU path, 37.9 to 211 tok/s.
        </p>
        <p>
          It&apos;s a 15M-parameter model at batch 1 on a laptop, so none of this predicts behaviour at 7B. The
          README is honest about that and about everything else it doesn&apos;t do yet.
        </p>
      </Prose>

      <Stack project={project} />
      <NextProject current="kestrel" />
    </article>
  );
}
