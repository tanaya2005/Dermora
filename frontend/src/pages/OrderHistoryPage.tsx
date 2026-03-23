import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const OrderHistoryPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/orders/user');
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navigation */}
          <main className="flex flex-1 flex-col items-center py-10 px-6 md:px-20 lg:px-40">
            <div className="w-full max-w-[960px] flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex flex-col gap-2">
                <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-3">
                  <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                  <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                  <span className="text-primary font-medium">Order History</span>
                </nav>
                <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">
                  Order History
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Manage your past purchases and track your deliveries.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/10">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">inventory_2</span>
                  <h2 className="text-xl font-bold dark:text-white">No orders yet</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Looks like you haven't placed any orders.</p>
                  <Link to="/products" className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all shadow-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.map((order: any) => (
                    <div key={order._id} className="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-primary/10 pb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                             ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-soft-olive text-accent-green dark:bg-emerald-900/30 dark:text-emerald-400' : 
                             order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' :
                             'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-500'
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'check_circle' : order.status === 'PENDING' ? 'schedule' : 'cancel'}
                            </span>
                            <span className="text-xs font-bold">
                              {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'Payment Done' : order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          {order.orderItems.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 items-center">
                              <div
                                className="size-16 bg-primary/5 rounded-lg flex-shrink-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${item.productId?.imageUrl}')` }}
                              ></div>
                              <div className="flex flex-1 flex-col justify-center">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {item.productId?.title || 'Unknown Product'}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-primary font-bold mt-1 text-sm">₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Order Total:</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">₹{order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'}</span>
                        </div>
                      </div>

                      {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                        <div className="bg-slate-50 dark:bg-primary/5 border-t border-primary/10 px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                          <div className="flex-1 w-full md:w-auto">
                            <div className="w-full bg-primary/20 rounded-full h-1.5 mb-2">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '60%' : '25%' }}
                              ></div>
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {order.status === 'DELIVERED' ? 'Delivered successfully.' : `Estimated Delivery: ${new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                            </p>
                          </div>
                          <button className="w-full md:w-auto border border-primary text-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            Track Delivery
                          </button>
                        </div>
                      )}

                      {order.status === 'FAILED' && (
                        <div className="bg-rose-50 dark:bg-rose-900/10 border-t border-rose-200 px-6 py-4">
                          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            Payment failed. Please try ordering again.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
