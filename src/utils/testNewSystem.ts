
import { newTranslationService } from '@/services/NewTranslationService';
import { supabase } from '@/integrations/supabase/client';

export class NewSystemTester {
  static async initialize() {
    await newTranslationService.initialize();
    console.log('🔧 New system tester initialized');
  }

  static async testTranslations() {
    console.log('🌍 Testing translations...');
    
    // Test Norwegian translations
    const noBookingStatus = newTranslationService.getTranslation('system.bookings.status.confirmed', 'NO');
    console.log('NO booking status:', noBookingStatus); // Should be "Bekreftet"
    
    // Test English translations with fallback
    const enBookingStatus = newTranslationService.getTranslation('system.bookings.status.confirmed', 'EN');
    console.log('EN booking status:', enBookingStatus); // Should be "Confirmed"
    
    // Test localized content helper
    const localizedName = newTranslationService.getLocalizedContent(
      {"NO": "Drammen Idrettshall", "EN": "Drammen Sports Hall"}, 
      'EN'
    );
    console.log('Localized name:', localizedName); // Should be "Drammen Sports Hall"
    
    return { noBookingStatus, enBookingStatus, localizedName };
  }

  static async testEdgeFunction() {
    console.log('🚀 Testing edge function...');
    
    try {
      const { data, error } = await supabase.functions.invoke('app-api', {
        body: { path: 'health' }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        return { success: false, error };
      }
      
      console.log('Edge function response:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Edge function test failed:', error);
      return { success: false, error };
    }
  }

  static async testDatabaseQueries() {
    console.log('🗃️ Testing database queries...');
    
    try {
      // Test users query
      const { data: users, error: usersError } = await supabase
        .from('app_users')
        .select('id, email, name, locale')
        .limit(5);

      if (usersError) {
        console.error('Users query error:', usersError);
        return { success: false, error: usersError };
      }

      console.log('Sample users:', users);

      // Test locations with localized names
      const { data: locations, error: locationsError } = await supabase
        .from('app_locations')
        .select('id, name, description')
        .limit(3);

      if (locationsError) {
        console.error('Locations query error:', locationsError);
        return { success: false, error: locationsError };
      }

      console.log('Sample locations with localized data:', locations);

      return { 
        success: true, 
        data: { 
          usersCount: users?.length || 0, 
          locationsCount: locations?.length || 0 
        } 
      };
    } catch (error) {
      console.error('Database test failed:', error);
      return { success: false, error };
    }
  }

  static async runAllTests() {
    console.log('🧪 Running all new system tests...');
    
    await this.initialize();
    
    const translationResults = await this.testTranslations();
    const edgeFunctionResults = await this.testEdgeFunction();
    const databaseResults = await this.testDatabaseQueries();
    
    const summary = {
      translations: translationResults,
      edgeFunction: edgeFunctionResults,
      database: databaseResults,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 Test Summary:', summary);
    return summary;
  }
}

// Export for easy testing in browser console
(window as any).NewSystemTester = NewSystemTester;
