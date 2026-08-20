import { CartDrawer } from "@/components/CartDrawer";
import { CustomizeModal } from "@/components/CustomizeModal";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { Navbar } from "@/components/Navbar";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Toast } from "@/components/Toast";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection />
      </main>
      <Footer />

      {/* Overlays */}
      <CustomizeModal />
      <CartDrawer />
      <OrderConfirmation />
      <FloatingCartBar />
      <Toast />
    </>
  );
}
