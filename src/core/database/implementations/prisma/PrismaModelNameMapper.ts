/**
 * PrismaModelNameMapper
 * 
 * Single Responsibility: Handle the conversion between table names and Prisma model names
 */
export class PrismaModelNameMapper {
  /**
   * Convert table name to Prisma model name
   * Applies the convention of converting snake_case singular to PascalCase
   */
  public getPrismaModelName(table: string): string | null {
    if (!table) {
      return null;
    }
    
    try {
      // Convert singular snake_case to PascalCase singular 
      // Following a consistent naming convention
      return this.toPascalCase(table);
    } catch (error) {
      console.error(`Error getting Prisma model name for table ${table}:`, error);
      return null;
    }
  }

  /**
   * Helper to convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    // Handle potential null or undefined
    if (!str) return '';
    
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
