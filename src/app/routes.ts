import { createBrowserRouter } from "react-router";
import { Root } from "../components/Root";
import { HomePage } from "../pages/HomePage";
import { WorkshopsPage } from "../pages/WorkshopsPage";
import { WorkshopDetailPage } from "../pages/WorkshopDetailPage";
import { BookingPage } from "../pages/BookingPage";
import { PaymentPage } from "../pages/PaymentPage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { HostDashboardPage } from "../pages/HostDashboardPage";
import { CreateWorkshopPage } from "../pages/CreateWorkshopPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "workshops", Component: WorkshopsPage },
      { path: "workshop/:id", Component: WorkshopDetailPage },
      { path: "book/:id", Component: BookingPage },
      { path: "payment", Component: PaymentPage },
      { path: "login", Component: LoginPage },
      { path: "profile", Component: ProfilePage },
      { path: "host", Component: HostDashboardPage },
      { path: "host/create", Component: CreateWorkshopPage },
      { path: "host/edit/:id", Component: CreateWorkshopPage },
    ],
  },
]);
