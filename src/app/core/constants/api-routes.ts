import { environment } from '@env/environment';

export const API_URL = `${environment.baseUrl}/api`;

export const apiRoutes = {
  config: 'config',
};

export const PAGES_TITLE = {
  '/dashboard/basemap': 'Dashboard.Basemap',
  '/dashboard/profile-service': 'Dashboard.ProfileService',
  '/dashboard/users': 'Dashboard.Users',
  '/dashboard/category': 'Dashboard.Category',
  '/dashboard/layers': 'Dashboard.Layers',
  '/dashboard/settings': 'Dashboard.Settings',
  '/dashboard/cemetery': 'Dashboard.CemeteryService',
  '/dashboard/event': 'Dashboard.Events',
  '/dashboard/comments': 'Dashboard.Comments',
  '/dashboard/bus': 'Dashboard.BusService',
};
