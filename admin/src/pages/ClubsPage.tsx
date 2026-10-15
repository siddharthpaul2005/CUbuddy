import { CrudPage } from '../components/CrudPage';

export function ClubsPage() {
  return (
    <CrudPage
      title="Clubs"
      table="clubs"
      orderBy={['sort_order', 'name']}
      defaults={{ is_active: true, sort_order: 0 }}
      deleteWarning="Delete this club? Its events stay, but lose their club."
      fields={[
        { key: 'logo_url', pathKey: 'logo_path', label: 'Logo', type: 'image', folder: 'logos' },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'short_name', label: 'Short name', type: 'text', placeholder: 'e.g. CC' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
        { key: 'website_url', label: 'Website URL', type: 'url' },
        { key: 'sort_order', label: 'Sort order (lower shows first)', type: 'number' },
        { key: 'is_active', label: 'Active (shown in app filters)', type: 'checkbox' },
      ]}
      renderSummary={(row) => (
        <div className="flex items-center gap-3">
          {row.logo_url ? (
            <img src={row.logo_url as string} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-100" />
          )}
          <div>
            <div className="font-medium">
              {row.name as string}
              {!row.is_active && <span className="ml-2 text-xs text-slate-500">(inactive)</span>}
            </div>
            <div className="truncate text-xs text-slate-500">{(row.description as string) ?? ''}</div>
          </div>
        </div>
      )}
    />
  );
}
