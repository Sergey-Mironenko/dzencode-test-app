'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryData } from '@/store/inventorySlice';
import { useLanguage } from './LanguageContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export default function ChartsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useLanguage();
  const { orders, products, isLoaded, isLoading } = useSelector((state: RootState) => state.inventory);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchInventoryData());
    }
  }, [isLoaded, dispatch]);

  const ordersByMonthMap: { [key: string]: number } = {};
  orders.forEach((order) => {
    const month = order.date.substring(0, 7);
    ordersByMonthMap[month] = (ordersByMonthMap[month] || 0) + 1;
  });

  const ordersChartData = Object.keys(ordersByMonthMap)
    .sort()
    .map((month) => ({
      month,
      count: ordersByMonthMap[month],
    }));

  const productsByTypeMap: { [key: string]: number } = {};
  products.forEach((product) => {
    const type = product.type || 'Другое';
    productsByTypeMap[type] = (productsByTypeMap[type] || 0) + 1;
  });

  const productsChartData = Object.keys(productsByTypeMap).map((type) => ({
    type,
    count: productsByTypeMap[type],
  }));

  if (isLoading && !isLoaded) {
    return <div className="p-4 text-secondary">{t('analyticsLoading')}</div>;
  }

  return (
    <div className="container-fluid p-0">
      <h2 className="h4 fw-bold mb-4 text-dark">{t('analytics')}</h2>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="bg-white p-4 rounded-4 shadow-sm w-100" style={{ height: '350px' }}>
            <h3 className="h6 fw-bold mb-3 text-secondary">{t('dynamics')}</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#198754" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="bg-white p-4 rounded-4 shadow-sm w-100" style={{ height: '350px' }}>
            <h3 className="h6 fw-bold mb-3 text-secondary">{t('amount')}</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={productsChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#198754" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}