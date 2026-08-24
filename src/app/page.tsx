import { CartDrawer } from "@/components/CartDrawer";
import { CateringSection } from "@/components/catering/CateringSection";
import { CustomizeModal } from "@/components/CustomizeModal";
import { DeliveryPartnerSheet } from "@/components/DeliveryPartnerSheet";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LocationSection } from "@/components/LocationSection";
import { MenuSection } from "@/components/MenuSection";
import { Navbar } from "@/components/Navbar";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Testimonials } from "@/components/Testimonials";
import { Toast } from "@/components/Toast";
import { TrustMarquee } from "@/components/TrustMarquee";
import { WhyUs } from "@/components/WhyUs";

/**
 * Section order is the argument the page makes, in order:
 * appetite → proof → product → the same kitchen at scale → reassurance → ask.
 *
 * Catering sits after the menu rather than before it because the B2B reader
 * still buys with their eyes first — but the hero carries a direct link so a
 * procurement visitor never has to scroll a consumer menu to find it.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <WhyUs />
        <MenuSection />
        <CateringSection />
        <HowItWorks />
        <Testimonials />
        <LocationSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />

      {/* Overlays */}
      <CustomizeModal />
      <DeliveryPartnerSheet />
      <CartDrawer />
      <OrderConfirmation />
      <FloatingCartBar />
      <Toast />
    </>
  );
}
