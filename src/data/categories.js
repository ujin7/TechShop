export const categories = [
  {
    id: 'smartphones',
    name: '스마트폰',
    slug: 'smartphones',
    icon: 'Smartphone',
    description: '최신 플래그십부터 가성비 스마트폰까지',
    color: '#66fcf1',
    subcategories: [
      { id: 'android', name: '안드로이드', slug: 'android', description: '삼성, LG, 소니 등 다양한 안드로이드 기기' },
      { id: 'iphone', name: '아이폰', slug: 'iphone', description: '애플 최신 아이폰 라인업' },
    ],
  },
  {
    id: 'laptops',
    name: '노트북',
    slug: 'laptops',
    icon: 'Laptop',
    description: '업무용, 게이밍, 크리에이티브 노트북',
    color: '#a855f7',
    subcategories: [
      { id: 'ultrabook', name: '울트라북', slug: 'ultrabook', description: '가볍고 얇은 프리미엄 노트북' },
      { id: 'gaming-laptop', name: '게이밍', slug: 'gaming-laptop', description: '고성능 게이밍 노트북' },
      { id: 'workstation', name: '워크스테이션', slug: 'workstation', description: '전문가용 고사양 노트북' },
    ],
  },
  {
    id: 'tablets',
    name: '태블릿',
    slug: 'tablets',
    icon: 'Tablet',
    description: '학습, 드로잉, 영상 시청에 최적화된 태블릿',
    color: '#ec4899',
    subcategories: [
      { id: 'ipad', name: '아이패드', slug: 'ipad', description: '애플 아이패드 전 라인업' },
      { id: 'android-tablet', name: '안드로이드 태블릿', slug: 'android-tablet', description: '갤럭시 탭, 레노버 탭 등' },
    ],
  },
  {
    id: 'monitors',
    name: '모니터',
    slug: 'monitors',
    icon: 'Monitor',
    description: '게이밍, 프로페셔널, 울트라와이드 모니터',
    color: '#f97316',
    subcategories: [
      { id: 'gaming-monitor', name: '게이밍 모니터', slug: 'gaming-monitor', description: '고주사율 게이밍 전용 모니터' },
      { id: 'professional', name: '프로페셔널', slug: 'professional', description: '색재현율 극대화 전문가용 모니터' },
      { id: 'general', name: '일반', slug: 'general', description: '가정 및 사무용 모니터' },
    ],
  },
  {
    id: 'audio',
    name: '오디오',
    slug: 'audio',
    icon: 'Headphones',
    description: '이어폰, 헤드폰, 스피커 프리미엄 오디오',
    color: '#3b82f6',
    subcategories: [
      { id: 'earphones', name: '이어폰', slug: 'earphones', description: 'TWS 무선 이어폰 및 유선 이어폰' },
      { id: 'headphones', name: '헤드폰', slug: 'headphones', description: '오버이어, 온이어 헤드폰' },
      { id: 'speakers', name: '스피커', slug: 'speakers', description: '블루투스, 데스크톱 스피커' },
    ],
  },
  {
    id: 'accessories',
    name: '액세서리',
    slug: 'accessories',
    icon: 'Package',
    description: '케이스, 충전기, 키보드, 마우스 등 주변기기',
    color: '#22c55e',
    subcategories: [
      { id: 'cases', name: '케이스 & 보호', slug: 'cases', description: '스마트폰, 태블릿 케이스 및 필름' },
      { id: 'chargers', name: '충전기 & 케이블', slug: 'chargers', description: '고속 충전기, 멀티 포트 허브' },
      { id: 'peripherals', name: '키보드 & 마우스', slug: 'peripherals', description: '기계식 키보드, 무선 마우스' },
    ],
  },
];

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug);

export const getSubcategoryBySlug = (categorySlug, subcategorySlug) => {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subcategorySlug);
};
