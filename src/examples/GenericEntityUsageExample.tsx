import React, { useEffect } from 'react';
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { useTranslation } from 'next-i18next';

// Define the Facility type
interface Facility {
  id: number;
  name: string;
  description: string;
  address: string;
  type: string;
  status: string;
  // Add other fields as needed
}

// Create a store for facilities using our generic approach
const useFacilityStore = createGenericEntityStore<Facility>('facilities', {
  related: ['facility_opening_hours', 'zones', 'facility_images'],
  statusField: 'status',
  activeValue: 'active'
});

/**
 * Example component showing how to use the generic entity store
 */
const FacilityListExample: React.FC = () => {
  const { t } = useTranslation('common');
  const { 
    items: facilities, 
    isLoading, 
    error, 
    pagination, 
    fetchList, 
    delete: deleteFacility 
  } = useFacilityStore();

  // Load facilities on component mount
  useEffect(() => {
    fetchList({
      page: 1,
      limit: 10,
      orderBy: 'name',
      orderDirection: 'asc'
    });
  }, [fetchList]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteFacility(id);
    }
  };

  if (isLoading) return <div>{t('loading')}</div>;
  if (error) return <div>{t('error')}: {error}</div>;

  return (
    <div>
      <h1>{t('facilities')}</h1>
      
      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('type')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map(facility => (
            <tr key={facility.id}>
              <td>{facility.name}</td>
              <td>{facility.type}</td>
              <td>
                <button onClick={() => handleDelete(facility.id)}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
      </div>
    </div>
  );
};

/**
 * Example component showing how to use the generic entity store for CRUD operations
 */
const FacilityFormExample: React.FC<{ facilityId?: number }> = ({ facilityId }) => {
  const { t } = useTranslation('common');
  const { 
    selectedItem: facility, 
    isLoading, 
    error, 
    fetchById, 
    create, 
    update 
  } = useFacilityStore();
  
  const [formData, setFormData] = React.useState<Partial<Facility>>({
    name: '',
    description: '',
    address: '',
    type: '',
    status: 'active'
  });

  // Load facility if editing
  useEffect(() => {
    if (facilityId) {
      fetchById(facilityId);
    }
  }, [facilityId, fetchById]);

  // Update form when facility is loaded
  useEffect(() => {
    if (facility) {
      setFormData(facility);
    }
  }, [facility]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (facilityId) {
      // Update existing facility
      await update(facilityId, formData);
    } else {
      // Create new facility
      await create(formData);
    }
  };

  if (isLoading) return <div>{t('loading')}</div>;
  if (error) return <div>{t('error')}: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>{facilityId ? t('editFacility') : t('newFacility')}</h1>
      
      <div>
        <label htmlFor="name">{t('name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="description">{t('description')}</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="address">{t('address')}</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="type">{t('type')}</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">{t('selectType')}</option>
          <option value="sports">{t('sports')}</option>
          <option value="cultural">{t('cultural')}</option>
          <option value="educational">{t('educational')}</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="status">{t('status')}</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="active">{t('active')}</option>
          <option value="inactive">{t('inactive')}</option>
        </select>
      </div>
      
      <button type="submit">
        {facilityId ? t('update') : t('create')}
      </button>
    </form>
  );
};

export { FacilityListExample, FacilityFormExample };
