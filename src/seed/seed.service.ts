import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { Brand } from '../brands/brand.entity';
import { HeroBanner } from '../hero-banners/hero-banner.entity';
import { User } from '../users/user.entity';
import { CustomerProfile } from '../users/customer-profile.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { AgeFilter } from '../age-filters/age-filter.entity';
import { BrandFeature } from '../brand-features/brand-feature.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(HeroBanner)
    private readonly heroBannerRepo: Repository<HeroBanner>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepo: Repository<CustomerProfile>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(AgeFilter)
    private readonly ageFilterRepo: Repository<AgeFilter>,
    @InjectRepository(BrandFeature)
    private readonly brandFeatureRepo: Repository<BrandFeature>,
  ) {}

  async run() {
    const catMap = await this.seedCategories();
    await this.seedProducts(catMap);
    await this.seedBrands();
    await this.seedHeroBanners();
    await this.seedAgeFilters();
    await this.seedBrandFeatures();
    await this.seedDemoUser();
    return { message: 'Seed completed successfully' };
  }

  private async seedCategories(): Promise<Map<string, string>> {
    const categories = [
      { id: 'plush-toys', label: 'Plush Toys', slug: 'plush-toys', icon: 'heart' },
      { id: 'wooden-toys', label: 'Wooden Toys', slug: 'wooden-toys', icon: 'box' },
      { id: 'baby-toys', label: 'Baby Toys', slug: 'baby-toys', icon: 'star' },
      { id: 'musical', label: 'Musical', slug: 'musical', icon: 'music' },
      { id: 'arts-crafts', label: 'Arts & Crafts', slug: 'arts-crafts', icon: 'paint' },
      { id: 'dress-up', label: 'Dress Up', slug: 'dress-up', icon: 'shirt' },
      { id: 'vehicles', label: 'Vehicles', slug: 'vehicles', icon: 'radio' },
      { id: 'board-games', label: 'Board Games', slug: 'board-games', icon: 'grid' },
      { id: 'outdoor', label: 'Outdoor', slug: 'outdoor', icon: 'sun' },
      { id: 'puzzles', label: 'Puzzles', slug: 'puzzles', icon: 'puzzle' },
      { id: 'building-blocks', label: 'Building Blocks', slug: 'building-blocks', icon: 'box' },
      { id: 'stem-science', label: 'STEM & Science', slug: 'stem-science', icon: 'flask' },
      { id: 'remote-control', label: 'Remote Control', slug: 'remote-control', icon: 'radio' },
      { id: 'action-figures', label: 'Action Figures', slug: 'action-figures', icon: 'shield' },
      { id: 'dolls', label: 'Dolls', slug: 'dolls', icon: 'star' },
    ];

    // Skip if a record with that slug already exists (DB may have different IDs)
    for (const cat of categories) {
      await this.categoryRepo
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(cat)
        .orIgnore()
        .execute();
    }

    // Query actual IDs from DB and build slug → id map
    const all = await this.categoryRepo.find();
    const map = new Map<string, string>();
    for (const c of all) {
      map.set(c.slug, c.id);
    }
    return map;
  }

  private async seedProducts(catMap: Map<string, string>) {
    const products = [
      { id: 'p1', name: 'Soft Rainbow Stacking Rings', categoryId: 'baby-toys', price: 12.99, badge: 'popular', rating: 4.9, reviewCount: 1842, inStock: true, ageGroup: '0-2', imageUrl: 'https://www.junioredition.com/cdn/shop/products/PlanToys_SS18_Rainbow_Stacking_Rings_Toy.jpg?v=1542031634&width=1200' },
      { id: 'p2', name: 'Baby Plush Teddy Bear 30cm', categoryId: 'plush-toys', price: 19.99, badge: 'popular', rating: 4.8, reviewCount: 2310, inStock: true, ageGroup: '0-2', imageUrl: 'https://lovelybears.com.au/cdn/shop/files/Clove30cm_1024x1024.jpg?v=1704684649' },
      { id: 'p3', name: 'Squeeze & Float Bath Toy Set', categoryId: 'baby-toys', price: 14.99, originalPrice: 19.99, badge: 'sale', rating: 4.7, reviewCount: 983, inStock: true, ageGroup: '0-2', imageUrl: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/6d1d2f3569af4f4ab1cb52ee3b044591~tplv-o3syd03w52-crop-webp:1200:1200.webp' },
      { id: 'p4', name: 'Baby Activity Gym & Play Mat', categoryId: 'baby-toys', price: 39.99, badge: 'new', rating: 4.8, reviewCount: 547, inStock: true, ageGroup: '0-2', imageUrl: 'https://infantino.com/cdn/shop/products/216-339_P1_1_grande.jpg?v=1532027252' },
      { id: 'p5', name: 'Musical Crib Mobile Stars', categoryId: 'musical', price: 29.99, badge: 'new', rating: 4.6, reviewCount: 412, inStock: true, ageGroup: '0-2', imageUrl: 'https://cdn02.pinkoi.com/product/aaDcPPMC/0/1/640x530.jpg' },
      { id: 'p6', name: 'Wooden Shape Sorter Box', categoryId: 'wooden-toys', price: 24.99, rating: 4.7, reviewCount: 728, inStock: true, ageGroup: '0-2', imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80&fit=crop' },
      { id: 'p7', name: 'Soft Fabric Sensory Activity Book', categoryId: 'baby-toys', price: 9.99, rating: 4.5, reviewCount: 654, inStock: true, ageGroup: '0-2', imageUrl: 'https://m.media-amazon.com/images/I/61swbNPdtxL._AC_UF894,1000_QL80_DpWeblab_.jpg' },
      { id: 'p8', name: 'Baby Sensory Crinkle Rattle Set', categoryId: 'baby-toys', price: 11.99, originalPrice: 16.99, badge: 'sale', rating: 4.6, reviewCount: 331, inStock: true, ageGroup: '0-2', imageUrl: 'https://i.ebayimg.com/images/g/R-UAAeSwBvJpcIH3/s-l400.jpg' },
      { id: 'p9', name: 'Giraffe Rattle & Teether Toy', categoryId: 'baby-toys', price: 8.99, rating: 4.7, reviewCount: 1104, inStock: true, ageGroup: '0-2', imageUrl: 'https://m.media-amazon.com/images/I/719qxclGLtL._AC_UF894,1000_QL80_.jpg' },
      { id: 'p10', name: 'Classic Pull-Along Wooden Duck', categoryId: 'wooden-toys', price: 16.99, badge: 'popular', rating: 4.8, reviewCount: 877, inStock: true, ageGroup: '0-2', imageUrl: 'https://babygifts.ie/cdn/shop/products/Classic-World-Pull-Along-Ducks1_600x.jpg?v=1632873579' },
      { id: 'p11', name: 'Baby Piano Play Mat Musical', categoryId: 'musical', price: 34.99, originalPrice: 44.99, badge: 'sale', rating: 4.7, reviewCount: 623, inStock: true, ageGroup: '0-2', imageUrl: 'https://m.media-amazon.com/images/I/71mLqJaFcNL.jpg' },
      { id: 'p12', name: 'Soft Silicone Stacking Cups 6pcs', categoryId: 'baby-toys', price: 7.99, rating: 4.5, reviewCount: 289, inStock: true, ageGroup: '0-2', imageUrl: 'https://i.ebayimg.com/images/g/6aQAAOSwsAJifPeR/s-l400.jpg' },
      { id: 'p13', name: 'Deluxe Play Kitchen Set', categoryId: 'dolls', price: 79.99, originalPrice: 99.99, badge: 'sale', rating: 4.8, reviewCount: 1253, inStock: true, ageGroup: '3-5', imageUrl: 'https://www.abcthebaby.com/wp-content/uploads/2023/05/E3177A-Deluxe-Kitchen-Playset-with-Fan-Fryer.jpg' },
      { id: 'p14', name: 'Washable Finger Paint Set 12 Colors', categoryId: 'arts-crafts', price: 14.99, rating: 4.6, reviewCount: 892, inStock: true, ageGroup: '3-5', imageUrl: 'https://i5.walmartimages.com/seo/12-Color-Washable-Finger-Paint-Set-Kids-Funny-Fingers-Painting-Art-Drawing-Supplies_c23b9d75.jpeg' },
      { id: 'p15', name: 'Princess Fairy Dress-Up Kit', categoryId: 'dress-up', price: 24.99, badge: 'popular', rating: 4.7, reviewCount: 1045, inStock: true, ageGroup: '3-5', imageUrl: 'https://m.media-amazon.com/images/I/61lVD3WvR2L._AC_UY1100_.jpg' },
      { id: 'p16', name: 'Wooden Train Track Set 40pcs', categoryId: 'wooden-toys', price: 44.99, badge: 'popular', rating: 4.9, reviewCount: 2087, inStock: true, ageGroup: '3-5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDzCbjR2JQQvGQ161Zu5h8zwKT1ETNLez5RA&s' },
      { id: 'p17', name: 'Memory Matching Card Game', categoryId: 'board-games', price: 12.99, rating: 4.5, reviewCount: 743, inStock: true, ageGroup: '3-5', imageUrl: 'https://m.media-amazon.com/images/I/81tfbZExDbL._AC_UF894,1000_QL80_.jpg' },
      { id: 'p18', name: 'Kids Art & Craft Activity Box', categoryId: 'arts-crafts', price: 29.99, originalPrice: 39.99, badge: 'sale', rating: 4.7, reviewCount: 631, inStock: true, ageGroup: '3-5', imageUrl: 'https://mycreativebox.com/cdn/shop/files/product_1_1200x.png?v=1779150764' },
      { id: 'p19', name: '24-Piece Foam Floor Puzzle Animals', categoryId: 'puzzles', price: 17.99, badge: 'new', rating: 4.6, reviewCount: 418, inStock: true, ageGroup: '3-5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfxOxjO9Y-NhLgI6vidrzScF9_Atl6kxOfEw&s' },
      { id: 'p20', name: 'Sand & Water Outdoor Play Table', categoryId: 'outdoor', price: 54.99, originalPrice: 69.99, badge: 'sale', rating: 4.8, reviewCount: 912, inStock: true, ageGroup: '3-5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZfahrEEZJtQr5qLR1AcpetchoXBfA0CPcA&s' },
      { id: 'p21', name: 'Jumbo Bubble Gun & Solution Set', categoryId: 'outdoor', price: 9.99, rating: 4.4, reviewCount: 567, inStock: true, ageGroup: '3-5', imageUrl: 'https://www.toysrus.co.th/dw/image/v2/BDGJ_PRD/on/demandware.static/-/Sites-master-catalog-toysrus/default/dw6ef91680/9/9/1/3/9913c0fd44c28d0d0eba107b5665a67ac93bb637_936761_i1.jpg?sw=394&sh=394&q=75' },
      { id: 'p22', name: 'Multi-Level Toy Vehicle Garage', categoryId: 'vehicles', price: 39.99, badge: 'popular', rating: 4.7, reviewCount: 784, inStock: true, ageGroup: '3-5', imageUrl: 'https://mentari.toys/cdn/shop/products/multi-level-garage-with-lift-mt7912-866972.jpg?v=1710167545' },
      { id: 'p23', name: 'Doctor & Nurse Role-Play Kit', categoryId: 'dolls', price: 19.99, rating: 4.5, reviewCount: 489, inStock: true, ageGroup: '3-5', imageUrl: 'https://m.media-amazon.com/images/I/91DPROnI1bL._AC_UF894,1000_QL80_.jpg' },
      { id: 'p24', name: 'Dinosaur World Figurine 12-Pack', categoryId: 'action-figures', price: 22.99, badge: 'popular', rating: 4.8, reviewCount: 1563, inStock: true, ageGroup: '3-5', imageUrl: 'https://i5.walmartimages.com/seo/Pack-of-12-Ja-Ru-Dino-World-Dinosaurs.jpeg' },
      { id: 'p25', name: 'Classic Farm Animals Playset', categoryId: 'dolls', price: 34.99, rating: 4.6, reviewCount: 349, inStock: true, ageGroup: '3-5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWAkunudNJCyIOiwO_j00_axs_rE9TSEF_pA&s' },
      { id: 'p26', name: 'Kids Mini Drum Kit Set', categoryId: 'musical', price: 44.99, originalPrice: 59.99, badge: 'sale', rating: 4.7, reviewCount: 527, inStock: true, ageGroup: '3-5', imageUrl: 'https://i5.walmartimages.com/seo/Donner-Kids-Size-Drums-Sets.jpeg' },
      { id: 'p27', name: 'Store Cash Register', categoryId: 'dolls', price: 27.99, rating: 4.5, reviewCount: 398, inStock: true, ageGroup: '3-5', imageUrl: 'https://m.media-amazon.com/images/I/811KsYDquwL.jpg' },
      { id: 'p28', name: 'LEGO Classic Creative Brick Box', categoryId: 'building-blocks', price: 49.99, badge: 'popular', rating: 4.9, reviewCount: 4821, inStock: true, ageGroup: '6+', imageUrl: 'https://www.toysrus.co.th/dw/image/v2/BDGJ_PRD/on/demandware.static/-/Sites-master-catalog-toysrus/default/dw8bf469cc/3687efdb541a79457b9d1d42d939eb88a03cbe93_49110_i1.jpg' },
      { id: 'p29', name: 'RC Turbo Racing Car Pro', categoryId: 'remote-control', price: 39.99, originalPrice: 59.99, badge: 'sale', rating: 4.6, reviewCount: 1189, inStock: true, ageGroup: '6+', imageUrl: 'https://shop.makerfire.com/cdn/shop/files/Turboracingsportscarred1.jpg?v=1741926475' },
      { id: 'p30', name: 'Science Explorer Lab Kit Pro', categoryId: 'stem-science', price: 34.99, badge: 'new', rating: 4.7, reviewCount: 698, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/61kvAJIAPtL._AC_UF1000,1000_QL80_.jpg' },
      { id: 'p31', name: 'Monopoly Junior Family Edition', categoryId: 'board-games', price: 24.99, rating: 4.5, reviewCount: 2134, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/81DPZQ6tQYL.jpg' },
      { id: 'p32', name: '20-inch Adventure Mountain Bike', categoryId: 'outdoor', price: 129.99, originalPrice: 159.99, badge: 'sale', rating: 4.7, reviewCount: 811, inStock: false, ageGroup: '6+', imageUrl: 'https://contents.mediadecathlon.com/p2642766/20-expl-500-orange-cnfr-btwin-8874418.jpg?f=768x0&format=auto' },
      { id: 'p33', name: 'Magnetic Tile Building Set 100pcs', categoryId: 'building-blocks', price: 54.99, badge: 'new', rating: 4.8, reviewCount: 943, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/51Isiza6ghL._AC_US1000_.jpg' },
      { id: 'p34', name: 'Premium Watercolor Art Studio Set', categoryId: 'arts-crafts', price: 27.99, rating: 4.6, reviewCount: 567, inStock: true, ageGroup: '6+', imageUrl: 'https://ph-live-01.slatic.net/p/7e0424cf29cff6318594c458b1dbc7ec.jpg' },
      { id: 'p35', name: 'RC Stunt Helicopter 2.4GHz', categoryId: 'remote-control', price: 44.99, badge: 'new', rating: 4.5, reviewCount: 432, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/51lX6Vc-KVL._AC_UF894,1000_QL80_.jpg' },
      { id: 'p36', name: 'Long-Range Kids Walkie-Talkie Set', categoryId: 'remote-control', price: 19.99, originalPrice: 29.99, badge: 'sale', rating: 4.4, reviewCount: 378, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/71GCacgNxNL.jpg' },
      { id: 'p37', name: 'Solar System Planetarium Kit', categoryId: 'stem-science', price: 39.99, badge: 'new', rating: 4.8, reviewCount: 521, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/81OXH1JBQpS._AC_UF894,1000_QL80_.jpg' },
      { id: 'p38', name: 'Coding Robot for Kids', categoryId: 'stem-science', price: 69.99, badge: 'new', rating: 4.7, reviewCount: 287, inStock: true, ageGroup: '6+', imageUrl: 'https://down-th.img.susercontent.com/file/sg-11134201-7req2-m8snrpakt4lt3d' },
      { id: 'p39', name: 'Table Tennis Ping-Pong Set', categoryId: 'outdoor', price: 34.99, rating: 4.5, reviewCount: 413, inStock: true, ageGroup: '6+', imageUrl: 'https://i5.walmartimages.com/seo/PRO-SPIN-All-in-One-Portable-Ping-Pong-Set.jpeg' },
      { id: 'p40', name: '500-Piece Nature Jigsaw Puzzle', categoryId: 'puzzles', price: 21.99, rating: 4.6, reviewCount: 889, inStock: true, ageGroup: '6+', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6wuKlULvqmG_q-qsNtOAcglmv09Qv_SOSrw&s' },
      { id: 'p41', name: 'Crystal Growing Science Lab Kit', categoryId: 'stem-science', price: 18.99, originalPrice: 26.99, badge: 'sale', rating: 4.7, reviewCount: 634, inStock: true, ageGroup: '6+', imageUrl: 'https://m.media-amazon.com/images/I/91v8uM8z-8L.jpg' },
      { id: 'p42', name: 'Classic Chess & Checkers Combo Set', categoryId: 'board-games', price: 22.99, originalPrice: 34.99, badge: 'sale', rating: 4.8, reviewCount: 1122, inStock: true, ageGroup: '6+', imageUrl: 'https://www.gamesworld.com.au/wp-content/uploads/2025/11/6c877bd996c487022e1f5ecd68cff126c45640ca.jpg' },
    ];

    for (const p of products) {
      // Resolve slug → actual DB category id
      const resolvedCategoryId = catMap.get(p.categoryId) ?? p.categoryId;
      await this.productRepo.upsert(
        { ...p, categoryId: resolvedCategoryId },
        ['id'],
      );
    }
  }

  private async seedBrands() {
    const brands = [
      { id: 'lego', name: 'LEGO', categoryId: 'building-blocks', description: 'Creative building sets for all ages', productCount: 2, colorClass: 'bg-yellow-400', tagColorClass: 'text-yellow-800 bg-yellow-100', displayOrder: 1 },
      { id: 'mattel', name: 'Mattel', categoryId: 'dolls', description: 'Iconic toys including Barbie & Hot Wheels', productCount: 3, colorClass: 'bg-red-500', tagColorClass: 'text-red-800 bg-red-100', displayOrder: 2 },
      { id: 'hasbro', name: 'Hasbro', categoryId: 'board-games', description: 'Board games, puzzles & action figures', productCount: 4, colorClass: 'bg-blue-500', tagColorClass: 'text-blue-800 bg-blue-100', displayOrder: 3 },
      { id: 'fisher-price', name: 'Fisher-Price', categoryId: 'baby-toys', description: 'Safe learning toys for babies & toddlers', productCount: 6, colorClass: 'bg-orange-400', tagColorClass: 'text-orange-800 bg-orange-100', displayOrder: 4 },
      { id: 'vtech', name: 'VTech', categoryId: 'baby-toys', description: 'Electronic learning toys for kids', productCount: 3, colorClass: 'bg-green-500', tagColorClass: 'text-green-800 bg-green-100', displayOrder: 5 },
      { id: 'playmobil', name: 'Playmobil', categoryId: 'action-figures', description: 'Creative playsets for imaginative play', productCount: 2, colorClass: 'bg-purple-500', tagColorClass: 'text-purple-800 bg-purple-100', displayOrder: 6 },
      { id: 'melissa-doug', name: 'Melissa & Doug', categoryId: 'wooden-toys', description: 'Wooden toys & arts and crafts', productCount: 4, colorClass: 'bg-teal-500', tagColorClass: 'text-teal-800 bg-teal-100', displayOrder: 7 },
      { id: 'play-doh', name: 'Play-Doh', categoryId: 'arts-crafts', description: 'Classic modeling compound & creative sets', productCount: 2, colorClass: 'bg-pink-400', tagColorClass: 'text-pink-800 bg-pink-100', displayOrder: 8 },
      { id: 'hot-wheels', name: 'Hot Wheels', categoryId: 'vehicles', description: 'Die-cast cars & racing tracks', productCount: 2, colorClass: 'bg-red-600', tagColorClass: 'text-red-800 bg-red-100', displayOrder: 9 },
      { id: 'nerf', name: 'Nerf', categoryId: 'outdoor', description: 'Foam blasters & outdoor action', productCount: 2, colorClass: 'bg-orange-500', tagColorClass: 'text-orange-800 bg-orange-100', displayOrder: 10 },
      { id: 'barbie', name: 'Barbie', categoryId: 'dolls', description: 'Fashion dolls & playsets for girls', productCount: 2, colorClass: 'bg-pink-500', tagColorClass: 'text-pink-800 bg-pink-100', displayOrder: 11 },
      { id: 'bruder', name: 'Bruder', categoryId: 'vehicles', description: 'Realistic toy vehicles & construction', productCount: 2, colorClass: 'bg-yellow-500', tagColorClass: 'text-yellow-800 bg-yellow-100', displayOrder: 12 },
    ];

    for (const b of brands) {
      await this.brandRepo.upsert(b, ['id']);
    }
  }

  private async seedHeroBanners() {
    const banners = [
      {
        id: 'banner-1',
        title: 'Summer Play Collection',
        subtitle: 'Outdoor toys and water games for endless summer fun',
        cta: 'Shop Outdoor',
        ctaLink: '/outdoor',
        gradient: 'linear-gradient(135deg, #1565C0 0%, #AA00FF 100%)',
        imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80&fit=crop',
        displayOrder: 1,
      },
      {
        id: 'banner-2',
        title: 'New Arrivals Just In',
        subtitle: 'The hottest toys of the season — be the first to get them',
        cta: 'View All Deals',
        ctaLink: '/deals',
        gradient: 'linear-gradient(135deg, #FF1744 0%, #FF6D00 100%)',
        imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80&fit=crop',
        displayOrder: 2,
      },
    ];

    for (const b of banners) {
      await this.heroBannerRepo.upsert(b, ['id']);
    }
  }

  private async seedAgeFilters() {
    const filters = [
      { id: 'all', label: 'All Ages', value: 'all', displayOrder: 0 },
      { id: 'age-0-2', label: '0-2 years', value: '0-2', displayOrder: 1 },
      { id: 'age-3-5', label: '3-5 years', value: '3-5', displayOrder: 2 },
      { id: 'age-6-plus', label: '6-8+ years', value: '6+', displayOrder: 3 },
    ];

    for (const f of filters) {
      await this.ageFilterRepo.upsert(f, ['id']);
    }
  }

  private async seedBrandFeatures() {
    const features = [
      { id: 'feat-1', title: 'Free Shipping', description: 'On all orders over $50', icon: 'truck', color: 'blue', displayOrder: 1 },
      { id: 'feat-2', title: 'Easy Returns', description: '30-day hassle-free returns', icon: 'refresh', color: 'green', displayOrder: 2 },
      { id: 'feat-3', title: 'Secure Payment', description: '100% safe transactions', icon: 'lock', color: 'purple', displayOrder: 3 },
      { id: 'feat-4', title: '24/7 Support', description: 'Dedicated customer service', icon: 'headphones', color: 'orange', displayOrder: 4 },
    ];

    for (const f of features) {
      await this.brandFeatureRepo.upsert(f, ['id']);
    }
  }

  private async seedDemoUser() {
    // Use the existing user ID already present in the DB
    const DEMO_USER_ID = 'user-alex-johnson';
    const passwordHash = await bcrypt.hash('password123', 10);

    await this.userRepo.upsert(
      {
        id: DEMO_USER_ID,
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.johnson@worldoftoys.com',
        provider: 'email',
        isGuest: false,
      },
      ['id'],
    );

    // Force-set password_hash via raw UPDATE (select:false columns
    // are excluded from TypeORM upsert UPDATE clauses)
    await this.userRepo
      .createQueryBuilder()
      .update()
      .set({ passwordHash } as any)
      .where('id = :id', { id: DEMO_USER_ID })
      .execute();

    await this.profileRepo.upsert(
      {
        userId: DEMO_USER_ID,
        phone: '+1 (555) 234-5678',
        loyaltyPoints: 2450,
        tier: 'Gold',
        memberSince: new Date('2022-01-15'),
      },
      ['userId'],
    );

    await this.seedDemoOrders(DEMO_USER_ID);
  }

  private async seedDemoOrders(userId: string) {
    const orders = [
      {
        id: 'WOT-20241201',
        status: 'delivered',
        statusColorClass: 'text-green-700 bg-green-100',
        orderDate: new Date('2024-12-01'),
        subtotal: 62.98,
        shippingFee: 0,
        tax: parseFloat((62.98 * 0.07).toFixed(2)),
        total: parseFloat((62.98 + 62.98 * 0.07).toFixed(2)),
        paymentMethod: 'card',
        items: [
          { id: 'oi-1', productId: 'p28', productName: 'LEGO Classic Creative Brick Box', productImage: 'https://www.toysrus.co.th/dw/image/v2/BDGJ_PRD/on/demandware.static/-/Sites-master-catalog-toysrus/default/dw8bf469cc/3687efdb541a79457b9d1d42d939eb88a03cbe93_49110_i1.jpg', unitPrice: 49.99, quantity: 1, subtotal: 49.99 },
          { id: 'oi-2', productId: 'p17', productName: 'Memory Matching Card Game', productImage: 'https://m.media-amazon.com/images/I/81tfbZExDbL._AC_UF894,1000_QL80_.jpg', unitPrice: 12.99, quantity: 1, subtotal: 12.99 },
        ],
      },
      {
        id: 'WOT-20241115',
        status: 'delivered',
        statusColorClass: 'text-green-700 bg-green-100',
        orderDate: new Date('2024-11-15'),
        subtotal: 39.99,
        shippingFee: 5.99,
        tax: parseFloat((39.99 * 0.07).toFixed(2)),
        total: parseFloat((39.99 + 5.99 + 39.99 * 0.07).toFixed(2)),
        paymentMethod: 'card',
        items: [
          { id: 'oi-3', productId: 'p29', productName: 'RC Turbo Racing Car Pro', productImage: 'https://shop.makerfire.com/cdn/shop/files/Turboracingsportscarred1.jpg?v=1741926475', unitPrice: 39.99, quantity: 1, subtotal: 39.99 },
        ],
      },
      {
        id: 'WOT-20241003',
        status: 'delivered',
        statusColorClass: 'text-green-700 bg-green-100',
        orderDate: new Date('2024-10-03'),
        subtotal: 129.99,
        shippingFee: 0,
        tax: parseFloat((129.99 * 0.07).toFixed(2)),
        total: parseFloat((129.99 + 129.99 * 0.07).toFixed(2)),
        paymentMethod: 'card',
        items: [
          { id: 'oi-4', productId: 'p32', productName: '20-inch Adventure Mountain Bike', productImage: 'https://contents.mediadecathlon.com/p2642766/20-expl-500-orange-cnfr-btwin-8874418.jpg?f=768x0&format=auto', unitPrice: 129.99, quantity: 1, subtotal: 129.99 },
        ],
      },
      {
        id: 'WOT-20240918',
        status: 'delivered',
        statusColorClass: 'text-green-700 bg-green-100',
        orderDate: new Date('2024-09-18'),
        subtotal: 53.98,
        shippingFee: 0,
        tax: parseFloat((53.98 * 0.07).toFixed(2)),
        total: parseFloat((53.98 + 53.98 * 0.07).toFixed(2)),
        paymentMethod: 'card',
        items: [
          { id: 'oi-5', productId: 'p30', productName: 'Science Explorer Lab Kit Pro', productImage: 'https://m.media-amazon.com/images/I/61kvAJIAPtL._AC_UF1000,1000_QL80_.jpg', unitPrice: 34.99, quantity: 1, subtotal: 34.99 },
          { id: 'oi-6', productId: 'p41', productName: 'Crystal Growing Science Lab Kit', productImage: 'https://m.media-amazon.com/images/I/91v8uM8z-8L.jpg', unitPrice: 18.99, quantity: 1, subtotal: 18.99 },
        ],
      },
    ];

    for (const orderData of orders) {
      const { items, ...orderFields } = orderData;

      await this.orderRepo.upsert(
        { ...orderFields, userId },
        ['id'],
      );

      for (const item of items) {
        await this.orderItemRepo.upsert(
          { ...item, orderId: orderData.id },
          ['id'],
        );
      }
    }
  }
}
