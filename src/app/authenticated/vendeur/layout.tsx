
import SideBar from "@/src/components/ui/SideBar";
import RoleGuard from "../../../components/ui/RoleGuard";


export default function VendeurLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="VENDEUR">
      {children}
    </RoleGuard>
  );
}