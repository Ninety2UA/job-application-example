import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-card/50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm font-bold tracking-tight">
              Dominik Benger <span className="text-accent">x</span> KLAR
            </p>
            <p className="mt-1 text-xs text-muted">
              An interactive job application
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href="https://dbenger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/dombenger/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:domi@dbenger.com"
              className="hover:text-foreground transition-colors"
            >
              Email
            </a>
            <Link
              href="/resume/dominik-benger-resume.pdf"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              Resume
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
