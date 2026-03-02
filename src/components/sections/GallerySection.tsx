import { useState, useEffect, useMemo } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { useLightbox } from "@/hooks/use-lightbox";
import { Lightbox } from "@/components/ui/lightbox";
import { apiConfig, apiFetch } from "@/lib/api";

// Fallback static imports for offline/error scenarios
import butterChicken from "@/assets/menu/butter-chicken.jpg";
import biryani from "@/assets/menu/biryani.jpg";
import gilafiSeekh from "@/assets/menu/gilafi-seekh.jpg";
import halibutTikka from "@/assets/menu/halibut-tikka.jpg";
import dalMakhani from "@/assets/menu/dal-makhani.jpg";
import scallops from "@/assets/menu/scallops.jpg";
import trufflePaneer from "@/assets/menu/truffle-paneer.jpg";
import lambRogan from "@/assets/menu/lamb-rogan.jpg";
import interiorDining from "@/assets/gallery/interior-dining.jpg";
import privateDining from "@/assets/gallery/private-dining.jpg";
import chefPlating from "@/assets/gallery/chef-plating.jpg";
import barLounge from "@/assets/gallery/bar-lounge.jpg";
import heatedTerrace1 from "@/assets/gallery/heated-terrace-1.jpg";
import heatedTerrace2 from "@/assets/gallery/heated-terrace-2.jpg";

// Fallback static images organized by section
const fallbackSection1 = [
  { id: "1", src: interiorDining, alt: "Elegant Dining Room", title: "Main Dining Hall", titleNl: "Grote Eetzaal", category: "ambiance", isFeatured: true },
  { id: "2", src: butterChicken, alt: "Signature Butter Chicken", title: "Butter Chicken", titleNl: "Boter Kip", category: "food", isFeatured: false },
  { id: "3", src: heatedTerrace1, alt: "Heated Terrace Evening", title: "Heated Terrace", titleNl: "Verwarmd Terras", category: "ambiance", isFeatured: false },
  { id: "4", src: gilafiSeekh, alt: "Gilafi Seekh Kebab", title: "Gilafi Seekh Kebab", titleNl: "Gilafi Seekh Kebab", category: "food", isFeatured: false },
  { id: "5", src: privateDining, alt: "Private Dining Room", title: "Private Dining", titleNl: "Privé Dining", category: "ambiance", isFeatured: false },
  { id: "6", src: halibutTikka, alt: "Tandoori Halibut", title: "Tandoori Halibut", titleNl: "Tandoori Heilbot", category: "food", isFeatured: false },
  { id: "7", src: heatedTerrace2, alt: "Terrace Dining Experience", title: "Al Fresco Dining", titleNl: "Buiten Dineren", category: "ambiance", isFeatured: false },
];

const fallbackSection2 = [
  { id: "8", src: barLounge, alt: "Bar & Lounge Area", title: "The Lounge Bar", titleNl: "De Lounge Bar", category: "ambiance", isFeatured: true },
  { id: "9", src: biryani, alt: "Lamb Biryani", title: "Hyderabadi Biryani", titleNl: "Hyderabadi Biryani", category: "food", isFeatured: false },
  { id: "10", src: chefPlating, alt: "Chef Preparing Dish", title: "Culinary Artistry", titleNl: "Culinaire Kunst", category: "ambiance", isFeatured: false },
  { id: "11", src: scallops, alt: "Seared Scallops", title: "Masala Scallops", titleNl: "Masala Coquilles", category: "food", isFeatured: false },
  { id: "12", src: dalMakhani, alt: "Dal Makhani", title: "Dal Makhani", titleNl: "Dal Makhani", category: "food", isFeatured: false },
  { id: "13", src: trufflePaneer, alt: "Truffle Paneer", title: "Truffle Paneer Tikka", titleNl: "Truffel Paneer Tikka", category: "food", isFeatured: false },
  // Extra row images for section 2
  { id: "14", src: lambRogan, alt: "Lamb Rogan Josh", title: "Lamb Rogan Josh", titleNl: "Lams Rogan Josh", category: "food", isFeatured: false },
  { id: "15", src: butterChicken, alt: "Butter Chicken Special", title: "Butter Chicken Special", titleNl: "Boter Kip Speciaal", category: "food", isFeatured: false },
  { id: "16", src: gilafiSeekh, alt: "Seekh Kebab Platter", title: "Seekh Kebab Platter", titleNl: "Seekh Kebab Schotel", category: "food", isFeatured: false },
];

// API response type
interface GalleryImageAPI {
  _id: string;
  title: string;
  titleNl: string;
  alt: string;
  altNl: string;
  category: "food" | "ambiance";
  imageUrl: string;
  section: 1 | 2;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
}

interface GalleryResponse {
  success: boolean;
  images: GalleryImageAPI[];
}

// Unified image type for the component
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  isFeatured: boolean;
}

