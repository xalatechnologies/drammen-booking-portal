import React, { useEffect } from 'react';
import { useStore } from '@/zustand-only/stores/useRootStore';
import { useTranslation } from '@/zustand-only/hooks/useTranslation';

/**
 * Example component demonstrating the usage of the root store
 * This shows how to access multiple stores through a single entry point
 */
export const BookingDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Access the root store which provides all stores
  const {
    userStore,
    locationStore,
    zoneStore,
    notificationStore,
    cartStore,
    settingsStore,
    hydrateAllStores
  } = useStore();
  
  // Get current user from user store
  const { currentUser, isAuthenticated } = userStore;
  
  // Get locations and zones from their respective stores
  const { items: locations, isLoading: isLoadingLocations } = locationStore;
  const { items: zones, isLoading: isLoadingZones } = zoneStore;
  
  // Get notifications from notification store
  const { notifications, unreadCount } = notificationStore;
  
  // Get cart items from cart store
  const { items: cartItems, totalAmount } = cartStore;
  
  // Get theme settings from settings store
  const { theme } = settingsStore;
  
  // Initialize all stores on component mount
  useEffect(() => {
    hydrateAllStores();
  }, []);
  
  // Example of using multiple stores together
  const handleBookZone = async (zoneId: string, startTime: string, endTime: string) => {
    if (!isAuthenticated) {
      return;
    }
    
    // Add zone to cart
    await cartStore.addItem({
      zoneId,
      startTime,
      endTime,
      quantity: 1
    });
    
    // Show notification
    notificationStore.addNotification({
      title: t('notifications.zoneAdded'),
      message: t('notifications.zoneAddedToCart'),
      type: 'success'
    });
  };
  
  // Example of conditional rendering based on multiple store states
  if (!isAuthenticated) {
    return <div>{t('common.pleaseLogin')}</div>;
  }
  
  if (isLoadingLocations || isLoadingZones) {
    return <div>{t('common.loading')}</div>;
  }
  
  return (
    <div style={{ 
      backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme.mode === 'dark' ? '#ffffff' : '#1a1a1a'
    }}>
      <header>
        <h1>{t('dashboard.welcome', { name: currentUser?.name })}</h1>
        <div>
          <span>{t('notifications.count')}: {unreadCount}</span>
          <span>{t('cart.itemCount')}: {cartItems.length}</span>
          <span>{t('cart.total')}: {totalAmount}</span>
        </div>
      </header>
      
      <main>
        <section>
          <h2>{t('locations.available')}</h2>
          <ul>
            {locations.map(location => (
              <li key={location.id}>
                {/* Use localized name from location */}
                {location.name[currentUser?.preferredLanguage || 'en'] || location.name.en}
              </li>
            ))}
          </ul>
        </section>
        
        <section>
          <h2>{t('zones.available')}</h2>
          <ul>
            {zones.map(zone => (
              <li key={zone.id}>
                {/* Use localized name from zone */}
                {zone.name[currentUser?.preferredLanguage || 'en'] || zone.name.en}
                <button 
                  onClick={() => handleBookZone(
                    zone.id, 
                    new Date().toISOString(), 
                    new Date(Date.now() + 3600000).toISOString()
                  )}
                >
                  {t('zones.book')}
                </button>
              </li>
            ))}
          </ul>
        </section>
        
        <section>
          <h2>{t('notifications.recent')}</h2>
          <ul>
            {notifications.slice(0, 5).map(notification => (
              <li key={notification.id} style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                {notification.title}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
