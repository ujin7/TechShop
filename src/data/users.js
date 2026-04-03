export const users = [
  {
    id: 'user_001',
    name: '김민준',
    email: 'minjun@techshop.kr',
    password: 'password123',
    avatar: null,
    createdAt: '2025-06-01',
    address: {
      recipient: '김민준',
      phone: '010-1234-5678',
      zipcode: '06100',
      address1: '서울특별시 강남구 테헤란로 123',
      address2: '101호',
    },
  },
  {
    id: 'user_002',
    name: '이서연',
    email: 'seoyeon@techshop.kr',
    password: 'password123',
    avatar: null,
    createdAt: '2025-08-15',
    address: {
      recipient: '이서연',
      phone: '010-9876-5432',
      zipcode: '03080',
      address1: '서울특별시 종로구 경복궁길 45',
      address2: '202호',
    },
  },
  {
    id: 'user_003',
    name: '박지호',
    email: 'jiho@techshop.kr',
    password: 'password123',
    avatar: null,
    createdAt: '2025-11-20',
    address: {
      recipient: '박지호',
      phone: '010-5555-7777',
      zipcode: '48058',
      address1: '부산광역시 해운대구 해운대로 100',
      address2: '303호',
    },
  },
  {
    id: 'user_demo',
    name: '테크샵 데모',
    email: 'demo@techshop.kr',
    password: 'demo1234',
    avatar: null,
    createdAt: '2026-01-01',
    address: null,
  },
];

export const findUserByEmail = (email) =>
  users.find((u) => u.email === email);

export const validateUser = (email, password) => {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
};
