interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeading = ({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`mb-12 ${alignClasses[align]} ${className}`}>
      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 flex items-center gap-4 ${
          align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""
        }`}
      >
        <span className="h-px w-12 bg-secondary" />
        <span className="w-2 h-2 rotate-45 bg-secondary" />
        <span className="h-px w-12 bg-secondary" />
      </div>
    </div>
  );
};

export default SectionHeading;
