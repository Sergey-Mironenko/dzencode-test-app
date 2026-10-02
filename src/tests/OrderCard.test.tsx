import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderCard } from '@/components/OrderCard';
import { LanguageContext } from '@/components/LanguageContext';
import { Order } from '@/types/index';

const mockOrder: Order = {
  id: 1,
  title: 'Заказ №12345',
  description: 'Тестовое описание заказа',
  date: '2026-03-15T10:00:00.000Z',
};

const mockStats = {
  count: 5,
  totalUSD: 150,
  totalUAH: 6000,
  orderProducts: [],
};

const renderOrderCard = (props = {}, language: 'ru' | 'en' = 'ru') => {
  const defaultProps = {
    order: mockOrder,
    isSelected: false,
    hasSelectedOrder: false,
    stats: mockStats,
    onSelect: jest.fn(),
    onDeleteClick: jest.fn(),
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      productsCount: 'товаров',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <OrderCard {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('OrderCard', () => {
  it('renders primary order information correctly', () => {
    renderOrderCard();

    expect(screen.getByText('Заказ №12345')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('150 USD')).toBeInTheDocument();
    expect(screen.getByText('6000 UAH')).toBeInTheDocument();
    expect(screen.getByText('15 / мар. / 2026')).toBeInTheDocument();
  });

  it('triggers onSelect when clicking the card', async () => {
    const { onSelect } = renderOrderCard();

    await userEvent.click(screen.getByText('Заказ №12345'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockOrder.id);
  });

  it('triggers onDeleteClick when clicking the delete button', async () => {
    const { onDeleteClick } = renderOrderCard();

    // Use getAllByRole since both mobile and desktop delete buttons share the same aria-label
    const deleteButtons = screen.getAllByRole('button', { name: /delete order/i });
    await userEvent.click(deleteButtons[0]);

    expect(onDeleteClick).toHaveBeenCalledTimes(1);
    expect(onDeleteClick.mock.calls[0][1]).toBe(mockOrder.id);
  });

  it('hides elements when hasSelectedOrder is true', () => {
    renderOrderCard({ hasSelectedOrder: true });

    expect(screen.queryByText('Заказ №12345')).not.toBeInTheDocument();
    expect(screen.queryByText('150 USD')).not.toBeInTheDocument();
  });
});