import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth, AuthContextInterface } from "./auth/context";
import { PopupProvider } from "./popup";

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
      <PopupProvider>
        <InnerApp />
      </PopupProvider>
    </AuthProvider>
  );
}

export default App;
