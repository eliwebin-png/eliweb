import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");
  
  await prisma.post.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.enquirySubmission.deleteMany();
  await prisma.footerLink.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.value.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.techTool.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.heroContent.deleteMany();
  await prisma.adminUser.deleteMany();

  const hashedPassword = await bcrypt.hash("eliweb@admin2024", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@eliweb.in",
      password: hashedPassword,
    },
  });

  await prisma.heroContent.create({
    data: {
      headline: "We Build Websites. / We Craft Videos. / We Grow Brands.",
      subtitle:
        "EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.",
      cta1Label: "Start Your Project",
      cta1Url: "/contact",
      cta2Label: "Watch Our Projects",
      cta2Url: "/portfolio",
      trustPills: [
        "50+ Projects Delivered",
        "100% Client Satisfaction",
        "5★ Rated Agency",
      ],
      tickerItems: [
        "Software Development",
        "Digital Marketing",
        "Web & App Development",
        "Brand Building",
        "SEO & Search Visibility",
        "Paid Ads & Promotion",
        "Content Strategy",
      ],
    },
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Software Development",
        description:
          "We build powerful, scalable digital products — from stunning websites to full-featured web and mobile apps. Our team works across modern technologies to deliver solutions tailored to your business needs.",
        category: "software",
        imageUrl:
          "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
        tags: [
          "Web Development",
          "App Development",
          "Next.js",
          "WordPress",
          "Shopify",
          "API Integration",
        ],
        items: [
          "Web Development",
          "App Development",
          "Node.js & Next.js",
          "WordPress & Webflow",
          "Shopify & eCommerce",
          "API Integration",
          "Backend Systems",
        ],
        steps: ["Discovery", "Design", "Develop", "Test", "Launch"],
        ctaLabel: "Start Your Software Project",
        order: 0,
      },
      {
        title: "Digital Marketing",
        description:
          "Grow your brand online with data-driven strategies that get real results. We manage your entire digital presence — from social media to search visibility — so you can focus on running your business.",
        category: "marketing",
        imageUrl:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
        tags: [
          "Social Media",
          "Brand Building",
          "Paid Ads",
          "SEO",
          "Content Strategy",
          "Email Marketing",
        ],
        items: [
          "Social Media Management",
          "Brand Building",
          "Online Promotion & Paid Ads",
          "SEO & Search Visibility",
          "Content Strategy & Creation",
          "Email Marketing Campaigns",
        ],
        steps: ["Audit", "Strategy", "Execute", "Optimize", "Report"],
        ctaLabel: "Start Growing Your Brand",
        order: 1,
      },
      {
        title: "Cinematic Media & Brand Storytelling",
        description:
          "High-retention commercial video production, brand architecture, and interactive design systems built to turn audiences into evangelists.",
        category: "creative",
        imageUrl:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
        tags: [
          "Brand Video",
          "Storytelling",
          "Commercials",
          "UI/UX Design",
        ],
        items: [
          "Commercial Video Production",
          "Motion Graphics",
          "Brand Identity",
          "Creative Direction",
        ],
        steps: ["Scripting", "Production", "Editing", "Mastering"],
        ctaLabel: "Explore Creative Scope",
        order: 2,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        name: "Analytics Dashboard",
        category: "Web Projects",
        tags: ["E-Commerce", "React"],
        description:
          "A premium storefront redesigned for faster browsing and stronger conversion.",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 0,
      },
      {
        name: "Developer Portfolio",
        category: "Web Projects",
        tags: ["Personal Brand", "Code"],
        description:
          "A sharp developer portfolio designed around clarity, credibility, and speed.",
        imageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 1,
      },
      {
        name: "Brand Story Film",
        category: "Video Projects",
        tags: ["Brand Video", "Story"],
        description:
          "A cinematic brand film structured for emotion, trust, and audience retention.",
        imageUrl:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 2,
      },
      {
        name: "SaaS Landing Page",
        category: "Web Projects",
        tags: ["Web App", "SaaS"],
        description:
          "Conversion-first SaaS landing page with crisp storytelling and fast load times.",
        imageUrl:
          "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 3,
      },
      {
        name: "Product Launch Reel",
        category: "Video Projects",
        tags: ["Instagram Reel", "Launch"],
        description:
          "High-impact launch cuts optimized for paid social and audience retention.",
        imageUrl:
          "https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=700&q=80",
        featured: false,
        homepageTeaser: false,
        order: 4,
      },
      {
        name: "Restaurant Website",
        category: "Web Projects",
        tags: ["Business Site", "UI/UX"],
        description:
          "A warm, polished business site built to drive bookings and local trust.",
        imageUrl:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80",
        featured: true,
        homepageTeaser: true,
        order: 5,
      },
    ],
  });

  await prisma.caseStudy.create({
    data: {
      title: "Nova Commerce",
      description:
        "Nova Commerce needed a high-converting ecommerce platform to scale their D2C brand across India. We rebuilt their storefront with a modern stack, optimized checkout flow, and mobile-first UX designed to turn browsers into buyers.",
      results:
        "340% increase in online revenue within 90 days of launch. Average page load dropped to 2.1 seconds. Cart abandonment reduced by 45%. Mobile conversion rate improved by 62% through streamlined checkout and trust signals.",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        quote:
          "EliWeb.in transformed our landing page — leads doubled in 3 weeks!",
        name: "Ravi S.",
        role: "Founder",
        avatarUrl: "https://i.pravatar.cc/80?img=32",
        order: 0,
      },
      {
        quote: "The reel they edited went viral. Insane quality and speed.",
        name: "Priya M.",
        role: "Content Creator",
        avatarUrl: "https://i.pravatar.cc/80?img=44",
        order: 1,
      },
      {
        quote:
          "Professional, fast, and creative. Best agency decision we made.",
        name: "Amandeep K.",
        role: "E-Commerce Brand Owner",
        avatarUrl: "https://i.pravatar.cc/80?img=15",
        order: 2,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "What services does EliWeb.in offer?",
        answer:
          "We offer end-to-end digital services: web development (React, Next.js, WordPress, Shopify), mobile app development, UI/UX design, SEO, social media marketing, paid advertising, content strategy, and brand building.",
        page: "homepage",
        order: 0,
      },
      {
        question: "How much does a website cost?",
        answer:
          "Pricing depends on project scope. We serve startups to enterprises with competitive packages. Book a free call for a custom quote.",
        page: "homepage",
        order: 1,
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes! While based in India, we work with clients across the US, UK, UAE, Australia, and beyond.",
        page: "homepage",
        order: 2,
      },
      {
        question: "How long does a website take to build?",
        answer:
          "Most projects are delivered in 2–6 weeks. We prioritise speed without sacrificing quality.",
        page: "homepage",
        order: 3,
      },
      {
        question: "How long does a website take?",
        answer:
          "Most projects ship within 2–6 weeks depending on scope, with a clear timeline confirmed before kickoff.",
        page: "contact",
        order: 0,
      },
      {
        question: "What's included in your video editing package?",
        answer:
          "Our video editing packages include concept review, rough cut, colour grading, sound design, motion graphics, and platform-optimised exports for Reels, YouTube, and ads — with two revision rounds included.",
        page: "contact",
        order: 1,
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes — we are a remote-first team and work with clients across the world.",
        page: "contact",
        order: 2,
      },
      {
        question: "Can I see samples before starting?",
        answer:
          "Absolutely — see our portfolio for recent web and video work, and request samples relevant to your industry.",
        page: "contact",
        order: 3,
      },
      {
        question: "What are your payment terms?",
        answer:
          "Typically 50% upfront and 50% on delivery; milestone-based billing is available for larger projects.",
        page: "contact",
        order: 4,
      },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      {
        name: "Arjun Sharma",
        role: "Founder & CEO",
        imageUrl: "https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg",
        order: 0,
      },
      {
        name: "Neha Kapoor",
        role: "Creative Director",
        imageUrl: "https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg",
        order: 1,
      },
      {
        name: "Vikram Bose",
        role: "Lead Developer",
        imageUrl: "https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg",
        order: 2,
      },
    ],
  });

  await prisma.stat.createMany({
    data: [
      { value: "50+", label: "Projects Delivered", order: 0 },
      { value: "30+", label: "Global Clients", order: 1 },
      { value: "3+", label: "Years Experience", order: 2 },
      { value: "100%", label: "Retention Rate", order: 3 },
    ],
  });

  await prisma.techTool.createMany({
    data: [
      {
        name: "Figma",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        order: 0,
      },
      {
        name: "Photoshop",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg",
        order: 1,
      },
      {
        name: "Illustrator",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
        order: 2,
      },
      {
        name: "Canva",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
        order: 3,
      },
      {
        name: "HTML",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        order: 4,
      },
      {
        name: "CSS",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        order: 5,
      },
      {
        name: "JavaScript",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        order: 6,
      },
      {
        name: "React",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        order: 7,
      },
      {
        name: "WordPress",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        order: 8,
      },
      {
        name: "After Effects",
        logoUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg",
        order: 9,
      },
    ],
  });

  await prisma.aboutContent.createMany({
    data: [
      {
        key: "mission",
        value: "To empower brands with world-class digital experiences.",
      },
      {
        key: "vision",
        value: "To be India's most trusted creative agency for web and video.",
      },
      {
        key: "story_heading",
        value: "Born From Passion. Built for Performance.",
      },
      {
        key: "story_body",
        value:
          "EliWeb.in started with a simple belief — that every business, big or small, deserves a powerful digital presence. We're a team of designers, developers, and video editors obsessed with craft, strategy, and results.",
      },
    ],
  });

  await prisma.value.createMany({
    data: [
      { icon: "Flame", label: "Passion", order: 0 },
      { icon: "Target", label: "Precision", order: 1 },
      { icon: "Zap", label: "Speed", order: 2 },
      { icon: "Handshake", label: "Transparency", order: 3 },
    ],
  });

  await prisma.siteSettings.createMany({
    data: [
      { key: "email", value: "eliweb.in@gmail.com" },
      { key: "hello_email", value: "eliweb.in@gmail.com" },
      { key: "phone", value: "+91 79 7385 1691" },
      { key: "whatsapp_url", value: "https://wa.me/917973851691" },
      { key: "location", value: "India (Remote-First)" },
      { key: "response_time", value: "Reply within 24 hours" },
      {
        key: "instagram_url",
        value: "https://www.instagram.com/eliweb.in/",
      },
      {
        key: "linkedin_url",
        value: "https://www.instagram.com/eliweb.in/",
      },
      {
        key: "youtube_url",
        value: "https://www.instagram.com/eliweb.in/",
      },
      {
        key: "brand_tagline",
        value:
          "We Build. We Edit. We Elevate. Premium websites and cinematic video content for ambitious brands.",
      },
      { key: "copyright_year", value: "2026" },
    ],
  });

  await prisma.footerLink.createMany({
    data: [
      { column: "company", label: "About", url: "#approach", order: 0 },
      { column: "company", label: "Portfolio", url: "#portfolio", order: 1 },
      { column: "company", label: "Contact", url: "#contact", order: 2 },
      {
        column: "services",
        label: "Website Development",
        url: "#services",
        order: 0,
      },
      {
        column: "services",
        label: "Video & Motion Editing",
        url: "#services",
        order: 1,
      },
      {
        column: "services",
        label: "UI/UX Design & Brand",
        url: "#services",
        order: 2,
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        slug: 'architecting-for-speed',
        title: 'Architecting for Speed: How Next.js App Router & Serverless Postgres Power Modern Applications',
        excerpt: 'A comprehensive exploration of streaming SSR, server components, and connection pooler optimization for sub-100ms global response times.',
        content: `Modern web architecture requires uncompromising performance. When latency rises, user engagement drops and conversion rates plummet.

At EliWeb, we optimize every layer of the technology stack: from Next.js server components streaming HTML directly from the edge, to Neon Serverless PostgreSQL instances with pooled transaction caching.

By decoupling data hydration from client-side bundle execution, applications render within single-digit milliseconds globally. Combined with intelligent revalidation and automated static fallbacks, your platform stays resilient even during multi-region traffic spikes.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
      {
        slug: 'editorial-web-design',
        title: 'Editorial Web Design: Moving Beyond Generic Framework Templates in 2026',
        excerpt: 'Why leading tech enterprises are abandoning cookie-cutter CSS kits in favor of custom design systems with bespoke typography and atmospheric lighting.',
        content: `Every brand wants to stand out, yet most commercial websites today look identical. Generic CSS component kits have democratized web development at the cost of brand identity.

Editorial web design reclaims individuality. By pairing bespoke serif typography with atmospheric background gradients and fluid layouts, digital atelier experiences create memorable impressions that elevate customer perception and establish market authority.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        published: true,
      },
      {
        slug: 'psychology-of-video-conversion',
        title: 'The Psychology of Video Conversion: Crafting Cinematic Brand Stories that Drive Pipeline',
        excerpt: 'How 4K high-definition video production combined with narrative pacing converts curious visitors into long-term enterprise clients.',
        content: `Visual storytelling is the most potent conversion medium available today. A compelling 60-second video conveys technical architecture, executive ethos, and customer trust faster than pages of technical documentation.

By structuring high-retention video arcs around problem identification, structural resolution, and measurable outcomes, brand videos become self-sustaining acquisition engines across organic search and paid campaigns.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
        published: true,
      },
      {
        slug: 'prisma-orm-best-practices',
        title: 'Prisma ORM Best Practices: Zero-Downtime Migrations & Relational Integrity',
        excerpt: 'Field-tested patterns for scaling PostgreSQL schemas, managing complex foreign keys, and maintaining blazing fast read caches in high-traffic applications.',
        content: `Relational databases remain the backbone of modern web platforms. As applications scale to millions of monthly operations, schema evolution and query planning become critical engineering disciplines.

Prisma ORM bridges type-safe developer ergonomics with robust connection lifecycle control. In this deep dive, we explore zero-downtime migration strategies, automated index tuning, and connection pool topologies engineered for serverless compute runtimes like AWS Lambda and Neon Serverless PostgreSQL.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        published: true,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
