import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '@/components/ProductCard';
import { Product, Order } from '@/types/index';

// 1. Мокаем контекст локализации
let mockLanguage = 'ru';
jest.mock('../components/LanguageContext', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    t: (key: string) => {
      const translations: Record<string, string> = {
        freeStatus: 'Свободен',
        repairStatus: 'В ремонте',
        productAlt: 'Фото продукта',
        from: 'с',
        to: 'по',
        newItem: 'Новый',
        usedItem: 'Б/У',
      };
      return translations[key] || key;
    },
  }),
}));

const mockProduct: Product = {
  id: 1, // Исправлено под ожидаемый id удаления в тесте
  serialNumber: 456789123,
  isNew: 1,
  photo: '/laptop.jpg',
  title: 'MacBook Pro 15',
  type: 'Laptops',
  specification: 'Specification 3',
  guarantee: { start: '2017-05-06 12:09:33', end: '2025-09-06 12:09:33' },
  price: [
    { value: 500, symbol: 'USD', isDefault: 0 },
    { value: 35000, symbol: 'UAH', isDefault: 1 }
  ],
  order: 3,
  date: '2017-06-08 12:09:33',
  status: 'Свободен',
  owner: 'Мироненко Сергей',
  groupName: 'Длинная предлинная группа'
};

const mockOrder: Order = {
  id: 10,
  title: 'Заказ №42',
  date: '2025-06-15T00:00:00.000Z',
  description: 'Description'
};

describe('Component ProductCard', () => {
  const mockDeleteClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLanguage = 'ru';
  });

  it('renders product title, serial number and prices correctly', () => {
    render(<ProductCard product={mockProduct} onDeleteClick={mockDeleteClick} />);

    expect(screen.getByText('MacBook Pro 15')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('456789123'))).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('35000')).toBeInTheDocument();
  });

  it('renders free status correctly when product is available', () => {
    render(<ProductCard product={mockProduct} onDeleteClick={mockDeleteClick} />);

    expect(screen.getByText('Свободен')).toBeInTheDocument();
  });

  it('renders repair status correctly when product status changes', () => {
    const repairProduct = { ...mockProduct, status: 'В ремонте' as const };
    render(<ProductCard product={repairProduct} onDeleteClick={mockDeleteClick} />);

    expect(screen.getByText('В ремонте')).toBeInTheDocument();
  });

  it('renders group name, owner and order details when provided', () => {
    render(
      <ProductCard
        product={mockProduct}
        order={mockOrder}
        onDeleteClick={mockDeleteClick}
      />
    );

    expect(screen.getByText('Длинная предлинная группа')).toBeInTheDocument();
    expect(screen.getByText('Мироненко Сергей')).toBeInTheDocument();
    expect(screen.getByText('Заказ №42')).toBeInTheDocument();
  });

  it('calls onDeleteClick with product id when delete button is clicked', async () => {
    render(<ProductCard product={mockProduct} onDeleteClick={mockDeleteClick} />);

    const deleteButton = screen.getByRole('button');
    await userEvent.click(deleteButton);

    expect(mockDeleteClick).toHaveBeenCalledTimes(1);
    expect(mockDeleteClick).toHaveBeenCalledWith(1);
  });
});