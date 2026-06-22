'use client';

import Hero from '@/components/Hero/Hero';
import InteractiveGallery from '@/components/InteractiveGallery/InteractiveGallery';
import AboutUs from '@/components/AboutUs/AboutUs';
import Menu from '@/components/Menu/Menu';
import BookingForm from '@/components/BookingForm/BookingForm';
import Footer from '@/components/Footer/Footer';
import Sponsors from '@/components/Sponsors/Sponsors';

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ramirez Éttermek Siófok",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fő u. 43",
      addressLocality: "Siófok",
      postalCode: "8600",
      addressCountry: "HU",
    },
    telephone: "+36 84 330 323",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.9075,
      longitude: 18.0436,
    },
    servesCuisine: ["Hungarian", "International", "Pizza"],
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <AboutUs />
        <Menu />
        <InteractiveGallery />
        <BookingForm />
      </main>
      <Sponsors />
      <Footer />
    </>
  );
}
