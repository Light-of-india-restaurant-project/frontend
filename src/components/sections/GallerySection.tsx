import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { useLightbox } from "@/hooks/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";

// Import gallery images - Food
import butterChicken from "@/assets/menu/butter-chicken.jpg";
import biryani from "@/assets/menu/biryani.jpg";
import gilafiSeekh from "@/assets/menu/gilafi-seekh.jpg";
import halibutTikka from "@/assets/menu/halibut-tikka.jpg";
import dalMakhani from "@/assets/menu/dal-makhani.jpg";
import scallops from "@/assets/menu/scallops.jpg";
import trufflePaneer from "@/assets/menu/truffle-paneer.jpg";
import lambRogan from "@/assets/menu/lamb-rogan.jpg";
import gulabJamun from "@/assets/menu/gulab-jamun.jpg";

// Import gallery images - Ambiance
import interiorDining from "@/assets/gallery/interior-dining.jpg";
import privateDining from "@/assets/gallery/private-dining.jpg";
import chefPlating from "@/assets/gallery/chef-plating.jpg";
import barLounge from "@/assets/gallery/bar-lounge.jpg";
import heatedTerrace1 from "@/assets/gallery/heated-terrace-1.jpg";
import heatedTerrace2 from "@/assets/gallery/heated-terrace-2.jpg";

const galleryImages = [
  { id: "1", src: interiorDining, alt: "Elegant Dining Room", title: "Main Dining Hall", category: "ambiance" },
  { id: "2", src: butterChicken, alt: "Signature Butter Chicken", title: "Butter Chicken", category: "food" },
  { id: "3", src: heatedTerrace1, alt: "Heated Terrace Evening", title: "Heated Terrace", category: "ambiance" },
  { id: "4", src: gilafiSeekh, alt: "Gilafi Seekh Kebab", title: "Gilafi Seekh Kebab", category: "food" },
  { id: "5", src: privateDining, alt: "Private Dining Room", title: "Private Dining", category: "ambiance" },
  { id: "6", src: halibutTikka, alt: "Tandoori Halibut", title: "Tandoori Halibut", category: "food" },
  { id: "7", src: heatedTerrace2, alt: "Terrace Dining Experience", title: "Al Fresco Dining", category: "ambiance" },
  { id: "8", src: barLounge, alt: "Bar & Lounge Area", title: "The Lounge Bar", category: "ambiance" },
  { id: "9", src: biryani, alt: "Lamb Biryani", title: "Hyderabadi Biryani", category: "food" },
  { id: "10", src: chefPlating, alt: "Chef Preparing Dish", title: "Culinary Artistry", category: "ambiance" },
  { id: "11", src: scallops, alt: "Seared Scallops", title: "Masala Scallops", category: "food" },
  { id: "12", src: dalMakhani, alt: "Dal Makhani", title: "Dal Makhani", category: "food" },
  { id: "13", src: trufflePaneer, alt: "Truffle Paneer", title: "Truffle Paneer Tikka", category: "food" },
  { id: "14", src: lambRogan, alt: "Lamb Rogan Josh", title: "Lamb Rogan Josh", category: "food" },
];

const GallerySection = () => {
  const { t } = useLanguage();
  const lightbox = useLightbox(galleryImages);

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("gallery.title")}
          subtitle={t("gallery.subtitle")}
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => lightbox.open(index)}
              className={`relative overflow-hidden group cursor-pointer ${
                index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 || index === 5
                    ? "aspect-square md:aspect-[4/3]"
                    : "aspect-square"
                }`}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-lg text-center px-4">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="text-center mt-12">
          <p className="font-serif text-muted-foreground mb-4">
            Follow us for more culinary inspiration
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-serif text-lg"
          >
            @lightofindia.rotterdam
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
      />
    </section>
  );
};

export default GallerySection;
