import {
  Route, RouteRecord, default as VueRouter, RouteConfig
} from 'vue-router'


export interface ChangedRouteRecords {
  from: RouteRecord | undefined
  to: RouteRecord | undefined
}

export interface RouteNamesTree {
  [propName: string]: number | RouteNamesTree
}

export {
  Route, RouteRecord, VueRouter, RouteConfig
}
