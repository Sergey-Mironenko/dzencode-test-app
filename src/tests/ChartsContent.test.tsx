import { render, screen } from '@testing-library/react';
import ChartsContent from '@/components/ChartsContent';
import { LanguageContext } from '@/components/LanguageContext';
import * as reactRedux from 'react-redux';

// Мокаем react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Мокаем Recharts ResponsiveContainer для JSDOM
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}));

const mockDispatch = jest.fn();

const renderChartsContent = (stateOverrides = {}, language: 'ru' | 'en' = 'ru') => {
  // Используем двойное приведение через unknown для мока useDispatch
  (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  (reactRedux.useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      inventory: {
        orders: [
          { id: 1, date: '2026-10-01T10:00:00Z' },
          { id: 2, date: '2026-10-02T12:00:00Z' },
          { id: 3, date: '2026-09-15T08:30:00Z' },
        ],
        products: [
          { id: 1, type: 'Электроника' },
          { id: 2, type: 'Электроника' },
          { id: 3, type: 'Аксессуары' },
        ],
        isLoaded: true,
        isLoading: false,
        ...stateOverrides,
      },
    })
  );

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      analytics: 'Аналитика',
      dynamics: 'Динамика заказов',
      amount: 'Количество по типам',
      analyticsLoading: 'Загрузка аналитики...',
    };
    return translations[key] || key;
  };

  return render(
    <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
      <ChartsContent />
    </LanguageContext.Provider>
  );
};

describe('ChartsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading and not loaded', () => {
    renderChartsContent({ isLoaded: false, isLoading: true });

    expect(screen.getByText('Загрузка аналитики...')).toBeInTheDocument();
  });

  it('renders analytics headers and chart containers when data is loaded', () => {
    renderChartsContent();

    expect(screen.getByText('Аналитика')).toBeInTheDocument();
    expect(screen.getByText('Динамика заказов')).toBeInTheDocument();
    expect(screen.getByText('Количество по типам')).toBeInTheDocument();

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers.length).toBe(2);
  });
});