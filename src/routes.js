import React from 'react'
import { Route, Router } from 'react-router-dom'
import history from './history'

import { VALUES } from './values'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons'

import {
  faCheckCircle,
  faCheckSquare,
  faSquare,
  faCircle,
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons'

import {
  faUser,
  faTrash,
  faExclamation,
  faCog,
  faStar,
  faLevelUpAlt,
  faChartBar,
  faBarcode,
  faInfoCircle,
  faSignOutAlt,
  faUserPlus,
  faUserMinus,
  faEdit,
  faExclamationTriangle,
  faBars,
} from '@fortawesome/free-solid-svg-icons'

import Utils from './Utils'
import FrontPage from './FrontPage/FrontPage'
import FrontPageHeader from './FrontPage/FrontPageHeader'

library.add(
  faBars,
  faTwitter,
  faFacebookF,
  faEdit,
  faUser,
  faCheckCircle,
  faCheckSquare,
  faSquare,
  faCircle,
  faInfoCircle,
  faBarcode,
  faTrash,
  faExclamation,
  faCog,
  faStar,
  faStarRegular,
  faLevelUpAlt,
  faChartBar,
  faSignOutAlt,
  faUserPlus,
  faUserMinus,
  faExclamationTriangle
)

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <>
        <Route path="/" render={(props) => <FrontPage {...props} />} />
      </>
    </Router>
  )
}
