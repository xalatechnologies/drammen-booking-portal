
import React from 'react';
import { Calendar, Info, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface DateRangeStepProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export function DateRangeStep({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeStepProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      console.log('Start date selected:', date);
      onStartDateChange(date);
    } else {
      onStartDateChange(undefined);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      console.log('End date selected:', date);
      onEndDateChange(date);
    } else {
      onEndDateChange(undefined);
    }
  };

  // Format dates for input fields (YYYY-MM-DD)
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  // Get today's date for min attribute
  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate duration and other stats
  const calculateStats = () => {
    if (!startDate || !endDate) return null;
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weeksDiff = Math.ceil(daysDiff / 7);
    const monthsDiff = Math.ceil(daysDiff / 30);
    
    return { daysDiff, weeksDiff, monthsDiff };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Velg periode</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            Angi når den gjentakende reservasjonen skal starte og slutte
          </p>
        </div>
      </div>

      {/* Date Selection Card */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Start Date */}
            <div className="space-y-3">
              <Label htmlFor="start-date" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Startdato
              </Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  value={formatDateForInput(startDate)}
                  onChange={handleStartDateChange}
                  min={today}
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {startDate && (
                <p className="text-sm text-green-600 font-medium">
                  {format(startDate, 'EEEE, dd. MMMM yyyy', { locale: nb })}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <Label htmlFor="end-date" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Sluttdato
              </Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  value={formatDateForInput(endDate)}
                  onChange={handleEndDateChange}
                  min={formatDateForInput(startDate) || today}
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {endDate && (
                <p className="text-sm text-red-600 font-medium">
                  {format(endDate, 'EEEE, dd. MMMM yyyy', { locale: nb })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Summary */}
      {startDate && endDate && stats && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Valgt periode</h3>
                  <p className="text-blue-700 text-sm">Sammendrag av reservasjonsperioden</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{stats.daysDiff}</div>
                    <div className="text-sm text-blue-600 font-medium">Dager totalt</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{stats.weeksDiff}</div>
                    <div className="text-sm text-blue-600 font-medium">Uker cirka</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{stats.monthsDiff}</div>
                    <div className="text-sm text-blue-600 font-medium">Måneder cirka</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    Periode
                  </Badge>
                  <div className="flex-1">
                    <p className="text-blue-800 font-medium">
                      {format(startDate, 'dd. MMM yyyy', { locale: nb })} - {format(endDate, 'dd. MMM yyyy', { locale: nb })}
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      Fra {format(startDate, 'EEEE', { locale: nb }).toLowerCase()} til {format(endDate, 'EEEE', { locale: nb }).toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tips for periodevelging</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Velg en startdato som ikke er for langt frem i tid</li>
                <li>• Sluttdatoen må være minst én dag etter startdatoen</li>
                <li>• For lange perioder kan det være lurt å dele opp i mindre deler</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
