import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsPanel from '@/components/OrderDetailsPanel';
import { LanguageContext } from '@/components/LanguageContext';
import { Order, Product } from '@/types/index';

jest.mock('@/components/AddProductModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div data-testid="add-product-modal">Add Product Modal</div> : null),
}));

const mockOrder: Order = {
  id: 1,
  title: 'Приход №42',
  description: 'Описание прихода',
  date: '2026-03-15T10:00:00.000Z',
};

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
    order: 3,
    date: '2017-06-08 12:09:33',
    status: 'Свободен',
    owner: 'Мироненко Сергей',
    groupName: 'Длинная предлинная группа'
  },
];

const renderOrderDetailsPanel = (props = {}, language: 'ru' | 'en' = 'ru') => {
  const defaultProps = {
    order: mockOrder,
    products: mockProducts,
    onClose: jest.fn(),
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      addProduct: 'Добавить продукт',
      noProducts: 'В этом приходе нет продуктов',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <OrderDetailsPanel {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('OrderDetailsPanel', () => {
  it('renders order title and products list correctly', () => {
    renderOrderDetailsPanel();

    expect(screen.getByText('Приход №42')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 15')).toBeInTheDocument();
    expect(screen.getByText('Добавить продукт')).toBeInTheDocument();
  });

  it('renders empty state message when products array is empty', () => {
    renderOrderDetailsPanel({ products: [] });

    expect(screen.getByText('В этом приходе нет продуктов')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', async () => {
    const { onClose } = renderOrderDetailsPanel();

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens AddProductModal when clicking add product button', async () => {
    renderOrderDetailsPanel();

    expect(screen.queryByTestId('add-product-modal')).not.toBeInTheDocument();

    const addButton = screen.getByText('Добавить продукт');
    await userEvent.click(addButton);

    expect(screen.getByTestId('add-product-modal')).toBeInTheDocument();
  });
});