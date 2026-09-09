import { Box, Mail, Puzzle } from "lucide-react";

const GUIDANCE = [
  {
    icon: Puzzle,
    title: "Connect your inbox",
    description: "Forward mail from your help address into Sperraw.",
    href: "#",
  },
  {
    icon: Box,
    title: "Keep context together",
    description: "Each forwarded email becomes a ticket in this workspace.",
    href: "#",
  },
  {
    icon: Mail,
    title: "Notify your team",
    description: "Teammates get loops when a new message arrives.",
    href: "#",
  },
] as const;

export function GuidanceCards() {
  return (
    <section className="mt-10">
      <h3 className="text-text text-sm font-medium">Guidance</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {GUIDANCE.map((item) => (
          <article
            key={item.title}
            className="border-border rounded-xl border bg-white p-4 shadow-sm"
          >
            <item.icon className="text-text-secondary size-5" />
            <h4 className="text-text mt-3 text-sm font-semibold">
              {item.title}
            </h4>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              {item.description}
            </p>
            <a
              href={item.href}
              className="text-text mt-3 inline-block text-xs font-medium underline underline-offset-2"
            >
              Learn how
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
