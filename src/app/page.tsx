import HeroSection from '@/components/home/HeroSection';
import OurStorySection from '@/components/home/OurStorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <OurStorySection />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
