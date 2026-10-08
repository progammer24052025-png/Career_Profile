import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { LandingPage } from "@/components/landing-page";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "A clear map from your skills to your career",
  description: SITE_DESCRIPTION,
  openGraph: { title: `${SITE_NAME} · Your student career map`, description: SITE_DESCRIPTION, url: "/", type: "website", siteName: SITE_NAME },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "WebApplication", "@id": `${SITE_URL}/#app`, name: SITE_NAME, applicationCategory: "EducationalApplication", operatingSystem: "Web", description: SITE_DESCRIPTION, url: SITE_URL, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ],
};

export default function Home() {
  return <>
    <Script id="site-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <noscript><main id="no-script-content" className="mx-auto max-w-3xl px-5 py-16"><h1>CareerProfile · A clear map from student skills to career readiness</h1><p>Build your academic profile, record your skills, choose a target career, and compare your proficiency with the role’s requirements. Keep projects by semester and use clear next steps to plan what to learn next.</p><p><Link href="/demo">Explore the sample career map</Link> or <Link href="/signup">create your profile</Link>.</p></main></noscript>
    <LandingPage />
    <footer className="relative overflow-hidden bg-[var(--surface-ink)] px-5 pb-28 pt-12 text-white sm:px-8 md:pb-10"><div className="mx-auto grid max-w-[1280px] gap-8 sm:grid-cols-[1.2fr_.8fr_.8fr]"><div><Link aria-label="CareerProfile home" className="inline-flex min-h-11 items-center gap-3" href="/"><Image src="/icon.svg" alt="" width={34} height={34} className="h-8 w-8 rounded-[9px] object-cover" /><span className="font-display text-lg font-semibold tracking-tight">Career<span className="font-normal text-[var(--accent)]">Profile</span></span></Link><p className="mt-3 max-w-sm text-sm leading-6 text-white/60">A student career map that makes skills, projects and next steps easier to understand.</p></div><nav aria-label="Product"><p className="text-[11px] font-medium tracking-[.14em] text-white/40">YOUR MAP</p><ul className="mt-3 space-y-1 text-sm text-white/65"><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/demo">Explore the demo</Link></li><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/signup">Create a profile</Link></li><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/dashboard/skills">Skills</Link></li><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/dashboard/journey">Journey</Link></li></ul></nav><nav aria-label="Information"><p className="text-[11px] font-medium tracking-[.14em] text-white/40">INFORMATION</p><ul className="mt-3 space-y-1 text-sm text-white/65"><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/about">About</Link></li><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/privacy">Privacy</Link></li><li><Link className="inline-flex min-h-10 items-center hover:text-white" href="/login">Sign in</Link></li></ul></nav></div><div className="mx-auto mt-8 flex max-w-[1280px] flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row"><span>© {new Date().getFullYear()} {SITE_NAME}</span><span>Your skill levels are self-assessed. Scores explain the requirements they use.</span></div></footer>
  </>;
}
