import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFilter from '@/components/ProductFilter';
import { LanguageContext } from '@/components/LanguageContext';

const renderProductFilter = (props = {}, language: 'ru' | 'en' = 'ru') => {
  const defaultProps = {
    totalCount: 15,
    filterType: 'all',
    uniqueTypes: ['Ноутбуки', 'Мониторы', 'Принтеры'],
    onFilterChange: jest.fn(),
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      products: 'Продукты',
      type: 'Тип',
      allTypes: 'Все типы',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <ProductFilter {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('ProductFilter', () => {
  it('renders total count and current filter label correctly', () => {
    renderProductFilter();

    expect(screen.getByText('Продукты / 15')).toBeInTheDocument();
    expect(screen.getByText('Тип:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Все типы/i })).toBeInTheDocument();
  });

  it('opens dropdown and displays unique types when clicked', async () => {
    renderProductFilter();

    const dropdownButton = screen.getByRole('button', { name: /Все типы/i });

    expect(screen.queryByText('Ноутбуки')).not.toBeInTheDocument();

    await userEvent.click(dropdownButton);

    expect(screen.getByText('Ноутбуки')).toBeInTheDocument();
    expect(screen.getByText('Мониторы')).toBeInTheDocument();
    expect(screen.getByText('Принтеры')).toBeInTheDocument();
  });

  it('calls onFilterChange and closes dropdown when an option is selected', async () => {
    const onFilterChange = jest.fn();
    renderProductFilter({ onFilterChange });

    const dropdownButton = screen.getByRole('button', { name: /Все типы/i });
    await userEvent.click(dropdownButton);

    const monitorOption = screen.getByRole('button', { name: 'Мониторы' });
    await userEvent.click(monitorOption);

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith('Мониторы');

    expect(screen.queryByText('Ноутбуки')).not.toBeInTheDocument();
  });
});