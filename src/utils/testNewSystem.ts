
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
    console.log('🗃️ Testing database queries via edge function...');
    
    try {
      // Test users query via edge function
      const { data: usersResult, error: usersError } = await supabase.functions.invoke('app-api', {
        body: { path: 'users' }
      });

      if (usersError) {
        console.error('Users query error:', usersError);
        return { success: false, error: usersError };
      }

      console.log('Users query result:', usersResult);

      // Test locations query via edge function
      const { data: locationsResult, error: locationsError } = await supabase.functions.invoke('app-api', {
        body: { path: 'locations' }
      });

      if (locationsError) {
        console.error('Locations query error:', locationsError);
        return { success: false, error: locationsError };
      }

      console.log('Locations query result:', locationsResult);

      return { 
        success: true, 
        data: { 
          usersResult, 
          locationsResult 
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
