import logoImage from "@/assets/logo-refined.png";

interface LogoProps {
  variant?: "image" | "text" | "combined";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ variant = "image", size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  if (variant === "text") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <span
          className={`font-display font-bold text-primary tracking-wide ${textSizeClasses[size]}`}
        >
          Light of India
        </span>
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-1">
          Fine Dining
        </span>
      </div>
    );
  }

  if (variant === "combined") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={logoImage}
          alt="Light of India"
          className={`${sizeClasses[size]} w-auto object-contain`}
        />
      </div>
    );
  }

  // Default: image variant
  return (
    <img
      src={logoImage}
      alt="Light of India - Fine Dining Indian Restaurant"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
