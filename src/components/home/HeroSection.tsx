import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="w-full py-20 lg:py-32 bg-dark-forest-green relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-hex-pattern" />

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div
          className="flex min-h-[480px] flex-col items-center justify-center gap-8 rounded-xl bg-cover bg-center p-8 text-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(26, 54, 45, 0.7) 0%, rgba(26, 54, 45, 0.8) 100%), url(https://images.unsplash.com/photo-1587049352846-4a222e784046?q=80&w=2000&auto=format&fit=crop)',
          }}
        >
          <div className="flex flex-col gap-6 max-w-4xl">
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in">
              Pure, Organic Honey from Our Cooperative to Your Home
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 animate-slide-in">
              Experience the natural sweetness and unparalleled quality of honey, ethically sourced from our dedicated beekeepers.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="animate-scale-in shadow-lg hover:shadow-xl"
            onClick={() => {
              window.location.href = '/products';
            }}
          >
            Explore Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
