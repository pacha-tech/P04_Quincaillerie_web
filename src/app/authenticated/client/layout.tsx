
import SideBar from "@/src/components/ui/SideBar";
import RoleGuard from "../../../components/ui/RoleGuard";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="CLIENT">
      {children}
    </RoleGuard>
  );
}