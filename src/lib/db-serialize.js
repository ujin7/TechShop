function safeParse(value, fallback) {
  if (value == null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toProductDto(row) {
  return {
    ...row,
    images: safeParse(row.images, []),
    tags: safeParse(row.tags, []),
    specs: safeParse(row.specs, {}),
  };
}

export function toUserDto(row) {
  return {
    ...row,
    address: safeParse(row.address, null),
  };
}

export function toReviewDto(row) {
  return {
    ...row,
    images: safeParse(row.images, []),
  };
}

export function toOrderDto(row) {
  return {
    ...row,
    items: safeParse(row.items, []),
    shipping: safeParse(row.shipping, {}),
  };
}
