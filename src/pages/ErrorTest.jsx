// This component is used to test the error handling in the application.
// It throws an error when rendered, which should be caught by the error boundary
// and display an error message instead of crashing the app.

export default function ErrorTest() {
  throw new Error("💥 Intentional error triggered for testing!");
}
