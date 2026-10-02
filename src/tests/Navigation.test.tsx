import { render, screen, act, fireEvent } from '@testing-library/react';
import Navigation from '@/components/Navigation';

jest.mock('next/navigation', () => ({
  usePathname: () => '/orders',
}));

jest.mock('../components/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        navOrders: 'Приходы',
        navGroups: 'Группы',
        navProducts: 'Продукты',
        navCharts: 'Графики',
        navMaps: 'Карты',
        userAvatar: 'Аватар пользователя',
        profileSettings: 'Настройки профиля',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Component Navigation', () => {
  it('renders all navigation links correctly', () => {
    render(<Navigation />);

    expect(screen.getByText('Приходы')).toBeInTheDocument();
    expect(screen.getByText('Группы')).toBeInTheDocument();
    expect(screen.getByText('Продукты')).toBeInTheDocument();
    expect(screen.getByText('Графики')).toBeInTheDocument();
    expect(screen.getByText('Карты')).toBeInTheDocument();
  });

  it('applies the active class for the current path (/orders)', () => {
    render(<Navigation />);

    const activeLink = screen.getByText('Приходы');
    expect(activeLink).toHaveClass('navigation-link-active');

    const inactiveLink = screen.getByText('Продукты');
    expect(inactiveLink).not.toHaveClass('navigation-link-active');
  });

  it('renders the profile settings button with correct aria-label', () => {
    render(<Navigation />);

    const settingsButton = screen.getByRole('button', { name: 'Настройки профиля' });
    expect(settingsButton).toBeInTheDocument();
  });

  it('falls back to rendering user icon when avatar image fails to load', async () => {
    render(<Navigation />);

    const avatarImage = screen.getByAltText('Аватар пользователя');

    await act(async () => {
      fireEvent.error(avatarImage);
    });

    const fallbackIcon = document.querySelector('.lucide-user');
    expect(fallbackIcon).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    render(<Navigation />);

    expect(screen.getByText('Приходы').getAttribute('href')).toBe('/orders');
    expect(screen.getByText('Группы').getAttribute('href')).toBe('/groups');
    expect(screen.getByText('Продукты').getAttribute('href')).toBe('/products');
    expect(screen.getByText('Графики').getAttribute('href')).toBe('/charts');
    expect(screen.getByText('Карты').getAttribute('href')).toBe('/maps');
  });

  it('renders main navigation landmark with proper aria-label', () => {
    render(<Navigation />);

    const navElement = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(navElement).toBeInTheDocument();
  });
});