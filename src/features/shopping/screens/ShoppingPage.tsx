import React from 'react';
import { ComingSoon } from '@/shared/ui';
import CartIcon from '@/../assets/icons/cart-icon.svg';

// TODO: 장보기 API(/api/me/shopping-helper, /api/me/shopping-list-items) 연동
export const ShoppingPage: React.FC = () => {
  return <ComingSoon title="장보기 도우미" icon={<CartIcon width={40} height={40} />} />;
};
