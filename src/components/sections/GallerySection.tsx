import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { useLightbox } from "@/hooks/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";

// Import gallery images
import butterChicken from "@/assets/menu/butter-chicken.jpg";
import biryani from "@/assets/menu/biryani.jpg";
import gilafiSeekh from "@/assets/menu/gilafi-seekh.jpg";
import halibutTikka from "@/assets/menu/halibut-tikka.jpg";
import dalMakhani from "@/assets/menu/dal-makhani.jpg";
import scallops from "@/assets/menu/scallops.jpg";
import trufflePaneer from "@/assets/menu/truffle-paneer.jpg";
import lambRogan from "@/assets/menu/lamb-rogan.jpg";
import gulabJamun from "@/assets/menu/gulab-jamun.jpg";

const galleryImages = [
  { id: "1", src: butterChicken, alt: "Signature Butter Chicken", title: "Butter Chicken", category: "food" },
  { id: "2", src: gilafiSeekh, alt: "Gilafi Seekh Kebab", title: "Gilafi Seekh Kebab", category: "food" },
  { id: "3", src: halibutTikka, alt: "Tandoori Halibut", title: "Tandoori Halibut", category: "food" },
  { id: "4", src: biryani, alt: "Lamb Biryani", title: "Hyderabadi Biryani", category: "food" },
  { id: "5", src: scallops, alt: "Seared Scallops", title: "Masala Scallops", category: "food" },
  { id: "6", src: dalMakhani, alt: "Dal Makhani", title: "Dal Makhani", category: "food" },
  { id: "7", src: trufflePaneer, alt: "Truffle Paneer", title: "Truffle Paneer Tikka", category: "food" },
  { id: "8", src: lambRogan, alt: "Lamb Rogan Josh", title: "Lamb Rogan Josh", category: "food" },
  { id: "9", src: gulabJamun, alt: "Gulab Jamun", title: "Gulab Jamun", category: "food" },
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
