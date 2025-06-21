
import React from 'react';
import { CheckCircle, Shield, Clock, Users, FileText } from 'lucide-react';

export function ServicesAndTerms() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Inkludert i prisen
        </h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Tilgang til fasiliteten</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Grunnleggende utstyr</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Rengjøring etter bruk</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Teknisk support</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-amber-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          Vilkår og betingelser
        </h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-700">
            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Gratis avbestilling (48t)</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Users className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Møt opp 15 min før</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <FileText className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Faktura etter arrangementet</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Bekreftelse på e-post</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
