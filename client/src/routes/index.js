import { lazy } from 'react'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Tables from '../pages/Tables'
import FormLayout from '../pages/Form/FormLayout'
import FormElements from '../pages/Form/FormElements'
import Buttons from '../pages/UiElements/Buttons'

const coreRoutes = [

  {
    path: '/profile',
    title: 'Profile',
    component: Profile
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables
  },

  {
    path: '/settings',
    title: 'Settings',
    component: Settings
  },

  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons
  }

]

const routes = [...coreRoutes]
export default routes
