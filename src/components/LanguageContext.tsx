'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'ru' | 'en';

const translations = {
  ru: {
    inventory: 'Инвентарь',
    orders: 'Приходы',
    products: 'Продукты',
    settings: 'Настройки',
    searchPlaceholder: 'Поиск',
    activeSessions: 'сессия',
    activeSessionsPlural: 'сессий',
    addProduct: 'Добавить продукт',
    noProducts: 'В этом приходе нет продуктов',
    confirmDeleteOrder: 'Вы уверены, что хотите удалить этот приход?',
    cancel: 'Отмена',
    delete: 'Удалить',
    freeStatus: 'Свободен',
    repairStatus: 'В ремонте',
    allTypes: 'Все типы',
    type: 'Тип',
    specification: 'Спецификация',
    navOrders: 'ПРИХОД',
    navGroups: 'ГРУППЫ',
    navProducts: 'ПРОДУКТЫ',
    navCharts: 'ГРАФИКИ',
    navMaps: 'КАРТЫ',
    noProductsFound: 'Продукты не найдены',
    userAvatar: 'Аватар пользователя',
    profileSettings: 'Настройки профиля',
    from: 'с',
    to: 'по',
    newItem: 'новый',
    usedItem: 'Б / У',
    productAlt: 'Продукт',
    productsCount: 'Продукта',
    save: 'Сохранить',
    addProductTitle: 'Добавить продукт в приход',
    productNameLabel: 'Название продукта*',
    productNamePlaceholder: 'Например: Monitor LG UltraGear 27',
    serialNumberLabel: 'Серийный номер*',
    typeLabel: 'Тип*',
    priceUsdLabel: 'Цена USD*',
    priceUahLabel: 'Цена UAH*',
    conditionLabel: 'Состояние',
    statusLabel: 'Статус',
    errTitleMinLength: 'Название должно содержать минимум 3 символа',
    errSerialNumberInvalid: 'Укажите корректный числовой серийный номер',
    errPriceUsd: 'Укажите цену в USD (> 0)',
    errPriceUah: 'Укажите цену в UAH (> 0)',
  },
  en: {
    inventory: 'Inventory',
    orders: 'Orders',
    products: 'Products',
    settings: 'Settings',
    searchPlaceholder: 'Search',
    activeSessions: 'session',
    activeSessionsPlural: 'sessions',
    addProduct: 'Add Product',
    noProducts: 'No products in this order',
    confirmDeleteOrder: 'Are you sure you want to delete this order?',
    cancel: 'Cancel',
    delete: 'Delete',
    freeStatus: 'Free',
    repairStatus: 'In Repair',
    allTypes: 'All Types',
    type: 'Type',
    specification: 'Specification',
    navOrders: 'ORDERS',
    navGroups: 'GROUPS',
    navProducts: 'PRODUCTS',
    navCharts: 'CHARTS',
    navMaps: 'MAPS',
    noProductsFound: 'No products found',
    userAvatar: 'User avatar',
    profileSettings: 'Profile settings',
    from: 'from',
    to: 'to',
    newItem: 'New',
    usedItem: 'Used',
    productAlt: 'Product',
    productsCount: 'Products',
    save: 'Save',
    addProductTitle: 'Add product to order',
    productNameLabel: 'Product Name*',
    productNamePlaceholder: 'e.g. Monitor LG UltraGear 27',
    serialNumberLabel: 'Serial Number*',
    typeLabel: 'Type*',
    priceUsdLabel: 'Price USD*',
    priceUahLabel: 'Price UAH*',
    conditionLabel: 'Condition',
    statusLabel: 'Status',
    errTitleMinLength: 'Name must contain at least 3 characters',
    errSerialNumberInvalid: 'Specify a valid numeric serial number',
    errPriceUsd: 'Specify price in USD (> 0)',
    errPriceUah: 'Specify price in UAH (> 0)',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ru']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: keyof typeof translations['ru']) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}