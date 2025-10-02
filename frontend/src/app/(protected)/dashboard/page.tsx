import { LogoutButton } from "@/components/custom/logout-button";


export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>대시보드</h1>
      <LogoutButton />
    </div>
  );
}