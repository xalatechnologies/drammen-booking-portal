
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
  Settings
} from "lucide-react";

const OverviewPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👋</h1>
            <p className="text-indigo-100">Administrer bookingsystemet for Drammen Kommune</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2">
            <Settings className="h-4 w-4" />
            Systeminnstillinger
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">34</p>
                <p className="text-sm text-gray-600">Aktive Reservasjoner</p>
                <p className="text-xs text-blue-600 mt-1">+5 fra i går</p>
              </div>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Ventende Godkjenninger</p>
                <p className="text-xs text-yellow-600 mt-1">Trenger handling</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-gray-600">Nye Forespørsler</p>
                <p className="text-xs text-purple-600 mt-1">Siste 7 dager</p>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">143</p>
                <p className="text-sm text-gray-600">Aktive Fasiliteter</p>
                <p className="text-xs text-green-600 mt-1">Alle tilgjengelige</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Nylige Reservasjoner</CardTitle>
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              8 aktive
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">DI</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">#B-2024-001</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Godkjent
                    </Badge>
                  </div>
                  <p className="font-medium">Drammen Idrettshall - Hovedhall</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>Drammen IL</span>
                    <span>•</span>
                    <span>15. februar 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-100 text-orange-600">BK</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">#B-2024-002</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                      Venter
                    </Badge>
                  </div>
                  <p className="font-medium">Brandengen Skole - Gymsal</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>Bragernes Kulturforening</span>
                    <span>•</span>
                    <span>20. februar 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-100 text-purple-600">SI</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">#B-2024-003</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      Under behandling
                    </Badge>
                  </div>
                  <p className="font-medium">Strømsø Samfunnshus - Storhall</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>Strømsø IL</span>
                    <span>•</span>
                    <span>25. februar 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Se alle reservasjoner
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              ⚡ Hurtighandlinger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              Behandle Forespørsler
            </Button>
            
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-4 w-4 text-green-600" />
              </div>
              Administrer Fasiliteter
            </Button>
            
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              Administrer Brukere
            </Button>
            
            <Button className="w-full justify-start gap-3 h-12" variant="outline">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              Se Rapporter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
