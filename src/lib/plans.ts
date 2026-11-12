// What the site shows for each plan. The Pro price must match the price of
// the variant in Lemon Squeezy (LEMONSQUEEZY_VARIANT_ID): that is what is charged.
export const freePlan = {
  key: "free",
  price: 0,
  featured: false,
  features: ["oneProject", "communitySupport"],
} as const;

export const proPlan = {
  key: "pro",
  price: 19,
  featured: true,
  features: [
    "unlimitedProjects",
    "prioritySupport",
    "analytics",
    "customDomain",
  ],
} as const;

export const plans = [freePlan, proPlan] as const;

export const currency = "EUR";
