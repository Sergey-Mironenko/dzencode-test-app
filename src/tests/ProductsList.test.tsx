import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsList from '@/components/ProductsList';
import { LanguageContext } from '@/components/LanguageContext';
import { Product, Order } from '@/types/index';

jest.mock('@/components/ProductCard', () => ({
  ProductCard: ({ product, onDeleteClick }: { product: Product; onDeleteClick: (id: number) => void }) => (
    <div data-testid={`product-card-${product.id}`}>
      <span>{product.title}</span>
      <button type="button" onClick={() => onDeleteClick(product.id)}>
        Delete {product.id}
      </button>
    </div>
  ),
}));

const mockProducts: Product[] = [
  {
    id: 3,
    serialNumber: 456789123,
    isNew: 1,
    photo: '/laptop.jpg',
    title: 'MacBook Pro 15',
    type: 'Laptops',
    specification: 'Specification 3',
    guarantee: { start: '2017-05-06 12:09:33', end: '2025-09-06 12:09:33' },
    price: [{ value: 35000, symbol: 'UAH', isDefault: 1 }],
    order: 42,
    date: '2017-06-08 12:09:33',
    status: 'Свободен',
  },
];

const mockOrders: Order[] = [
  {
    id: 42,
    title: 'Приход №42',
    description: 'Тестовый приход',
    date: '2026-03-15T10:00:00.000Z',
  },
];

const renderProductsList = (props = {}, language: 'ru' | 'en' = 'ru') => {
  const defaultProps = {
    products: mockProducts,
    orders: mockOrders,
    onDeleteClick: jest.fn(),
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      noProductsFound: 'Продукты не найдены',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <ProductsList {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('ProductsList', () => {
  it('renders list of products correctly', () => {
    renderProductsList();

    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 15')).toBeInTheDocument();
  });

  it('renders empty state message when products array is empty', () => {
    renderProductsList({ products: [] });

    expect(screen.getByText('Продукты не найдены')).toBeInTheDocument();
  });

  it('calls onDeleteClick with correct product id when delete is triggered', async () => {
    const onDeleteClick = jest.fn();
    renderProductsList({ onDeleteClick });

    const deleteButton = screen.getByRole('button', { name: /Delete 3/i });
    await userEvent.click(deleteButton);

    expect(onDeleteClick).toHaveBeenCalledTimes(1);
    expect(onDeleteClick).toHaveBeenCalledWith(3);
  });
});