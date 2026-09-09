export const ONBOARDING_STEPS = [
  {
    id: "company",
    title: "Add Workspace",
    description: "Name your workspace and choose a unique URL or identifier.",
    heading: "Add Workspace",
    subtitle:
      "Create a workspace for your company. This is the shared space where your team will send recognition.",
  },
  {
    id: "culture",
    title: "Set up email forwarding",
    description: "Route recognition emails into this workspace automatically.",
    heading: "Set up email forwarding",
    subtitle:
      "When you receive emails in this workspace, they will automatically be converted to tickets. Set up forwarding to get started.",
  },
  {
    id: "invite",
    title: "Invite your team",
    description:
      "Bring colleagues in so they can start recognizing each other.",
    heading: "Invite your team",
    subtitle:
      "Send invites now, or skip and add people later from workspace settings.",
  },
  {
    id: "completion",
    title: "You're all set",
    description: "Review your workspace and start using Sperraw.",
    heading: "Workspace ready",
    subtitle:
      "Your workspace is set up. You can invite more people and tweak settings any time.",
  },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

export const FORWARDING_ADDRESS = "nasbui.r@example.net";
