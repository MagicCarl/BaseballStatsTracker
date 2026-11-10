// Real quotes only — never invent these. The section renders nothing while
// this list is empty.
const testimonials: {
  quote: string;
  name: string;
  role?: string;
}[] = [
  {
    quote:
      "Thx so much, I love your program. I studied a lot of options to score the games. We started a new youth league and will offer very reasonable participation fees. We aim to extend your generosity, with some of our own, to those less fortunate. Play ball.",
    name: "Brent",
    role: "Youth league founder",
  },
  {
    quote: "A refreshing change from the usual subscription fatigue",
    name: "Aidan Talon",
  },
  {
    quote:
      "Baseball Stats Tracker has a clear value proposition, excellent pricing transparency, and good competitive readiness, making it a strong offering for its target audience.",
    name: "Webelf.ai",
  },
  {
    quote: "Congrats — looks like a solid product",
    name: "David",
    role: "KrispiTech",
  },
  {
    quote: "Very cool idea!",
    name: "Will Colachis",
  },
];

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <h2 className="text-center text-3xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
        What people are saying
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {testimonials.map((item) => (
          <figure
            key={item.quote}
            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <blockquote className="text-gray-700 dark:text-gray-300">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
              {item.role && (
                <span className="text-gray-500 dark:text-gray-400"> — {item.role}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
