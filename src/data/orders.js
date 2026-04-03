export const orders = [
  {
    id: 'ord_20260315_001',
    userId: 'user_001',
    status: 'delivered',
    items: [
      {
        productId: 'prod_001',
        productName: 'Samsung Galaxy S25 Ultra',
        thumbnail: 'https://placehold.co/100x100/111318/66fcf1?text=S25+Ultra',
        price: 1_599_000,
        quantity: 1,
      },
      {
        productId: 'prod_028',
        productName: 'Anker 747 충전기 GaNPrime 150W',
        thumbnail: 'https://placehold.co/100x100/111318/66fcf1?text=Anker+GaN',
        price: 89_000,
        quantity: 1,
      },
    ],
    shipping: {
      recipient: '김민준',
      phone: '010-1234-5678',
      zipcode: '06100',
      address1: '서울특별시 강남구 테헤란로 123',
      address2: '101호',
      message: '문 앞에 놔주세요',
    },
    paymentMethod: 'card',
    subtotal: 1_688_000,
    shippingFee: 0,
    total: 1_688_000,
    orderedAt: '2026-03-15T09:30:00Z',
    deliveredAt: '2026-03-17T14:20:00Z',
  },
  {
    id: 'ord_20260220_002',
    userId: 'user_001',
    status: 'delivered',
    items: [
      {
        productId: 'prod_007',
        productName: 'Apple MacBook Pro 16 M4 Max',
        thumbnail: 'https://placehold.co/100x100/111318/c5c6c7?text=MacBook+Pro',
        price: 4_199_000,
        quantity: 1,
      },
    ],
    shipping: {
      recipient: '김민준',
      phone: '010-1234-5678',
      zipcode: '06100',
      address1: '서울특별시 강남구 테헤란로 123',
      address2: '101호',
      message: '',
    },
    paymentMethod: 'card',
    subtotal: 4_199_000,
    shippingFee: 0,
    total: 4_199_000,
    orderedAt: '2026-02-20T14:00:00Z',
    deliveredAt: '2026-02-22T11:30:00Z',
  },
  {
    id: 'ord_20260110_003',
    userId: 'user_002',
    status: 'delivered',
    items: [
      {
        productId: 'prod_022',
        productName: 'Sony WH-1000XM6',
        thumbnail: 'https://placehold.co/100x100/111318/c5c6c7?text=WH-1000XM6',
        price: 449_000,
        quantity: 1,
      },
      {
        productId: 'prod_029',
        productName: 'Keychron Q3 Max',
        thumbnail: 'https://placehold.co/100x100/111318/a855f7?text=Keychron',
        price: 219_000,
        quantity: 1,
      },
    ],
    shipping: {
      recipient: '이서연',
      phone: '010-9876-5432',
      zipcode: '03080',
      address1: '서울특별시 종로구 경복궁길 45',
      address2: '202호',
      message: '경비실에 맡겨주세요',
    },
    paymentMethod: 'kakaopay',
    subtotal: 668_000,
    shippingFee: 0,
    total: 668_000,
    orderedAt: '2026-01-10T10:00:00Z',
    deliveredAt: '2026-01-12T16:00:00Z',
  },
];

export const getOrdersByUserId = (userId) =>
  orders.filter((o) => o.userId === userId);

export const getOrderById = (orderId) =>
  orders.find((o) => o.id === orderId);

export const ORDER_STATUS = {
  pending:   { label: '주문 확인 중', color: '#f59e0b' },
  confirmed: { label: '주문 확인',    color: '#3b82f6' },
  shipping:  { label: '배송 중',      color: '#a855f7' },
  delivered: { label: '배송 완료',    color: '#22c55e' },
  cancelled: { label: '주문 취소',    color: '#ef4444' },
};
