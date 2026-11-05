import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    /** Rendered instead of the children when they throw. Defaults to nothing. */
    fallback?: ReactNode;
    /** Named in the console so a swallowed failure is still traceable. */
    label?: string;
}

interface State {
    failed: boolean;
}

/**
 * Stops one broken subtree from taking down the page.
 *
 * React unmounts the whole tree on an uncaught render error, so a decorative
 * component that throws leaves the visitor on a blank screen. Suspense does
 * not help -- it catches promises, not errors -- so this has to be a class
 * component, which is the only way React exposes error catching.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { failed: false };

    static getDerivedStateFromError(): State {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(
            `[${this.props.label ?? "ErrorBoundary"}] subtree failed and was dropped:`,
            error,
            info.componentStack,
        );
    }

    render() {
        if (this.state.failed) return this.props.fallback ?? null;
        return this.props.children;
    }
}
