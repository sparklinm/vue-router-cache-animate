
import { Route, RouteRecord } from 'vue-router'

export interface ChangedRouteRecords {
  from: RouteRecord | undefined
  to: RouteRecord | undefined
}

export interface RouteOptions {
  name: string
  children?: Array<RouteOptions>
}

export interface RouteNamesObject {
  [propName: string]: number
}

export interface RouteNamesTree {
  [propName: string]: number | RouteNamesTree
}

export { Route, RouteRecord }