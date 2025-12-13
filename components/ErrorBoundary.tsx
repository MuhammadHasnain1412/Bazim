"use client";

import { ReactNode, Component, ErrorInfo } from "react";
import { Container, Title, Text, Button } from "@mantine/core";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="xl" py="xl">
          <Title order={1}>Something went wrong</Title>
          <Text mb="md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
