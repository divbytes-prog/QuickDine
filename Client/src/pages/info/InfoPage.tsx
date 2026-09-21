import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import AuthModal from "../../components/AuthModal.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

type PageKey = "about" | "partner" | "careers" | "terms" | "privacy" | "cookies";

interface Props {
    page: PageKey;
}

const content = {
    about: {
        eyebrow: "ABOUT QUICKDINE",
        title: "Exceptional dining, without the friction.",
        intro:
            "QuickDine is a restaurant discovery and reservation experience designed around one simple idea: finding and booking a memorable table should feel as considered as the meal itself.",
        sections: [
            {
                title: "What we are building",
                body:
                    "QuickDine brings restaurant discovery, live reservation availability, booking management, restaurant-owner tools, and platform administration into one focused experience.",
            },
            {
                title: "For diners",
                body:
                    "Browse curated restaurants, search by cuisine and location, check available times, reserve a table, and manage upcoming bookings from one account.",
            },
            {
                title: "For restaurants",
                body:
                    "Owners can create a restaurant profile, submit it for approval, manage capacity and available time slots, and process live reservation records from their dashboard.",
            },
        ],
    },
    careers: {
        eyebrow: "CAREERS",
        title: "Build thoughtful hospitality software.",
        intro:
            "QuickDine is currently a portfolio product rather than a staffed company, but collaboration, feedback, and project conversations are welcome.",
        sections: [
            {
                title: "Engineering",
                body:
                    "The project spans React, TypeScript, Express, MongoDB, authentication, serverless deployment, responsive UI, and reservation workflow design.",
            },
            {
                title: "Product & design",
                body:
                    "The interface focuses on calm typography, clear hierarchy, compact interaction patterns, and a premium dining aesthetic across desktop and mobile.",
            },
            {
                title: "Get in touch",
                body:
                    "For collaboration or project-related enquiries, use the contact email below and include a short note about what you would like to work on.",
            },
        ],
    },
    terms: {
        eyebrow: "LEGAL",
        title: "Terms of Service",
        intro:
            "These terms describe the intended use of the QuickDine demonstration application. QuickDine is a portfolio project and does not currently process paid commercial reservations.",
        sections: [
            {
                title: "Use of the service",
                body:
                    "You may use QuickDine to explore restaurants, create an account, submit reservation requests, and test owner or administrative flows available to your account role.",
            },
            {
                title: "Reservation information",
                body:
                    "Restaurant availability and demo restaurant information are provided for application demonstration. A booking shown as confirmed inside QuickDine should not be treated as a real-world restaurant reservation unless the listed restaurant independently confirms it.",
            },
            {
                title: "Accounts and acceptable use",
                body:
                    "Users are responsible for the information submitted through their accounts and should not attempt to interfere with the service, access another user's data, or misuse owner or administrator functionality.",
            },
            {
                title: "Service availability",
                body:
                    "The application may change, be redeployed, or be temporarily unavailable while the project is maintained and improved.",
            },
        ],
    },
    privacy: {
        eyebrow: "LEGAL",
        title: "Privacy Policy",
        intro:
            "QuickDine collects only the information needed to demonstrate account and reservation functionality. This page explains what the application stores and why.",
        sections: [
            {
                title: "Account information",
                body:
                    "When you create an account, the application may store your name, email address, optional phone number, encrypted password, and account role.",
            },
            {
                title: "Reservation information",
                body:
                    "Bookings may include the selected restaurant, date, time, party size, occasion, and any special requests you choose to provide.",
            },
            {
                title: "Authentication",
                body:
                    "QuickDine uses token-based authentication so signed-in users can access protected account, booking, owner, and administrator features.",
            },
            {
                title: "Data use",
                body:
                    "Stored information is used to operate the application's demonstrated functionality. It is not presented as a commercial data-selling service.",
            },
        ],
    },
    cookies: {
        eyebrow: "LEGAL",
        title: "Cookies & Local Storage",
        intro:
            "QuickDine keeps browser storage simple. The application primarily uses local storage for sign-in state rather than a marketing-cookie system.",
        sections: [
            {
                title: "Authentication storage",
                body:
                    "After sign-in, the browser stores an authentication token locally so protected pages can remain accessible between page loads.",
            },
            {
                title: "No advertising profile",
                body:
                    "The current QuickDine implementation does not include an advertising network or a dedicated cross-site tracking system.",
            },
            {
                title: "Clearing stored data",
                body:
                    "Signing out removes the locally stored authentication token. You can also clear site data using your browser settings.",
            },
        ],
    },
} as const;

