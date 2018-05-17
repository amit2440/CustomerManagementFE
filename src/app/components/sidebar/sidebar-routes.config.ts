import {  RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: 'user-profile', title: 'Add Customer',  icon:'person', class: '' },
    { path: 'table-list', title: 'Update Customer',  icon:'update', class: '' },
    { path: 'icons', title: 'Todays Reminders',  icon:'alarm', class: '' },
    { path: 'typography', title: 'Internet Plans',  icon:'library_books', class: '' },
    { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: 'upgrade', title: 'Infinity Network',  icon:'copyright', class: 'active-pro' },
];
