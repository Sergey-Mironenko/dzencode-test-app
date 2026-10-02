import { render, screen } from '@testing-library/react';
import MapContent from '@/components/MapContent';
import { LanguageContext } from '@/components/LanguageContext';

// Мокаем react-leaflet, чтобы не инициализировать тяжелый DOM/Leaflet в Node.js
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="map-popup">{children}</div>,
}));

jest.mock('leaflet', () => ({
  icon: jest.fn().mockReturnValue({}),
}));

describe('MapContent', () => {
  it('renders title and map container correctly', () => {
    const mockTranslate = (key: string) => {
      const translations: Record<string, string> = {
        objectGeolocation: 'Геолокация объектов',
        place: 'Главный офис / Склад',
      };
      return translations[key] || key;
    };

    render(
      <LanguageContext.Provider value={{ language: 'ru', setLanguage: jest.fn(), t: mockTranslate }}>
        <MapContent />
      </LanguageContext.Provider>
    );

    expect(screen.getByText('Геолокация объектов')).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('map-marker')).toBeInTheDocument();
    expect(screen.getByText('Главный офис / Склад')).toBeInTheDocument();
  });
});