export default function InfoPage({ page }: Props) {
    const { setAuthModalOpen } = useAppContext();

    if (page === "partner") {
        return (
            <div className="min-h-screen bg-surface flex flex-col pt-20">
                <Navbar />
                <AuthModal />
                <main className="grow">
                    <section className="border-b border-outline-variant/15 bg-white">
                        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-end">
                            <div className="lg:col-span-8">
                                <p className="text-[10px] font-medium tracking-[0.24em] text-secondary uppercase mb-5">RESTAURANT PARTNERS</p>
                                <h1 className="font-display text-4xl md:text-6xl leading-[1.03] text-primary max-w-4xl">
                                    Bring your dining room to QuickDine.
                                </h1>
                                <p className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-black/55">
                                    Create an owner account, submit your restaurant profile, define availability and capacity, and manage reservations from the owner portal once approved.
                                </p>
                            </div>
                            <div className="lg:col-span-4 lg:text-right">
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white px-6 py-3.5 text-xs font-medium tracking-widest uppercase transition-colors cursor-pointer"
                                >
                                    Create owner account <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                ["01", "Create your profile", "Register as a Restaurant Owner / Manager and enter your restaurant details."],
                                ["02", "Submit for approval", "Your listing enters the admin review flow before it becomes publicly bookable."],
                                ["03", "Manage reservations", "Set capacity and time slots, then process confirmed bookings from the owner dashboard."],
                            ].map(([n, title, body]) => (
                                <article key={n} className="bg-white border border-outline-variant/20 p-7 md:p-8 ambient-shadow">
                                    <span className="text-[10px] tracking-[0.2em] text-secondary">{n}</span>
                                    <h2 className="font-display text-xl text-primary mt-5 mb-3">{title}</h2>
                                    <p className="text-sm leading-7 text-black/55">{body}</p>
                                </article>
                            ))}
                        </div>

                        <div className="mt-16 bg-primary text-white p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-[10px] tracking-[0.2em] text-secondary-container uppercase mb-3">OWNER PORTAL</p>
                                <h2 className="font-display text-3xl md:text-4xl">Already registered?</h2>
                                <p className="text-white/65 text-sm leading-7 mt-4">Sign in with your owner account to manage your restaurant and current reservations.</p>
                            </div>
                            <div className="md:text-right">
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="inline-flex items-center gap-3 bg-white text-primary hover:bg-secondary hover:text-white px-6 py-3.5 text-xs font-medium tracking-widest uppercase transition-colors cursor-pointer"
                                >
                                    Open sign in <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const pageContent = content[page];

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />
            <main className="grow">
                <section className="bg-white border-b border-outline-variant/15">
                    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
                        <p className="text-[10px] font-medium tracking-[0.24em] text-secondary uppercase mb-5">{pageContent.eyebrow}</p>
                        <h1 className="font-display text-4xl md:text-6xl leading-[1.03] text-primary max-w-4xl">{pageContent.title}</h1>
                        <p className="mt-7 max-w-3xl text-base md:text-lg leading-8 text-black/55">{pageContent.intro}</p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <aside className="lg:col-span-3">
                            <div className="sticky top-28 border-t border-primary pt-5">
                                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-black/50">QuickDine / {page}</span>
                            </div>
                        </aside>

                        <div className="lg:col-span-8 lg:col-start-5 space-y-12">
                            {pageContent.sections.map((section, index) => (
                                <article key={section.title} className="border-b border-outline-variant/20 pb-10 last:border-b-0">
                                    <div className="flex gap-5">
                                        <span className="text-[10px] text-secondary pt-2">0{index + 1}</span>
                                        <div>
                                            <h2 className="font-display text-2xl md:text-3xl text-primary mb-4">{section.title}</h2>
                                            <p className="text-sm md:text-base leading-8 text-black/55 max-w-3xl">{section.body}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {page === "about" && (
                                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                                    {[
                                        [UtensilsCrossed, "Discover", "Browse approved restaurant experiences."],
                                        [Sparkles, "Reserve", "Check capacity and book available times."],
                                        [ShieldCheck, "Manage", "Dedicated user, owner, and admin workflows."],
                                    ].map(([Icon, title, body]) => {
                                        const IconComponent = Icon as typeof UtensilsCrossed;
                                        return (
                                            <div key={String(title)} className="bg-white border border-outline-variant/20 p-6">
                                                <IconComponent size={18} className="text-secondary mb-5" />
                                                <h3 className="font-display text-lg text-primary mb-2">{String(title)}</h3>
                                                <p className="text-xs leading-6 text-black/55">{String(body)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {page === "careers" && (
                                <a
                                    href="mailto:24DCS032@lnmiit.ac.in?subject=QuickDine%20Collaboration"
                                    className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white px-6 py-3.5 text-xs font-medium tracking-widest uppercase transition-colors"
                                >
                                    <Mail size={15} /> Contact about collaboration
                                </a>
                            )}

                            {(page === "terms" || page === "privacy" || page === "cookies") && (
                                <div className="bg-surface-container-low border border-outline-variant/20 p-6 flex gap-4 items-start">
                                    <CheckCircle2 size={18} className="text-secondary shrink-0 mt-0.5" />
                                    <p className="text-xs leading-6 text-black/55">
                                        Last updated September 2026. For questions, email{" "}
                                        <a className="text-primary underline underline-offset-4" href="mailto:24DCS032@lnmiit.ac.in">
                                            24DCS032@lnmiit.ac.in
                                        </a>.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
