const OurStorySection = () => {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-text-light dark:text-text-dark md:text-4xl">
          Our Story
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark md:text-lg max-w-3xl">
          ShahdCooperative is built on a foundation of community, sustainability, and a deep respect for nature.
          We are a collective of passionate beekeepers dedicated to organic practices, ensuring every jar of honey
          is as pure as nature intended.
        </p>
      </div>
    </section>
  );
};

export default OurStorySection;