const GallerySection = () => {
  const { t, language } = useLanguage();
  const [apiImages, setApiImages] = useState<GalleryImageAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch<GalleryResponse>(apiConfig.endpoints.gallery);
        if (response.success && response.images) {
          setApiImages(response.images);
        }
      } catch (err) {
        console.warn("Failed to fetch gallery, using fallback images:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Transform API images to component format, with language support
  const { section1Images, section2Images, allImages } = useMemo(() => {
    if (apiImages.length > 0) {
      const section1 = apiImages
        .filter((img) => img.section === 1)
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || a.sortOrder - b.sortOrder)
        .map((img) => ({
          id: img._id,
          src: img.imageUrl,
          alt: language === "nl" ? img.altNl : img.alt,
          title: language === "nl" ? img.titleNl : img.title,
          category: img.category,
          isFeatured: img.isFeatured,
        }));

      const section2 = apiImages
        .filter((img) => img.section === 2)
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || a.sortOrder - b.sortOrder)
        .map((img) => ({
          id: img._id,
          src: img.imageUrl,
          alt: language === "nl" ? img.altNl : img.alt,
          title: language === "nl" ? img.titleNl : img.title,
          category: img.category,
          isFeatured: img.isFeatured,
        }));

      return {
        section1Images: section1,
        section2Images: section2,
        allImages: [...section1, ...section2],
      };
    }

    // Fallback to static images
    const section1 = fallbackSection1.map((img) => ({
      ...img,
      title: language === "nl" ? img.titleNl : img.title,
    }));
    const section2 = fallbackSection2.map((img) => ({
      ...img,
      title: language === "nl" ? img.titleNl : img.title,
    }));

    return {
      section1Images: section1,
      section2Images: section2,
      allImages: [...section1, ...section2],
    };
  }, [apiImages, language]);

  const lightbox = useLightbox(allImages);

  // Get lightbox index for an image
  const getLightboxIndex = (imageId: string) => {
    return allImages.findIndex((img) => img.id === imageId);
  };

  // Render a gallery section with optional extra row
  const renderSection = (images: GalleryImage[], hasExtraRow: boolean = false) => {
    const featured = images.find((img) => img.isFeatured);
    const small = images.filter((img) => !img.isFeatured);
    const sideImages = small.slice(0, 2); // Two images stacked on the right
    const bottomImages = small.slice(2, 5); // First bottom row (3 images)
    const extraRowImages = hasExtraRow ? small.slice(5, 8) : []; // Second bottom row for section 2

    return (
      <div className="flex flex-col gap-4">
        {/* Top Row: Large image + two side images stacked */}
        <div className="flex flex-col md:flex-row gap-4 md:h-[700px]">
          {/* Featured (Large) Image - 2/3 width */}
          {featured && (
            <div
              className="md:w-2/3 relative overflow-hidden group cursor-pointer h-[400px] md:h-full"
              onClick={() => lightbox.open(getLightboxIndex(featured.id))}
            >
              <img
                src={featured.src}
                alt={featured.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-xl text-center px-4">
                  {featured.title}
                </span>
              </div>
            </div>
          )}

          {/* Two side images stacked vertically - 1/3 width */}
          {sideImages.length > 0 && (
            <div className="md:w-1/3 flex flex-row md:flex-col gap-4 h-[250px] md:h-full">
              {sideImages.map((image) => (
                <div
                  key={image.id}
                  className="flex-1 relative overflow-hidden group cursor-pointer"
                  onClick={() => lightbox.open(getLightboxIndex(image.id))}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-primary-foreground font-serif text-sm text-center px-2">
                      {image.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Row: 2 images under large (2/3) + 1 image under side (1/3) */}
        {bottomImages.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* First 2 images - align with large image (2/3 width) */}
            <div className="md:w-2/3 grid grid-cols-2 gap-4">
              {bottomImages.slice(0, 2).map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden group cursor-pointer"
                  onClick={() => lightbox.open(getLightboxIndex(image.id))}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-[200px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-primary-foreground font-serif text-sm text-center px-2">
                      {image.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3rd image - align with side images (1/3 width) */}
            {bottomImages[2] && (
              <div
                className="md:w-1/3 relative overflow-hidden group cursor-pointer"
                onClick={() => lightbox.open(getLightboxIndex(bottomImages[2].id))}
              >
                <img
                  src={bottomImages[2].src}
                  alt={bottomImages[2].alt}
                  className="w-full h-[200px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-sm text-center px-2">
                    {bottomImages[2].title}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extra Bottom Row for Section 2: Another 3 images */}
        {extraRowImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extraRowImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => lightbox.open(getLightboxIndex(image.id))}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[200px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-sm text-center px-2">
                    {image.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("gallery.title")}
          subtitle={t("gallery.subtitle")}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Gallery Sections */}
        {!isLoading && (
          <div className="space-y-8">
            {/* Section 1: 6 images (1 featured + 2 side + 3 bottom) */}
            {section1Images.length > 0 && renderSection(section1Images, false)}

            {/* Section 2: 9 images (1 featured + 2 side + 3 bottom + 3 extra row) */}
            {section2Images.length > 0 && renderSection(section2Images, true)}
          </div>
        )}

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
        images={allImages}
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
