import Vue from 'vue'

type value =
  | {
    include: string[] | undefined
    exclude: string[] | undefined
  }
  | undefined

export interface Cache {
  names: value
  cachedOn: value
}

export interface Transition {
  name: string
  reverseName: string
  from: value
  to: value
}

export type Caches = Cache[]

export type Transitions = Transition[]


export type Props = {
  caches?: Caches
  transitions?: Transitions
  noCacheOnBack?: boolean
}

export type Data = {
  include?: string[]
  exclude?: string[]
  transitionName?: string
  css?: boolean
}

export type Instance = Vue & Props & Data