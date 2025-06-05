
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  ClipboardList,
  Settings,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const OverviewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Administrer og overvåk lokaler</h1>
            <p className="text-base text-gray-600">Administrer og overvåk lokaler</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-10 text-base font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Ny Lokal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mb-2">
              <p className="text-2xl font-semibold text-gray-900">143</p>
              <p className="text-sm text-gray-600">Totale Lokaler</p>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+5</span>
              <span className="text-gray-500 ml-1">fra forrige måned</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mb-2">
              <p className="text-2xl font-semibold text-gray-900">34</p>
              <p className="text-sm text-gray-600">I Produksjon</p>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-600 font-medium">89%</span>
              <span className="text-gray-500 ml-1">av totalt</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mb-2">
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Ventende Godkjenninger</p>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-amber-600 font-medium">Trenger handling</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mb-2">
              <p className="text-2xl font-semibold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Kritiske Varsler</p>
            </div>
            <div className="flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">Krever oppmerksomhet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lokaler Liste */}
        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Alle Lokaler</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Administrer og overvåk alle lokaler</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  Alle Statuser
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                  Sorter etter dato
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk etter lokaler..."
                  className="pl-10 bg-gray-50 border-gray-200 text-base"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Drammen Idrettshall</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">Hovedhall</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Produksjon
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">95% samsvar</span>
                    </div>
                    <p className="text-xs">Sist oppdatert: 2024-03-15</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Detaljer</DropdownMenuItem>
                      <DropdownMenuItem>Administrer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Strømsø Samfunnshus</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">Storhall</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Produksjon
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="font-medium text-amber-600">88% samsvar</span>
                    </div>
                    <p className="text-xs">Sist oppdatert: 2024-03-14</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Detaljer</DropdownMenuItem>
                      <DropdownMenuItem>Administrer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Building className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Brandengen Skole</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">Gymsal</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Test
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">92% samsvar</span>
                    </div>
                    <p className="text-xs">Sist oppdatert: 2024-03-13</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Detaljer</DropdownMenuItem>
                      <DropdownMenuItem>Administrer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Hurtighandlinger</CardTitle>
            <p className="text-sm text-gray-600">Vanlige administrative oppgaver</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button className="w-full justify-start gap-3 h-12 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Behandle Forespørsler</p>
                  <p className="text-xs text-blue-600">12 ventende</p>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12 bg-green-50 hover:bg-green-100 text-green-700 border-green-200" variant="outline">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Administrer Lokaler</p>
                  <p className="text-xs text-green-600">143 aktive</p>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" variant="outline">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Administrer Brukere</p>
                  <p className="text-xs text-purple-600">Se alle</p>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200" variant="outline">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Se Rapporter</p>
                  <p className="text-xs text-gray-600">Analytikk</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
