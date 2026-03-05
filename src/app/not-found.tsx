import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">
          This page doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            Back to Home
          </Link>
          <Link
            href="/recommendations"
            className="rounded-full border border-card-border px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/30 hover:text-foreground"
          >
            View Recommendations
          </Link>
        </div>
      </div>
    </section>
  );
}
