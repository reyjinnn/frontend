import { HeroBanner } from '../components/HeroBanner';
import { ValuePropositionBar } from '../components/ValuePropositionBar';
import { CategoryTiles } from '../components/CategoryTiles';
import { PromoStrip } from '../components/PromoStrip';
import { FlashDeals } from '../components/FlashDeals';

export function StorefrontView() {
  return (
    <div>
      <HeroBanner />
      <ValuePropositionBar />
      <CategoryTiles />
      <PromoStrip />
      <FlashDeals />
    </div>
  );
}
