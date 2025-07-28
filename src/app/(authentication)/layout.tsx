import Landing from "@/common/components/Authentication/LandingConstant";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Landing>{children}</Landing>;
}
