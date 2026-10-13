import { Faq } from "@/components/shared/faq";
import { useIdpContent } from "./content";
import { ArrowUpRight } from "./icons";
import { Kicker, rv } from "./primitives";

export function FaqSection() {
  const c = useIdpContent().faq;

  const items = c.items.map((f) => ({
    q: f.q,
    a: (
      <>
        <p>{f.a}</p>
        {f.link && (
          <p>
            <a
              href={f.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink underline underline-offset-4 hover:text-ink-hover"
            >
              {f.link.label}
              <ArrowUpRight className="size-4" />
            </a>
          </p>
        )}
      </>
    ),
  }));

  return (
    <section id="faq" className="sec">
      <div className="wrap faqgrid">
        <div>
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={{ ...rv(1), fontSize: 40 }}>
            {c.title}
          </h2>
        </div>
        <div className="rv" style={rv(2)}>
          <Faq items={items} />
        </div>
      </div>
    </section>
  );
}
