import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 pt-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-none tracking-[-0.04em]">
        Unresolved <span className="serif-accent">reference.</span>
      </h1>
      <p className="mt-5 text-lg text-muted">This page doesn&apos;t exist, or it moved.</p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-accent px-7 py-4 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#4580f0]"
      >
        Back home
      </Link>
    </section>
  );
}
