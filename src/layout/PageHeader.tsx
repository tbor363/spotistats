// title + subtitle + actions
interface Props {
  title: string;
  subtitle?: string;
  // actions?: React.ReactNode;
}

function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="page-header">
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
