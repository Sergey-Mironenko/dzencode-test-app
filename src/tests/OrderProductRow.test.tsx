import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderProductRow } from '@/components/OrderProductRow';
import { LanguageContext } from '@/components/LanguageContext';
import { Product } from '@/types/index';

const mockProduct: Product = {
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
  };

const renderOrderProductRow = (productProps = {}, onDelete = jest.fn(), language: 'ru' | 'en' = 'ru') => {
  const product = { ...mockProduct, ...productProps };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      freeStatus: 'Свободен',
      repairStatus: 'В ремонте',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <OrderProductRow product={product} onDelete={onDelete} />
      </LanguageContext.Provider>
    ),
    onDelete,
    product,
  };
};

describe('OrderProductRow', () => {
  it('renders product information correctly when status is "Свободен"', () => {
    renderOrderProductRow();

    expect(screen.getByText('MacBook Pro 15')).toBeInTheDocument();
    expect(screen.getByText('SN-456789123')).toBeInTheDocument();
    expect(screen.getByText('Свободен')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: /MacBook Pro 15/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/laptop.jpg');
  });

  it('renders correct status text when status is not "Свободен"', () => {
    renderOrderProductRow({ status: 'В ремонте' });

    expect(screen.getByText('В ремонте')).toBeInTheDocument();
  });

  it('calls onDelete callback when delete button is clicked', async () => {
    const onDelete = jest.fn();
    renderOrderProductRow({}, onDelete);

    const deleteButton = screen.getByRole('button', { name: /delete product/i });
    await userEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});