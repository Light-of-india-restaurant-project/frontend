import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakfastReservationSection from "@/components/sections/BreakfastReservationSection";

const BreakfastReservation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <BreakfastReservationSection sectionId="breakfast-reservation-page" />
      </main>
      <Footer />
    </div>
  );
};

export default BreakfastReservation;
