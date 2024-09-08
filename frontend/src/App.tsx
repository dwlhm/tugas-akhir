import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth, AuthContextInterface } from "./auth/context";

const router = createRouter({
  routeTree,
  context: {
    auth: {} as AuthContextInterface,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
};

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
