import Profile from '../pages/Profile/Profile'
import Settings from '../pages/Settings/Settings'
import Tables from '../pages/Tables/Tables'
import AdminPanel from '../pages/Dashboard/AdminPanel.jsx'
import { About, Achievements, AchievementsForm, AlumniMenu, Connect, Events, Forms, Home, NotFound, RegisterForm, Teams } from '../components'
import AllForms from '../pages/Forms/AllForms'

export const DefaultRoutes = [
  {
    path: '/',
    title: 'Home',
    component: Home
  },
  {
    path: 'team',
    title: 'Teams',
    component: Teams
  },
  {
    path: 'achievements',
    title: 'Achievements',
    component: Achievements
  },
  {
    path: 'achievements/add-new',
    title: 'Add New Achievement',
    component: AchievementsForm
  },
  {
    path: 'events',
    title: 'Events',
    component: Events
  },
  {
    path: 'forms',
    title: 'Forms',
    component: Forms
  },
  {
    path: 'about',
    title: 'About',
    component: About
  },
  {
    path: 'register/:formId',
    title: 'Register Form',
    component: RegisterForm
  },
  {
    path: 'connect',
    title: 'Connect',
    component: Connect
  },
  {
    path: 'connect/alumni',
    title: 'Alumni Menu',
    component: AlumniMenu
  },
  {
    path: '*',
    title: 'Not Found',
    component: NotFound
  }
]

export const AdminRoutes = [
  {
    path: '',
    title: 'Dashboard',
    component: AdminPanel
  },

  {
    path: 'profile',
    title: 'Profile',
    component: Profile
  },
  {
    path: 'forms/all',
    title: 'All Forms',
    component: AllForms
  },
  {
    path: 'forms/create',
    title: 'Create a Form',
    component: Profile
  },
  {
    path: 'tables',
    title: 'Tables',
    component: Tables
  },

  {
    path: 'settings',
    title: 'Settings',
    component: Settings
  }

]
