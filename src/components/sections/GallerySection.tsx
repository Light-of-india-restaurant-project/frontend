import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

// Placeholder gallery images (will be replaced with API data)
const galleryImages = [
  { id: "1", alt: "Signature Butter Chicken", category: "food" },
  { id: "2", alt: "Restaurant Interior", category: "ambiance" },
  { id: "3", alt: "Tandoori Platter", category: "food" },
  { id: "4", alt: "Private Dining Area", category: "ambiance" },
  { id: "5", alt: "Chef Preparing Dish", category: "ambiance" },
  { id: "6", alt: "Lamb Biryani", category: "food" },
];

const GallerySection = () => {
  const { t } = useLanguage();

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
              className={`relative overflow-hidden group cursor-pointer ${
                index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br from-brown/30 to-primary/30 ${
                  index === 0 || index === 5
                    ? "aspect-square md:aspect-[4/3]"
                    : "aspect-square"
                } flex items-center justify-center`}
              >
                <span className="text-muted-foreground font-serif text-sm">
                  {image.alt}
                </span>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-lg">
                  {image.alt}
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
    </section>
  );
};

export default GallerySection;
