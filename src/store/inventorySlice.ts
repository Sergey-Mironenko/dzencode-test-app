import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, Product } from '@/types';

const initialOrders: Order[] = [
  { id: 1, title: 'Поставка серверного оборудования', date: '2017-02-06 12:09:33', description: 'desc' },
  { id: 2, title: 'Закупка оргтехники для офиса', date: '2017-02-15 14:00:00', description: 'desc' },
  { id: 3, title: 'Поставка ноутбуков разработчикам', date: '2017-06-06 12:09:33', description: 'desc' },
  { id: 4, title: 'Мониторы для отдела продаж', date: '2017-06-20 10:30:00', description: 'desc' },
  { id: 5, title: 'Срочная закупка комплектующих', date: '2017-06-28 16:45:00', description: 'desc' },
  { id: 6, title: 'Периферия и аксессуары', date: '2017-09-06 12:09:33', description: 'desc' },
  { id: 7, title: 'Внеплановая закупка', date: '2017-10-15 12:09:33', description: 'desc' }
];

const initialProducts: Product[] = [
  {
    id: 1,
    serialNumber: 123456789,
    isNew: 1,
    photo: '/monitor.jpg',
    title: 'Gigabyte Technology X58-USB3',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-04-07 12:09:33', end: '2025-01-06 12:09:33' },
    price: [{ value: 2500, symbol: 'UAH', isDefault: 1 }],
    order: 1,
    date: '2017-02-10 12:09:33',
    status: 'Свободен',
    owner: null,
    groupName: 'Группа А'
  },
  {
    id: 2,
    serialNumber: 987654321,
    isNew: 0,
    photo: '/monitor.jpg',
    title: 'Dell UltraSharp',
    type: 'Monitors',
    specification: 'Specification 2',
    guarantee: { start: '2017-06-06 12:09:33', end: '2025-10-06 12:09:33' },
    price: [{ value: 3500, symbol: 'UAH', isDefault: 1 }],
    order: 2,
    date: '2017-04-12 12:09:33',
    status: 'В ремонте',
    owner: null,
    groupName: null
  },
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
  {
    id: 4,
    serialNumber: 321654987,
    isNew: 0,
    photo: '/laptop.jpg',
    title: 'Lenovo ThinkPad',
    type: 'Laptops',
    specification: 'Specification 4',
    guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
    price: [{ value: 18000, symbol: 'UAH', isDefault: 1 }],
    order: 4,
    date: '2017-09-10 12:09:33',
    status: 'Свободен',
    owner: null,
    groupName: null
  },
  {
    id: 5,
    serialNumber: 111222333,
    isNew: 1,
    photo: '/monitor.jpg',
    title: 'ASUS ProArt',
    type: 'Monitors',
    specification: 'Specification 5',
    guarantee: { start: '2017-10-01 12:09:33', end: '2026-01-01 12:09:33' },
    price: [{ value: 12000, symbol: 'UAH', isDefault: 1 }],
    order: 5,
    date: '2017-10-16 12:09:33',
    status: 'В ремонте',
    owner: null,
    groupName: 'Группа А'
  }
];

export const fetchInventoryData = createAsyncThunk(
  'inventory/fetchData',
  async () => {
    return new Promise<{ orders: Order[]; products: Product[] }>((resolve) => {
      setTimeout(() => {
        resolve({ orders: initialOrders, products: initialProducts });
      }, 1000);
    });
  }
);

interface InventoryState {
  orders: Order[];
  products: Product[];
  selectedOrderId: number | null;
  activeSessions: number;
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState: InventoryState = {
  orders: [],
  products: [],
  selectedOrderId: null,
  activeSessions: 0,
  isLoading: false,
  isLoaded: false,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    deleteOrder: (state, action: PayloadAction<number>) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((o) => o.id !== orderId);
      state.products = state.products.filter((p) => p.order !== orderId);
      if (state.selectedOrderId === orderId) {
        state.selectedOrderId = null;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setSelectedOrderId: (state, action: PayloadAction<number | null>) => {
      state.selectedOrderId = action.payload;
    },
    setActiveSessions: (state, action: PayloadAction<number>) => {
      state.activeSessions = action.payload;
    },
    addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'date'>>) => {
      const newProduct: Product = {
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      state.products.push(newProduct);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.isLoaded) {
          state.orders = action.payload.orders;
          state.products = action.payload.products;
          state.isLoaded = true;
        }
      })
      .addCase(fetchInventoryData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { deleteOrder, deleteProduct, setSelectedOrderId, setActiveSessions, addProduct } = inventorySlice.actions;
export default inventorySlice.reducer;