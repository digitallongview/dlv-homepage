import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Wird statt der Kinder gerendert, sobald ein Fehler auftritt. */
  fallback?: ReactNode
  /** Einmaliger Callback beim ersten gefangenen Fehler (z. B. um Folge-UI freizuschalten). */
  onError?: (error: Error) => void
}

type State = { hasError: boolean }

/**
 * Fängt Render-Fehler im Teilbaum ab — etwa wenn ein 3D-Asset (useGLTF) nicht
 * lädt. Ohne diese Grenze würde ein solcher Fehler bis zur Root durchschlagen
 * und die gesamte Seite leeren. Stattdessen zeigen wir `fallback` und melden
 * den Fehler über `onError`, damit der restliche Hero-Inhalt erscheinen kann.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary] gefangener Fehler:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
