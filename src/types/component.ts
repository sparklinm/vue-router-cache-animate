import Vue from 'vue'

type value =
  | {
      include: Array<string> | undefined
      exclude: Array<string> | undefined
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

export type Caches = Array<Cache>

export type Transitions = Array<Transition>


type Props = {
  caches?: Caches
  transitions?: Transitions
  noCacheOnBack?: boolean
}

type Data = {
  include?: Array<string>
  exclude?: Array<string>
  transitionName?: string
  css?: boolean
}

export type Instance = Vue & Props & Data