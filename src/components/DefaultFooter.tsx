export function AppFooter() {
  return (
    <footer className="text-text-muted mx-auto mt-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-2 py-4 sm:flex-row">
      <nav className="flex items-center gap-4">
        <a href="#" className="hover:text-text transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-text transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-text transition-colors">
          Help
        </a>
      </nav>
      <p>© {new Date().getFullYear()} Sperraw by CongThach</p>
    </footer>
  );
}
