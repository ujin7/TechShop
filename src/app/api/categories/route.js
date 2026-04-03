import { NextResponse } from 'next/server';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

// 카테고리 목록은 거의 변하지 않으므로 60초 캐시
export const revalidate = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const withCount = searchParams.get('withCount') === 'true';

  let data = categories;

  if (withCount) {
    data = categories.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.category === cat.slug).length,
      subcategories: cat.subcategories.map((sub) => ({
        ...sub,
        productCount: products.filter(
          (p) => p.category === cat.slug && p.subcategory === sub.slug
        ).length,
      })),
    }));
  }

  return NextResponse.json({ data });
}
