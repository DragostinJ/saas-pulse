import { BreadcrumbNav } from '@/components/breadcrumb-nav';

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbNav />
      {children}
    </>
  );
}