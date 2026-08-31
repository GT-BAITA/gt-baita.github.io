import { Spinner } from "@/components/ui/spinner";
import { CustomComboboxInput } from "../../shared/custom-combobox-input";
import { CustomInput } from "../../shared/custom-input";
import { CustomTextarea } from "../../shared/custom-textarea";
import { useContactForm } from "@/hooks/useContactForm";
import { useSuccessMorph } from "@/hooks/useSuccessMorph";
import { motion } from "motion/react";
import { splitText } from "@/utils/split-text";
import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onContactRequest } from "@/lib/contact-request";

export function ContactFormSection() {
  const { t } = useTranslation();

  const {
    formRef,
    siteKey,
    isSubmitting,
    isSucceeded,
    formId,
    goBack,
    errors,
  } = useContactForm(t);

  const {
    phase,
    fieldsOpen,
    messageOpen,
    messageState,
    checkRef,
    messageRef,
  } = useSuccessMorph(isSucceeded);

  // The Message field is controlled so a CTA elsewhere on the page can
  // arrive with it already filled in.
  const [message, setMessage] = useState("");
  const injectedRef = useRef("");

  useEffect(
    () =>
      onContactRequest((requested) => {
        // Read the previous injection before overwriting it: the
        // functional updater runs on the next render, by which point
        // the ref would already hold `requested` and the comparison
        // would never match — every CTA after the first was ignored.
        const previous = injectedRef.current;
        injectedRef.current = requested;

        // Never clobber something the visitor typed themselves — only
        // an empty field or a previous injection gets replaced.
        setMessage((current) =>
          current === "" || current === previous ? requested : current
        );
      }),
    []
  );

  // reset() clears the uncontrolled fields but cannot touch React state.
  useEffect(() => {
    if (!isSucceeded) return;
    setMessage("");
    injectedRef.current = "";
  }, [isSucceeded]);

  const title = t("contactForm.title");
  const successTitle = t("contactForm.successTitle");

  // The section is lg:items-center, so a shrinking card would drag the
  // copy on the left up with it. Reserve the form's height on desktop
  // and let the banner settle inside a frame that never moves.
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [reservedHeight, setReservedHeight] = useState<number>();

  useLayoutEffect(() => {
    if (phase === "success") return;

    const card = cardRef.current;
    if (!card) return;

    const observer = new ResizeObserver(() =>
      setReservedHeight(card.offsetHeight)
    );
    observer.observe(card);

    return () => observer.disconnect();
  }, [phase]);

  return (
    <section
      id="contact-form"
      className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-20"
    >
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>

      <div className="space-y-6 lg:max-w-[500px]">
        <motion.h2
          key={title}
          className="text-4xl md:text-5xl lg:text-6xl font-domine text-neutral-100 leading-none inline-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {splitText(title).map((char, index) => (
            <motion.span
              key={`${title}-${index}-${char}`}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ duration: 0.05, ease: "linear" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        <p className="text-neutral-400 font-geist max-w-[430px]">
          {t("contactForm.description")}
        </p>
      </div>

      <div
        className="w-full lg:max-w-[560px] flex flex-col justify-center lg:min-h-[var(--reserved-h)]"
        style={
          reservedHeight
            ? ({ "--reserved-h": `${reservedHeight}px` } as React.CSSProperties)
            : undefined
        }
      >
        <div ref={cardRef}>
          <form
            ref={formRef}
            id="myForm"
            action={`https://formspree.io/f/${formId}`}
            method="POST"
            className="t-morph-card"
            data-phase={phase}
          >
            {/* Fields — collapse via grid-template-rows, no measurement.
                The card's height follows them, and the CTA below rides
                the closing track up to where the banner's badge lands. */}
            <div
              className="t-acc t-morph-fields"
              data-open={String(fieldsOpen)}
              inert={!fieldsOpen}
            >
              <div className="t-acc-panel">
                <div className="t-acc-panel-inner">
                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                    <CustomInput
                      id="name"
                      type="text"
                      name="name"
                      label={t("contactForm.form.name.label")}
                      placeholder={t("contactForm.form.name.placeholder")}
                      required
                      error={errors.name}
                    />

                    <CustomInput
                      id="email"
                      type="email"
                      name="email"
                      label={t("contactForm.form.email.label")}
                      required
                      placeholder={t("contactForm.form.email.placeholder")}
                      error={errors.email}
                    />

                    <CustomInput
                      id="companyOrInstitution"
                      type="text"
                      name="companyOrInstitution"
                      label={t("contactForm.form.companyOrInstitution.label")}
                      placeholder={t(
                        "contactForm.form.companyOrInstitution.placeholder"
                      )}
                    />

                    <CustomComboboxInput
                      id="affiliation"
                      type="text"
                      name="affiliation"
                      label={t("contactForm.form.affiliation.label")}
                      placeholder={t("contactForm.form.affiliation.placeholder")}
                      options={[
                        {
                          label: t(
                            "contactForm.form.affiliation.options.professor"
                          ),
                          value: t(
                            "contactForm.form.affiliation.options.professor"
                          ),
                        },
                        {
                          label: t(
                            "contactForm.form.affiliation.options.itStaff"
                          ),
                          value: t(
                            "contactForm.form.affiliation.options.itStaff"
                          ),
                        },
                        {
                          label: t(
                            "contactForm.form.affiliation.options.student"
                          ),
                          value: t(
                            "contactForm.form.affiliation.options.student"
                          ),
                        },
                        {
                          label: t("contactForm.form.affiliation.options.other"),
                          value: "",
                        },
                      ]}
                    />
                  </div>

                  <CustomTextarea
                    id="message"
                    name="message"
                    label={t("contactForm.form.message.label")}
                    placeholder={t("contactForm.form.message.placeholder")}
                    rows={4}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* The one element that survives both states: submit pill,
                then spinner, then the check badge of the banner. */}
            <button
              className="g-recaptcha t-cta-morph mt-4 disabled:cursor-default"
              data-phase={phase}
              data-sitekey={siteKey}
              data-callback="onSubmit"
              data-action="submit"
              disabled={isSubmitting || phase === "success"}
              type="submit"
            >
              <span className="t-cta-slot">
                <span
                  className="t-icon-swap t-cta-swap"
                  data-state={isSubmitting ? "b" : "a"}
                >
                  <span className="t-icon" data-icon="a">
                    {t("contactForm.form.submit")}
                  </span>
                  <span className="t-icon" data-icon="b">
                    <Spinner />
                  </span>
                </span>

                <span
                  ref={checkRef}
                  className="t-success-check t-cta-check"
                  data-state={phase === "success" ? "in" : "out"}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
                    <path
                      d="M14 25 L21 32 L34 17"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>

            {/* Obrigado block — same collapse mechanism, on the same
                clock as the fields so the card's height stays
                monotonic. Its content is invisible until is-shown, so
                opening the track early costs nothing visually.
                .t-stagger owns the visuals. */}
            <div
              className="t-acc t-morph-message"
              data-open={String(messageOpen)}
              inert={messageState !== "is-shown"}
              style={
                {
                  "--title-steps": splitText(successTitle).length,
                } as React.CSSProperties
              }
            >
              <div className="t-acc-panel">
                <div className="t-acc-panel-inner">
                  <div
                    ref={messageRef}
                    tabIndex={-1}
                    className={`t-stagger flex flex-col items-center text-center gap-4 pt-6 outline-none ${messageState}`}
                  >
                    <h2 className="text-4xl md:text-5xl font-domine text-neutral-100">
                      {splitText(successTitle).map((char, index) => (
                        <span
                          key={`${successTitle}-${index}-${char}`}
                          className="t-morph-char"
                          style={{ "--i": index } as React.CSSProperties}
                        >
                          {char}
                        </span>
                      ))}
                    </h2>

                    <p className="t-stagger-line t-stagger-line--2 text-neutral-300 font-geist">
                      {t("contactForm.successMessage")}
                    </p>

                    <span className="t-stagger-line t-stagger-line--3">
                      <button
                        type="button"
                        onClick={goBack}
                        className="bg-neutral-950 text-white rounded-lg px-4 h-9 text-sm hover:bg-neutral-800 transition-colors"
                      >
                        {t("contactForm.goBack")}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
