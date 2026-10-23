import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowUpRight, Check } from "lucide-react";
import { LandingPage } from "@/components/landing-page";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "See where your skills stand",
  description: SITE_DESCRIPTION,
  openGraph: { title: `${SITE_NAME} · A career map for students`, description: SITE_DESCRIPTION, url: "/", type: "website", siteName: SITE_NAME }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "WebApplication", "@id": `${SITE_URL}/#app`, name: SITE_NAME, applicationCategory: "EducationalApplication", operatingSystem: "Web", description: SITE_DESCRIPTION, url: SITE_URL, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
  ]
};

const footerLinks = {
  map: [
    ["Explore the demo", "/demo"],
    ["Skills", "/dashboard/skills"],
    ["Projects", "/dashboard/proof"],
    ["Journey", "/dashboard/journey"]
  ],
  information: [
    ["About", "/about"],
    ["Privacy and data", "/privacy"],
    ["Sign in", "/login"]
  ]
} as const;

export default function Home() {
  return (
    <>
      <Script id="site-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <noscript>
        <main id="no-script-content" className="mx-auto max-w-3xl px-5 py-16">
          <h1>CareerProfile · See where your student skills stand</h1>
          <p>Build your academic profile, record your skills, choose a target career, and compare your proficiency with the role&apos;s requirements. Keep projects by semester and use clear next steps to plan what to learn next.</p>
          <p><Link href="/demo">Explore the sample career map</Link> or <Link href="/signup">create your profile</Link>.</p>
        </main>
      </noscript>
      <LandingPage />
      <footer className="landing-footer-shell relative overflow-hidden px-5 pb-40 pt-14 sm:px-8 lg:pb-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5EEAD4]/40 to-transparent" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1280px] gap-10 sm:grid-cols-[1.5fr_.85fr_.85fr]">
          <div>
            <Link href="/" aria-label="CareerProfile home" className="inline-flex min-h-11 items-center gap-2.5">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#5EEAD4,#818CF8)] text-[#04131A] shadow-[0_0_24px_-6px_rgba(94,234,212,.5)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
                  <path d="M4.5 16.8 9.6 11l2.8 2.9 6.9-7.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19.3" cy="6.5" r="1.9" fill="currentColor" />
                  <path d="M4.5 19.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-[-0.03em] text-white">Career<span className="font-normal text-[#5EEAD4]">Profile</span></span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
              A student career map that keeps your record, your skills and your next step in one private place.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/60">
              <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="h-3 w-3 text-[#5EEAD4]" /> Self-assessed levels</span>
              <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="h-3 w-3 text-[#5EEAD4]" /> Explainable readiness</span>
            </p>
          </div>

          <nav aria-label="Your map">
            <p className="font-mono text-[10px] tracking-[0.12em] text-white/55">YOUR MAP</p>
            <ul className="mt-2">
              {footerLinks.map.map(([label, href]) => (
                <li key={href}>
                  <Link className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white" href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Information">
            <p className="font-mono text-[10px] tracking-[0.12em] text-white/55">INFORMATION</p>
            <ul className="mt-2">
              {footerLinks.information.map(([label, href]) => (
                <li key={href}>
                  <Link className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white" href={href}>{label}</Link>
                </li>
              ))}
              <li>
                <Link className="inline-flex min-h-11 items-center gap-1 text-sm text-[#5EEAD4] hover:text-[#99F6E4]" href="/signup">
                  Create a profile <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1280px] flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE_NAME}</span>
          <span>Readiness is a weighted summary of self-reported skills. Not a credential or an employment prediction.</span>
        </div>
      </footer>
    </>
  );
}
