import ReactDOM from 'react-dom'
import './index.css'
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css'
import 'bootstrap/dist/css/bootstrap.css'
import { makeMainRoutes } from './routes'

const routes = makeMainRoutes()
ReactDOM.render(routes, document.getElementById('root'))
